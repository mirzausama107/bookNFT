const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentNFT", function () {
    let DocumentNFT;
    let docNFT;
    let owner, addr1, addr2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        DocumentNFT = await ethers.getContractFactory("DocumentNFT");
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy a new contract before each test.
        docNFT = await DocumentNFT.deploy();
        await docNFT.deployed();
    });

    describe("Roles and Permissions", function () {
        it("should allow the owner to grant editor roles", async function () {
            // Initially, addr1 cannot register a document
            await expect(docNFT.connect(addr1).registerDocument("hash1", "kit1"))
                .to.be.revertedWith("AccessControlUnauthorizedAccount");  // Using the specific error message
        
            // Owner grants editor role to addr1
            await docNFT.grantRole(ethers.utils.id("EDITOR_ROLE"), addr1.address);
            
            // Now addr1 can register a document
            await expect(docNFT.connect(addr1).registerDocument("hash1", "kit1"))
                .to.emit(docNFT, "DocumentRegistered");
        });        

        it("should prevent non-admins from minting NFTs", async function () {
            await docNFT.grantRole(ethers.utils.id("EDITOR_ROLE"), addr1.address);
            await docNFT.connect(addr1).registerDocument("hash1", "kit1");

            // Try to mint NFT with non-admin account
            await expect(docNFT.connect(addr1).mintNFT(1, "uri://document1"))
                .to.be.revertedWith("AccessControlUnauthorizedAccount");
        });
    });

    describe("Document Management", function () {
        beforeEach(async function () {
            // Grant editor role and register a document
            await docNFT.grantRole(ethers.utils.id("EDITOR_ROLE"), addr1.address);
            await docNFT.connect(addr1).registerDocument("hash1", "kit1");
        });

        it("should allow registered editors to edit documents", async function () {
            await expect(docNFT.connect(addr1).editDocument(1, "newHash"))
                .to.emit(docNFT, "DocumentEdited")
                .withArgs(1, "newHash");
        });

        it("should prevent unauthorized edits", async function () {
            // Attempt to edit the document by someone who's not the editor
            await expect(docNFT.connect(addr2).editDocument(1, "hackedHash"))
                .to.be.revertedWith("AccessControlUnauthorizedAccount");
        });

        it("should mint NFTs correctly", async function () {
            await docNFT.grantRole(ethers.utils.id("EDITOR_ROLE"), addr1.address);
            await docNFT.connect(addr1).registerDocument("hash1", "kit1");
        
            // Ensure the admin role is correct and minting is done by an admin
            await docNFT.grantRole(ethers.utils.id("ADMIN_ROLE"), owner.address);
            await expect(docNFT.connect(owner).mintNFT(1, "uri://document1"))
                .to.emit(docNFT, 'NFTMinted')
                .withArgs(1, "uri://document1");
        
            const ownerOfNFT = await docNFT.ownerOf(1);
            expect(ownerOfNFT).to.equal(owner.address); // Expecting the owner who mints the NFT to be the owner
        });
        
    });
});
