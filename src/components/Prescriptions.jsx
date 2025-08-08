import React, { useEffect, useMemo, useState, useCallback } from "react";

/**
 * Local “taken today” tracker (no backend changes).
 * Keyed by email+date so it resets every day.
 */
function useTakenToday(email) {
  const key = useMemo(() => {
    const d = new Date();
    const ymd = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return `rx-taken:${email}:${ymd}`;
  }, [email]);

  const [taken, setTaken] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(taken));
  }, [key, taken]);

  return [taken, setTaken];
}

export default function Prescriptions({ user }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medication, setMedication] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");

  const [takenToday, setTakenToday] = useTakenToday(user?.email || "anon");

  const loadPrescriptions = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/prescriptions?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();
      setPrescriptions(data || []);
    } catch (err) {
      console.error("Error loading prescriptions:", err);
    }
  }, [user?.email]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const progress = prescriptions.length
    ? Math.round(
        (prescriptions.filter((p) => takenToday[p._id]).length /
          prescriptions.length) *
          100
      )
    : 0;

  const celebrate = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
    } catch {
      // it's fine if confetti fails
    }
  };

  const handleAdd = async () => {
    if (!medication.trim()) {
      setError("Medication field is required.");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          medication: medication.trim(),
          instructions: instructions.trim(),
        }),
      });

      const data = await res.json();
      setPrescriptions((prev) => [data.prescription, ...prev]);
      setMedication("");
      setInstructions("");
      celebrate();
    } catch (err) {
      console.error("Error adding prescription:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/prescriptions/${id}`, {
        method: "DELETE",
      });
      setPrescriptions((prev) => prev.filter((p) => p._id !== id));

      // also clean up local taken flag
      setTakenToday((t) => {
        const next = { ...t };
        delete next[id];
        return next;
      });
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
      celebrate();
    } catch (err) {
      console.error("Refill failed:", err);
    }
  };

  const toggleTaken = async (id) => {
    setTakenToday((t) => {
      const next = { ...t, [id]: !t[id] };
      // if user just completed all, confetti 🎉
      const done = prescriptions.length
        ? prescriptions.every((p) => next[p._id])
        : false;
      if (done) celebrate();
      return next;
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Prescriptions</h2>

      {/* Progress */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-400 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm mt-1">{progress}% taken today</p>
      </div>

      <div className="flex gap-2 mb-2 flex-wrap">
        <input
          type="text"
          placeholder="Medication (e.g. Prozac 10mg)"
          className="border p-2 flex-1"
          value={medication}
          onChange={(e) => {
            setMedication(e.target.value);
            setError("");
          }}
        />
        <input
          type="text"
          placeholder="Instructions (e.g. Twice a day)"
          className="border p-2 flex-1"
          value={instructions}
          onChange={(e) => {
            setInstructions(e.target.value);
            setError("");
          }}
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
        {prescriptions.map((p) => {
          const isTaken = !!takenToday[p._id];
          const refillSoon =
            typeof p.refillCount === "number" && p.refillCount >= 3; // tweak if you want
          return (
            <li
              key={p._id}
              className={`flex justify-between items-center bg-white shadow px-4 py-2 rounded border ${
                isTaken ? "opacity-70" : ""
              }`}
            >
              <div>
                <strong className="mr-2">{p.medication}</strong>
                <span className="text-gray-700">{p.instructions}</span>
                {p.refillCount > 0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    (Refilled {p.refillCount}×)
                  </span>
                )}
                {refillSoon && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                    Refill soon
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => toggleTaken(p._id)}
                  className={`px-3 py-1 rounded text-sm ${
                    isTaken ? "bg-green-200" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  title="Mark taken today"
                >
                  ✅
                </button>
                <button
                  onClick={() => handleRefill(p._id)}
                  className="bg-green-200 hover:bg-green-300 text-sm px-3 py-1 rounded"
                >
                  Refill
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
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
