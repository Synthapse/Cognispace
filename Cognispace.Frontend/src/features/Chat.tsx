import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";
//@ts-ignore
import Conversation from './conversations/MoodBasedAgent/conversation1.txt'
import { stringToConversationData } from "./utils";
import '../style/Chat.css';

interface IMessage {
    role: string;
    text: string;
}

const Chat = () => {

    const location = useLocation();
    // const url = `http://localhost:8000/llama?human_input=Hello`
    // const { data, error } = useFetch(url)

    const [conversation, setConversation] = useState<any>(null);

    //console.log(data);

    useEffect(() => {
        document.title = "Cognispace | Chat";

        fetch(Conversation)
            .then(r => r.text())
            .then(t => setConversation(stringToConversationData(t)))

    }, []);



    console.log(conversation);

    const renderConversation = () => {
        return conversation.map((item: IMessage, index: number) => (
            <div key={index} className={item.role + '-response chat-message'}>
                <p><b>{item.role}</b> {item.text}</p>
            </div>
        ));
    };

    return (
        <div className="container">
            <h1>Mood-Based Recipe Generator:</h1>

            <p>This agent could generate recipes based on the user's mood or emotions. Users could input how they're feeling,
                and the agent would suggest recipes that match their mood, such as comfort foods for a bad day
                or energizing dishes for a productive day.</p>
            <hr /><br />
            {conversation && renderConversation()}

        </div>
    );

}


export default Chat;