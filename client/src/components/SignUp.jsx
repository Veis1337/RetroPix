import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    isNewUser: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setFormData({ ...formData, isNewUser: !formData.isNewUser });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.isNewUser) {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match");
        return;
      }
  
      const { email, username, password } = formData;
      const requestData = { email, username, password };
  
      try {
        console.log(requestData);
        const response = await axios.post('/auth/register', requestData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('try complete');
  
        if (response.status === 200) {
          console.log('User registered successfully');
          setIsLoggedIn(true);
          navigate('/');
        } else {
          alert('User registration failed');
        }
      } catch (error) {
        alert('An error occurred:', error);
      }
    } else {
      try {
        const response = await axios.post('/auth/login', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          console.log('User logged in successfully');
          setIsLoggedIn(true);
          navigate('/');
        } else {
          alert('Login failed');
        }
      } catch (error) {
        alert('An error occurred:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="heading text-center mb-6" style={{ color: '#ccc', fontWeight: 'bold' }}>
        {formData.isNewUser ? 'Sign Up' : 'Log In'}
      </h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {formData.isNewUser && (
          <div className="mb-4">
            <label className="text">Email</label><br></br>
            <input
              type="email"
              className="input"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        )}
        {formData.isNewUser && (
          <div className="mb-4">
            <label className="text">Username</label>
            <input
              type="text"
              className="input"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        )}
        {!formData.isNewUser && (
          <div className="mb-4">
            <label className="text">Email</label><br></br>
            <input
              type="email"
              className="input"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="mb-4">
          <label className="text">Password</label>
          <input
            type="password"
            className="input"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
  
        {formData.isNewUser && (
          <div className="mb-6">
            <label className="text">Confirm Password</label>
            <input
              type="password"
              className={`input ${formData.password !== formData.confirmPassword ? 'text-red-500' : ''}`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {formData.password !== formData.confirmPassword && (
              <p className="text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
        )}
        <div>
          <button type="submit" className="text-green-500 border-2 p-2 border-green-500 hover:text-green-300">
            {formData.isNewUser ? 'Submit' : 'Log In'}
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        {formData.isNewUser ? (
          <p>
            <button className="text-blue-700 border-2 border-blue-700 p-2 hover:text-blue-300" onClick={handleToggle}>
              Log In
            </button>
          </p>
        ) : (
          <p>
            <button className="text-blue-700 border-2 border-blue-700 p-2 hover:text-blue-300" onClick={handleToggle}>
              Create New User
            </button>
          </p>
        )}
      </div>
    </div>
  );
  };
  
  export default SignUp;
  
