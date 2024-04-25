// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Import the Prescription Contract
import "./prescription.sol";

contract InsuranceContract {
    // Address of the Prescription Contract
    address public prescriptionContractAddress;

    // Instance of the Prescription Contract
    PrescriptionContract prescriptionContract;

    // Constructor to set the address of the Prescription Contract
    constructor(address _prescriptionContractAddress) {
        prescriptionContractAddress = _prescriptionContractAddress;
        prescriptionContract = PrescriptionContract(_prescriptionContractAddress);
    }

    // Function to verify prescription payment status
    function verifyPrescriptionPayment(uint _prescriptionId) public view returns (bool) {
        return prescriptionContract.getPrescriptionPaidStatus(_prescriptionId);
    }

    // Function to mark prescription as reimbursed
    function markPrescriptionReimbursed(uint _prescriptionId) public {
        prescriptionContract.markPrescriptionReimbursed(_prescriptionId);
    }
}
