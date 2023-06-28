import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AIL.css'; // Import the CSS file

const AILHomePage = () => {
  const [botList, setBotList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBotList();
  }, []);

  const fetchBotList = async () => {
    try {
      const response = await axios.get('/bots');
      const fetchedBotList = response.data;
      setBotList(fetchedBotList);
    } catch (error) {
      console.error('Error fetching bot list:', error);
    }
  };

  const handleBotSelection = (botId) => {
    navigate(`/ail/bot/${botId}`);
  };

  return (
    <div className="ail-homepage">
      <h2>AIL - Artificial Intelligence... L</h2>
      <p>Choose a bot to chat with:</p>
      <div className="bot-list">
        {botList.map((bot) => (
          <div
            key={bot.id}
            className="bot-card hover:cursor-pointer"
            onClick={() => handleBotSelection(bot.id)}
          >
            <div className="bot-avatar">
              <img src={bot.avatar} alt={bot.name} />
            </div>
            <h3>{bot.name}</h3>
            <p>Personality: {Object.keys(bot.personality).join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AILHomePage;
