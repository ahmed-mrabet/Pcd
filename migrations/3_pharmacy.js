const Prescription = artifacts.require("PrescriptionContract");

var Pharmacy = artifacts.require("PharmacyContract");

module.exports = function(deployer) {
  deployer.deploy(Pharmacy,Prescription.address);
};