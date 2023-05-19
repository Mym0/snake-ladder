import React from 'react';
import styles from './UniverseBackground.module.css';
const UniverseBackground = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
      <div className={styles.bg}></div>
      <div className={styles['star-field']}>
        <div className={styles['layer']}></div>
        <div className={styles['layer']}></div>
        <div className={styles['layer']}></div>
      </div>
    </div>
  );
};
export default UniverseBackground;
