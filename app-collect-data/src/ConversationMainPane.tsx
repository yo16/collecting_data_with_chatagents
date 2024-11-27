import { useState, useRef } from "react";
import { callToServer } from "./callToServer";

import "./ConversationMainPane.css";

export const ConversationMainPane = () => {
    const [response, setResponse] = useState<string>("");
    const refInputTextarea = useRef<HTMLTextAreaElement>(null);

    const handleOnSubmit = async () => {
        if (!refInputTextarea.current) return;
        const inputStr: string = refInputTextarea.current.value;

        const result = await callToServer(inputStr)
        setResponse(result);
    }

    return (
        <>
            <div
                className="conversationMainPane"
            >
                main
                <textarea
                    ref={refInputTextarea}
                    placeholder="ChatGPTにメッセージを送信する"
                />
                <button onClick={handleOnSubmit}>送る</button>
                <hr />
                <p>Response: {response}</p>
            </div>
        </>
    );
}
