import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import UserList from './components/UserList';
import Header from './components/Header';
import PixGallery from './components/PixGallery';
import UserProfile from './pages/UserProfile';
import AILHomePage from './components/AILHomePage';
import AILBotChatPage from './components/AILBotChatPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/signup" element={<SignUpPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<PixGallery />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ail" element={<AILHomePage />} />
          <Route path="/ail/bot/:botId" element={<AILBotChatPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
