import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "./logIn.css";
import img1 from "../../../assets/téléchargement.png";
import { jwtDecode } from "jwt-decode";

function LoginPage({ onLogin }) {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username: username,
        password: password,
        role: role
      });

       const token = response.data.token;
       localStorage.setItem('token', token);

       const decoded = jwtDecode(token);
       const userRole = response.data.role;

       localStorage.setItem('userRole', userRole);

       if (userRole === 'doctor') {
         navigate('/doctor'); // Use navigate function to navigate
       } else if (userRole === 'pharmacist') {
         navigate('/pharmacist'); // Use navigate function to navigate
       } else if (userRole === 'patient') {
         navigate('/patient'); // Use navigate function to navigate
       } else if (userRole === 'insurance') {
         navigate('/insurance'); // Use navigate function to navigate
       }

       onLogin(userRole, token);
       console.log('connected',token,"    role    :",userRole,"decode",decoded)
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='Box1'>
      <div className='Box2'>
        <h2>Login</h2>
        <div className='Form'>
        <form onSubmit={handleLogin}>
          <fieldset>
            <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div >
            <label htmlFor="role">Select your Role:</label>
            <select name="role" id="role" onChange={(e) => setRole(e.target.value)} >
              <option value="" disabled >Roles</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
              <option value="insurance">Insurance</option>
              <option value="pharmacy">Pharmacy</option>
            </select>
          </div>
          <div className='logInbtx '>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button className='btxin' type="submit">Login</button>
          </div>
          </fieldset>
        </form>
          
        </div>
      </div>
      <div className='image'>
        <img src={img1} alt="img" />
      </div>
    </div>
  );
}

export default LoginPage;
