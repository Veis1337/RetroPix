import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/auth/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, [id]);

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="heading text-center">{user.username}'s Profile</h2>
      <div className="card">
        <h3 className="heading">About Me</h3>
        <p>{user.aboutMe}</p>
      </div>
      <div className="card">
        <h3 className="heading">Contact Info</h3>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
      </div>
      <div className="card">
        <h3 className="heading">Pictures</h3>
        <div className="grid">
          {/* Render user's pictures */}
          {user.pictures.map((picture) => (
            <div key={picture.id} className="card">
              <div
                className="pixelated"
                style={{
                  width: '200px',
                  height: '200px',
                  backgroundImage: picture.drawingData,
                  backgroundSize: 'cover',
                }}
              />
              <p>{picture.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
