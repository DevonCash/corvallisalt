import { getCollection, type CollectionEntry } from "astro:content";
import { DateTime } from "luxon";

/**
 * Groups items in a list based on the provided predicates.
 * @param list The list of items to group.
 * @param groupPredicates An object with keys representing the names of the groups and values representing the predicates used to determine if an item belongs to that group.
 * @returns An object with keys representing the names of the groups and values representing the items in that group.
 */
export function group<T>(
  list: T[],
  groupPredicates: { [key: string]: (item: T) => boolean }
): { [key: string]: T[] } {
  // Create an object with the same keys as groupPredicates, but with empty arrays as values
  const output: { [key: string]: T[] } = Object.fromEntries(
    Object.entries(groupPredicates).map(([group]) => [group, []])
  );

  // For each item in the list, find the first group that matches the item and add it to that group
  for (const item of list) {
    for (const group in groupPredicates) {
      if (!groupPredicates[group](item)) continue;
      output[group].push(item);
      break;
    }
  }
  return output;
}

/**
 * Converts a string to a URL-friendly slug.
 * @param text The string to convert.
 * @returns The slugified string.
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Adds or replaces a query parameter in a URL object.
 * @param url The URL object to modify.
 * @param key The key of the query parameter to add or replace.
 * @param value The value of the query parameter to add or replace.
 * @returns The modified URL object.
 */
export function addQueryParam(url: URL, key: string, value: string) {
  if (url.searchParams.has(key)) url.searchParams.delete(key);
  url.searchParams.append(key, value);
  return url;
}

/**
 * Queries the "events" collection based on the provided query parameters.
 * @param query An object or URLSearchParams containing the query parameters.
 * @returns A Promise that resolves to an array of events that match the query.
 */
export async function queryEvents(query: object | URLSearchParams) {
  type Event = CollectionEntry<"events">;

  let params: URLSearchParams;
  if (!(query instanceof URLSearchParams))
    params = new URLSearchParams(Object.entries(query));
  else params = query;

  const filterFns: {
    [key: string]: (terms: string[]) => (item: Event) => boolean;
  } = {
    // Filter by who is featured
    ft: (terms: string[]) => (item: Event) =>
      terms.every((term) => item.data.performer.find((p) => p.id === term)),

    // Filter by location
    at: (terms: string[]) => (evt: Event) =>
      terms.every((term) => evt.data.location.id === term),

    // Filter by month
    in: (terms: string[]) => (evt: Event) =>
      terms.every((term) =>
        DateTime.fromFormat(term, "yyyy-MM").hasSame(
          DateTime.fromJSDate(evt.data.startDate),
          "month"
        )
      ),

    // Filter by day
    on: (terms: string[]) => (evt: Event) =>
      terms.every((term) =>
        DateTime.fromFormat(term, "yyyy-MM").hasSame(
          DateTime.fromJSDate(evt.data.startDate),
          "month"
        )
      ),

    // Filter by cost
    // for: (terms) => (evt) =>
    //   terms.every((term) => {

    //     const op = term[0];
    //     const cost = parseInt(term.slice(1)) ?? 0;
    //     switch (op) {
    //       case "<":
    //         return evt.data.cost <= cost;
    //       case ">":
    //         return evt.data.cost >= cost;
    //       default:
    //         return false;
    //     }
    //   }),

    keywords: (terms: string[]) => (evt: Event) =>
      terms.every((term) =>
        evt.data.keywords.find((keyword) => keyword === term)
      ),
  };

  const noop = () => () => true;

  const filter = (event: Event) =>
    Array.from(params.entries())
      .map(([key, terms]) => (filterFns[key] ?? noop)(terms?.split(",")))
      .every((fn) => fn(event));

  const events = await getCollection("events", (event) =>
    query ? filter(event) : isFuture(event.data.startDate)
  );

  return events;
}
