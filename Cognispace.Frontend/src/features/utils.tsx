import { gapi } from "gapi-script";

export const stringToConversationData = (inputString: string) => {
  const conversationData = [];
  const lines = inputString.split('\n');

  let currentRole = '';
  let currentText = '';

  for (const line of lines) {
    if (line.startsWith('Example:')) {
      continue;
    } else if (line.startsWith('User:')) {
      if (currentRole) {
        conversationData.push({ role: currentRole, text: currentText.trim() });
        currentText = '';
      }
      currentRole = 'human';
      currentText += line.replace('User:', '').trim() + '\n';
    } else if (line.startsWith('Agent:')) {
      if (currentRole) {
        conversationData.push({ role: currentRole, text: currentText.trim() });
        currentText = '';
      }
      currentRole = 'agent';
      currentText += line.replace('Agent:', '').trim() + '\n';
    } else {
      currentText += line.trim() + '\n';
    }
  }

  if (currentRole) {
    conversationData.push({ role: currentRole, text: currentText.trim() });
  }

  return conversationData;
}



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
