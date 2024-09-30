import { ethers } from 'ethers';

const getEthers = async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return new ethers.providers.Web3Provider(window.ethereum);
    } else {
        throw new Error("No Ethereum provider found. Install MetaMask.");
    }
};

export default getEthers;
