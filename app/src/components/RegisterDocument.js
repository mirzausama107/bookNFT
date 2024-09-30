import React, { useState, useEffect } from 'react';
import getEthers from '../utils/getEthers';
import DocumentNFT from '../utils/DocumentNFT.json';

const RegisterDocument = () => {
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [contentHash, setContentHash] = useState('');
    const [encryptedKit, setEncryptedKit] = useState('');

    useEffect(() => {
        const init = async () => {
            const provider = await getEthers();
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                "0x5FbDB2315678afecb367f032d93F642f64180aa3",
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
        const txResponse = await contract.registerDocument(contentHash, encryptedKit);
        await txResponse.wait();
        console.log('Document registered:', txResponse);
    };

    return (
        <div>
            <h2>Register Document</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={contentHash}
                    onChange={e => setContentHash(e.target.value)}
                    placeholder="Content Hash"
                />
                <input
                    type="text"
                    value={encryptedKit}
                    onChange={e => setEncryptedKit(e.target.value)}
                    placeholder="Encrypted Kit"
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterDocument;
