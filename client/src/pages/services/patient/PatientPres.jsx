import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom'; 
import Patient from '../../../contracts/PatientContract.json';

function PatientPres() {
    const walletAddress = localStorage.getItem('walletAddress');
    const { prescriptionId } = useParams(); 
    const [state, setState] = useState({ web3: null, contract: null });
    const [data, setData] = useState(null);

    useEffect(() => {
        const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

        async function fetchData() {
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Patient.networks[networkId];
            const contract = new web3.eth.Contract(Patient.abi, deployedNetwork.address);
            setState({ web3: web3, contract: contract });
            const prescription = await contract.methods.getPrescription(prescriptionId).call();         
            setData(prescription);
            
        }

        provider && fetchData();
    }, [prescriptionId]);
    

   
   
    return (
        <div className='PatientBox'> 
        {data === null ? (  <div>Loading...</div> ) : ( <div className='SmallerBox'>
            
              <h2>Prescription Details</h2>
  
                <div className='DetailsBox'> 
                   <div className='Details'>
                      <strong>Doctor:</strong> {data.doctorUsername}
                    </div>
                     <div  className='Details'>
                       <strong>Patient:</strong> {data.patientUsername}
                    </div>
                     <div  className='Details'>
                       <strong>Medications:</strong> {data.medication}
                    </div>
                     <div  className='Details'>
                      <strong>Instructions:</strong> {data.instructions}
                      </div>
                      <div  className='Details'>
                        <strong>Paid Status:</strong> {data.paidStatus.toString()}
                      </div>
                      <div  className='Details'>
                        <strong>reimbursement Status:</strong> {data.reimbursementStatus.toString()}
                      </div>
                    
                    
                    </div>
            </div>
             )}
        </div>
    );
}

export default PatientPres;
