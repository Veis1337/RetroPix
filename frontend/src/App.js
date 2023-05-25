import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoggedInHomePage from './pages/LoggedInHomePage';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={isLoggedIn ? <LoggedInHomePage /> : <HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
