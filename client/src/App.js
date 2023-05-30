import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import LoggedInHomePage from './pages/LoggedInHomePage';
import UserList from './components/UserList';
import Header from './components/Header';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/" element={isLoggedIn ? <LoggedInHomePage /> : <HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
