import { ethers } from 'ethers';

const getEthers = async () => {
    // Modern way to connect to MetaMask
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // We now have access to the provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            return provider;
        } catch (error) {
            throw new Error("User denied account access");
        }
    } else {
        throw new Error("No Ethereum provider found. Install MetaMask.");
    }
};

export default getEthers;
