import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./logIn.css";
import img1 from "../../../assets/téléchargement.png";
import { jwtDecode } from "jwt-decode";

function LoginPage({ onLogin }) {
  const navigate = useNavigate(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState(''); // Initialize role state with an empty string

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username: username,
        password: password,
        role: role
      });
      localStorage.setItem('username', username);
      const walletAddress = response.data.walletAddress;
      localStorage.setItem('walletAddress', walletAddress);

       const token = response.data.token;
       localStorage.setItem('token', token);

       const decoded = jwtDecode(token);
       const userRole = response.data.role;

       localStorage.setItem('userRole', userRole);

       onLogin(userRole, token); // Call the onLogin function with userRole and token
       navigate(`/${userRole}`); // Redirect to the appropriate role-specific page
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='Box1'>
      <div className='Box2'>
        <h2>Login</h2>
        <div className='Form'>
          <form  className="logInForm"onSubmit={handleLogin}>
            <fieldset className='logInField'>
              <div className='logInInputs'>
                <label htmlFor="username">Username:</label>
                <input required
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div  className='logInInputs'>
                <label htmlFor="password">Password:</label>
                <input required
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div  className='logInInputs'>
                <label htmlFor="role">Select your Role:</label>
                <select required name="role" id="role" value={role} onChange={(e) => setRole(e.target.value)} >
                  <option value="" disabled>Select a role</option> {/* Set the default option */}
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
