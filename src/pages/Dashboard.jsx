import React from "react";
import WelcomeBanner from "../components/WelcomeBanner";
import HealthSummaryCard from "../components/HealthSummaryCard";
import GoalsPanel from "../components/GoalsPanel";
import CaloriesSummaryCard from "../components/CaloriesSummaryCard";
import WeeklyOverviewCard from "../components/WeeklyOverviewCard";
import Footer from "../components/Footer";

export default function Dashboard({ profile }) {
  const healthSummary = [
    { icon: "🚶", label: "Steps", value: "6,320" },
    { icon: "💧", label: "Water Intake", value: "1.8 L" },
    { icon: "😴", label: "Sleep", value: "7h 20m" },
    { icon: "⚖️", label: "Weight", value: profile.weight },
    { icon: "🧠", label: "Mood", value: "😄 Feeling great!" },
  ];

  const goals = profile?.goals?.split(";").map((g) => g.trim()) || [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          padding: "2rem",
        }}
      >
        <WelcomeBanner profile={profile} />

        <div style={{ display: "flex", marginTop: "1.5rem" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "1rem",
              }}
            >
              {healthSummary.map((item, index) => (
                <HealthSummaryCard
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "stretch-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <CaloriesSummaryCard consumed={1800} burned={500} />
              </div>
              <div style={{ flex: 4 }}>
                <WeeklyOverviewCard />
              </div>
            </div>
          </div>

          <GoalsPanel goals={goals} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
