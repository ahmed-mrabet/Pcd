// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract PrescriptionContract {
    // Struct to store prescription details
    struct Prescription {
        address doctor;
        address patient;
        string medication;
        string instructions;
        bool isDeleted;
        bool paidStatus;
        bool reimbursementStatus; 
    }


    // Mapping to store prescriptions
    mapping(uint => Prescription) public prescriptions;
    uint public prescriptionCount;

   uint public latestPrescriptionId; // Variable to store the latest prescription ID

    // Events for creation, modification, and deletion of prescriptions
    event PrescriptionCreated(uint prescriptionId, address doctor, address patient, string medication, string instructions);
    event PrescriptionModified(uint prescriptionId, string medication, string instructions);
    event PrescriptionDeleted(uint prescriptionId);

    // Function to create a new prescription
    function createPrescription(address _patient, string memory _medication, string memory _instructions) public {
        uint _prescriptionId = prescriptionCount++;
        latestPrescriptionId = _prescriptionId; // Update the latest prescription ID
        prescriptions[_prescriptionId] = Prescription(msg.sender, _patient, _medication, _instructions, false,false, false); 
        emit PrescriptionCreated(_prescriptionId, msg.sender, _patient, _medication, _instructions);
    }
    
    //Getter for the prescription
    function getPrescription(uint _prescriptionId) public view returns (Prescription memory) {
        return prescriptions[_prescriptionId];
    }

    //Getter function to use in the other contracts
    function getPrescriptionPaidStatus(uint _prescriptionId) public view returns (bool) {
        return prescriptions[_prescriptionId].paidStatus;
    }


    //Change the PaidStatus
    function markPrescriptionPaid(uint _prescriptionId) public {
        require(!prescriptions[_prescriptionId].isDeleted, "Prescription is deleted");
        require(!prescriptions[_prescriptionId].paidStatus, "Prescription is already paid");

        prescriptions[_prescriptionId].paidStatus = true;

    }

    // Getter function for medication
    function getPrescriptionMedication(uint _prescriptionId) public view returns (string memory) {
        return prescriptions[_prescriptionId].medication;
    }

    // Getter function for instructions
    function getPrescriptionInstructions(uint _prescriptionId) public view returns (string memory) {
        return prescriptions[_prescriptionId].instructions;
    }

    //Getter for the reimbursedStatus
    function getPrescriptionreimbursementStatus(uint _prescriptionId)public view returns(bool) {
        return prescriptions[_prescriptionId].reimbursementStatus;
    }
    
    //ChangethereimbursementStatus
    function markPrescriptionReimbursed(uint _prescriptionId) public {
        require(!prescriptions[_prescriptionId].isDeleted, "Prescription is deleted");
        require(prescriptions[_prescriptionId].paidStatus, "Prescription is not paid");
        require(!prescriptions[_prescriptionId].reimbursementStatus, "Prescription is already reimbursed");

        prescriptions[_prescriptionId].reimbursementStatus = true;

    }

    

    // Function to modify an existing prescription
    function modifyPrescription(uint _prescriptionId, string memory _medication, string memory _instructions) public {
        Prescription storage prescription = prescriptions[_prescriptionId];
        require(msg.sender == prescription.doctor, "Only the doctor who created the prescription can modify it");
        require(!prescription.isDeleted, "Prescription has been deleted");
        prescription.medication = _medication;
        prescription.instructions = _instructions;
        emit PrescriptionModified(_prescriptionId, _medication, _instructions);
    }

    // Function to delete a prescription
    function deletePrescription(uint _prescriptionId) public {
        Prescription storage prescription = prescriptions[_prescriptionId];
        require(msg.sender == prescription.doctor, "Only the doctor who created the prescription can delete it");
        require(!prescription.isDeleted, "Prescription has already been deleted");
        prescription.isDeleted = true;
        emit PrescriptionDeleted(_prescriptionId);
    }
}
