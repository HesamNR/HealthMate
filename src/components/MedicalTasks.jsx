import React, { useEffect, useState } from "react";

export default function MedicalTasks({ user }) {
  console.log("MedicalTasks received user:", user);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [time, setTime] = useState("");

  // Add new medical task
  const handleAdd = async () => {
    if (!newTask.trim() || !time) return;

    try {
      const res = await fetch("http://localhost:5000/api/medical-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          title: newTask.trim(),
          time: time,
          notes: "",
          completed: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json();
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
      setTime("");
    } catch (err) {
      console.error("Add medical task failed:", err);
    }
  };

  // Delete medical task by ID
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

  // Fetch all tasks for the user
  useEffect(() => {
    if (!user?.email) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/medical-tasks?email=${encodeURIComponent(
            user.email
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch medical tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load medical tasks:", err);
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Medical Tasks</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="border px-3 py-2 rounded"
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
            <span>
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
