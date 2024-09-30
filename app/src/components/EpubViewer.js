import React, { useEffect, useRef } from 'react';
import ePub from 'epubjs';
import styles from '../styles/EpubViewer.module.css';

const EpubViewer = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (viewerRef.current) {
      const book = ePub('../assets/Friends_in_strange_garments_by_Anna_Milo_Upjohn.epub');
      const rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
      });

      rendition.display();
    }
  }, []);

  return <div className={styles.viewerContainer} ref={viewerRef}></div>;
};

export default EpubViewer;
