import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'; // Import useNavigate
import Doctor from './pages/services/doctor/Doctor';
import LoginPage from './pages/home/logIn/logIn';
import Pharmacist from "./pages/services/pharmacist/pharmacist";
import Patient from "./pages/services/patient/patient";
import Insurance from './pages/services/insurance/insurance';
import SignUpPage from './pages/home/signUp/signUp';
import "./App.css";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [userAddress, ] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('Token');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole && token) {
      setUserRole(storedUserRole);
      setToken(token);
    }
  }, []);

  const handleLogin = (role, token) => {
    setUserRole(role);
    setToken(token);
    console.log('connected', "token", token, "   role    :", role);
  };

  const handleLogout = () => {
    setUserRole(null);
    (null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.location.href = "/";
  };

  return (
    <Router>
      <div className='BigBox'>
        <h1>Prescription Management System</h1>
        <div className='Container'>
          <Routes>
            {userRole && (
              <Route path={`/${userRole}`} element={(
                <>
                  {userRole === 'pharmacist' && (
                    <>
                      <div className='Title'>
                        <h2>Welcome, {userRole}!</h2>
                        <button className="btxout" onClick={handleLogout}>Logout</button>
                      </div>
                      <Pharmacist userRole={userRole}  />
                    </>
                  )}
                  {userRole === 'doctor' && (
                    <>
                      <div className='Title'>
                        <h2>Welcome, {userRole}!</h2>
                        <button className='btxout' onClick={handleLogout}>Logout</button>
                      </div>
                      <Doctor userRole={userRole}  />
                    </>
                  )}
                  {userRole === 'patient' && (
                    <>
                      <div className='Title'>
                        <h2>Welcome, {userRole}!</h2>
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                      <Patient userRole={userRole}  />
                    </>
                  )}
                  {userRole === 'insurance' && (
                    <>
                      <div className='Title'>
                        <h2>Welcome, {userRole}!</h2>
                        <button onClick={handleLogout}>Logout</button>
                      </div>
                      <Insurance userRole={userRole}  />
                    </>
                  )}
                </>
              )} />
            )}
            {/* If user is logged in, redirect to their role-specific page */}
            <Route path="/" element={userRole ? <Navigate to={`/${userRole}`} /> : (
              <div>
                <div>
                  <ul className='Header'>
                    <li><Link to="/">About us</Link></li>
                    <li><Link to="/signUp">Sign up</Link></li>
                  </ul>
                </div>
                <LoginPage onLogin={handleLogin} />
              </div>
            )} />
            <Route path="/signUp" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
