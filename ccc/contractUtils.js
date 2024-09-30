import { ethers } from 'ethers';
import ExcerptTracker from '../app/src/contracts/ExcerptTracker.json';

// Create a new block
export const createBlock = async (hash, provider) => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Contract address from .env
  const signer = provider.getSigner(); // Get the signer to sign transactions
  const contract = new ethers.Contract(contractAddress, ExcerptTracker.abi, signer); // Initialize contract with ABI and signer

  try {
    const tx = await contract.createBlock(hash); // Call createBlock function from the contract
    await tx.wait(); // Wait for the transaction to be mined
    alert("Block created successfully!");
  } catch (error) {
    console.error("Error creating block:", error);
  }
};

// Get all blocks
export const getAllBlocks = async (provider) => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Contract address from .env
  const contract = new ethers.Contract(contractAddress, ExcerptTracker.abi, provider); // Initialize contract with ABI and provider (read-only)

  try {
    const blocks = await contract.getAllBlocks(); // Fetch all blocks from the contract
    return blocks;
  } catch (error) {
    console.error("Error fetching blocks:", error);
    return [];
  }
};

// Get a specific block by index
export const getBlock = async (index, provider) => {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS; // Contract address from .env
  const contract = new ethers.Contract(contractAddress, ExcerptTracker.abi, provider); // Initialize contract with ABI and provider (read-only)

  try {
    const block = await contract.getBlock(index); // Fetch a specific block by its index
    return block;
  } catch (error) {
    console.error("Error fetching block:", error);
    return null;
  }
};
