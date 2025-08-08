import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CustomWorkoutForm({ user }) {
  const navigate = useNavigate();
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [planName, setPlanName] = useState("");
  const [customPlan, setCustomPlan] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  useEffect(() => {
    if (!user?._id) return; // skip if no user

    async function fetchPlan() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/custom-workout?userId=${user._id}`
        );
        if (!response.ok) throw new Error("Failed to fetch plan");
        const data = await response.json();

        setPlanName(data.name || "");

        // Build the customPlan object with empty arrays default
        const planObj = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };

        data.days.forEach(({ day, exercises }) => {
          if (planObj[day]) {
            planObj[day] = exercises;
          }
        });

        setCustomPlan(planObj);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPlan();
  }, [user]);

  const handleInputChange = (day, index, field, value) => {
    const updated = [...customPlan[day]];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setCustomPlan({ ...customPlan, [day]: updated });
  };

  const addExercise = (day) => {
    setCustomPlan({
      ...customPlan,
      [day]: [...customPlan[day], { exercise: "", sets: "", reps: "" }],
    });
  };

  const handleSave = async () => {
  if (!user || !user._id) {
    alert("You must be logged in to save a workout plan.");
    return;
  }

  const daysArray = Object.keys(customPlan).map((day) => ({
    day,
    exercises: customPlan[day],
  }));

  const fullPlan = {
    userId: user._id,
    name: planName || "Custom Plan",
    days: daysArray,
  };

  try {
    const response = await fetch("http://localhost:5000/api/custom-workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullPlan),
    });

    if (!response.ok) {
      throw new Error("Failed to save workout plan.");
    }

    const data = await response.json();
    console.log("Saved plan:", data);

    setPlanName(data.savedPlan.name || planName);

    const planObj = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    data.savedPlan.days.forEach(({ day, exercises }) => {
      if (planObj[day]) {
        planObj[day] = exercises;
      }
    });

    setCustomPlan(planObj);

    alert("Plan saved successfully!");
    console.log("Saving custom plan for user ID:", user._id);
    navigate("/workoutplans", { state: { reloadCustom: true, selectCustom: true } });
  } catch (error) {
    console.error("Error saving workout plan:", error);
    alert("Something went wrong while saving your plan.");
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Create Your Custom Plan
      </h1>

      {/* Plan Name Input */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Plan Name</label>
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="e.g. My Workout Plan"
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Daily Exercise Inputs */}
      {days.map((day) => (
        <div key={day} className="mb-6">
          <h2 className="font-semibold text-lg mb-2">{day}</h2>
          {customPlan[day].map((exercise, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Exercise"
                value={exercise.exercise}
                onChange={(e) =>
                  handleInputChange(day, index, "exercise", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Sets"
                value={exercise.sets}
                onChange={(e) =>
                  handleInputChange(day, index, "sets", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Reps"
                value={exercise.reps}
                onChange={(e) =>
                  handleInputChange(day, index, "reps", e.target.value)
                }
                className="p-2 border rounded"
              />
            </div>
          ))}
          <button
            onClick={() => addExercise(day)}
            className="text-sm text-blue-600 underline"
          >
            + Add Exercise
          </button>
        </div>
      ))}

      <div className="text-center mt-6">
        <button
          onClick={handleSave}
          className="bg-[#AAD59E] px-6 py-2 rounded text-black hover:brightness-110"
          style={{ backgroundColor: "#AAD59E" }}
        >
          Save Plan
        </button>
      </div>
    </div>
  );
}
