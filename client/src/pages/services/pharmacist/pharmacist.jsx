import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import "./pharmacist.css";
import Pharmacy from '../../../contracts/PharmacyContract.json';
import Web3 from 'web3';

function Pharmacist() {
  const walletAddress = localStorage.getItem('walletAddress');
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { prescriptionId } = useParams(); 
  
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
  
    async function fetchData() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Pharmacy.networks[networkId];
      const contract = new web3.eth.Contract(Pharmacy.abi, deployedNetwork.address);
      setState({ web3: web3, contract: contract });

      const prescriptions = await contract.methods.getAllPrescriptions().call();
      const formattedPrescriptions = prescriptions.map((prescription, index) => ({
        ...prescription,
        prescriptionId: index 
      }));

      setData(formattedPrescriptions);
    }
  
    provider && fetchData();
  }, []);

  async function searchPrescriptions() {
    if (!searchQuery) {
      const prescriptions = await state.contract.methods.getAllPrescriptions().call();
      setData(prescriptions);
    } else {
      const prescriptions = await state.contract.methods.getAllPrescriptionsForPatient(searchQuery).call();
      setData(prescriptions);
    }  
  }
  return (
    <div className='PharmacistBox'>
      <div>
        <h4>Search Prescriptions by Patient:</h4>
        <div className='SearchBar'>
          <input placeholder='Patient Username' onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} type="text" id="searchQuery" />
          <button type="button"  onClick={searchPrescriptions}>Search</button>  
        </div>
      </div>

      <div className='SmallerBox'>
        <h2>All Prescription Details:</h2>
        <div className='listContainer'>
          <ul className='list'>
            {data.filter(prescription => !prescription.isDeleted).map(prescription => (
              <li
                className='pharmacyprescriptionlist'
                key={prescription.prescriptionId} 
              >
                <Link className='link' to={`/pharmacy/prescription/${prescription.prescriptionId}`}>
                  <div>
                    <strong>Doctor:</strong> {prescription.doctorUsername}
                  </div>
                  <div>
                    <strong>Patient:</strong> {prescription.patientUsername}
                  </div>
                  <div>
                    <strong>Medications:</strong> {prescription.medication}
                  </div>
                  <div>
                    <strong>Instructions:</strong> {prescription.instructions}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      
    </div>
  );
}

export default Pharmacist;
