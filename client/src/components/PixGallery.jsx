import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PixGallery.css';
import CommentModal from './CommentModal';

const PixGallery = () => {
  const [pictures, setPictures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [usernames, setUsernames] = useState({});
  const [error, setError] = useState(null); // Error state
  const [selectedPicture, setSelectedPicture] = useState(null); // Selected picture for comments
  const [showCommentModal, setShowCommentModal] = useState(false); // Comment modal visibility
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    setLoading(true); // Set loading state to true
    fetchPictures(currentPage);
    setError(null); // Clear the error state
  }, [currentPage]);

  useEffect(() => {
    if (pictures.length > 0) {
      setLoading(false); // Set loading state to false after pictures are fetched
    }
  }, [pictures]);

  const fetchPictures = async (page) => {
    try {
      const response = await axios.get(`/pix?page=${page}&limit=20`); // Add limit parameter
      if (response.status === 200) {
        setPictures(response.data);
        setTotalPages(response.headers['x-total-pages']);
        console.log(totalPages);
        console.log(currentPage);
        await fetchUsernames(response.data);
      } else {
        throw new Error('Failed to fetch pictures');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch pictures'); // Set error state
    }
  };

  const fetchUsernames = async (pictures) => {
    try {
      const userIds = pictures.map((picture) => picture.userId);
      const response = await axios.post('/users/usernames', { userIds });
      if (response.status === 200) {
        setUsernames(response.data);
      } else {
        throw new Error('Failed to fetch usernames');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch usernames'); // Set error state
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

  const getUsername = (picture) => {
    if (picture.userId) {
      return usernames[picture.userId] || 'Guest';
    } else if (picture.guestUserId) {
      return 'Guest';
    } else {
      return 'Unknown User';
    }
  };

  const handlePictureClick = (picture) => {
    setSelectedPicture(picture);
    setShowCommentModal(true);
  };

  return (
    <div className="pix-gallery">
      <h2 className="pix-gallery-heading">Welcome to RetroPix Pix Gallery!</h2>
      <p className="pix-gallery-subheading">Here's a gallery of random pictures created by users:</p>
      <div className="pagination">
        <button
          className={`pagination-button mr-4 mt-4 ${currentPage === 1 ? 'disabled' : 'hover:scale-110'}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={`pagination-button ${currentPage == totalPages ? 'disabled' : 'hover:scale-110'}`}
          onClick={handleNextPage}
          disabled={currentPage == totalPages}
        >
          Next
        </button>
      </div>  
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <div className="gallery">
          {pictures.map((picture, index) => {
            const drawingData = JSON.parse(picture.drawingData);
            const squareSize = Math.sqrt(drawingData.length);
            const canvasSize = squareSize * 10;
            const cardSizeClass = getCardSizeClass(squareSize);
            const animationDelay = `${index * 0.2}s`; // Delay each card animation

            return (
              <div
                key={picture.id}
                className={`card ${cardSizeClass}`}
                onClick={() => handlePictureClick(picture)}
                style={{ animationDelay }}
              >
                <h3 className="card-title">{picture.title}</h3>
                <div className="card-image hover:cursor-pointer hover:scale-125 transition-all">
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
                <p className="card-creator">Created by: {getUsername(picture)}</p>
              </div>
            );
          })}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {showCommentModal && selectedPicture && (
        <CommentModal picture={selectedPicture} closeModal={() => setShowCommentModal(false)} />
      )}
      <div className="pagination">
      <button
        className={`pagination-button mr-4 mt-4 ${currentPage === 1 ? 'disabled' : 'hover:scale-110'}`}
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <button
        className={`pagination-button ${currentPage == totalPages ? 'disabled' : 'hover:scale-110'}`}
        onClick={handleNextPage}
        disabled={currentPage == totalPages}
      >
        Next
      </button>
    </div>
  </div>
);
};

export default PixGallery;