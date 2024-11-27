// サーバーに問い合わせる
export async function callToServer(prompt: string): Promise<string> {
    try {
        const response = await fetch("http://localhost:3001/api/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        return "Error occurred";
    }
}
