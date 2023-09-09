import { gapi } from "gapi-script";

export const GOOGLE_ACCESS_TOKEN = "googleAccessToken"

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Data saved successfully with key: ${key}`);
  } catch (error) {
    console.error(`Error saving data with key ${key}: ${error}`);
  }
}

export const readFromLocalStorage = (key: string) => {
  try {
    //@ts-ignore
    const data = JSON.parse(localStorage.getItem(key));
    if (data === null) {
      console.log(`No data found for key: ${key}`);
      return null;
    }
    console.log(`Data retrieved successfully with key: ${key}`);
    return data;
  } catch (error) {
    console.error(`Error reading data with key ${key}: ${error}`);
    return null;
  }
}

export const addEvent = (calendarID: string, event: any) => {
  function initiate() {

    const accessToken = readFromLocalStorage(GOOGLE_ACCESS_TOKEN)

    gapi.client
      .request({
        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
        method: "POST",
        body: event,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(
        (response: any) => {
          return [true, response];
        },
        function (err: any) {
          console.log(err);
          return [false, err];
        }
      );
  }
  gapi.load("client", initiate);
};

export const addMinutesToDate = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
}

export const getSpecificHourDate = (hour: number, minute = 0, second = 0) => {
  const now = new Date(); // Current date and time
  const specificDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    second
  );
  return specificDate;
}

export const findNearestFutureEvent = (events: any[]) => {
  const currentTime = new Date();

  const futureEvents = events.filter((event) => {
      if (event.start && event.start.dateTime) {
          const eventTime = new Date(event.start.dateTime);
          return eventTime > currentTime; // Only keep events in the future
      }
      return false;
  });

  if (futureEvents.length === 0) {
      return null; // No future events found
  }

  const nearestEvent = futureEvents.reduce((nearest, event) => {
      if (event.start && event.start.dateTime) {
          const eventTime = new Date(event.start.dateTime);
          const timeDifference: number = eventTime.getTime() - currentTime.getTime();

          if (timeDifference < nearest.timeDifference) {
              return { event, timeDifference };
          }
      }

      return nearest;
  }, { event: null, timeDifference: Infinity });

  return nearestEvent.event;
}

export const findNearestFutureEvents = (events: any[], numEvents: number = 3) => {
  const currentTime = new Date();

  const futureEvents = events.filter((event) => {
    if (event.start && event.start.dateTime) {
      const eventTime = new Date(event.start.dateTime);
      return eventTime > currentTime; // Only keep events in the future
    }
    return false;
  });

  if (futureEvents.length === 0) {
    return []; // No future events found, return an empty array
  }

  const nearestEvents = futureEvents
    .map((event) => {
      if (event.start && event.start.dateTime) {
        const eventTime = new Date(event.start.dateTime);
        const timeDifference: number = eventTime.getTime() - currentTime.getTime();
        return { event, timeDifference };
      }
      return null;
    })
    .filter((eventWithTime) => eventWithTime !== null)
    .sort((a: any, b: any) => a.timeDifference - b.timeDifference)
    .slice(0, numEvents) // Take the first numEvents

  return nearestEvents.map((eventWithTime: any) => eventWithTime.event);
};

export const findPositionsInFirstArray = (firstArray: { start: { dateTime: any; }; }[], secondArray: any[]) =>  {
  const positions: null[] = [];

  secondArray.forEach((element: { start: { dateTime: any; }; }) => {
    const dateTimeToFind = element.start.dateTime;

    const index = firstArray.findIndex((item: { start: { dateTime: any; }; }) => {
      // Compare elements based on start.dateTime property
      return item.start && item.start.dateTime === dateTimeToFind;
    });

    if (index !== -1) {
      //@ts-ignore
      positions.push(index);
    } else {
      positions.push(null); // Element not found in the first array
    }
  });

  return positions;
}
