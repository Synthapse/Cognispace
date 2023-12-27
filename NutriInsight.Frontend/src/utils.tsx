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

export const findPositionsInFirstArray = (firstArray: { start: { dateTime: any; }; }[], secondArray: any[]) => {
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


interface DrinkEntry {
    name: string;
    drinks?: {
        amount: number;
        type: string;
    }[];
}

interface DailySummary {
    totalAmount: number;
    mostConsumedType: string | null;
    mostConsumedAmount: number;
    leastConsumedType: string | null;
    leastConsumedAmount: number;
    averageConsumption: number;
}

interface OverallSummary {
    totalAmount: number;
    mostConsumedType: string | null;
    mostConsumedAmount: number;
    leastConsumedType: string | null;
    leastConsumedAmount: number;
    averageConsumption: number;
}

export interface AnalysisSummary {
    dailySummaries: Record<string, DailySummary>;
    overallSummary: OverallSummary;
}

export const analyzeDrinksData = (data: DrinkEntry[]): AnalysisSummary => {
    const summary: AnalysisSummary = {
        dailySummaries: {},
        overallSummary: {
            totalAmount: 0,
            mostConsumedType: null,
            mostConsumedAmount: 0,
            leastConsumedType: null,
            leastConsumedAmount: Infinity,
            averageConsumption: 0,
        },
    };

    // Iterate through the entries in the data array
    for (const entry of data) {
        const date = entry.name;
        const drinks = entry.drinks || [];

        // Initialize daily summary
        summary.dailySummaries[date] = {
            totalAmount: 0,
            mostConsumedType: null,
            mostConsumedAmount: 0,
            leastConsumedType: null,
            leastConsumedAmount: Infinity,
            averageConsumption: 0,
        };

        // Calculate daily statistics
        for (const drink of drinks) {
            const drinkType = drink.type;
            const drinkAmount = drink.amount;

            // Track the total amount consumed for the day
            summary.dailySummaries[date].totalAmount += drinkAmount;

            // Update most and least consumed types and amounts
            if (
                !summary.dailySummaries[date].mostConsumedType ||
                drinkAmount > summary.dailySummaries[date].mostConsumedAmount
            ) {
                summary.dailySummaries[date].mostConsumedType = drinkType;
                summary.dailySummaries[date].mostConsumedAmount = drinkAmount;
            }
            if (drinkAmount < summary.dailySummaries[date].leastConsumedAmount) {
                summary.dailySummaries[date].leastConsumedType = drinkType;
                summary.dailySummaries[date].leastConsumedAmount = drinkAmount;
            }
        }

        // Calculate overall statistics
        summary.overallSummary.totalAmount += summary.dailySummaries[date].totalAmount;
        if (summary.dailySummaries[date].mostConsumedAmount > summary.overallSummary.mostConsumedAmount) {
            summary.overallSummary.mostConsumedType = summary.dailySummaries[date].mostConsumedType;
            summary.overallSummary.mostConsumedAmount = summary.dailySummaries[date].mostConsumedAmount;
        }
        if (summary.dailySummaries[date].leastConsumedAmount < summary.overallSummary.leastConsumedAmount) {
            summary.overallSummary.leastConsumedType = summary.dailySummaries[date].leastConsumedType;
            summary.overallSummary.leastConsumedAmount = summary.dailySummaries[date].leastConsumedAmount;
        }
    }

    // Calculate average consumption
    const numDays = Object.keys(summary.dailySummaries).length;
    if (numDays > 0) {
        summary.overallSummary.averageConsumption = summary.overallSummary.totalAmount / numDays;
    }

    return summary;
}


export const calculateLongestConsecutiveStreak = (dates: any[]) => {
    // Convert date strings to Date objects and sort them in ascending order.
    //@ts-ignore
    const dateObjects = dates.map(dateStr => new Date(dateStr)).sort((a, b) => a - b);

    let longestStreak: string | any[] = [];
    let currentStreak = [dateObjects[0]];

    for (let i = 1; i < dateObjects.length; i++) {
        const currentDate = dateObjects[i];
        const previousDate = dateObjects[i - 1];

        // Calculate the difference in days between the current and previous date.
        //@ts-ignore
        const dayDifference = Math.floor((currentDate - previousDate) / (24 * 60 * 60 * 1000));

        if (dayDifference === 1) {
            // If the difference is 1 day, add the current date to the current streak.
            currentStreak.push(currentDate);
        } else if (dayDifference > 1) {
            // If the difference is greater than 1 day, the streak is broken.
            // Check if the current streak is longer than the longest streak.
            if (currentStreak.length > longestStreak.length) {
                longestStreak = currentStreak;
            }
            // Start a new streak with the current date.
            currentStreak = [currentDate];
        }
    }

    // Check if the current streak is longer than the longest streak (for the last date).
    if (currentStreak.length > longestStreak.length) {
        longestStreak = currentStreak;
    }

    return [longestStreak.length, currentStreak.length];
}