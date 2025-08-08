import React from "react";

export default function MyChallengesSidebar({
  challenges = [],
  onLog,
  onLeaderboard,
}) {
  return (
    <div className="lg:col-span-1 bg-gray-50 rounded-md p-4">
      <h2 className="text-lg font-semibold mb-4">My Challenges</h2>
      {challenges.length === 0 ? (
        <p className="text-sm text-gray-500">
          You haven't joined any challenges yet.
        </p>
      ) : (
        challenges.map((c) => (
          <div key={c._id} className="border-b py-2">
            <p className="font-medium">{c.name}</p>
            <div className="flex gap-2 mt-1">
              <button
                style={{ backgroundColor: "#AAD59E" }}
                onClick={() => onLog(c)}
                className="mt-3 px-4 py-2 rounded text-white"
              >
                Log Progress
              </button>
              <button
                style={{ backgroundColor: "#AAD59E" }}
                onClick={() => onLeaderboard(c)}
                className="mt-3 px-4 py-2 rounded text-white"
              >
                Leaderboard
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
