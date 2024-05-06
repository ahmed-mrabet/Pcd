import React, { useState, useEffect } from 'react';
import { Link , useParams } from 'react-router-dom';
import patient from "../../../contracts/PatientContract.json";
import "./patient.css"
import Web3 from 'web3';

function Patient() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState([]);
  const { prescriptionId } = useParams(); 
  const username = localStorage.getItem('username');
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
  
    async function fetchData() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = patient.networks[networkId];
      const contract = new web3.eth.Contract(patient.abi, deployedNetwork.address);
      setState({ web3: web3, contract: contract });

      const prescriptions = await contract.methods.getPrescriptionsByPatient(username).call();
      const formattedPrescriptions = prescriptions.map((prescription, index) => ({
        ...prescription,
        prescriptionId: index 
      }));

      setData(formattedPrescriptions);
    }
  
    provider && fetchData();
  }, []);

 
  return (
    <div className='PatientBox'>
      <div className='SmallerBox'>
        <h2>All your Prescriptions : </h2>
        <div className='listContainer'>
          {data.length === 0 ? (
            <p>No prescriptions available.</p>
          ) : (
            <ul className='list'>
                {data.filter(prescription => !prescription.isDeleted).map(prescription => (
                  
                  <li
                    className='prescriptionlist'
                    key={prescription.prescriptionId}  
                  >
                    <Link className='link' to={`/Patient/prescription/${prescription.prescriptionId}`}>
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
          )}
        </div>
      </div>
    </div>
  );
}









  

export default Patient;
