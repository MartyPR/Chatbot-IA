//sk-proj-sryAMpg8CawsXPilrGDQT3BlbkFJ5tZ0uEswaXfVT1A1Q2Jk

import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const corsOption={
  origin:['http://localhost:5173','http://localhost:5174']
}


dotenv.config();
//authentciated with our api
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const app = express();
const PORT = process.env.PORT || 9090;
//! passin incoming
app.use(express.json());
app.use(cors(corsOption))
//!Global variable to honld the conversation hisztory
let conversationHistory = [
  {
    role: "system",
    content: "You are a helpful assitant",
  },
];
//!router
app.post("/ask", async (req, res) => {
  const userMessage = req.body.message;

  //update the conversation history with the user's message
  conversationHistory.push({ role: "user", content: userMessage });
  try {
    const completion = await openai.chat.completions.create({
      messages: conversationHistory,
      model: "gpt-3.5-turbo",
    });
    //!Extract the response
    const botResponse = completion.choices[0].message.content;
    res.json({ message: botResponse });
  } catch (error) {
    res.status(500).send("Error generating response from openAi");
  }
});

app.listen(PORT, console.log(`Server is Runnig ${PORT}`));
//!run
