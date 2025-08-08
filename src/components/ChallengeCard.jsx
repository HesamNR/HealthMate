import { useState, useEffect } from "react";

function ChallengeCard({ challenge, userId }) {
  const [joined, setJoined] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (challenge.participants?.includes(userId)) {
      setJoined(true);
    }
  }, [challenge, userId]);

  const handleJoin = async () => {
    try {
      const res = await fetch(`/api/challenges/${challenge._id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join");
      setJoined(true);
      setMessage("Joined successfully!");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleSubmit = async () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      return setMessage("Enter a valid number");
    }

    try {
      const res = await fetch(`/api/challenges/${challenge._id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, value }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit progress");
      setMessage("Progress submitted!");
      setInputValue("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="challenge-card">
      <h3>{challenge.name}</h3>
      <p>{challenge.description}</p>
      <p><strong>Metric:</strong> {challenge.metric}</p>
      <p><strong>Scoring:</strong> {challenge.scoringMethod}</p>
      <p>
        <strong>Dates:</strong>{" "}
        {new Date(challenge.startDate).toDateString()} –{" "}
        {new Date(challenge.endDate).toDateString()}
      </p>

      {!joined ? (
        <button onClick={handleJoin}>Join Challenge</button>
      ) : (
        <div>
          <input
            type="number"
            placeholder={`Enter ${challenge.metric}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit Progress</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default ChallengeCard;
