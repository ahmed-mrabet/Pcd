import React,{useEffect,useState} from 'react'
import Web3 from 'web3';
import Prescription from '../../../contracts/PrescriptionContract.json';
function add() { 
    
    const [contract, setContract] = useState(null);
    const [patient, setPatient] = useState('');
    const [medications, setMedications] = useState('');
    const [instructions, setInstructions] = useState('');
    const doctor = localStorage.getItem('username');
    const walletAddress = localStorage.getItem('walletAddress');

    useEffect(() => {
    async function fetchContract() {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Prescription.networks[networkId];
      const contractInstance = new web3.eth.Contract(Prescription.abi, deployedNetwork.address);
      
      setContract(contractInstance);
      
    }
    fetchContract();
    
  }, []);


  async function writeData() {
    const gasEstimate = await contract.methods.createPrescription(doctor, patient, medications, instructions)
      .estimateGas({ from: walletAddress });
    const gasLimit = Number(gasEstimate) + 100000;
    await contract.methods.createPrescription(doctor, patient, medications, instructions)
      .send({ from: walletAddress, gas: gasLimit });

    window.location.reload();
  }
  return (
    <div className='DoctorBox'>
            <div className='SmallerBox'>
            <form action="" className='box1' >
            <fieldset className='Field'>
                <h4>Add Prescription:</h4>
                <div className='inputs'>
                <label htmlFor="patient">Patient:</label>
                <input onChange={(e) => setPatient(e.target.value)} value={patient} type="text" id="patient" />
                </div>
                <div className='inputs'>
                <label htmlFor="medications">Medications:</label>
                <input onChange={(e) => setMedications(e.target.value)} value={medications} type="text" id="medications" />
                </div>
                <div className='inputs'>
                <label htmlFor="instructions">Instructions:</label>
                <input type="text" id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
                </div>
                <div className='btx_container'>
                <button className="btx" type="button" onClick={writeData}>Submit</button>
                </div>
            </fieldset>
            </form>
        </div>

    </div>
    
  )
}

export default add 