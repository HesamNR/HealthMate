import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import CaloriesSummaryCard from "../components/CaloriesSummaryCard";
import GoalsPanel from "../components/GoalsPanel";
import HealthSummaryCard from "../components/HealthSummaryCard";
import WeeklyOverviewCard from "../components/WeeklyOverviewCard";
import WelcomeBanner from "../components/WelcomeBanner";

export default function Dashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/user?email=${user?.email}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    if (user?.email) fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchEntry = async () => {
      if (!user?.email) return;
      const today = new Date().toISOString().split("T")[0];
      try {
        const res = await fetch(
          `http://localhost:5000/api/health-entry?email=${encodeURIComponent(user.email)}&date=${today}`
        );
        if (res.ok) {
          const data = await res.json();
          setEntry(data);
        } else {
          setEntry(null);
        }
      } catch (err) {
        console.error("Failed to fetch health entry:", err);
      }
    };

    fetchEntry();
  }, [user]);

  if (!profile) {
    return <div style={{ padding: "2rem" }}>Loading dashboard...</div>;
  }

  const healthSummary = [
    { icon: "🚶", label: "Steps", value: entry?.steps !== undefined ? entry.steps.toString() : "-" },
    { icon: "💧", label: "Water Intake", value: entry?.water !== undefined ? `${entry.water}` : "-" },
    { icon: "😴", label: "Sleep", value: entry?.sleep !== undefined ? `${entry.sleep}h` : "-" },
    { icon: "📏", label: "Height", value: profile.height ?? "-" },
    { icon: "⚖️", label: "Weight", value: profile.weight ?? "-" },
    { icon: "🧠", label: "Mood", value: entry?.mood ?? "-" },
  ];

  const goals = profile?.goals?.split(";").map((g) => g.trim()) || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Dashboard Content */}
      <div style={{ flexGrow: 1, padding: "2rem" }}>
        <WelcomeBanner profile={profile} />
        <div style={{ display: "flex", marginTop: "1.5rem" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {healthSummary.map((item, index) => (
                <HealthSummaryCard
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "stretch-start" }}>
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
    </div>
  );
}
