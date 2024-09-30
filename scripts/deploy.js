async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const DocumentNFT = await ethers.getContractFactory("DocumentNFT");
    const docNFT = await DocumentNFT.deploy();
    await docNFT.deployed();

    console.log("DocumentNFT deployed to:", docNFT.address);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
