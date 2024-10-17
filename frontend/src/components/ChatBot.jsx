import React, { useState, useEffect, useRef } from "react";
import "../ChatBot.css";

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (userMessage.trim()) {
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { user: userMessage, bot: null, time: new Date().toLocaleTimeString() },
      ]);
      setUserMessage("");
      setIsTyping(true);

      try {
        const response = await fetch("http://localhost:5579/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        setTimeout(() => {
          setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            {
              user: null,
              bot: data.botMessage,
              time: new Date().toLocaleTimeString(),
            },
          ]);
          setIsTyping(false);
        }, 1000);
      } catch (error) {
        console.error("Error sending message:", error);
        setChatHistory((prevChatHistory) => [
          ...prevChatHistory,
          {
            user: null,
            bot: "Sorry, something went wrong.",
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <h3>Customer Support</h3>
        </div>
      </div>
      <div className="chat-box">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${chat.user ? "user" : "bot"}`}
          >
            <div
              className={`avatar ${chat.user ? "user-avatar" : "bot-avatar"}`}
            ></div>
            <div className="message">
              <span className="message-text">
                {chat.user ? chat.user : chat.bot}
              </span>
              <span className="timestamp">{chat.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message bot">
            <div className="avatar bot-avatar"></div>
            <div className="message typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>
      <div className="input-area">
        <input
          className="chat-input"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};
export default ChatBot;
