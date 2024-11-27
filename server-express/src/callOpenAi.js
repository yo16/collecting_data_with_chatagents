
const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.CHATAGENT_API_KEY,
});


async function callOpenAi(prompt) {
    console.log("------");
    console.log(`prompt: ${prompt.prompt}`);
    let messages = [{ role: "user", content: prompt.prompt }];
    let fullResponse = "";
    let continueFetching = true;
    const OnetimeToken = 100;

    do {
        //console.log(`message length:${messages.length}`);
        const response = await openai.chat.completions.create({
            //model: "gpt-4",
            model: "gpt-4o-mini",
            messages,
            max_tokens: OnetimeToken,
        });

        // responseを累積
        const content = response.choices[0]?.message?.content || "";
        fullResponse += content;
        //console.log(`content: ${content}`);
        //console.log(`content choices length: ${response.choices.length}`);
        //console.log("dir");
        //console.dir(response, {depth: null});

        // 終了判定
        const finishReason = response.choices[0]?.finish_reason || "";
        if (finishReason === "stop") {
            // 正常に終了した場合
            continueFetching = false;
        } else if (finishReason === "length") {
            // max_tokensに達した場合、続きをリクエスト
            messages.push({ role: "assistant", content });
        } else {
            // そのほかのケースは終了
            console.warn(`unknown finishReason: ${finishReason}`);
            continueFetching = false;
        }

    } while (continueFetching);

    return fullResponse;
}

module.exports = { callOpenAi };
