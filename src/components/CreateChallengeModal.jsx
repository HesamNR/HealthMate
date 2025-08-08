import React, { useState, useEffect } from "react";

export default function CreateChallengeModal({ onClose, onChallengeCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    metric: "",
    startDate: "",
    endDate: "",
  });

  const [options, setOptions] = useState({
    categories: [],
    metrics: [],
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/challenge-metadata")
      .then((res) => res.json())
      .then((data) => {
        setOptions({
          categories: data.categories || [],
          metrics: data.metrics || [],
        });
      })
      .catch((err) => {
        console.error("Failed to fetch challenge metadata:", err);
      });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        onChallengeCreated(data.challenge);
      } else {
        alert(data.message || "Failed to create challenge.");
      }
    } catch (err) {
      console.error("Create challenge error:", err);
      alert("Server error.");
    }
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Create New Challenge</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded text-sm"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded text-sm"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">Select Category</option>
            {options.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            name="metric"
            value={formData.metric}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="">Select Metric</option>
            {options.metrics.map((metric) => (
              <option key={metric} value={metric}>
                {metric}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="border px-3 py-2 rounded text-sm w-full"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="border px-3 py-2 rounded text-sm w-full"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              style={{ backgroundColor: "#FFB6B6" }}
              className="bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "#AAD59E" }}
              className="text-white px-4 py-1 rounded text-sm"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
