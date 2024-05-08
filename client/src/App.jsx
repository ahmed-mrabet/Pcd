import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate,useLocation } from 'react-router-dom'; 
import Doctor from './pages/services/doctor/Doctor';
import LoginPage from './pages/home/logIn/logIn';
import Pharmacist from "./pages/services/pharmacist/pharmacist";
import Patient from "./pages/services/patient/patient";
import Insurance from './pages/services/insurance/insurance';
import SignUpPage from './pages/home/signUp/signUp';
import Add from './pages/services/doctor/add';
import "./App.css";
import logo from "./assets/logo.png";
import PrescriptionDetails from './pages/services/pharmacist/Prescription';
import  PrescriptionDetails1  from './pages/services/insurance/Prescription';
import PatientPres from './pages/services/patient/PatientPres';
import AboutUs from './pages/home/abouUs/aboutUs';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole && storedToken) {
      setUserRole(storedUserRole);
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (role, token) => {
    setUserRole(role);
    setToken(token);
  };
  const handelSignUp=(role,token)=>{{
    setUserRole(role);
    setToken(token);
  }
  }
  const handleLogout = () => {
    setUserRole(null);
    setToken(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    window.location.href = "/";
  };
  function HeaderButtons({ userRole }) {
    const location = useLocation();
  
    return (
      <ul className='Header'>
        {!userRole && <li><Link to="/aboutus">About us</Link></li>}
        {userRole === "doctor" && location.pathname !== "/Create" && <li><Link to="/Create">Create Prescription</Link></li>}
        {userRole === "doctor" && location.pathname !== "/doctor" && <li><Link to="/doctor">Home</Link></li>}
        {!userRole && location.pathname!=="/signUp" && <li><Link to="/signUp">Sign up</Link></li>}
        {!userRole && location.pathname=="/signUp"&& <li><Link to="/">Login</Link></li>}
        {userRole === "pharmacy" && location.pathname !== "/pharmacy" && <li id="PharmacyLink"><Link  to="/pharmacy">Home</Link></li>}
        {userRole === "patient" && location.pathname !== "/patient" && <li id="PatientLink"><Link to="/patient">Home</Link></li>}
        {userRole === "insurance" && location.pathname !== "/insurance" && <li id="InsuranceLink"><Link to="/insurance">Home</Link></li>}      
      </ul>
    );
  }

  return (
    <Router>
      <div className='BigBox'>
        <h1>Prescription Management System</h1> 
        <div className='HeaderContainer'>
          <div className='logo'>
            <img className="logopic" src={logo} alt="LOGO" />
          </div>
          <ul className='Header'>
            <HeaderButtons userRole={userRole} /> 
          </ul>
        </div>
        {userRole && (
          <div className='Title'>
            <h2>Welcome, {userRole}!</h2>
            <button className="btxout" onClick={handleLogout}>Logout</button>
          </div>
        )}
        <div className='Container'>
          <Routes>
            <Route path="/" element={userRole ? <Navigate to={`/${userRole}`} /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/signUp" element={userRole ? <Navigate to ={`/${userRole}`}/> : <SignUpPage onSignUp={handelSignUp} />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/pharmacy" element={<Pharmacist />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/insurance" element={<Insurance />} />
            <Route path='/Create' element={<Add/>}/>
            <Route path='/pharmacy/prescription/:prescriptionId' element={<PrescriptionDetails />} />
            <Route path='/insurance/prescription/:prescriptionId' element={<PrescriptionDetails1 />} />
            <Route path="/Patient/prescription/:prescriptionId" element={<PatientPres/>} />
            <Route path='/aboutUs' element={<AboutUs/>}/>

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
