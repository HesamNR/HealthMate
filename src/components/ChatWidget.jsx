// src/components/ChatWidget.jsx
import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ChatWidget({ healthData = [] }) {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [botMessages, setBotMessages] = useState([
    {
      type: "bot",
      text: "Hi! Try: steps, sleep, water, weekly summary, best day, compare sleep and exercise, trend last month, weekday vs weekend, did I improve?, tip.",
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [botMessages]);

  // ---------- helpers ----------
  const fmtDate = (d) => new Date(d).toLocaleDateString();
  const sortByDateAsc = (arr) =>
    [...arr].sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastNDays = (arr, n) => sortByDateAsc(arr).slice(-n);

  const safeSeries = (key, max) =>
    healthData
      .filter((e) => typeof e[key] === "number" && e[key] >= 0 && e[key] <= max)
      .map((e) => ({ x: fmtDate(e.date), y: e[key] }));

  const avg = (nums) =>
    nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  // const sum = (nums) => nums.reduce((a, b) => a + b, 0);

  const pushText = (text) =>
    setBotMessages((prev) => [...prev, { type: "bot", text }]);

  const pushChart = (label, labels, values, yMax, yTitle) => {
    setBotMessages((prev) => [
      ...prev,
      {
        type: "chart",
        label,
        data: { labels, values, yMax, yTitle },
      },
    ]);
  };

  // specific chart factories with fixed y-axis ranges (keeps your UI scale clean)
  const chartSteps = () => {
    const series = lastNDays(safeSeries("steps", 200000), 7);
    if (!series.length) return pushText("No recent valid data for steps.");
    pushChart(
      "Steps Walked",
      series.map((d) => d.x),
      series.map((d) => d.y),
      10000,
      "Steps"
    );
  };

  const chartSleep = () => {
    const series = lastNDays(safeSeries("sleep", 24), 7);
    if (!series.length) return pushText("No recent valid data for sleep.");
    pushChart(
      "Sleep Hours",
      series.map((d) => d.x),
      series.map((d) => d.y),
      12,
      "Hours"
    );
  };

  const chartWater = () => {
    const series = lastNDays(safeSeries("water", 60), 7);
    if (!series.length) return pushText("No recent valid data for water.");
    pushChart(
      "Water Intake (glasses)",
      series.map((d) => d.x),
      series.map((d) => d.y),
      16,
      "Glasses"
    );
  };

  const chartExercise = () => {
    const series = lastNDays(safeSeries("exercise", 24), 7);
    if (!series.length) return pushText("No recent valid data for exercise.");
    pushChart(
      "Exercise Hours",
      series.map((d) => d.x),
      series.map((d) => d.y),
      6,
      "Hours"
    );
  };

  const chartCompareSleepExercise = () => {
    const s = lastNDays(safeSeries("sleep", 24), 7);
    const ex = lastNDays(safeSeries("exercise", 24), 7);
    const labels = s.map((d) => d.x);
    if (!labels.length || labels.length !== ex.length) {
      return pushText(
        "Not enough aligned data to compare sleep vs exercise (need same 7 days)."
      );
    }
    setBotMessages((prev) => [
      ...prev,
      {
        type: "multiChart",
        label: "Sleep vs Exercise (last 7 days)",
        datasets: [
          { name: "Sleep (h)", values: s.map((d) => d.y) },
          { name: "Exercise (h)", values: ex.map((d) => d.y) },
        ],
        labels,
        yMax: 12,
        yTitle: "Hours",
      },
    ]);
  };

  const chartTrendLastMonth = () => {
    const thirty = lastNDays(safeSeries("steps", 200000), 30);
    if (!thirty.length) return pushText("No steps data for last 30 days.");
    pushChart(
      "Steps Trend (30 days)",
      thirty.map((d) => d.x),
      thirty.map((d) => d.y),
      10000,
      "Steps"
    );
  };

  const chartWeekdayVsWeekend = () => {
    const series = safeSeries("steps", 200000);
    if (!series.length) return pushText("No steps data available.");
    const weekday = series.filter((p) => {
      const day = new Date(p.x).getDay(); // 0 Sun .. 6 Sat
      return day >= 1 && day <= 5;
    });
    const weekend = series.filter((p) => {
      const day = new Date(p.x).getDay();
      return day === 0 || day === 6;
    });
    pushChart(
      "Weekday vs Weekend (avg steps)",
      ["Weekday", "Weekend"],
      [
        Math.round(avg(weekday.map((d) => d.y))),
        Math.round(avg(weekend.map((d) => d.y))),
      ],
      10000,
      "Steps"
    );
  };

  const weeklySummary = () => {
    const week = lastNDays(sortByDateAsc(healthData), 7);
    if (!week.length) return pushText("No data in the last 7 days.");
    const avgSteps = Math.round(avg(week.map((d) => +d.steps || 0)));
    const avgSleep = +avg(week.map((d) => +d.sleep || 0)).toFixed(1);
    const avgWater = Math.round(avg(week.map((d) => +d.water || 0)));
    const avgEx = +avg(week.map((d) => +d.exercise || 0)).toFixed(1);
    pushText(
      `Weekly summary (last 7 days): Steps avg ${avgSteps}, Sleep ${avgSleep}h, Water ${avgWater} glasses, Exercise ${avgEx}h.`
    );
  };

  const bestDay = () => {
    const series = safeSeries("steps", 200000);
    if (!series.length) return pushText("No steps data found.");
    const best = series.reduce((a, b) => (b.y > a.y ? b : a));
    pushText(`Best steps day: ${best.x} with ${best.y} steps. 🎉`);
  };

  const lowestDay = () => {
    const series = safeSeries("steps", 200000);
    if (!series.length) return pushText("No steps data found.");
    const low = series.reduce((a, b) => (b.y < a.y ? b : a));
    pushText(`Lowest activity day: ${low.x} with ${low.y} steps.`);
  };

  const averageStepsThisMonth = () => {
    const now = new Date();
    const month = healthData.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    if (!month.length) return pushText("No entries this month yet.");
    const val = Math.round(avg(month.map((e) => +e.steps || 0)));
    pushText(`Average steps this month: ${val}.`);
  };

  const stepsGoalProgress = (goal = 8000) => {
    const week = lastNDays(sortByDateAsc(healthData), 7);
    if (!week.length) return pushText("No recent data for goal progress.");
    const avgSteps = Math.round(avg(week.map((d) => +d.steps || 0)));
    pushText(
      `Steps goal progress: avg ${avgSteps}/${goal} (${Math.round(
        (avgSteps / goal) * 100
      )}%).`
    );
  };

  const hydrationGoal = (goal = 8) => {
    const week = lastNDays(sortByDateAsc(healthData), 7);
    if (!week.length) return pushText("No recent water data.");
    const met = week.filter((d) => (+d.water || 0) >= goal).length;
    pushText(`Hydration goal: ${met}/7 days hit ${goal}+ glasses.`);
  };

  const didIImprove = () => {
    const sorted = sortByDateAsc(healthData);
    if (sorted.length < 14)
      return pushText("Need at least 14 days of steps to compare weeks.");
    const last14 = sorted.slice(-14);
    const week2 = last14.slice(0, 7); // older
    const week1 = last14.slice(7); // recent
    const a1 = avg(week1.map((d) => +d.steps || 0));
    const a2 = avg(week2.map((d) => +d.steps || 0));
    const diff = Math.round(a1 - a2);
    pushText(
      diff >= 0
        ? `Yes! This week is up by ~${diff} steps on average. 🚀`
        : `Slight dip of ~${Math.abs(
            diff
          )} steps vs last week. You got this! 💪`
    );
  };

  const healthTips = [
    "Small walks add up—stand and stretch each hour.",
    "Aim for 7–9 hours of sleep; keep a consistent bedtime.",
    "Sip water across the day; keep a bottle at your desk.",
    "Pair short workouts with daily tasks (stairs, quick squats).",
    "Light evening screens off 30–60 mins before bed helps sleep.",
  ];

  // ---------- input handler ----------
  const handleSend = () => {
    if (!input.trim()) return;

    const msg = input.toLowerCase().trim();
    setBotMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");

    // direct chart keywords
    if (msg.includes("steps")) return chartSteps();
    if (msg.includes("sleep")) return chartSleep();
    if (msg.includes("water")) return chartWater();
    if (msg.includes("exercise")) return chartExercise();
    if (msg.includes("mood")) {
      // Simple mood distribution (counts)
      const counts = {};
      healthData.forEach((e) => {
        const m = (e.mood || "").toString();
        if (!m) return;
        counts[m] = (counts[m] || 0) + 1;
      });
      const labels = Object.keys(counts);
      if (!labels.length) return pushText("No mood data found.");
      pushChart(
        "Mood Distribution",
        labels,
        labels.map((k) => counts[k]),
        Math.max(...Object.values(counts)) || 5,
        "Days"
      );
      return;
    }

    // richer commands
    if (msg.includes("weekly summary")) return weeklySummary();
    if (msg.includes("best day")) return bestDay();
    if (msg.includes("lowest")) return lowestDay();
    if (msg.includes("average steps") && msg.includes("month"))
      return averageStepsThisMonth();
    if (msg.includes("goal") && msg.includes("steps"))
      return stepsGoalProgress();
    if (msg.includes("hydration")) return hydrationGoal();
    if (
      msg.includes("compare") &&
      msg.includes("sleep") &&
      msg.includes("exercise")
    )
      return chartCompareSleepExercise();
    if (msg.includes("trend") && msg.includes("month"))
      return chartTrendLastMonth();
    if (msg.includes("weekday") || msg.includes("weekend"))
      return chartWeekdayVsWeekend();
    if (msg.includes("did i improve") || msg.includes("improve"))
      return didIImprove();
    if (msg.includes("tip"))
      return pushText(
        healthTips[Math.floor(Math.random() * healthTips.length)]
      );

    // fallback
    pushText(
      "Try: steps, sleep, water, exercise, mood, weekly summary, best day, lowest activity day, average steps this month, steps goal progress, hydration goal, compare sleep and exercise, trend last month, weekday vs weekend, did I improve?, tip."
    );
  };

  return (
    <div className={`fixed bottom-6 z-50 ${isChatPage ? 'left-6' : 'right-6'}`}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#AAD59E] text-black p-3 rounded-full shadow-lg"
          aria-label="Open chat"
        >
          <MessageSquare />
        </button>
      ) : (
        <div className="bg-white w-[360px] h-[520px] rounded-lg shadow-lg flex flex-col overflow-hidden">
          <div className="bg-[#AAD59E] p-3 flex justify-between items-center">
            <h3 className="font-semibold">HealthMate Chat</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto">
            {botMessages.map((m, i) => {
              if (m.type === "chart") {
                const { labels, values, yMax, yTitle } = m.data;
                return (
                  <div key={i} className="mb-4">
                    <Bar
                      data={{
                        labels,
                        datasets: [
                          {
                            label: m.label,
                            data: values,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: true },
                          title: { display: true, text: m.label },
                        },
                        scales: {
                          y: {
                            min: 0,
                            max: yMax,
                            title: { display: true, text: yTitle },
                            ticks: {
                              stepSize: Math.max(1, Math.round(yMax / 5)),
                            },
                          },
                        },
                      }}
                    />
                  </div>
                );
              }
              if (m.type === "multiChart") {
                const { labels, datasets, yMax, yTitle } = m;
                return (
                  <div key={i} className="mb-4">
                    <Bar
                      data={{
                        labels,
                        datasets: datasets.map((ds, idx) => ({
                          label: ds.name,
                          data: ds.values,
                          backgroundColor:
                            idx === 0
                              ? "rgba(54,162,235,0.6)"
                              : "rgba(255,159,64,0.6)",
                        })),
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: true },
                          title: { display: true, text: m.label },
                        },
                        scales: {
                          y: {
                            min: 0,
                            max: yMax,
                            title: { display: true, text: yTitle },
                            ticks: {
                              stepSize: Math.max(1, Math.round(yMax / 6)),
                            },
                          },
                        },
                      }}
                    />
                  </div>
                );
              }
              // text bubbles
              return (
                <p
                  key={i}
                  className={`my-1 px-2 py-1 rounded max-w-[80%] text-sm ${
                    m.type === "user"
                      ? "bg-blue-100 self-end ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  {m.text}
                </p>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-2 border-t flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about steps, weekly summary, tip…"
              className="flex-1 border rounded px-2 py-1 text-black"
            />
            <button
              onClick={handleSend}
              className="ml-2 px-3 py-1 bg-[#AAD59E] rounded text-black"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
