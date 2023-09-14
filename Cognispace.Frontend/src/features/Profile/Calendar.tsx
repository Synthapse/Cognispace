import { useEffect, useState } from "react";
import '../../style/ingredients.scss'
import { gapi } from "gapi-script";
import Menu from "../../components/Menu";
import { GOOGLE_ACCESS_TOKEN, addEvent, saveToLocalStorage } from "../utils";

interface IProduct {
    name: string;
    quantity: string;
    currentUnitPrice: string;
}

interface IIngredient {
    title: string[];
    userId: string;
}

// needs to change to user email - making calendar Id publicly automatically 
export const googleCalendarId = "piotrzak77@gmail.com"

export const Calendar = () => {


    const googleCalendarAPIKey = "AIzaSyCsNmlCJJMBohSqrLFs1itcf0CIu3u-4ic"
    const googleCalendarAccessToken = ""

    const refreshToken = "1//04MLFH7jgMFuOCgYIARAAGAQSNwF-L9IrtPI49knqZ3C4Yyh8MZpC1x_Kp1fGZpTp6R6wKY8VvYRVeSoTff5KoOkNiJEm5x_wn3g"
    const clientId = "946555989276-mbsnp5730qklm9iedug2qpti0kajvjc8.apps.googleusercontent.com"
    const clientSecret = "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"

    const scopes =
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";

    const [events, setEvents] = useState<any>([]);
    const [accessToken, setAccessToken] = useState<any>([]);

    const getAccessToken = () => {

        gapi?.auth2?.authorize({
            client_id: clientId,
            scope: scopes,
            response_type: 'id_token permission',
            redirect_uri: false,
        }, function (response: { error: any; access_token: any; id_token: any; }) {
            if (response.error) {
                console.log(response.error)
                return;
            }
            var accessToken = response.access_token;
            var idToken = response.id_token;
            setAccessToken(accessToken)
            saveToLocalStorage(GOOGLE_ACCESS_TOKEN, accessToken);
        });
    }

    const getEvents = (calendarID: string, apiKey: string) => {

        function initiate() {
            gapi.client
                .init({
                    apiKey: apiKey,
                })

                .then(function () {
                    return gapi.client.request({
                        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?timeMin=2016-06-03T10:00:00-07:00`,
                    });
                })

                .then(
                    (response: { result: { items: any; }; }) => {
                        let events = response.result.items;
                        setEvents(events)
                        return events;
                    },
                    function (err: any) {
                        return [false, err];
                    }
                );
        }
        gapi.load("client", initiate);
    };

    useEffect(() => {
        getAccessToken()
        const events = getEvents(googleCalendarId, googleCalendarAPIKey);
    }, []);

    return (
        <div className="profile-container">
            <Menu />
            <ul>
                {events?.map((event: any) => (
                    <>
                        <hr />
                        <h2>{event.summary}</h2>
                        <p>{event.start.dateTime}</p>
                        <p>{event.end.dateTime}</p>
                        <hr />
                    </>
                ))}
            </ul>
        </div >
    )
}