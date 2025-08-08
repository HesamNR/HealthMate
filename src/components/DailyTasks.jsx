import React, { useEffect, useMemo, useRef, useState } from "react";

// --- tiny helpers ---
const todayKey = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD

const parseTimeToDate = (time12h) => {
  // converts "9:41 AM" -> Date today 09:41
  // returns null if no time
  if (!time12h) return null;
  const m = time12h.match(/^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$/i);
  if (!m) return null;
  let [_, hh, mm, ap] = m;
  let h = parseInt(hh, 10);
  const minutes = parseInt(mm, 10);
  if (/PM/i.test(ap) && h !== 12) h += 12;
  if (/AM/i.test(ap) && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, minutes, 0, 0);
  return d;
};

const formatTime = (timeStr24) => {
  if (!timeStr24) return "";
  const [hourStr, minute] = timeStr24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

// keyword → category
const getCategory = (title = "") => {
  const t = title.toLowerCase();
  if (/(walk|run|yoga|gym|workout|exercise|pushup|stretch)/.test(t))
    return "exercise";
  if (/(water|drink|hydr|breakfast|lunch|dinner|fruit|veg|snack)/.test(t))
    return "nutrition";
  return "wellness";
};

const catStyles = {
  exercise: "border-l-4 border-blue-400",
  nutrition: "border-l-4 border-green-400",
  wellness: "border-l-4 border-yellow-400",
};

export default function DailyTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("");
  const [error, setError] = useState("");

  const confettiDone = useRef(false);

  // Load all tasks for the user
  useEffect(() => {
    if (!user?.email) return;
    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/daily-tasks?email=${encodeURIComponent(
            user.email
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };
    fetchTasks();
  }, [user]);

  // Filter into groups (we assume your model stores a `date` — your API sorts by date)
  const today = todayKey();
  const todayTasks = useMemo(
    () => tasks.filter((t) => (t.date ? t.date.slice(0, 10) === today : true)), // fallback if date missing
    [tasks, today]
  );

  // Progress (today)
  const completedCount = todayTasks.filter((t) => t.completed).length;
  const progress =
    todayTasks.length === 0
      ? 0
      : Math.round((completedCount / todayTasks.length) * 100);

  // Confetti when all complete
  useEffect(() => {
    if (
      todayTasks.length > 0 &&
      completedCount === todayTasks.length &&
      !confettiDone.current
    ) {
      (async () => {
        try {
          const confetti = (await import("canvas-confetti")).default;
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
        } catch {
          /* confetti optional */
        }
      })();
      confettiDone.current = true;
    }
    if (completedCount !== todayTasks.length) confettiDone.current = false;
  }, [todayTasks.length, completedCount]);

  // Streak: count consecutive days (backwards) where all tasks that day were completed
  const streak = useMemo(() => {
    // group tasks by dateKey
    const map = new Map();
    for (const t of tasks) {
      const dk = t.date ? t.date.slice(0, 10) : today; // fallback to today
      if (!map.has(dk)) map.set(dk, []);
      map.get(dk).push(t);
    }
    let s = 0;
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const k = todayKey(d);
      const arr = map.get(k) || [];
      if (arr.length === 0) {
        // no tasks that day → break streak
        break;
      }
      const allDone = arr.every((t) => t.completed);
      if (allDone) s++;
      else break;
    }
    return s;
  }, [tasks]);

  const badge =
    streak >= 7 ? "🌟 Perfect week!" : streak >= 3 ? "🔥 3-day streak!" : "";

  // Overdue + upcoming + completed sorting for TODAY view
  const now = new Date();
  const sortedToday = useMemo(() => {
    const withParsed = todayTasks.map((t) => ({
      ...t,
      when: parseTimeToDate(t.time),
    }));
    const upcoming = withParsed.filter(
      (t) => !t.completed && t.when && t.when >= now
    );
    const overdue = withParsed.filter(
      (t) => !t.completed && (!t.when || t.when < now)
    );
    const done = withParsed.filter((t) => t.completed);

    upcoming.sort((a, b) => a.when - b.when);
    overdue.sort((a, b) => (a.when || 0) - (b.when || 0));
    done.sort((a, b) => (a.when || 0) - (b.when || 0));

    return [...upcoming, ...overdue, ...done];
  }, [todayTasks, now]);

  // Smart suggestion (very simple: if we don’t see one category today, suggest it)
  const suggestion = useMemo(() => {
    const cats = new Set(todayTasks.map((t) => getCategory(t.title)));
    if (!cats.has("exercise")) return "Add 10-minute walk?";
    if (!cats.has("nutrition")) return "Drink a glass of water.";
    if (!cats.has("wellness")) return "2-minute breathing break.";
    return null;
  }, [todayTasks]);

  // Add
  const handleAdd = async () => {
    if (!newTask.trim() || !newTime) {
      setError("Please enter both a time and a task.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/daily-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          title: newTask.trim(),
          time: formatTime(newTime),
          notes: "",
          completed: false,
          // let your model set date; if you want to enforce today:
          // date: new Date().toISOString()
        }),
      });
      if (!res.ok) throw new Error("Failed to add task");
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
      setNewTime("");
    } catch (err) {
      console.error("Add task failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  // Toggle complete
  const toggleComplete = async (task) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/daily-tasks/${task._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !task.completed }),
        }
      );
      if (!res.ok) throw new Error("Failed to update task");
      const { task: updated } = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    } catch (err) {
      console.error("Update task failed:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/daily-tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Daily Tasks</h2>

      {/* Progress + streak */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">Today’s Progress</span>
          <span className="text-gray-600">
            {completedCount}/{todayTasks.length} ({progress}%)
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded">
          <div
            className="h-3 bg-[#AAD59E] rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm">
          <span className="font-medium">Streak:</span> {streak} day
          {streak === 1 ? "" : "s"}
          {badge && <span className="ml-2">{badge}</span>}
        </div>
      </div>

      {/* Add row */}
      <div className="flex gap-2 mb-2">
        <input
          type="time"
          value={newTime}
          onChange={(e) => {
            setNewTime(e.target.value);
            setError("");
          }}
          className="w-32 border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => {
            setNewTask(e.target.value);
            setError("");
          }}
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-green-300 hover:bg-green-400 font-semibold px-4 py-2 rounded shadow"
          style={{ color: "#5E514D" }}
        >
          Add
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 mb-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Smart suggestion */}
      {suggestion && (
        <div className="mb-3 text-sm bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded">
          💡 Suggestion: {suggestion}
        </div>
      )}

      {/* List for today (sorted: upcoming → overdue → completed) */}
      <ul className="space-y-2">
        {sortedToday.map((task) => {
          const isOverdue =
            !task.completed &&
            parseTimeToDate(task.time) &&
            parseTimeToDate(task.time) < now;
          const cat = getCategory(task.title);
          return (
            <li
              key={task._id}
              className={`flex items-center justify-between bg-white shadow px-4 py-2 rounded ${
                catStyles[cat]
              } ${isOverdue ? "opacity-90 ring-1 ring-red-200" : ""}`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleComplete(task)}
                  title={task.completed ? "Mark as not done" : "Mark as done"}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                    task.completed
                      ? "bg-green-400 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {task.completed ? "✓" : ""}
                </button>
                <div>
                  <div
                    className={`font-semibold ${
                      task.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {task.time} – {task.title}
                  </div>
                  {isOverdue && !task.completed && (
                    <div className="text-xs text-red-500">Missed</div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-400 hover:underline text-sm"
              >
                Delete
              </button>
            </li>
          );
        })}

        {/* If there are no tasks today, show info */}
        {sortedToday.length === 0 && (
          <li className="text-sm text-gray-500">No tasks for today yet.</li>
        )}
      </ul>
    </div>
  );
}
