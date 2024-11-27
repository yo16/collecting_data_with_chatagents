const express = require("express");
const cors = require("cors");

const { callOpenAi } = require("./callOpenAi");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


// OpenAIとの会話
app.post("/api/openai", async (req, res) => {
    try {
        const messages = req.body.messages;
        const response = await callOpenAi(messages);

        console.log(`response: ${response}`);
        res.json({ content: response });
    } catch (error) {
        console.error("Error calling OpenAI API:", error.message);
        res.status(500).send("Error calling OpenAI API");
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
