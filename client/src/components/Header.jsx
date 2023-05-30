import React, { useState } from 'react';
import PixelArtModal from './PixelArtModal';
import './Header.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <a href="/">Home</a>
          </li>
          <li className="nav-item">
            <a href="/signup">Sign Up</a>
          </li>
          <li className="nav-item">
            <a href="/profile">User Profile</a>
          </li>
        </ul>
      </nav>
      <button className="draw-button" onClick={openModal}>
        Draw Something!
      </button>
      {isModalOpen && <PixelArtModal closeModal={closeModal} />}
    </header>
  );
};

export default Header;
