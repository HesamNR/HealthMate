import { useEffect, useState } from "react";
import ChallengeCard from "./ChallengeCard";

function ChallengeList({ userId }) {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const res = await fetch("http://localhost:5000/api/challenges");
        const data = await res.json();
        if (res.ok) {
          setChallenges(data);
        } else {
          console.error("Failed to load challenges:", data.message);
        }
      } catch (err) {
        console.error("Network error:", err.message);
      }
    }

    fetchChallenges();
  }, []);

  return (
    <div>
      <h2>Available Challenges</h2>
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge._id} challenge={challenge} userId={userId} />
      ))}
    </div>
  );
}

export default ChallengeList;
