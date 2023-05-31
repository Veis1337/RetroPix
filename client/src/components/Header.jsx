import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PixelArtModal from './PixelArtModal';
import './Header.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState(15);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openModal = (size) => {
    setModalSize(size);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    // Perform logout logic
    setIsLoggedIn(false);
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
                <Link to="/profile">User Profile</Link>
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
      {isModalOpen && (
        <PixelArtModal closeModal={closeModal} gridSize={modalSize} />
      )}
    </header>
  );
};

export default Header;
