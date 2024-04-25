import { useState, useEffect } from 'react';
import Web3 from "web3";
import Prescription from "../../contracts/PrescriptionContract.json";
import Pharmacy from "../../contracts/PharmacyContract.json";
import Insurance from "../../contracts/InsuranceContract.json";

function PrescriptionSelector({ userRole, userAddress }) {
  const [selectedId, setSelectedId] = useState('0');
  const [prescriptionIds, setPrescriptionIds] = useState({});
  const [data, setData] = useState({});
  const [contract, setContract] = useState(null);
  const [pharmacy, setPharmacy] = useState(null);
  const [insurance, setInsurance] = useState(null);
  const [deletedPrescriptionsCount, setDeletedPrescriptionsCount] = useState(0);
  const [paidPrescriptionsCount, setPaidPrescriptionsCount] = useState(0);
  const [reimbursedPrescriptionsCount, setReimbursedPrescriptionsCount] = useState(0);
  const [Medications, setMedications] = useState('');
  const [Instructions, setInstructions] = useState('');

  useEffect(() => {
    async function fetchContract() {
      const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Prescription.networks[networkId];
      const contractInstance = new web3.eth.Contract(Prescription.abi, deployedNetwork.address);
      const pharmacyInstance = new web3.eth.Contract(Pharmacy.abi, deployedNetwork.address);
      const insuranceInstance = new web3.eth.Contract(Insurance.abi, deployedNetwork.address);
      
      setContract(contractInstance);
      setPharmacy(pharmacyInstance);
      setInsurance(insuranceInstance);
    }
    fetchContract();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!contract) return;
      await fetchPrescriptionIds();
      readData(selectedId);
      countDeletedPrescriptions();
      countPaidPrescriptions();
      countReimbursedPrescriptions();
    }
    fetchData();
  }, [contract, selectedId]);

  const fetchPrescriptionIds = async () => {
    if (!contract) return;
    const latestId = await contract.methods.latestPrescriptionId().call();
    let ids = {};
    let counter = 1;
    for (let i = 0; i <= latestId; i++) {
      const prescription = await contract.methods.getPrescription(i).call();
      if (!prescription.isDeleted) {
        ids[i.toString()] = counter.toString();
        counter++;
      }
    }
    setPrescriptionIds(ids);
    if (!ids[selectedId]) {
      const firstId = Object.keys(ids)[0] || '0';
      setSelectedId(firstId);
      readData(firstId);
    }
  };

  const readData = async (id) => {
    if (!contract) return;
    const prescriptionData = await contract.methods.getPrescription(id).call();
    if (!prescriptionData.isDeleted) {
      setData(prescriptionData);
    } else {
      setData({});
    }
  };

  const handleChange = (e) => {
    const selectedId = e.target.value;
    setSelectedId(selectedId);
  };

  const DeletePrescription = async () => {
    if (!contract) return;
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    try {
      await contract.methods.deletePrescription(selectedId).send({ from: userAddress });
      await fetchPrescriptionIds();
      countDeletedPrescriptions();
    } catch (error) {
      console.error("Error deleting prescription:", error.message);
    }
  };

  const MarkPaid = async () => {
    if (!pharmacy) return;
    if (!window.confirm('Are you sure you want to mark this prescription as paid?')) return;
    try {
      await pharmacy.methods.markPrescriptionPaid(selectedId).send({ from: userAddress });
      countPaidPrescriptions();
      window.location.reload();
    } catch (error) {
      console.error("Error marking prescription as paid:", error.message);
    }
  };

  const MarkReimbursed = async () => {
    if (!insurance) return;
    if (!window.confirm('Are you sure you want to mark this prescription as reimbursed ?')) return;
    try {
      await insurance.methods.markPrescriptionReimbursed(selectedId).send({ from: userAddress });
      countReimbursedPrescriptions();
      window.location.reload();
    } catch (error) {
      console.error("Error marking prescription as reimbursed:", error.message);
    }
  };

  const countDeletedPrescriptions = async () => {
    if (!contract) return;
    try {
      const latestId = await contract.methods.latestPrescriptionId().call();
      let counter = 0;
      for (let i = 0; i <= latestId; i++) {
        const prescription = await contract.methods.getPrescription(i).call();
        if (prescription.isDeleted) {
          counter++;
        }
      }
      setDeletedPrescriptionsCount(counter);
    } catch (error) {
      console.error("Error counting deleted prescriptions:", error.message);
    }
  };

  const countPaidPrescriptions = async () => {
    if (!contract) return;
    try {
      const latestId = await contract.methods.latestPrescriptionId().call();
      let counter = 0;
      for (let i = 0; i <= latestId; i++) {
        const prescription = await contract.methods.getPrescription(i).call();
        if (prescription.paidStatus) {
          counter++;
        }
      }
      setPaidPrescriptionsCount(counter);
    } catch (error) {
      console.error("Error counting paid prescriptions:", error.message);
    }
  };

  const countReimbursedPrescriptions = async () => {
    if (!contract) return;
    try {
      const latestId = await contract.methods.latestPrescriptionId().call();
      let counter = 0;
      for (let i = 0; i <= latestId; i++) {
        const prescription = await contract.methods.getPrescription(i).call();
        if (prescription.reimbursementStatus) {
          counter++;
        }
      }
      setReimbursedPrescriptionsCount(counter);
    } catch (error) {
      console.error("Error counting reimbursed prescriptions:", error.message);
    }
  };
  async function ModifyPrescription() {
    if (!contract) return;
    if (!window.confirm('Are you sure you want to modify this prescription ?')) return;
    try {
      const gasEstimate = await contract.methods.modifyPrescription(selectedId, Medications, Instructions)
        .estimateGas({ from: userAddress });
      const gasLimit = Number(gasEstimate) + 100000;
      await contract.methods.modifyPrescription(selectedId, Medications, Instructions)
        .send({ from: userAddress, gas: gasLimit });
      window.location.reload()  
    } catch (error) {
      console.error("Error modifying prescription:", error.message);
    }
  }
  


  const excludedKeys = ['0', '1', '2', '3', '4', '5', '6', '__length__'];

  return (
    <div>
      <h2>Prescription Selector</h2>
      <label htmlFor="prescriptionSelect">Select Prescription:</label>
      <select id="prescriptionSelect" value={selectedId} onChange={handleChange}>
        {Object.entries(prescriptionIds).map(([id, displayNum]) => (
          <option key={id} value={id}>Prescription {displayNum}</option>
        ))}
      </select>

      <div>
        <h2>Prescription Details:</h2>
        <ul>
          {Object.keys(data).filter(key => !excludedKeys.includes(key)).map((key, index) => (
            <li key={index}>
              <strong>{key}:</strong> {data[key].toString()}
            </li>
          ))}
        </ul> 
        {userRole === "doctor" ? (
          <>
            <div className='btx_container'>           
              <button className="btx" onClick={DeletePrescription}>Delete Prescription</button>
            </div> 
            <p>Prescriptions Deleted: {deletedPrescriptionsCount}</p>
            <div>
              <form className='box1' action="">
               <fieldset  className='Field'>
                <h4>Modify prescription :</h4>
                <div className='inputs'>
                  <label htmlFor="medications">Medications :</label>
                  <input type="text" id="medications" value={Medications} onChange={(e) => setMedications(e.target.value)} />
                </div>
                <div className='inputs'>
                  <label htmlFor="instructions">Instructions: </label>
                  <input type="text" id="instructions" value={Instructions} onChange={(e) => setInstructions(e.target.value)} />
                </div>
                <div className=' btx_container'>           
                  <button type="button" className="btx" onClick={ModifyPrescription}>Modify Prescription</button>
                </div> 

               </fieldset>
               
              </form>
            </div>

          </>
        ) : userRole === "pharmacist" ? (
          <>
           <div className='btx_container'>           
           <button className='btx' onClick={MarkPaid}>Mark Paid</button>
            </div> 
            <p>Prescriptions Paid: {paidPrescriptionsCount}</p>
          </>
        ): userRole === "insurance" ? (
          <>
            <button onClick={MarkReimbursed}>Mark Reimbursed</button>
            <p>Prescriptions Reimbursed: {reimbursedPrescriptionsCount}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default PrescriptionSelector;
