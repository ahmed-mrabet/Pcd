// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./prescription.sol";

contract PatientContract {
    address public prescriptionContractAddress;
    PrescriptionContract prescriptionContract;

    constructor(address _prescriptionContractAddress) {
        prescriptionContractAddress = _prescriptionContractAddress;
        prescriptionContract = PrescriptionContract(_prescriptionContractAddress);
    }

    // Function to get all prescriptions associated with a patient
    function getPrescriptionsByPatient(string memory _patientUsername) public view returns (PrescriptionContract.Prescription[] memory) {
        return prescriptionContract.getAllPrescriptionsForPatient(_patientUsername);
    }
}