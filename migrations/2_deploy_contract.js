const cozyHome = artifacts.require('CozyHome');

module.exports = function(deployer){
    const percent = 3;
    deployer.deploy(cozyHome, percent);
}