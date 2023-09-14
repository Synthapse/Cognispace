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