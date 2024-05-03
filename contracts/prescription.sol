// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract PrescriptionContract {
    // Struct to store prescription details
    struct Prescription {
        string doctorUsername;
        string patientUsername;
        string medication;
        string instructions;
        bool isDeleted;
        bool paidStatus;
        bool reimbursementStatus; 
    }

    // Struct to store user details
    struct User {
        string username;
        string role;
    }

    // Mapping to store prescriptions
    mapping(uint => Prescription) public prescriptions;
    uint public prescriptionCount;

    // Mapping to store user details using username as key
    mapping(string => User) public users;

    // Events for creation, modification, and deletion of prescriptions
    event PrescriptionCreated(uint prescriptionId, string doctorUsername, string patientUsername, string medication, string instructions);
    event PrescriptionModified(uint prescriptionId, string medication, string instructions);
    event PrescriptionDeleted(uint prescriptionId);


    //Getter for the prescription
    function getPrescription(uint _prescriptionId) public view returns (Prescription memory) {
        return prescriptions[_prescriptionId];
    }

    // Function to get all prescriptions
    function getAllPrescriptions() public view returns (Prescription[] memory) {
        Prescription[] memory allPrescriptions = new Prescription[](prescriptionCount);
        for (uint i = 0; i < prescriptionCount; i++) {
            allPrescriptions[i] = prescriptions[i];
        }
        return allPrescriptions;
    }


    //Change the PaidStatus
    function markPrescriptionPaid(uint _prescriptionId) public {
        require(!prescriptions[_prescriptionId].isDeleted, "Prescription is deleted");
        require(!prescriptions[_prescriptionId].paidStatus, "Prescription is already paid");

        prescriptions[_prescriptionId].paidStatus = true;

    }

    
    //ChangethereimbursementStatus
    function markPrescriptionReimbursed(uint _prescriptionId) public {
        require(!prescriptions[_prescriptionId].isDeleted, "Prescription is deleted");
        require(prescriptions[_prescriptionId].paidStatus, "Prescription is not paid");
        require(!prescriptions[_prescriptionId].reimbursementStatus, "Prescription is already reimbursed");

        prescriptions[_prescriptionId].reimbursementStatus = true;

    }


    // Function to create a new prescription
    function createPrescription(string memory _doctorUsername, string memory _patientUsername, string memory _medication, string memory _instructions) public {
        uint _prescriptionId = prescriptionCount++;
        prescriptions[_prescriptionId] = Prescription(_doctorUsername, _patientUsername, _medication, _instructions, false, false, false); 
        emit PrescriptionCreated(_prescriptionId, _doctorUsername, _patientUsername, _medication, _instructions);
    }

    // Function to modify an existing prescription
    function modifyPrescription(uint _prescriptionId, string memory _medication, string memory _instructions) public {
        Prescription storage prescription = prescriptions[_prescriptionId];
        require(keccak256(abi.encodePacked(msg.sender)) == keccak256(abi.encodePacked(prescription.doctorUsername)), "Only the doctor who created the prescription can modify it");
        require(!prescription.isDeleted, "Prescription has been deleted");
        prescription.medication = _medication;
        prescription.instructions = _instructions;
        emit PrescriptionModified(_prescriptionId, _medication, _instructions);
    }

    // Function to delete a prescription
    function deletePrescription(uint _prescriptionId) public {
        Prescription storage prescription = prescriptions[_prescriptionId];
        require(keccak256(abi.encodePacked(msg.sender)) == keccak256(abi.encodePacked(prescription.doctorUsername)), "Only the doctor who created the prescription can delete it");
        require(!prescription.isDeleted, "Prescription has already been deleted");
        prescription.isDeleted = true;
        emit PrescriptionDeleted(_prescriptionId);
    }

    // Function to get all prescriptions for a specific patient
    function getAllPrescriptionsForPatient(string memory _patientUsername) public view returns (Prescription[] memory) {
        Prescription[] memory patientPrescriptions = new Prescription[](prescriptionCount);
        uint patientPrescriptionCount = 0;
        for (uint i = 0; i < prescriptionCount; i++) {
            if (keccak256(abi.encodePacked(prescriptions[i].patientUsername)) == keccak256(abi.encodePacked(_patientUsername))) {
                patientPrescriptions[patientPrescriptionCount] = prescriptions[i];
                patientPrescriptionCount++;
            }
        }
        // Trim the array to remove any empty slots
        assembly {
            mstore(patientPrescriptions, patientPrescriptionCount)
        }
        return patientPrescriptions;
    }
}
