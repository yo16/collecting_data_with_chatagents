const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

// Open AIのモデル
const OPEN_AI_MODEL = "gpt-4o-mini";

// １回で受け付けるトークン量
const ONETIME_RECIEVE_TOKEN = 1000;

// 要約を開始するメッセージ数（これを超えたら要約する）
const NUMBER_OF_SUMMARY_MESSAGES_THRESHOLD = 50;
// 要約対象のメッセージ（要約すると決まったときに、"要約しない"最新のメッセージ）
const NUMBER_OF_NON_SUMMARY_MESSAGES = 10;


// 初期化
const openai = new OpenAI({
    apiKey: process.env.CHATAGENT_API_KEY,
});


// OpenAIのAPIを呼んで、結果を返す
async function callOpenAi(messages) {
    // 要約の必要性があれば要約
    const curMessages = await summarizeMessages(messages);

    const prompt = {
        model: OPEN_AI_MODEL,
        messages: curMessages,
        max_tokens: ONETIME_RECIEVE_TOKEN,
    };

    // 戻り値となる、各呼び出しのresponseをつなぎ合わせた結果の文字列
    let fullResponse = "";

    // 問い合わせ
    // 問い合わせの結果が途中だったら、途中までの結果を入れて続きを聞く
    let continueFetching = true;
    do {
        //console.log(`message length:${curMessages.length}`);
        console.dir(prompt);
        const response = await openai.chat.completions.create(prompt);
        console.dir(response);
        
        // responseを蓄積
        const content = response.choices[0]?.message?.content || "";
        fullResponse += content;

        // 終了判定
        const finishReason = response.choices[0]?.finish_reason || "";
        if (finishReason === "stop") {
            // 正常に終了した場合
            continueFetching = false;
        } else if (finishReason === "length") {
            // max_tokensに達した場合、今回の結果をmessagesに追加し、続きをリクエスト
            prompt.messages.push({
                role: "assistant",
                content,
            });
        } else {
            // そのほかのケースは終了
            console.warn(`unknown finishReason: ${finishReason}`);
            continueFetching = false;
        }

    } while (continueFetching);

    return fullResponse;
}


// メッセージを要約する
async function summarizeMessages(messages) {
    console.log(messages);
    // メッセージ数が閾値を超えていなかったら何もせず返す
    if (messages.length < NUMBER_OF_SUMMARY_MESSAGES_THRESHOLD) {
        return messages;
    }

    // 要約用のメッセージを作成
    // 要約するのは、閾値以内の全体ではなく、その少し前まで
    const summarize_number = messages.length - NUMBER_OF_NON_SUMMARY_MESSAGES;
    const forSummarizeMessage = [{
        role: "system",
        content: "以下の会話履歴を要約してください。"
            + "重要なポイントだけをまとめてください: "
            + JSON.stringify(messages.slice(0, summarize_number)),
    },];

    // 要約を依頼
    const response = await callOpenAi(forSummarizeMessage);
    
    // 要約したものと比較的新しい原文をマージした、messageの配列を返す
    const summaryMessage = [
        {
            role: "system",
            content: "以下は要約された会話履歴です。",
        },
        {
            role: "assistant",
            content: response,
        }
    ];
    const newMessage = message.slice(summarize_number);
    return summaryMessage.concat(newMessage);
}

module.exports = { callOpenAi };
