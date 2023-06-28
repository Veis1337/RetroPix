import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AILBotChatPage = () => {
  const { botId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [activeBot, setActiveBot] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchBotList();
  }, []);

  const fetchBotList = async () => {
    try {
      const response = await axios.get("/bots");
      const botList = response.data;
      setActiveBot(botList.find((bot) => bot.id === botId));
    } catch (error) {
      console.error("Error fetching bot list:", error);
    }
  };

  useEffect(() => {
    fetchInitialBotMessage();
  }, [activeBot]);

  const fetchInitialBotMessage = async () => {
    if (activeBot) {
      try {
        // Set the initial message sent by the bot
        const initialBotMessage = {
          sender: "bot",
          content: activeBot.firstMessage,
        };
        setMessages([initialBotMessage]);
      } catch (error) {
        console.error("Error fetching bot:", error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() !== "") {
      const newUserMessage = { sender: "user", content: userMessage };
      const updatedMessages = [...messages, newUserMessage].slice(-100);
      setMessages(updatedMessages);

      try {
        const chatHistory = updatedMessages.map((message) => ({
          role: message.sender === "user" ? "user" : "assistant",
          content: message.content,
        }));

        const response = await axios.post(`/bots/${activeBot.id}/messages`, {
          message: newUserMessage.content,
          chatHistory: chatHistory.slice(-100), // Pass the latest 100 messages as chat history
        });

        const botResponse = response.data.response;

        const newBotMessage = {
          sender: "bot",
          content: botResponse.choices[0].message.content,
        };
        setMessages([...updatedMessages, newBotMessage].slice(-100));
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setUserMessage("");
    }
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [messages]);

  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  if (!activeBot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ail-bot-chat-page">
      <div className="bot-header">
        <img className="bot-avatar" src={activeBot.avatar} alt="Bot Avatar" />
        <h3 className="bot-name">{activeBot.name}</h3>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        <div className="chat-messages">
          {messages.slice(-100).map((message, index) => {
            const { sender, content } = message;
            let renderedContent = "";

            if (
              typeof content === "object" &&
              content.choices &&
              content.choices.length > 0
            ) {
              // Extract the content from the first choice's message
              renderedContent = content.choices[0].message.content;
            } else if (typeof content === "string") {
              // Render the content as a plain string
              renderedContent = content;
            }

            return (
              <div key={index} className={`message ${sender}`}>
                <p>{renderedContent}</p>
              </div>
            );
          })}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AILBotChatPage;
