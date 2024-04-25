// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./prescription.sol";

contract PharmacyContract {
    address public prescriptionContractAddress;
    PrescriptionContract prescriptionContract;

    constructor(address _prescriptionContractAddress) {
        prescriptionContractAddress = _prescriptionContractAddress;
        prescriptionContract = PrescriptionContract(_prescriptionContractAddress);
    }

    function verifyPrescriptionPayment(uint _prescriptionId) public view returns (bool) {
        return prescriptionContract.getPrescriptionPaidStatus(_prescriptionId);
    }

    function markPrescriptionPaid(uint _prescriptionId) public {
        prescriptionContract.markPrescriptionPaid(_prescriptionId);
    }

    function getPrescriptionMedication(uint _prescriptionId) public view returns (string memory) {
        return prescriptionContract.getPrescriptionMedication(_prescriptionId);
    }

    function getPrescriptionInstructions(uint _prescriptionId) public view returns (string memory) {
        return prescriptionContract.getPrescriptionInstructions(_prescriptionId);
    }
}
