import React, { useState, useEffect } from 'react';
import getEthers from '../utils/getEthers';
import DocumentNFT from '../utils/DocumentNFT.json';

const MintNFT = () => {
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [tokenId, setTokenId] = useState('');

    useEffect(() => {
        const init = async () => {
            const provider = await getEthers();
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                "Your_Contract_Address", // Replace with your contract's address
                DocumentNFT.abi,
                signer
            );
            setSigner(signer);
            setContract(contract);
        };
        init();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tokenURI = `uri://token${tokenId}`; // Simplistic token URI generation
        const txResponse = await contract.mintNFT(tokenId, tokenURI);
        await txResponse.wait();
        console.log('NFT minted:', txResponse);
    };

    return (
        <div>
            <h2>Mint NFT</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={tokenId}
                    onChange={e => setTokenId(e.target.value)}
                    placeholder="Token ID"
                />
                <button type="submit">Mint NFT</button>
            </form>
        </div>
    );
};

export default MintNFT;
