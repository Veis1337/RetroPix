import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AILBotChatPage = () => {
  const { botId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [activeBot, setActiveBot] = useState(null);

  useEffect(() => {
    fetchBotList();
  }, []);

  const fetchBotList = async () => {
    try {
      const response = await axios.get('/bots');
      const botList = response.data;
      setActiveBot(botList.find(bot => bot.id === botId));
    } catch (error) {
      console.error('Error fetching bot list:', error);
    }
  };

  useEffect(() => {
    fetchInitialBotMessage();
  }, [activeBot]);

  const fetchInitialBotMessage = async () => {
    if (activeBot) {
      try {
        const response = await axios.get(`/bots/${activeBot.id}`);
        const bot = response.data;

        // Set the initial message sent by the bot
        const initialBotMessage = { sender: 'bot', content: bot.firstMessage };
        setMessages([initialBotMessage]);
      } catch (error) {
        console.error('Error fetching bot:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() !== '') {
      const newUserMessage = { sender: 'user', content: userMessage };
      setMessages((prevMessages) => [...prevMessages, newUserMessage].slice(-10));

      try {
        // Prepare the chat history for the bot
        const chatHistory = messages.slice(-10).map((message) => message.content);

        // Send user message and chat history to the bot
        const response = await axios.post(`/bots/${activeBot.id}/messages`, {
          message: newUserMessage.content,

        });
        const botResponse = response.data;

        // Add the bot's response to the messages
        const newBotMessage = { sender: 'bot', content: botResponse };
        setMessages((prevMessages) => [...prevMessages, newBotMessage].slice(-10));
      } catch (error) {
        console.error('Error sending message:', error);
      }

      // Reset the input field
      setUserMessage('');
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
      <div className="chat-container">
        <div className="chat-messages">
          {messages.slice(-10).map((message, index) => {
            const { sender, content } = message;
            let renderedContent;

            if (typeof content === 'object' && content.response) {
              // Extract the content from the response object
              renderedContent = content.response.choices[0].message.content;
            } else {
              // Render the content as is
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
