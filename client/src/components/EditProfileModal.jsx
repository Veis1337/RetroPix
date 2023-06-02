import React, { useState } from 'react';
import axios from 'axios';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onUpdateProfile }) => {
  const [editData, setEditData] = useState({
    about: user.about || '',
  });

  const handleAboutChange = (e) => {
    setEditData({ ...editData, about: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      // Update the user about section
      const token = localStorage.getItem('token');
      await axios.put(`/users/${user.id}/about`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profile updated successfully!');
      onUpdateProfile(); // Fetch updated user profile
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <label htmlFor="about">About:</label>
        <textarea
          className="bg-[#ccc] p-2 m-2"
          id="about"
          value={editData.about}
          onChange={handleAboutChange}
        ></textarea>
        <div className="m-2 p-1">
          <br />
          <button className="px-5" onClick={handleSaveProfile}>
            Save
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
