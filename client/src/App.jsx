import { useState, useEffect } from 'react';
import Docotr from './pages/services/doctor/Doctor';
import LoginPage from './pages/home/logIn/logIn';
import Pharmacist from "./pages/services/pharmacist/pharmacist";
import Patient from"./pages/services/patient/patient"
import Insurance from './pages/services/insurance/insurance';
import"./App.css"
function App() {
  const [userRole, setUserRole] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  // On initial load, check if user is logged in from localStorage
  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserAddress = localStorage.getItem('userAddress');
    if (storedUserRole && storedUserAddress) {
      setUserRole(storedUserRole);
      setUserAddress(storedUserAddress);
    }
  }, []);

  const handleLogin = (role, address) => {
    setUserRole(role);
    setUserAddress(address);
    // Store the logged-in user role and address in localStorage
    localStorage.setItem('userRole', role);
    localStorage.setItem('userAddress', address);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserAddress(null);
    // Clear the logged-in user role and address from localStorage
    localStorage.removeItem('userRole');
    localStorage.removeItem('userAddress');
  };

  return (
    <div className='BigBox'>
      <h1>Prescription Management System</h1>
      
          {userRole === 'pharmacist' ? (
            <>
              <h2>Welcome, {userRole}!</h2>
              <button className ="btxout"onClick={handleLogout}>Logout</button>
              <Pharmacist userRole={userRole} userAddress={userAddress} />  
            </>
          ) : userRole === 'doctor' ? (
            <>
              <h2>Welcome, {userRole}!</h2>
              <button className='btxout'onClick={handleLogout}>Logout</button>
              <Docotr userRole={userRole} userAddress={userAddress} />
            </>          
          ) : userRole === 'patient' ? (
            <>
              <h2>Welcome, {userRole}!</h2>
              <button onClick={handleLogout}>Logout</button>
              <Patient userRole={userRole} userAddress={userAddress} />
            </>
          ) : userRole === 'insurance' ? (
            <>
              <h2>Welcome, {userRole}!</h2>
              <button onClick={handleLogout}>Logout</button>
              <Insurance userRole={userRole} userAddress={userAddress} />
            </>
          )  : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
