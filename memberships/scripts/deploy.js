const hre = require("hardhat");
const { ethers } = require("hardhat");

const main = async () => {
 
  // Deploy contract: 
  /* deploy the membership contract */
  const NFTMembershipContractFactory = await ethers.getContractFactory("NFTMembership")
  const nftMembershipContract = await NFTMembershipContractFactory.deploy()
  await nftMembershipContract.deployed()

  console.log("Contract deployed to:", nftMembershipContract.address);
};

const runMain = async () => {
  try{
    await main();
    process.exit(0);
  } catch (error){
    console.log(error);
    process.exit(1);
  }
};

runMain();