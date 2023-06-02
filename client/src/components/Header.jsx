import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PixelArtModal from './PixelArtModal';
import './Header.css';
import axios from 'axios';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState(15);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (token && token !== 'Guest') {
      setIsLoggedIn(true);
    }
  }, []);
  

  const openModal = (size) => {
    setModalSize(size);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    axios
      .post('/auth/logout')
      .then((response) => {
        console.log(response.data);
        setIsLoggedIn(false);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          {!isLoggedIn && (
            <li className="nav-item">
              <Link to="/signup">Sign Up / Log In</Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <button className="draw-button" onClick={() => openModal(15)}>
        Draw Something!
      </button>
      {isModalOpen && <PixelArtModal closeModal={closeModal} gridSize={modalSize} />}
    </header>
  );
};

export default Header;
