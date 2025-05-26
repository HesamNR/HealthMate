import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", stepsK: 5, sleep: 7, water: 1.5 },
  { day: "Tue", stepsK: 6.2, sleep: 6, water: 2.0 },
  { day: "Wed", stepsK: 7.2, sleep: 8, water: 2.1 },
  { day: "Thu", stepsK: 4.5, sleep: 5, water: 1.2 },
  { day: "Fri", stepsK: 8, sleep: 7.5, water: 2.3 },
  { day: "Sat", stepsK: 9, sleep: 9, water: 3.0 },
  { day: "Sun", stepsK: 4, sleep: 6.5, water: 1.8 },
];

const WeeklyOverviewCard = () => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>📊 Weekly Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(val) => `${val}`} />
          <Tooltip
            formatter={(value, name) =>
              name === "Steps" ? [`${value}k`, name] : [value, name]
            }
          />
          <Legend />
          <Bar dataKey="stepsK" fill="#8884d8" name="Steps (k)" />
          <Bar dataKey="sleep" fill="#82ca9d" name="Sleep (hrs)" />
          <Bar dataKey="water" fill="#00bcd4" name="Water (L)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    flex: "1 1 100%",
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.75rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  title: {
    marginBottom: "0.75rem",
    fontSize: "1.25rem",
    color: "#2c3e50",
  },
};

export default WeeklyOverviewCard;
