import React from 'react';
import SignUp from '../components/SignUp';

const SignUpPage = ({ setIsLoggedIn }) => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUp setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default SignUpPage;
