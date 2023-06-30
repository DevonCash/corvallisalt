/**
 * Groups items in a list based on the provided predicates.
 * @param list The list of items to group.
 * @param groupPredicates An object with keys representing the names of the groups and values representing the predicates used to determine if an item belongs to that group.
 * @returns An object with keys representing the names of the groups and values representing the items in that group.
 */
export function group<T>(list: T[], groupPredicates: { [key: string]: (item: T) => boolean }): { [key: string]: T[] } {
    // Create an object with the same keys as groupPredicates, but with empty arrays as values
    const output: { [key: string]: T[] } = Object.fromEntries(Object.entries(groupPredicates).map(([group]) => [group, []]));

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
    return text.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}