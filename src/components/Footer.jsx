import React from 'react'

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.leftSection}>
        <p>&copy; {new Date().getFullYear()} InventioPOS. All rights reserved.</p>
      </div>
    </footer>
  )
}


const styles = {
    leftSection: {
        position: 'absolute',
        bottom: '-4px',
        left: '1%',
        marginBottom: '10px',
        fontSize: '13px',
        textAlign: 'center'
    },
    rightSection: {
        display: 'flex',
        gap: '8px'
    },
    footerLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '12px'
    }
  };

export default Footer