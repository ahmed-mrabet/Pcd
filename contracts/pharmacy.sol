// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./prescription.sol";

contract PharmacyContract {
    address public prescriptionContractAddress;
    PrescriptionContract prescriptionContract;

    // Function to get all prescriptions
    function getAllPrescriptions() public view returns (PrescriptionContract.Prescription[] memory) {
        return prescriptionContract.getAllPrescriptions();
    }
    function getPrescription(uint _prescriptionId) public view returns (PrescriptionContract.Prescription memory) {
        return prescriptionContract.getPrescriptionById(_prescriptionId);
    }

    constructor(address _prescriptionContractAddress) {
        prescriptionContractAddress = _prescriptionContractAddress;
        prescriptionContract = PrescriptionContract(_prescriptionContractAddress);
    }

   

    function markPrescriptionPaid(uint _prescriptionId) public {
        PrescriptionContract.Prescription memory prescription = prescriptionContract.getPrescription(_prescriptionId);
        prescriptionContract.markPrescriptionPaid(_prescriptionId);
    }

   function getAllPrescriptionsForPatient(string memory _patientUsername) public view returns (PrescriptionContract.Prescription[] memory) {
        return prescriptionContract.getAllPrescriptionsForPatient(_patientUsername);
    }
}
