import React, { useState } from 'react';
import axios from 'axios';
import "./singUp.css"
import { useNavigate } from 'react-router-dom';

function SignUp(onSignUp) {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    password: '',
    role: '' 
  });
  const navigate=useNavigate();
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.post('http://localhost:3000/SignUp', formData);
      console.log('User registered successfully');

      localStorage.setItem('username', formData.username);
      const walletAddress = response.data.walletAddress;
      localStorage.setItem('walletAddress', walletAddress);

       const token = response.data.token;
       localStorage.setItem('token', token);

       
       const userRole = response.data.role;

       localStorage.setItem('userRole', userRole);
       onSignUp(userRole, token); 
       navigate(`/${userRole}`);

    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <div className="SignUpBox">
      <form className='Form' onSubmit={handleSubmit}>
        <fieldset className='Field'> 
          <div className='Inputs'>
            <input type="text" id='name' name='name' value={formData.name} onChange={handleChange} />
            <label htmlFor="name">Name:</label>
          </div>
          <div className='Inputs'>
            <input type="text" id='lastname' name='lastname' value={formData.lastname} onChange={handleChange} />
            <label htmlFor="lastname">Last Name:</label>
          </div>
          <div className='Inputs'>
            <input type="text" id='username' name='username' value={formData.username} onChange={handleChange} />
            <label htmlFor="username">User Name:</label>
          </div>
          <div className='Inputs'>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
            <label htmlFor="password">Password:</label>
          </div>
          <div className='Inputs'>
            <select name="role" id="role" value={formData.role} onChange={handleChange}>
            <option value="" disabled>Select a role</option> 
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="insurance">Insurance</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
            <label htmlFor="role">Select your Role:</label>
          </div>
          <button type='submit' className='btx'>Submit</button>
        </fieldset>
      </form>
    </div>
  );
}

export default SignUp;
