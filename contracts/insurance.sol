// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Import the Prescription Contract
import "./prescription.sol";

contract InsuranceContract {
    // Address of the Prescription Contract
    address public prescriptionContractAddress;

    // Instance of the Prescription Contract
    PrescriptionContract prescriptionContract;

    // Function to get all prescriptions
    function getAllPrescriptions() public view returns (PrescriptionContract.Prescription[] memory) {
        return prescriptionContract.getAllPrescriptions();
    }


    // Constructor to set the address of the Prescription Contract
    constructor(address _prescriptionContractAddress) {
        prescriptionContractAddress = _prescriptionContractAddress;
        prescriptionContract = PrescriptionContract(_prescriptionContractAddress);
    }

    // Function to mark prescription as reimbursed
    function markPrescriptionReimbursed(uint _prescriptionId) public {
        PrescriptionContract.Prescription memory prescription = prescriptionContract.getPrescription(_prescriptionId);
        require(keccak256(abi.encodePacked(prescription.patientUsername)) == keccak256(abi.encodePacked(msg.sender)), "Unauthorized");
        prescriptionContract.markPrescriptionReimbursed(_prescriptionId);
    }

}



