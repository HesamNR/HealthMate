const WelcomeBanner = ({ profile }) => {
  const name = profile?.name || "User";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return today.toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.greeting}>
        {getGreeting()}, {name} 👋
      </h1>
      <p style={styles.date}>{getCurrentDate()}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "1rem",
    backgroundColor: "#f0f4f8",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    marginBottom: "1rem",
  },
  greeting: {
    margin: 0,
    fontSize: "1.75rem",
    color: "#2c3e50",
  },
  date: {
    marginTop: "0.25rem",
    fontSize: "1rem",
    color: "#7f8c8d",
  },
};

export default WelcomeBanner;
