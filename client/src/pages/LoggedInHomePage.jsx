import React, { useEffect, useState } from 'react';

const LoggedInHomePage = () => {
  const [galleryPictures, setGalleryPictures] = useState([]);

  useEffect(() => {
    // Fetch the pictures from the backend API
    const fetchPictures = async () => {
      try {
        const response = await fetch('/pix');
        if (response.ok) {
          const data = await response.json();
          setGalleryPictures(data);
        } else {
          throw new Error('Failed to fetch pictures');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPictures();
  }, []);

  return (
    <div>
      <h2>Welcome to RetroPix!</h2>
      <p>Here's a gallery of random pictures created by users:</p>
      <div className="gallery">
        {galleryPictures.map((picture) => (
          <div key={picture.id} className="picture">
            <img src={picture.imageUrl} alt={`Picture ${picture.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoggedInHomePage;
