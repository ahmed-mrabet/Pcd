const Prescription = artifacts.require("PrescriptionContract");

var Patient = artifacts.require("PatientContract");

module.exports = function(deployer) {
  deployer.deploy(Patient,Prescription.address);
};