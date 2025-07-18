import React, { useEffect, useState } from "react";

export default function DailyTasks({ user }) {
  console.log("DailyTasks received user:", user);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTime, setNewTime] = useState("");

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hourStr, minute] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // Add new task
  const handleAdd = async () => {
    if (!newTask.trim() || !newTime) return;

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
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");
      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
      setNewTime("");
    } catch (err) {
      console.error("Add task failed:", err);
    }
  };

  // Delete task
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

  // Fetch tasks
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Daily Tasks</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-32 border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
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

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-white shadow px-4 py-2 rounded"
          >
            <span className="font-semibold">
              {task.time} – {task.title}
            </span>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
