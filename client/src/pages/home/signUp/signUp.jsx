import React, { useState } from 'react';
import axios from 'axios';
import "./singUp.css"

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    password: 'Roles',
    role: '' // Default role
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/SignUp', formData);
      console.log('User registered successfully');
      // Optionally, redirect the user to another page after successful registration
    } catch (error) {
      console.error('Error registering user:', error);
      // Handle error (e.g., display error message to the user)
    }
  };

  return (
    <div>
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
              <option value=""disabled  >Roles</option>
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
