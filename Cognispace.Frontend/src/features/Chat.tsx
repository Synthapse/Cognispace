import { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";




const Chat = () => {

    const location = useLocation();
    const url = `http://localhost:8000/llama?human_input=Hello`
    const { data, error } = useFetch(url)

    console.log(data);

    useEffect(() => {
        document.title = "Cognispace | Chat";

    }, []);


    return (
        <div className="container">
            <h1>Mood-Based Recipe Generator:</h1>

            <p>This agent could generate recipes based on the user's mood or emotions. Users could input how they're feeling,
                and the agent would suggest recipes that match their mood, such as comfort foods for a bad day
                or energizing dishes for a productive day.</p>
            <hr /><br />

        </div>
    );

}


export default Chat;