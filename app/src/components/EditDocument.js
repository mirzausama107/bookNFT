import React, { useState, useEffect } from 'react';
import getEthers from '../utils/getEthers';
import DocumentNFT from '../utils/DocumentNFT.json';

const EditDocument = () => {
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [tokenId, setTokenId] = useState('');
    const [newContentHash, setNewContentHash] = useState('');

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
        const txResponse = await contract.editDocument(tokenId, newContentHash);
        await txResponse.wait();
        console.log('Document edited:', txResponse);
    };

    return (
        <div>
            <h2>Edit Document</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={tokenId}
                    onChange={e => setTokenId(e.target.value)}
                    placeholder="Token ID"
                />
                <input
                    type="text"
                    value={newContentHash}
                    onChange={e => setNewContentHash(e.target.value)}
                    placeholder="New Content Hash"
                />
                <button type="submit">Edit</button>
            </form>
        </div>
    );
};

export default EditDocument;
