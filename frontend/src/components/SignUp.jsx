import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('User created successfully');
        // Redirect or show success message
      } else {
        alert('User creation failed');
        // Handle error response
      }
    } catch (error) {
      alert('An error occurred:', error);
  
    }
  };

  const isPasswordMatch = formData.password === formData.confirmPassword;
  const isFormComplete =
    formData.username !== '' &&
    formData.email !== '' &&
    formData.password !== '' &&
    formData.confirmPassword !== '' &&
    isPasswordMatch;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="heading text-center mb-6" style={{ color: 'blue', fontWeight: 'bold' }}>Sign Up</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
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
        <div className="mb-4">
          <div className="flex flex-col">
            <label className="text">Email</label>
            <input
              type="email"
              className="input"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
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
        <div className="mb-6">
          <label className="text">Confirm Password</label>
          <input
            type="password"
            className={`input ${!isPasswordMatch ? 'text-red-500' : ''}`}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {!isPasswordMatch && (
            <p className="text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>
        <div>
        <button type="submit" className={`btn ${isFormComplete ? 'btn-green' : ''}`}>Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
