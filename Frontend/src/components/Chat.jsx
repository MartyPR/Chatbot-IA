import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import {IoSend} from 'react-icons/io5';
import {FaRobot} from 'react-icons/fa'
import "./Chatbot.css";
//function to make http request
const sendMessageAPI = async (message) => {
  const res = await axios.post("http://localhost:9090/ask", { message });
  return res.data;
};
const Chat = () => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState([
    { role: "assistant", content: "Hello! how can assist you today" },
  ]);

  const mutation = useMutation({
    mutationFn: sendMessageAPI,
    mutationKey: ["chatbot"],
    onSuccess: (data) => {
      setIsTyping(false);
      setConversation((prevConversation) => [
        ...prevConversation,

        { role: "assistant", content: data.message },
      ]);
    },
  });
  const handleSubmitMessage = () => {
    const currentMessage = message.trim();
    if (!currentMessage) {
      alert("please enter a message");
      return;
    }
    setConversation((prevConversation) => [
      ...prevConversation,
      {
        role: "user",
        content: currentMessage,
      },
    ]);
    setIsTyping(true);
    mutation.mutate(currentMessage);
    setMessage("");
  };

  return (
    <>
      <div className="header">
        <h1 className="title">AI Chatbot</h1>
        <p className="description">
          Enter yourr message in the input below to chat with the AI
        </p>
        <div className="chat-container">
          <div className="conversation">
            {conversation.map((entry, index) => (
              <div className={`message ${entry.role}`} key={index}>
                <strong>
                  {entry.role === "user" ? "You" : <FaRobot/>}
                  {entry.content}
                </strong>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant">
               <FaRobot/>
                <strong>AI is typing ...</strong>
              </div>
            )}
          </div>
          <div className="input-area">
            <input
              type="text"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e)=>e.key ==='enter' && handleSubmitMessage}
            />
            <button onClick={handleSubmitMessage}>
                {mutation?.isPending ? 'Loading' : <IoSend/>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
