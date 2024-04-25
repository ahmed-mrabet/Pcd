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

    function getPrescription(uint _prescriptionId) public view returns (PrescriptionContract.Prescription memory) {
        return prescriptionContract.getPrescription(_prescriptionId);
    }
}
