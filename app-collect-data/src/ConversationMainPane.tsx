import { useState, useRef } from "react";
import { callToServer } from "./callToServer";
import type { Message_OpenAI } from "./callToServer";

import "./ConversationMainPane.css";


export const ConversationMainPane = () => {
    const [messages, setMessages] = useState<Message_OpenAI[]>([]);
    const refInputTextarea = useRef<HTMLTextAreaElement>(null);

    const handleOnSubmit = async () => {
        if (!refInputTextarea.current) return;
        const inputStr: string = refInputTextarea.current.value;

        // 質問を、メッセージへ設定する
        const newMessage: Message_OpenAI[] = [
            ...messages,
            {
                role: "user",
                content: inputStr,
            }
        ];
        setMessages(() => newMessage );

        // 質問を投げる
        const result = await callToServer( newMessage )
        
        // 結果を、メッセージへ設定する
        const responsedMessage: Message_OpenAI[] = [
            ...newMessage,
            {
                role: "assistant",
                content: result,
            }
        ]
        setMessages(() => responsedMessage );
    }

    return (
        <>
            <div
                className="conversationMainPane"
            >
                <div
                    className="chatHistory"
                >
                    {messages.map((msg: Message_OpenAI) => (
                        <div
                            className={
                                "messageCommon " + (
                                    (msg.role === "user")      ? "messageUser":
                                    (msg.role === "assistant") ? "messageAssistant":
                                                                "messageSystem"
                                )
                            }
                        >{msg.content}</div>
                    ))}
                </div>
                <hr />
                <textarea
                    ref={refInputTextarea}
                    placeholder="ChatGPTにメッセージを送信する"
                />
                <button onClick={handleOnSubmit}>送る</button>
            </div>
        </>
    );
}
