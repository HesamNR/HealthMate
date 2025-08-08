import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const workoutPlans = {
  "Full Body": {
    Monday: [
      { exercise: "Inclined Dumbbell Press", sets: 3, reps: "8-10" },
      { exercise: "Barbell Squat", sets: 3, reps: "6-8" },
      { exercise: "Dumbbell Chest Supported Row", sets: 3, reps: "8-12" },
      { exercise: "Leg Curls", sets: 3, reps: "10-15" },
      { exercise: "Dumbbell Bicep Curls", sets: 3, reps: "10-12" },
      { exercise: "Tricep Pushdown", sets: 3, reps: "10-12" },
    ],
    Tuesday: "Rest",
    Wednesday: [
      { exercise: "Barbell Bench Press", sets: 3, reps: "3-5 " },
      { exercise: "Romanian Deadlift", sets: 3, reps: "6-8 " },
      { exercise: "Lat Pulldowns", sets: 3, reps: "8-12" },
      { exercise: "Walking Lunges", sets: 3, reps: "10-12" },
      { exercise: "Cable Lateral Raise", sets: 3, reps: "10-12" },
      { exercise: "Reverse Crunches", sets: 3, reps: "12-15" },
    ],
    Thursday: "Rest",
    Friday: [
      { exercise: "Seated Dumbbell Shoulder Press", sets: 3, reps: "8-12" },
      { exercise: "Dumbbell Row", sets: 3, reps: "8-12" },
      { exercise: "Hip Thrust", sets: 3, reps: "10-15" },
      { exercise: "Leg Extensions", sets: 3, reps: "10-15" },
      { exercise: "Chest Flyes", sets: 3, reps: "10-15" },
      { exercise: "Calf Raises", sets: 3, reps: "12-15" },
      { exercise: "Reverse Cable Flyes", sets: 3, reps: "8-10" },
    ],
    Saturday: "Rest",
    Sunday: "Rest",
  },
  "Push-Pull-Legs": {
    Monday: [
      { exercise: "Inclined Barbell Bench Press", sets: 3, reps: "6-8" },
      { exercise: "Standing Dumbbell Shoulder Press", sets: 3, reps: "10-15" },
      { exercise: "Flat Dumbbell Press", sets: 3, reps: "8-12" },
      { exercise: "Dumbbell Lateral Raise", sets: 3, reps: "10-15" },
      { exercise: "Seated Decline Cable Flyes", sets: 3, reps: "10-15" },
      {
        exercise: "Incline Dumbbell Overhead Extensions",
        sets: 3,
        reps: "10-15",
      },
    ],
    Tuesday: [
      { exercise: "Pull-ups/Assisted Pull-ups", sets: 3, reps: "6-10" },
      { exercise: "Barbell Row", sets: 3, reps: "10-15" },
      { exercise: "Lat Pulldown", sets: 3, reps: "8-12" },
      { exercise: "Chest Supported Rear Delt Row", sets: 3, reps: "10-15" },
      { exercise: "Barbell Curl", sets: 3, reps: "8-12" },
      { exercise: "Kneeling Face Pulls", sets: 3, reps: "10-15" },
    ],
    Wednesday: [
      { exercise: "Barbell Squat", sets: 3, reps: "6-10" },
      { exercise: "Hip Thrusts", sets: 3, reps: "12-15" },
      { exercise: "Glute Ham Raise", sets: 3, reps: "10-15" },
      { exercise: "Standing Single Leg Calf Raise", sets: 3, reps: "6-10" },
      { exercise: "Bulgarian Split Squats", sets: 3, reps: "8-12 (each side)" },
    ],
    Thursday: "Rest",
    Friday: [
      { exercise: "Barbell Bench Press", sets: 3, reps: "6-8" },
      { exercise: "Barbell Overhead Press", sets: 3, reps: "8-10" },
      { exercise: "Inclined Dumbbell Press", sets: 3, reps: "8-12" },
      { exercise: "Dumbbell Lateral Raise", sets: 3, reps: "10-15" },
      { exercise: "Seated Decline Cable Flyes", sets: 3, reps: "10-15" },
      {
        exercise: "Incline Dumbbell Overhead Extensions",
        sets: 3,
        reps: "10-15",
      },
    ],
    Saturday: [
      { exercise: "Deadlift", sets: 3, reps: "6-8" },
      { exercise: "Seated Cable Row", sets: 3, reps: "10-12" },
      { exercise: "Lat Pulldown", sets: 3, reps: "8-12" },
      { exercise: "Chest Supported Rear Delt Row", sets: 3, reps: "10-15" },
      { exercise: "Barbell Curl", sets: 3, reps: "8-12" },
      { exercise: "Kneeling Face Pulls", sets: 3, reps: "10-15" },
    ],
    Sunday: [
      { exercise: "Barbell Squat", sets: 3, reps: "6-10" },
      { exercise: "Hip Thrusts", sets: 3, reps: "12-15" },
      { exercise: "Glute Ham Raise", sets: 3, reps: "10-15" },
      { exercise: "Standing Single Leg Calf Raise", sets: 3, reps: "6-10" },
      { exercise: "Bulgarian Split Squats", sets: 3, reps: "8-12 (each side)" },
    ],
  },
  "Upper/Lower Split": {
    Monday: [
      { exercise: "Inclined Dumbbell Press", sets: 3, reps: "6-10" },
      { exercise: "Chest Supported Row", sets: 3, reps: "8-10" },
      { exercise: "Barbell Overhead Press", sets: 3, reps: "6-10" },
      { exercise: "Lat Pulldowns", sets: 3, reps: "8-10" },
      { exercise: "Inclined Dumbbell Curl", sets: 3, reps: "8-12" },
      { exercise: "Inclined Dumbbell Extensions", sets: 3, reps: "8-12" },
    ],
    Tuesday: [
      { exercise: "Barbell Squat", sets: 3, reps: "6-8" },
      { exercise: "Romanian Deadlift", sets: 3, reps: "8-10" },
      { exercise: "Bulgarian Split", sets: 3, reps: "6-10" },
      { exercise: "Glute Ham Raise", sets: 3, reps: "8-12" },
      { exercise: "Inclined Dumbbell Curl", sets: 3, reps: "8-12" },
      { exercise: "Standing Single Calf Raise", sets: 3, reps: "6-10" },
    ],
    Wednesday: "Rest",
    Thursday: [
      { exercise: "Barbell Bench Press", sets: 3, reps: "6-8" },
      { exercise: "Chest Supported Row", sets: 3, reps: "8-10" },
      { exercise: "Standing Dumbell Shoulder Press", sets: 3, reps: "6-10" },
      { exercise: "Lat Pulldowns", sets: 3, reps: "8-10" },
      { exercise: "Inclined Dumbbell Curl", sets: 3, reps: "8-12" },
      { exercise: "Inclined Dumbbell Extensions", sets: 3, reps: "8-12" },
    ],
    Friday: [
      { exercise: "Barbell Squat", sets: 3, reps: "6-8" },
      { exercise: "Romanian Deadlift", sets: 3, reps: "8-10" },
      { exercise: "Bulgarian Split", sets: 3, reps: "6-10" },
      { exercise: "Glute Ham Raise", sets: 3, reps: "8-12" },
      { exercise: "Inclined Dumbbell Curl", sets: 3, reps: "8-12" },
      { exercise: "Standing Single Calf Raise", sets: 3, reps: "6-10" },
    ],
    Saturday: "Rest",
    Sunday: "Rest",
  },
  Custom: {},
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkoutPlansPage({ user }) {
  const [selectedPlan, setSelectedPlan] = useState("Full Body");
  const [showInfo, setShowInfo] = useState(false);
  const [customPlanData, setCustomPlanData] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const { reloadCustom, selectCustom } = location.state || {};

    async function fetchCustomPlan() {
      if (!user || !user._id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/custom-workout/user/${user._id}`
        );
        if (response.ok) {
          const data = await response.json();

          // Transform days array into keys for each day
          const transformedPlan = {};
          data.days.forEach(({ day, exercises }) => {
            transformedPlan[day] = exercises;
          });

          setCustomPlanData({
            ...transformedPlan,
            name: data.name,
          });
        }
      } catch (error) {
        console.error("Failed to fetch custom workout plan:", error);
      }
    }

    if (reloadCustom || !customPlanData) {
      fetchCustomPlan();
    }

    if (selectCustom) {
      setSelectedPlan("Custom");
    }

    // Clean up navigation state
    if (reloadCustom || selectCustom) {
      window.history.replaceState({}, document.title);
    }
  }, [user, location, customPlanData]);

  const currentPlan =
    selectedPlan === "Custom" && customPlanData
      ? customPlanData
      : workoutPlans[selectedPlan];

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sample Workout Plans
      </h1>

      {/* Info Toggle Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-sm underline text-blue-700 hover:text-blue-900"
        >
          Which plan is right for me?
        </button>
      </div>

      {/* Info Box */}
      {showInfo && (
        <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 max-w-2xl mx-auto mb-6 text-sm text-gray-800">
          <h2 className="font-semibold mb-2">
            Choosing the Right Workout Plan
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Full Body:</strong> Great for beginners or busy schedules.
              Hits all major muscle groups in fewer sessions.
            </li>
            <li>
              <strong>Push-Pull-Legs:</strong> Ideal for intermediate users
              training 5–6 days/week. Splits focus on movement patterns.
            </li>
            <li>
              <strong>Upper/Lower Split:</strong> Good balance for strength and
              size gains with 4 sessions/week.
            </li>
          </ul>
        </div>
      )}

      {/* Plan Switch Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {Object.keys(workoutPlans).map((planKey) => {
          const isSelected = selectedPlan === planKey;
          const isCustom = planKey === "Custom";
          const label = isCustom
            ? customPlanData?.name || "Create Custom Plan"
            : planKey;

          return (
            <button
              key={planKey}
              onClick={() => {
                if (isCustom && !customPlanData) {
                  navigate("/customworkout");
                } else {
                  setSelectedPlan(planKey);
                }
              }}
              className={`px-4 py-2 rounded font-medium border transition duration-200 ${
                isSelected
                  ? "text-black border-[#7A9A76]"
                  : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
              }`}
              style={isSelected ? { backgroundColor: "#AAD59E" } : {}}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Plan Details */}
      <div className="bg-gray-100 rounded-lg p-6 shadow-md mx-4">
        <div className="grid grid-cols-4 gap-4 px-4">
          {days.map((day) => (
            <div
              key={day}
              className="bg-white border p-4 rounded shadow-sm text-sm text-left"
            >
              <h2 className="font-semibold text-center mb-2">{day}</h2>
              {currentPlan[day] === "Rest" ? (
                <p className="text-center text-gray-500">Rest</p>
              ) : (
                <ul>
                  {Array.isArray(currentPlan[day]) ? (
                    currentPlan[day].length > 0 ? (
                      currentPlan[day].map((w, idx) => (
                        <li key={idx}>
                          • {w.exercise}: {w.sets} sets × {w.reps} reps
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">Rest</p>
                    )
                  ) : (
                    <p className="text-center text-gray-400">No exercises</p>
                  )}
                </ul>
              )}
            </div>
          ))}

          {/* "Use This Plan" button */}
          <div className="col-span-1 flex flex-col items-center justify-center gap-4">
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:5000/api/users/${user._id}/select-plan`,
                    {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ currentPlan: selectedPlan }),
                    }
                  );

                  if (res.ok) {
                    alert(`You have selected the "${selectedPlan}" plan!`);
                    navigate('/workoutdetails');
                  } else {
                    alert("Failed to save this plan.");
                  }
                } catch (error) {
                  console.error("Error selecting plan:", error);
                  alert("An error occurred. Please try again.");
                }
              }}
              className="px-4 py-2 text-black rounded hover:brightness-110 transition"
              style={{ backgroundColor: "#AAD59E" }}
            >
              Use This Plan!
            </button>

            {selectedPlan === "Custom" && customPlanData && (
              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete your custom plan "${customPlanData.name}"?`
                    )
                  ) {
                    try {
                      const response = await fetch(
                        `http://localhost:5000/api/custom-workout/user/${user._id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      if (response.ok) {
                        alert("Custom plan deleted successfully.");
                        setCustomPlanData(null);
                        setSelectedPlan("Full Body"); 
                      } else {
                        alert("Failed to delete the plan.");
                      }
                    } catch (error) {
                      console.error("Error deleting custom plan:", error);
                      alert("Error deleting the plan.");
                    }
                  }
                }}
                className="px-4 py-2 text-white rounded hover:brightness-90 transition"
                style={{ backgroundColor: "#FFB6B6" }}
              >
                Delete Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
