import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from 'react-router-dom';
import { IoIosReturnLeft } from "react-icons/io";
import { gapi } from "gapi-script";
import { useEffect, useState } from "react";
import '../style/main.scss'

export const Profile = () => {

    const navigate = useNavigate();

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

    //The API Key and the authentication credential are from different projects."
    const addEvent = (calendarID: string, event: any) => {
        function initiate() {
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


    const googleCalendarAPIKey = "AIzaSyCsNmlCJJMBohSqrLFs1itcf0CIu3u-4ic"
    const googleCalendarAccessToken = ""
    const googleCalendarId = "piotrzak77@gmail.com"

    const refreshToken = "1//04MLFH7jgMFuOCgYIARAAGAQSNwF-L9IrtPI49knqZ3C4Yyh8MZpC1x_Kp1fGZpTp6R6wKY8VvYRVeSoTff5KoOkNiJEm5x_wn3g"
    const clientId = "946555989276-mbsnp5730qklm9iedug2qpti0kajvjc8.apps.googleusercontent.com"
    const clientSecret = "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"

    const scopes =
        "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";

    const [events, setEvents] = useState<any>([]);
    const [accessToken, setAccessToken] = useState<any>([]);

    const getAccessToken = () => {

        console.log('get access token...')

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
            // this access token allow to add events in calendar

            // add breakfast
            // add dinner
            // add supper
            var accessToken = response.access_token;
            var idToken = response.id_token;
            setAccessToken(accessToken)

            console.log(accessToken)
            console.log(idToken)
        });
    }

    useEffect(() => {
        //getAccessToken()
        //const events = getEvents(googleCalendarId, googleCalendarAPIKey);
    }, []);

    const event = {
        summary: "Hello World",
        location: "",
        start: {
            dateTime: "2022-08-28T09:00:00-07:00",
            timeZone: "America/Los_Angeles",
        },
        end: {
            dateTime: "2022-08-28T17:00:00-07:00",
            timeZone: "America/Los_Angeles",
        },
        recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
        attendees: [],
        reminders: {
            useDefault: false,
            overrides: [
                { method: "email", minutes: 24 * 60 },
                { method: "popup", minutes: 10 },
            ],
        },
    };

    const navigateToIngredients = () => {
        navigate("/ingredients");
    };

    return (
        <div style={{ paddingTop: '5%', paddingLeft: ' 70px' }}>
            <div onClick={() => navigate(-1)} style={{ display: 'flex' }}> <IoIosReturnLeft style={{ fontSize: '24px ' }} /><p style={{ fontSize: '12px' }}>return </p></div>
            <img style={{ borderRadius: '50%', width: '72px', height: '72px' }} src={auth?.currentUser?.photoURL ?? ""} />
            <h3>{auth?.currentUser?.displayName}</h3>
            <p>{auth?.currentUser?.email}</p>
            <hr /><br /><br />

            <button onClick={() => navigateToIngredients()} className="primary-button">
                Manage ingredients
            </button>

            <br /><br /><br /><br />

            <hr />
            <p onClick={() => addEvent(googleCalendarId, event)}>Add Event:</p>


            <br />
            Calendar:
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
        </div>
    );
};