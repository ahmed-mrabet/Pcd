const Prescription = artifacts.require("PrescriptionContract");

var Insurance = artifacts.require("InsuranceContract");

module.exports = function(deployer) {
  deployer.deploy(Insurance,Prescription.address);
};