import React from "react";

const CaloriesSummaryCard = ({ consumed = 0, burned = 0 }) => {
  const net = consumed - burned;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Calorie Summary</h3>
      <div style={styles.row}>
        <strong>🔥 Consumed:</strong> {consumed} kcal
      </div>
      <div style={styles.row}>
        <strong>🏃 Burned:</strong> {burned} kcal
      </div>
      <div style={styles.row}>
        <strong>⚖️ Net:</strong> {net} kcal
      </div>
    </div>
  );
};

const styles = {
  card: {
    height: "100%",
    backgroundColor: "#ffffff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",

    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center", 
    alignItems: "center", 

    textAlign: "left", 
  },

  title: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  row: {
    marginBottom: "0.5rem",
    fontSize: "1rem",
    color: "#34495e",
  },
};

export default CaloriesSummaryCard;
