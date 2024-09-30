import React, { useEffect, useState } from 'react';
import getEthers from './utils/getEthers';
import RegisterDocument from './components/RegisterDocument';
import EditDocument from './components/EditDocument';
import MintNFT from './components/MintNFT';
import DocumentNFT from './utils/DocumentNFT.json';
import Navbar from './components/Navbar';

function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const provider = await getEthers(); // Get the provider from ethers
                const signer = provider.getSigner(); // Get the signer from the provider
                const address = await signer.getAddress(); // Get the user address
                const network = await provider.getNetwork();
                const contract = new ethers.Contract(
                    DocumentNFT.networks[network.chainId].address, // Replace with deployed contract address if not dynamic
                    DocumentNFT.abi,
                    signer
                );

                setProvider(provider);
                setSigner(signer);
                setContract(contract);
                setUserAddress(address);
            } catch (error) {
                console.error("Could not initialize the contract:", error);
            }
        };

        init();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Welcome to Document NFT DApp</h1>
            <p>Connected account: {userAddress}</p>
            {contract && (
                <div>
                    <RegisterDocument contract={contract} userAddress={userAddress} />
                    <EditDocument contract={contract} userAddress={userAddress} />
                    <MintNFT contract={contract} userAddress={userAddress} />
                </div>
            )}
            {!contract && <p>Loading contract, wallets, or there was an error...</p>}
        </div>
    );
}

export default App;
