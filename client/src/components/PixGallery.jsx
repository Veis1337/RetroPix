import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PixGallery.css'; 

const PixGallery = () => {
  const [pictures, setPictures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userInfo, setUserInfo] = useState(null); // User information state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetchPictures(currentPage);
    fetchUserInfo(); // Fetch user information
    setError(null); // Clear the error state
  }, [currentPage]);

  const fetchPictures = async (page) => {
    try {
      const response = await axios.get(`/pix?page=${page}`);
      if (response.status === 200) {
        setPictures(response.data);
        setTotalPages(response.headers['x-total-pages']);
      } else {
        throw new Error('Failed to fetch pictures');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/users/user-info'); 
      if (response.status === 200) {
        setUserInfo(response.data); // Set the user information
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const getCardSizeClass = (gridSize) => {
    if (gridSize === 15) {
      return 'card-size-15';
    } else if (gridSize === 25) {
      return 'card-size-25';
    } else if (gridSize === 50) {
      return 'card-size-50';
    } else {
      return '';
    }
  };

  const getUsername = () => {
    return userInfo?.username || 'Guest'; // Use the user info to get the username or default to 'Guest'
  };

  return (
    <div className="pix-gallery">
      <h2 className="pix-gallery-heading">Welcome to RetroPix Pix Gallery!</h2>
      <p className="pix-gallery-subheading">
        Here's a gallery of random pictures created by users:
      </p>
      <div className="gallery">
        {pictures.map((picture) => {
          const drawingData = JSON.parse(picture.drawingData);
          const squareSize = Math.sqrt(drawingData.length);
          const canvasSize = squareSize * 10;
          const cardSizeClass = getCardSizeClass(squareSize);

          return (
            <div key={picture.id} className={`card ${cardSizeClass}`}>
              <h3 className="card-title">{picture.title}</h3>
              <div className="card-image">
                <canvas
                  width={canvasSize}
                  height={canvasSize}
                  style={{ border: '1px solid transparent' }}
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      drawingData.forEach((color, index) => {
                        const x = index % squareSize;
                        const y = Math.floor(index / squareSize);
                        ctx.fillStyle = color;
                        ctx.fillRect(x * 10, y * 10, 10, 10);
                      });
                    }
                  }}
                ></canvas>
              </div>
              <p className="card-caption">{picture.caption}</p>
              <p className="card-creator">
                Created by: {getUsername()} {/* Display the username or "Guest" */}
              </p>
            </div>
          );
        })}
      </div>
      {error && <p className="error-message">{error}</p>} {/* Display error message if there's an error */}
      <div className="pagination">
        <button
          className="pagination-button mr-4 mt-4"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PixGallery;
