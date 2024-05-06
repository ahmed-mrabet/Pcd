import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import Prescription from "../../../contracts/PrescriptionContract.json";
import "./doctor.css";


function Doctor() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState([]);
  const { contract } = state;
  const doctor = localStorage.getItem('username');
  const walletAddress = localStorage.getItem('walletAddress');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [showModifyInputs, setShowModifyInputs] = useState(false);
  const [medication, setMedication] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
  
    async function fetchData() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Prescription.networks[networkId];
      const contract = new web3.eth.Contract(Prescription.abi, deployedNetwork.address);
      setState({ web3: web3, contract: contract });
      const prescriptions = await contract.methods.getAllPrescriptionsForDoctor(doctor).call();
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
      const prescriptions = await contract.methods.getAllPrescriptions().call();
      setData(prescriptions);
    } else {
      const prescriptions = await contract.methods.getAllPrescriptionsForPatient(searchQuery).call();
      setData(prescriptions);
    }  
  }

  async function handleDelete(prescriptionId) {
    try {
      const gasEstimate = await contract.methods.deletePrescription(prescriptionId, doctor).estimateGas({ from: walletAddress });
      const gasLimit = Number(gasEstimate) + 100000;
      await contract.methods.deletePrescription(prescriptionId, doctor).send({ from: walletAddress, gas: gasLimit });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting prescription:", error);
    }
  }
   function handleModifyInputs() {
    
    setShowModifyInputs(true);
    
  }

  async function handleModify(prescriptionId) {
    try {
      const gasEstimate = await contract.methods.modifyPrescription(prescriptionId, medication, instructions).estimateGas({ from: walletAddress });
      const gasLimit = Number(gasEstimate) + 100000; // Increasing gas limit
      await contract.methods.modifyPrescription(prescriptionId, medication, instructions).send({ from: walletAddress, gas: gasLimit });
      window.location.reload();
    } catch (error) {
      console.error("Error modifying prescription:", error);
      console.log((prescriptionId ))

    }
  }


  return (
    <div className='DoctorBox'>
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
                className='prescriptionlist'
                key={prescription.prescriptionId} 
                onClick={() => {
                  setSelectedPrescriptionId(prescription.prescriptionId);
                  setShowButtons(true);
                }}
              >
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
                {selectedPrescriptionId === prescription.prescriptionId && showButtons && (
                  
                  <div className='ButtonsBox'>
                    <div className='ModifyBox'>
                      
                      <button onClick={() => handleModifyInputs(selectedPrescriptionId)}>Modify</button>

                      {showModifyInputs && (
                                  <div className='Modify'>
                                    <div>
                                      <label htmlFor="Medications"> Medications :</label>
                                    <input type="text"name='Medications' placeholder="Modified Medication" 
                                    onChange={(e)=>{setMedication(e.target.value)}} />
                                    </div>
                                    <div>
                                      <label htmlFor="Instructions"> Instructions :</label>     
                                    <input type="text"name='Instructions ' placeholder="Modified Instructions"
                                    onChange={(e)=>{setInstructions(e.target.value)}}  />
                                    </div>
                                    
                                  <button type="button" onClick={() => handleModify(selectedPrescriptionId)}>Submit Modifications </button>
                                  </div>
                       )}

                    </div>
                    <button onClick={() => handleDelete(prescription.prescriptionId)}>Delete</button>
                  </div>
                 
                )}
              </li>
            ))}
          </ul>
        </div>
        
      </div>
      
      

      
    </div>
    
  );
}

export default Doctor;
