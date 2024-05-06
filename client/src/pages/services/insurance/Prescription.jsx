import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom'; 
import Insurance from '../../../contracts/InsuranceContract.json';

function PrescriptionDetails1() {
    const walletAddress = localStorage.getItem('walletAddress');
    const { prescriptionId } = useParams(); 
    const [state, setState] = useState({ web3: null, contract: null });
    const [data, setData] = useState(null);

    useEffect(() => {
        const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

        async function fetchData() {
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Insurance.networks[networkId];
            const contract = new web3.eth.Contract(Insurance.abi, deployedNetwork.address);
            setState({ web3: web3, contract: contract });
            const prescription = await contract.methods.getPrescription(prescriptionId).call();         
            setData(prescription);
            
        }

        provider && fetchData();
    }, [prescriptionId]);
    console.log(prescriptionId)
    

    const handleMarkAsReimbursed = async () => {

        try {

                        
            await state.contract.methods.markPrescriptionReimbursed(prescriptionId).send({ from: walletAddress });
            window.location.reload();
            
          } catch (error) {
            console.error("Error marking prescription as paid:", error.message);
          }
        
    };

    if (!data) {
        return <div>Loading...</div>;
    }
    
   
    return (
        <div className='InsuranceBox'> 
            <div className='SmallerBox'>
              <h2>Prescription Details</h2>
  
                <div>
                   <div>
                      <strong>Doctor:</strong> {data.doctorUsername}
                    </div>
                     <div>
                       <strong>Patient:</strong> {data.patientUsername}
                    </div>
                     <div>
                       <strong>Medications:</strong> {data.medication}
                    </div>
                     <div>
                      <strong>Instructions:</strong> {data.instructions}
                      <div>
                        <strong>Paid Status:</strong> {data.paidStatus.toString()}
                      </div>
                      <div>
                        <strong>reimbursement Status:</strong> {data.reimbursementStatus.toString()}
                      </div>
                    </div >
                    <div className='ButtonBox'>
                       <button className='Button' type='button' onClick={handleMarkAsReimbursed}>Mark as Reimbursed</button>

                    </div>
                    </div>
            </div>
            
        </div>
    );
}

export default PrescriptionDetails1;
