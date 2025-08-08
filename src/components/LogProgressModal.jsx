// LogProgressModal.jsx
import React, { useState } from "react";

export default function LogProgressModal({
  isOpen,
  onClose,
  challenge,
  userId,
  onProgressLogged,
}) {
  const [value, setValue] = useState("");

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value) return alert("Please enter a value.");

    try {
      const res = await fetch(
        `http://localhost:5000/api/challenges/${challenge._id}/progress`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, value: parseFloat(value) }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Progress submitted!");
        onClose();
        if (onProgressLogged) onProgressLogged();
      } else {
        alert(data.message || "Failed to submit progress.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Server error submitting progress.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Log Progress</h2>
        <p className="text-sm mb-2 text-gray-600">
          Challenge: <span className="font-medium">{challenge.name}</span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${challenge.metric}...`}
            className="border px-3 py-2 rounded text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              style={{ backgroundColor: "#FFB6B6" }}
              className="px-3 py-1 text-sm bg-gray-200 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              style={{ backgroundColor: "#AAD59E" }}
              type="submit"
              className="px-3 py-1 text-sm bg-green-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
