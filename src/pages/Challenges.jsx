import ChallengeList from "../components/ChallengeList";
import React, { useEffect, useState } from "react";
import MyChallengesSidebar from "../components/ChallengeSidebar";
import LogProgressModal from "../components/LogProgressModal";
import CreateChallengeModal from "../components/CreateChallengeModal";
import LeaderboardModal from "../components/LeaderboardModal";

export default function Challenges({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedIds, setJoinedIds] = useState([]);
  const [userId, setUserId] = useState(null);

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  //const [leaderboardData, setLeaderboardData] = useState([]);

  const isAdmin =
    user?.email === "kchen120@myseneca.ca" || user?.role === "admin";

  useEffect(() => {
    if (user && user._id) {
      setUserId(user._id);
    }
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:5000/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch challenges:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/user/${userId}/challenges`)
      .then((res) => res.json())
      .then((joinedChallenges) => {
        const joinedIds = joinedChallenges.map((ch) => ch._id);
        setJoinedIds(joinedIds);
      })
      .catch((err) => {
        console.error("Failed to fetch joined challenges:", err);
      });
  }, [userId]);

  const handleJoin = async (challengeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/challenges/${challengeId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setJoinedIds((prev) => [...prev, challengeId]);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Join error:", error);
    }
  };

  const handleLeave = async (challengeId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/challenges/${challengeId}/leave`,
        {
          method: "POST", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setJoinedIds((prev) => prev.filter((id) => id !== challengeId));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  const handleDelete = async (challengeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this challenge?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/challenges/${challengeId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setChallenges((prev) => prev.filter((ch) => ch._id !== challengeId));
      } else {
        let message = "Failed to delete challenge.";

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          message = data.message || message;
        }

        alert(message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error while deleting.");
    }
  };

  if (loading) return <p>Loading challenges...</p>;

  return (
    <>
      <div className="px-6 pt-4">
        {" "}
        {isAdmin && (
          <button
            style={{ backgroundColor: "#AAD59E" }}
            className="px-6 py-2 rounded text-white hover:bg-[#3d3d3d] transition"
            onClick={() => setShowCreateModal(true)}
          >
            Create Challenge
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 items-start">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No Challenges Available
            </p>
          ) : (
            challenges.map((challenge) => {
              const isJoined = joinedIds.includes(challenge._id);
              return (
                <div
                  key={challenge._id}
                  className="bg-white shadow-md rounded-lg p-4 relative"
                >
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                      title="Delete challenge"
                    >
                      ✖
                    </button>
                  )}
                  <h2 className="text-xl font-bold mb-2">{challenge.name}</h2>
                  <p className="text-sm text-gray-500 mb-1">
                    {challenge.category} • {challenge.metric}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {challenge.description}
                  </p>
                  <p className="text-sm text-gray-400">
                    {challenge.startDate
                      ? new Date(challenge.startDate).toLocaleDateString()
                      : "Invalid start date"}{" "}
                    →{" "}
                    {challenge.endDate
                      ? new Date(challenge.endDate).toLocaleDateString()
                      : "Invalid end date"}
                  </p>

                  <button
                    className="mt-3 px-4 py-2 rounded text-white"
                    style={{
                      backgroundColor: isJoined ? "#FFB6B6" : "#AAD59E",
                    }}
                    onClick={() =>
                      isJoined
                        ? handleLeave(challenge._id)
                        : handleJoin(challenge._id)
                    }
                  >
                    {isJoined ? "Leave Challenge" : "Join Challenge"}
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div className="lg:col-span-1">
          <MyChallengesSidebar
            challenges={challenges.filter((c) => joinedIds.includes(c._id))}
            onLog={(challenge) => {
              setSelectedChallenge(challenge);
              setModalOpen(true);
            }}
            onLeaderboard={(challenge) => {
              setSelectedChallenge(challenge); 
              setLeaderboardOpen(true);
            }}
          />
        </div>
      </div>
      <LogProgressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        challenge={selectedChallenge}
        userId={userId}
      />
      <LeaderboardModal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        challengeId={selectedChallenge?._id}
      />

      {showCreateModal && (
        <CreateChallengeModal
          onClose={() => setShowCreateModal(false)}
          onChallengeCreated={(newChallenge) => {
            const startDate = newChallenge.startDate
              ? new Date(newChallenge.startDate)
              : null;
            const endDate = newChallenge.endDate
              ? new Date(newChallenge.endDate)
              : null;

            setChallenges((prev) => [
              ...prev,
              {
                ...newChallenge,
                startDate,
                endDate,
                name: newChallenge.name || "(No name)",
                description: newChallenge.description || "(No description)",
              },
            ]);
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
}
