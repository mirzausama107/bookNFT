import React, { useState, useEffect } from 'react';
import { getAllBlocks } from '../utils/contractUtils';
import { ethers } from 'ethers';
import styles from '../styles/Admin.module.css';

const Admin = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const fetchedBlocks = await getAllBlocks(provider);
      setBlocks(fetchedBlocks);
    };

    fetchBlocks();
  }, []);

  return (
    <div className={styles.adminContainer}>
      <h2>Admin Panel</h2>
      <ul className={styles.blockList}>
        {blocks.map((block, index) => (
          <li key={index}>
            Block {block.index}: {block.hash}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
