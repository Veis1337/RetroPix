import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';
import EditProfileModal from '../components/EditProfileModal';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPictures();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/users/user-info', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data);
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch user profile');
    }
  };

  const fetchUserPictures = async () => {
    try {
      const response = await axios.get('/pix');
      if (response.status === 200) {
        const fetchedPictures = response.data.map((picture) => ({
          ...picture,
          squareSize: Math.sqrt(JSON.parse(picture.drawingData).length),
        }));
        setPictures(fetchedPictures);
      } else {
        throw new Error('Failed to fetch user pictures');
      }
    } catch (error) {
      console.error('Error fetching user pictures:', error);
      setError('Failed to fetch user pictures');
    }
  };

  const handleEditPicture = async (picture) => {
    try {
      const response = await axios.put(`/pix/${picture.id}`, {
        title: picture.title,
        drawingData: picture.drawingData,
      });
      console.log('Picture edited successfully!', response.data);
      fetchUserPictures(); // Fetch updated list of pictures
    } catch (error) {
      console.error('Error editing picture:', error);
    }
  };

  const handleCopyPicture = async (picture) => {
    try {
      const response = await axios.post(`/pix/${picture.id}/copy`);
      console.log('Picture copied successfully!', response.data);
      fetchUserPictures(); // Fetch updated list of pictures
    } catch (error) {
      console.error('Error copying picture:', error);
    }
  };

  const handleDeletePicture = async (pictureId) => {
    try {
      await axios.delete(`/pix/${pictureId}`);
      console.log('Picture deleted successfully!');
      fetchUserPictures(); // Fetch updated list of pictures
    } catch (error) {
      console.error('Error deleting picture:', error);
    }
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateProfile = () => {
    fetchUserProfile();
  };

  const renderPictures = () => {
    return pictures.map((picture) => {
      const drawingData = JSON.parse(picture.drawingData);
      const cardSizeClass = `card-size-${picture.squareSize}`;
  
      return (
        <div key={picture.id} className={`card ${cardSizeClass}`}>
          <h3 className="card-title">{picture.title}</h3>
          <div className="card-image">
            <canvas
              width={picture.squareSize * 10}
              height={picture.squareSize * 10}
              style={{ border: '1px solid transparent' }}
              ref={(canvas) => {
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  drawingData.forEach((color, index) => {
                    const x = index % picture.squareSize;
                    const y = Math.floor(index / picture.squareSize);
                    ctx.fillStyle = color;
                    ctx.fillRect(x * 10, y * 10, 10, 10);
                  });
                }
              }}
            ></canvas>
          </div>
          <p className="card-caption">{picture.caption}</p>
          <div className="card-actions">
            <button
              className="card-button"
              onClick={() => handleEditPicture(picture)}
            >
              Edit
            </button>
            <button
              className="card-button"
              onClick={() => handleCopyPicture(picture)}
            >
              Copy
            </button>
            <button
              className="card-button"
              onClick={() => handleDeletePicture(picture.id)}
            >
              Delete
            </button>
          </div>
        </div>
      );
    });
  };
  

  return (
    <div className="user-profile">
      {user && (
        <>
          <div className="profile-header">
            <h2 className="username font-bold text-[#4299e1]">
              {user.username}
            </h2>
            <p className="about">{user.about}</p>
            <button class='bg-[#4299e1] p-1 px-2' onClick={handleOpenEditModal}>Edit Profile</button>
            {showEditModal && (
              <EditProfileModal
                user={user}
                onClose={handleCloseEditModal}
                onUpdateProfile={handleUpdateProfile}
              />
            )}
          </div>
          <div className="picture-gallery">
            <h3 className="gallery-heading text-[#FF00FF]">
              {user.username}'s Pix
            </h3>
            {pictures.length > 0 ? (
              <div className="gallery">{renderPictures()}</div>
            ) : (
              <p>No pictures found.</p>
            )}
          </div>
        </>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default UserProfile;
