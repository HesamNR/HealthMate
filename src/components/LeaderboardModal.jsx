import React, { useEffect, useState } from "react";

export default function LeaderboardModal({ isOpen, onClose, challengeId }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (!isOpen || !challengeId) return;
    fetch(`http://localhost:5000/api/challenges/${challengeId}/logs`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.logs || []))
      .catch(console.error);
  }, [isOpen, challengeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-sm">No progress yet.</p>
        ) : (
          <ol className="list-decimal ml-5 space-y-2">
            {leaderboard.map((entry, index) => (
              <li key={entry._id || index}>
                <div className="flex flex-col sm:flex-row justify-between gap-1 sm:items-center">
                  <span className="font-medium">
                    {entry.userId?.name ||
                      entry.userId?.email ||
                      "Unknown User"}
                  </span>
                  <span className="text-sm text-gray-600">
                    {entry.value} &nbsp; @{" "}
                    {new Date(entry.date).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        )}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded text-white"
            style={{ backgroundColor: "#FFB6B6" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
