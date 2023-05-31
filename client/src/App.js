import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoggedInHomePage from './pages/LoggedInHomePage';
import UserList from './components/UserList';
import Header from './components/Header';
import PixGallery from './components/PixGallery';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/signup" element={<SignUpPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/users" element={<UserList />} />
          {isLoggedIn ? (
            <Route path="/" element={<LoggedInHomePage />} />
          ) : (
            <Route path="/" element={<HomePage />} />
          )}
          <Route path="/pix" element={<PixGallery />} /> {/* Add this line */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
