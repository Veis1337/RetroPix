import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoggedInHomePage = () => {
  const [galleryPictures, setGalleryPictures] = useState([]);

  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const response = await axios.get('/pix');
        if (response.status === 200) {
          setGalleryPictures(response.data);
        } else {
          throw new Error('Failed to fetch pictures');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPictures();
  }, []);

  const parseDrawingData = (drawingData) => {
    try {
      return JSON.parse(drawingData);
    } catch (error) {
      console.error('Error parsing drawingData:', error);
      return [];
    }
  };

  const getCanvasSize = (squareSize) => {
    return squareSize * 10; // Each square cell is 10x10 pixels
  };

  return (
    <div>
      <h2>Welcome to RetroPix!</h2>
      <p>Here's a gallery of random pictures created by users:</p>
      <div className="gallery">
        {galleryPictures.map((picture) => {
          const drawingData = parseDrawingData(picture.drawingData);
          const squareSize = Math.sqrt(drawingData.length); // Calculate the square size based on the length of drawingData
          const canvasSize = getCanvasSize(squareSize);

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
    </div>
  );
};

export default LoggedInHomePage;
