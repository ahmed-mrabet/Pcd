var Prescription = artifacts.require("PrescriptionContract");

module.exports = function(deployer) {
  deployer.deploy(Prescription);
};