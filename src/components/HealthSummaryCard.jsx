import React from 'react';

const HealthSummaryCard = ({ icon, label, value }) => {
  return (
    <div style={styles.card}>
      <div style={styles.icon}>{icon}</div>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
};

const styles = {
  card: {
    flex: '1 1 200px',               
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    transition: 'transform 0.2s ease-in-out',
    minWidth: '180px',              
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    color: '#555',
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
};

export default HealthSummaryCard;
