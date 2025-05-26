import React from "react";

const GoalsPanel = ({ goals = [] }) => {
  return (
    <div style={styles.container}>
      <strong><h2 style={styles.title}>Health and Fitness Goals</h2></strong>
      <ul style={styles.list}>
        {goals.map((goal, index) => (
          <li key={index} style={styles.item}>
            <strong>Goal {index + 1}:</strong> {goal}{" "}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    minWidth: "300px",
    maxWidth: "350px",
    marginLeft: "1rem",
  },
  title: {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
    color: "#2c3e50",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    fontSize: "0.95rem",
    marginBottom: "0.5rem",
    color: "#34495e",
  },
};

export default GoalsPanel;
