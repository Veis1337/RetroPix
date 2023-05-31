import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PixGallery = () => {
  const [pictures, setPictures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPictures(currentPage);
  }, [currentPage]);

  const fetchPictures = async (page) => {
    try {
      const response = await axios.get(`/pix?page=${page}`);
      if (response.status === 200) {
        setPictures(response.data);
      } else {
        throw new Error('Failed to fetch pictures');
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

  return (
    <div>
      <h2>Welcome to RetroPix Pix Gallery!</h2>
      <p>Here's a gallery of random pictures created by users:</p>
      <div className="gallery">
        {pictures.map((picture) => {
          const drawingData = JSON.parse(picture.drawingData);
          const squareSize = Math.sqrt(drawingData.length);
          const canvasSize = squareSize * 10;

          return (
            <div key={picture.id} className="picture">
              <canvas
                width={canvasSize}
                height={canvasSize}
                style={{ border: '1px solid black' }}
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
          );
        })}
      </div>
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PixGallery;
