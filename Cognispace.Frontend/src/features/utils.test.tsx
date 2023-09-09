import { findNearestFutureEvents, findPositionsInFirstArray } from "./utils";

it('should return an empty array when given an empty array of events', () => {
    const events: any[] = [];
    const result = findNearestFutureEvents(events);
    expect(result).toEqual([]);
});

it('should return the correct events when given an array of events with a mix of past and future events', () => {
    const currentTime = new Date();
    const events = [
        { title: 'Event 1', start: { dateTime: new Date(currentTime.getTime() - 1000).toISOString() } },
        { title: 'Event 2', start: { dateTime: new Date(currentTime.getTime() + 1000).toISOString() } },
        { title: 'Event 3', start: { dateTime: new Date(currentTime.getTime() + 2000).toISOString() } },
        { title: 'Event 4', start: { dateTime: new Date(currentTime.getTime() - 2000).toISOString() } },
        { title: 'Event 5', start: { dateTime: new Date(currentTime.getTime() + 3000).toISOString() } }
    ];
    const expected = [
        { title: 'Event 2', start: { dateTime: new Date(currentTime.getTime() + 1000).toISOString() } },
        { title: 'Event 3', start: { dateTime: new Date(currentTime.getTime() + 2000).toISOString() } },
        { title: 'Event 5', start: { dateTime: new Date(currentTime.getTime() + 3000).toISOString() } }
    ];
    const result = findNearestFutureEvents(events);
    expect(result).toEqual(expected);
});

it('should return an array with null values for elements not found in the first array', () => {
    const firstArray: { start: { dateTime: any; }; }[] = [
      { start: { dateTime: "2021-01-01" } },
      { start: { dateTime: "2021-02-01" } },
      { start: { dateTime: "2021-03-01" } }
    ];
    const secondArray: any[] = [
      { start: { dateTime: "2021-04-01" } },
      { start: { dateTime: "2021-05-01" } },
      { start: { dateTime: "2021-06-01" } }
    ];
    const result = findPositionsInFirstArray(firstArray, secondArray);
    expect(result).toEqual([null, null, null]);
  });

  it('should return an array with the correct positions for elements found in the first array', () => {
    const firstArray: { start: { dateTime: any; }; }[] = [
      { start: { dateTime: "2021-01-01" } },
      { start: { dateTime: "2021-02-01" } },
      { start: { dateTime: "2021-03-01" } }
    ];
    const secondArray: any[] = [
      { start: { dateTime: "2021-02-01" } },
      { start: { dateTime: "2021-03-01" } },
      { start: { dateTime: "2021-04-01" } }
    ];
    const result = findPositionsInFirstArray(firstArray, secondArray);
    expect(result).toEqual([1, 2, null]);
  });

  it('should return an array with null values for elements with null start.dateTime property', () => {
    const firstArray: { start: { dateTime: string | null; }; }[] = [
      { start: { dateTime: "2021-01-01" } },
      { start: { dateTime: null } },
      { start: { dateTime: "2021-03-01" } }
    ];
    const secondArray: any[] = [
      { start: { dateTime: "2021-01-01" } },
      { start: { dateTime: null } },
      { start: { dateTime: "2021-03-01" } }
    ];
    const result = findPositionsInFirstArray(firstArray, secondArray);
    expect(result).toEqual([0, 1, 2]);
  });