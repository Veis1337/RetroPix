import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="content">
        <h1 className="heading">Welcome to RetroPix</h1>
        <p className="description">
          RetroPix is a platform where you can create and share pixel-graphic pictures. Let your creativity run wild and express yourself with retro-style artwork!
        </p>
        <p className="description">
          Explore a vibrant community of artists, upvote their creations, and engage in discussions in the comments. Get inspired, learn from others, and showcase your pixel art skills!
        </p>
        <a href="/signup" className="cta-button">Get Started</a>
      </div>
    </div>
  );
};

export default HomePage;
