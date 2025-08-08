import React, { useEffect, useMemo, useState } from "react";

export default function MedicalTasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const celebrate = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
    } catch {
      // it's fine if confetti fails
    }
  };

  const minutesFromHHMM = (hhmm) => {
    if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return 24 * 60 + 1;
    const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
    return h * 60 + m;
  };

  const sorted = useMemo(() => {
    const upcoming = [];
    const overdue = [];
    for (const t of tasks) {
      const mins = minutesFromHHMM(t.time);
      const item = { ...t, _mins: mins };
      if (mins >= nowMinutes) upcoming.push(item);
      else overdue.push(item);
    }
    upcoming.sort((a, b) => a._mins - b._mins);
    overdue.sort((a, b) => a._mins - b._mins);
    return [...upcoming, ...overdue];
  }, [tasks, nowMinutes]);

  const progress = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  const fetchTasks = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/medical-tasks?email=${encodeURIComponent(
          user.email
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch medical tasks");
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to load medical tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleAdd = async () => {
    if (!newTask.trim() || !time) {
      setError("Please enter both a time and a task.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/medical-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          title: newTask.trim(),
          time,
          notes: "",
          completed: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
      setTime("");
      celebrate();
    } catch (err) {
      console.error("Add medical task failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/medical-tasks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  const handleToggleComplete = async (id, nextVal) => {
    try {
      const res = await fetch(`http://localhost:5000/api/medical-tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: nextVal }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const data = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? data.task : t)));

      const allDone =
        tasks.length > 0 &&
        tasks.every((t) => (t._id === id ? nextVal : t.completed));
      if (allDone) celebrate();
    } catch (err) {
      console.error("Complete toggle failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Medical Tasks</h2>

      {/* Progress */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-1">{progress}% completed</p>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            setError("");
          }}
          className="border px-3 py-2 rounded"
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

      <ul className="space-y-2">
        {sorted.map((task) => {
          const mins = task._mins;
          const isOverdue = mins < nowMinutes;
          return (
            <li
              key={task._id}
              className={`flex justify-between items-center bg-white shadow px-4 py-2 rounded border ${
                isOverdue ? "border-red-200 bg-red-50" : ""
              }`}
            >
              <span
                className={`font-semibold ${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.time} – {task.title}
                {isOverdue && !task.completed && (
                  <span className="ml-2 text-xs text-red-600">Missed</span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleToggleComplete(task._id, !task.completed)
                  }
                  className={`px-3 py-1 rounded text-sm ${
                    task.completed
                      ? "bg-green-200"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title="Mark complete"
                >
                  ✅
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-400 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
