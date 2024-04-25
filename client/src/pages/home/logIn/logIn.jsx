import React, { useState } from 'react';
import "./logIn.css"
import img1 from "../../../assets/téléchargement.png"

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    let doctorAddress = "0x282d34Df86Bf49AbC52FEff14d0072bEE4EB5115"; // Default doctor's address
    let patientAddress = "0x669a9c7e304EB24cfe479B484396D471C4A2EaB8"; // Default patient's address
    let pharmacistAddress = "0xa14ebb9bBF722f05A42370832600Efc13E4ae238"; // Default pharmacist's address
    let insuranceAddress = "0xd4686A9D503Dd44eBf5F3f8e795E705571aaaE55"; // Default insurance's address

    if (username === 'doctor' && password === 'doctorpassword') {
      onLogin('doctor', doctorAddress);
    } else if (username === 'patient' && password === 'patientpassword') {
      onLogin('patient', patientAddress);
    } else if (username === 'pharmacist' && password === 'pharmacistpassword') {
      onLogin('pharmacist', pharmacistAddress);
    } else if (username === 'insurance' && password === 'insurancepassword') {
      onLogin('insurance', insuranceAddress);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='Box1'>
      
      <div className='Box2'>
      <h2>Login</h2>
      <div className='Form'>
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
      <div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      <button className='btxin' onClick={handleLogin}>Login</button>
      </div>


      </div>
          </div>
    <div className='image'>
        <img src={img1} alt="img" /> 
      </div>

      </div>
        );
}

export default LoginPage;
