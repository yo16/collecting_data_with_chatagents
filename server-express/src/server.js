const express = require("express");
const cors = require("cors");

const { callOpenAi } = require("./callOpenAi");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// 通常の会話(OpenAI)
app.post("/api/openai", async (req, res) => {
    // 要約を開始するメッセージ数
    const numberOfSummaryMessages = 50;
    
    try {
        //// クライアントから得た情報をまとめる
        //const { messages } = req.body;
        //// トークン制限に近づいている場合、履歴を要約
        //if (messages.length > numberOfSummaryMessages) {
        //    const summaryPrompt = {
        //        role: "system",
        //        content: "以下の会話履歴を要約し、"
        //            + "重要なポイントだけを簡潔にまとめてください: "
        //            + $JSON.stringify(messages),
        //    };
        //    const summaryResponse = await openai.chat.completions.create({
        //        model
        //    })
        //}

        const prompt = req.body;
        const response = await callOpenAi(prompt);
        //console.log("------");
        //console.log(`prompt: ${prompt}`);
        //let messages = [{ role: "user", content: prompt }];
        //let fullResponse = "";
        //let continueFetching = true;
        //const OnetimeToken = 100;
        //
        //do {
        //    //console.log(`message length:${messages.length}`);
        //    //const response = await openai.chat.completions.create({
        //    //    //model: "gpt-4",
        //    //    model: "gpt-4o-mini",
        //    //    messages,
        //    //    max_tokens: OnetimeToken,
        //    //});
        //
        //    // responseを累積
        //    const content = response.choices[0]?.message?.content || "";
        //    fullResponse += content;
        //    //console.log(`content: ${content}`);
        //    //console.log(`content choices length: ${response.choices.length}`);
        //    //console.log("dir");
        //    //console.dir(response, {depth: null});
        //
        //    // 終了判定
        //    const finishReason = response.choices[0]?.finish_reason || "";
        //    if (finishReason === "stop") {
        //        // 正常に終了した場合
        //        continueFetching = false;
        //    } else if (finishReason === "length") {
        //        // max_tokensに達した場合、続きをリクエスト
        //        messages.push({ role: "assistant", content });
        //    } else {
        //        // そのほかのケースは終了
        //        console.warn(`unknown finishReason: ${finishReason}`);
        //        continueFetching = false;
        //    }
        //
        //} while (continueFetching);
        //

        console.log(`response: ${response}`);
        res.json({ content: response});
    } catch (error) {
        console.error("Error calling OpenAI API:", error.message);
        res.status(500).send("Error calling OpenAI API");
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
