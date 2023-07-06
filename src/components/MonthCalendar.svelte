<script lang="ts">
  import {
    eachWeekOfInterval,
    getMonth,
    addDays,
    format,
    formatISO,
    setDate,
    subDays,
    addMonths,
    isToday,
    startOfDay,
  } from "date-fns";
  export let monthOf: Date;
  export let events: Date[] = [];

  const month = getMonth(monthOf);
  const firstDay = setDate(monthOf, 1);
  const lastDay = subDays(addMonths(firstDay, 1), 1);
  const weeks = eachWeekOfInterval(
    { start: firstDay, end: lastDay },
    { weekStartsOn: 0 }
  );
  const days = weeks.map((firstDay) =>
    Array.from({ length: 7 }, (_, i) => addDays(new Date(firstDay), i))
  );
  let byDay = events.reduce((acc: { [key: string]: Date[] }, event) => {
    const day = startOfDay(event).toISOString();
    acc[day] = [...(acc[day] || []), event];
    return acc;
  }, {});
</script>

<table>
  <!-- <caption>
    <span>{format(firstDay, "MMMM")}</span>
    {format(firstDay, "yyyy")}
  </caption> -->
  <thead>
    <tr>
      <th>Sun</th>
      <th>Mon</th>
      <th>Tue</th>
      <th>Wed</th>
      <th>Thu</th>
      <th>Fri</th>
      <th>Sat</th>
    </tr>
  </thead><tbody>
    {#each days as week}
      <tr>
        {#each week as day}
          <td
            class:today={isToday(day)}
            class:inMonth={getMonth(day) === month}
          >
            {#if byDay[day.toISOString()]}
              <a href={format(day, "#dd")}>
                <time datetime={formatISO(day)}>{format(day, "d")}</time>
              </a>
              <div class="events">
                {#each byDay[day.toISOString()] || [] as _}
                  <div class="event" />
                {/each}
              </div>
            {:else}
              <time datetime={formatISO(day)}>{format(day, "d")}</time>
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style>
  caption {
    user-select: none;
  }
  caption span {
    color: var(--primary);
  }

  table {
    width: 300px;
    table-layout: fixed;
  }

  td,
  th {
    user-select: none;

    text-align: center;
    padding: 0.3rem 0;
    position: relative;
    z-index: 2;
  }

  th {
    border-bottom: 0;
    background-color: var(--color);
    color: var(--background);
  }

  td {
    padding-bottom: 0.5rem;
  }

  .past,
  td:not(.inMonth) {
    opacity: 0.5;
  }

  .today {
    border-color: var(--primary);
  }

  .event {
    position: relative;
    width: 0.2rem;
    height: 0.2rem;
    background: var(--primary);
    padding: 0;
    margin: 0;
  }

  .events {
    position: absolute;
    display: flex;
    bottom: 0.1rem;
    gap: 0.2rem;
    width: 100%;
    padding: 0;
    height: 0.2rem;
    margin: 0;
  }

  td a {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
