import React, { useState } from 'react';
import { createBlock } from '../utils/contractUtils';
import { ethers } from 'ethers';
import styles from '../styles/Editor.module.css';

const Editor = () => {
  const [input, setInput] = useState('');

  const handleCreateBlock = async () => {
    if (!input) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const hash = ethers.keccak256(ethers.toUtf8Bytes(input));

    await createBlock(hash, provider);
    setInput('');
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Editor</h2>
      <textarea
        className={styles.textArea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter excerpt text here..."
      />
      <button className={styles.createButton} onClick={handleCreateBlock}>Create Block</button>
    </div>
  );
};

export default Editor;
