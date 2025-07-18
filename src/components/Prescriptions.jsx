import React, { useEffect, useState, useCallback } from "react";

export default function Prescriptions({ user }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medication, setMedication] = useState("");
  const [instructions, setInstructions] = useState("");

  // ✅ useCallback to avoid ESLint warning
  const loadPrescriptions = useCallback(async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/prescriptions?email=${user.email}`
      );
      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.error("Error loading prescriptions:", err);
    }
  }, [user?.email]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]); // ✅ now valid dependency

  const handleAdd = async () => {
    if (!medication.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          medication,
          instructions,
        }),
      });
      const data = await res.json();
      setPrescriptions((prev) => [data.prescription, ...prev]);
      setMedication("");
      setInstructions("");
    } catch (err) {
      console.error("Error adding prescription:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/prescriptions/${id}`, {
        method: "DELETE",
      });
      setPrescriptions((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleRefill = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/prescriptions/${id}/refill`,
        { method: "PUT" }
      );
      const data = await res.json();
      setPrescriptions((prev) =>
        prev.map((p) => (p._id === id ? data.prescription : p))
      );
    } catch (err) {
      console.error("Refill failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Prescriptions</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Medication (e.g. 10/30 Prozac)"
          className="border p-2 flex-1"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
        />
        <input
          type="text"
          placeholder="Instructions (e.g. Twice a day)"
          className="border p-2 flex-1"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
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
        {prescriptions.map((p) => (
          <li
            key={p._id}
            className="flex justify-between items-center bg-white shadow px-4 py-2 rounded"
          >
            <div>
              <strong>{p.medication}</strong> – {p.instructions}{" "}
              {p.refillCount > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (Refilled {p.refillCount}x)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRefill(p._id)}
                className="bg-green-300 hover:bg-green-400 px-3 py-1 rounded"
              >
                refill
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
