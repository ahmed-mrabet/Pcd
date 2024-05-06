import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { useParams } from 'react-router-dom'; 
import Pharmacy from '../../../contracts/PharmacyContract.json';

function PrescriptionDetails() {
    const walletAddress = localStorage.getItem('walletAddress');
    const { prescriptionId } = useParams(); 
    const [state, setState] = useState({ web3: null, contract: null });
    const [data, setData] = useState(null);

    useEffect(() => {
        const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

        async function fetchData() {
            const web3 = new Web3(provider);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Pharmacy.networks[networkId];
            const contract = new web3.eth.Contract(Pharmacy.abi, deployedNetwork.address);
            setState({ web3: web3, contract: contract });
            const prescription = await contract.methods.getPrescription(prescriptionId).call();         
            setData(prescription);
            
        }

        provider && fetchData();
    }, [prescriptionId]);

    const handleMarkAsPaid = async () => {

        try {

                        
            await state.contract.methods.markPrescriptionPaid(prescriptionId).send({ from: walletAddress });
            window.location.reload();
            
          } catch (error) {
            console.error("Error marking prescription as paid:", error.message);
          }
        
    };

    if (!data) {
        return <div>Loading...</div>;
    }
    
   
    return (
        <div className='PharmacistBox'> 
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
                    </div>
                    <div className='PaidButtonBox'>
                       <button className='PaidButton' type='button' onClick={handleMarkAsPaid}>Mark as Paid</button>

                    </div>
                    </div>
            </div>
            
        </div>
    );
}

export default PrescriptionDetails;
