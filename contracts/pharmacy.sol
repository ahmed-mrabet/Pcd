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

    constructor(address _prescriptionContractAddress) {
        prescriptionContractAddress = _prescriptionContractAddress;
        prescriptionContract = PrescriptionContract(_prescriptionContractAddress);
    }

   

    function markPrescriptionPaid(uint _prescriptionId) public {
        PrescriptionContract.Prescription memory prescription = prescriptionContract.getPrescription(_prescriptionId);
        require(keccak256(abi.encodePacked(prescription.patientUsername)) == keccak256(abi.encodePacked(msg.sender)), "Unauthorized");
        prescriptionContract.markPrescriptionPaid(_prescriptionId);
    }

   
}
