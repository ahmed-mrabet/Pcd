import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import Prescription from "../../../contracts/PrescriptionContract.json";
import PrescriptionSelector from '../selector';
import "./doctor.css"

function Doctor({userRole, userAddress }) {
  const [state, setState] = useState({ web3: null, contract: null });
  const [data, setData] = useState({});

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    async function template() {
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Prescription.networks[networkId];
      const contract = new web3.eth.Contract(Prescription.abi, deployedNetwork.address);
      setState({ web3: web3, contract: contract });
    }
    provider && template();
  }, []);

  useEffect(() => {
    const { contract } = state;
    async function readData() {
      const Id = await contract.methods.latestPrescriptionId().call();
      const data = await contract.methods.getPrescription(Id).call();
      setData(data);
    }
    contract && readData();
  }, [state]);

  async function writeData() {
    const { contract } = state;
    const patient = document.querySelector("#patient").value;
    const medications = document.querySelector("#medications").value;
    const instructions = document.querySelector("#instructions").value;
    const gasEstimate = await contract.methods.createPrescription(patient, medications, instructions)
      .estimateGas({ from: userAddress });
    const gasLimit = Number(gasEstimate) + 100000;
    await contract.methods.createPrescription(patient, medications, instructions)
      .send({ from: userAddress, gas: gasLimit });
    window.location.reload();
  }

  const excludedKeys = ['0', '1', '2', '3', '4', '5', '6', '__length__'];

  return (
    <div className='DoctorBox'>
      <div>
      <div className='SmallerBox' >
        <h2>Prescription Details:</h2>
        <ul>
          {Object.keys(data).filter(key => !excludedKeys.includes(key)).map((key, index) => (
            <li key={index}>
              <strong>{key}:</strong> {data[key].toString()}
            </li>
          ))}
        </ul>
      </div>

      <div className='SmallerBox'>
        <form action="" className='box1' >
          <fieldset className='Field'>
            <h4>Add Prescription :</h4>
            <div className='inputs'>
              <label htmlFor="patient">Patient :</label>
              <input type="text" id="patient" />
            </div>
            <div className='inputs'>
              <label htmlFor="medications">Medications :</label>
              <input type="text" id="medications" />
            </div>
            <div className='inputs'>
              <label htmlFor="instructions">Instructions :</label>
              <input type="text" id="instructions" />
            </div> 
            <div className='btx_container'>           
             <button className="btx"type="button" onClick={writeData}>Submit</button>
            </div>          

          </fieldset>

        </form> 
      </div>

      </div>
      
      <div className='SmallerBox'>
        <PrescriptionSelector userRole={userRole}userAddress={userAddress} />
      </div>
    </div>
  )
} 

export default Doctor;
