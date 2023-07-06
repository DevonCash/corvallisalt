import { queryEvents } from "src/utils";

export const get = async ({ request }) => {
  const url = new URL(request.url);

  const events = await queryEvents(url.searchParams);

  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname,
      data: events,
    }),
  };
};
