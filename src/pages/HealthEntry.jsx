import React, { useState, useEffect, useRef } from "react";

const getInitialForm = (
  email = "",
  date = new Date().toISOString().split("T")[0]
) => ({
  email,
  date,
  steps: "",
  sleep: "",
  water: "",
  exercise: "",
  mood: "Happy",
  reflection: "",
});

export default function HealthEntry({ user }) {
  const [form, setForm] = useState(getInitialForm(user?.email));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [history, setHistory] = useState([]);
  const skipCheckRef = useRef(false);

  useEffect(() => {
    if (!user?.email) return;
    fetch(
      `http://localhost:5000/api/health-entries?email=${encodeURIComponent(
        user.email
      )}`
    )
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      setForm((f) => ({ ...f, email: user.email }));
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
    setMessage("");
    setRecommendation("");
  };

  const validateForm = () => {
    const errs = {};
    if (!form.steps || +form.steps <= 0) errs.steps = "Enter valid steps";
    const s = parseFloat(form.sleep);
    if (!form.sleep || s <= 0 || s > 24) errs.sleep = "0–24 hrs";
    const w = parseInt(form.water, 10);
    if (!form.water || w <= 0) errs.water = "Must be > 0";
    const ex = parseFloat(form.exercise);
    if (!form.exercise || ex < 0 || ex > 24) errs.exercise = "0–24 hrs";
    if (!form.reflection.trim()) errs.reflection = "Reflection is required";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setRecommendation("");

    if (!validateForm()) {
      setMessage("❌ Please fix errors above.");
      return;
    }

    const payload = {
      ...form,
      steps: +form.steps,
      sleep: parseFloat(form.sleep),
      water: +form.water,
      exercise: parseFloat(form.exercise),
      date: form.date, // keep date field
    };

    try {
      const res = await fetch("http://localhost:5000/api/health-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = await res.json();
      if (!res.ok) throw new Error(saved.message || "Save failed");

      setMessage("✅ Submission successful!");
      let rec = "";
      if (payload.steps < 5000) rec += "Try walking more today. ";
      if (payload.water < 8)   rec += "Drink extra water. ";
      if (payload.sleep < 7)   rec += "You may need more sleep. ";
      if (payload.exercise < 0.5) rec += "Add some movement today. ";
      if (["sad","angry","stressed","tired"].includes(payload.mood.toLowerCase())) {
        rec += "Take time for mental wellness. ";
      }
      setRecommendation(rec || "You're doing great! Keep it up!");

      setHistory((h) => [{ ...saved, ...payload }, ...h]);
      setForm((f) => ({
        ...getInitialForm(f.email, f.date),
        email: f.email,
        date: f.date,
      }));
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  const renderInput = (label, name, type = "text", readOnly = false) => (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        readOnly={readOnly}
        value={form[name]}
        onChange={handleChange}
        className={`w-full border rounded p-2 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        } ${readOnly ? "bg-gray-100" : "bg-white"} text-black`}
      />
      {errors[name] && (
        <p className="text-sm text-red-500">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 text-black">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8 space-y-6"
        >
          <h2 className="text-2xl font-bold mb-4">
            📝 Daily Health Entry
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderInput("Email", "email", "email", true)}
            {renderInput("Date", "date", "date")}
            {renderInput("Steps walked", "steps", "number")}
            {renderInput("Sleep hours", "sleep", "number")}
            {renderInput("Water (glasses)", "water", "number")}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mood
              </label>
              <select
                name="mood"
                value={form.mood}
                onChange={handleChange}
                className="w-full border rounded p-2 text-black"
              >
                {[
                  "Happy",
                  "Neutral",
                  "Sad",
                  "Angry",
                  "Stressed",
                  "Tired",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Daily Reflection
            </label>
            <textarea
              name="reflection"
              rows={4}
              value={form.reflection}
              onChange={handleChange}
              className="w-full border rounded p-2 text-black"
            />
            {errors.reflection && (
              <p className="text-sm text-red-500">
                {errors.reflection}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#AAD59E] text-black py-2 rounded hover:bg-[#94c88a] transition"
          >
            Submit
          </button>
          {message && (
            <p className="text-center text-sm mt-2">{message}</p>
          )}
          {recommendation && (
            <p className="text-center text-sm mt-1">
              {recommendation}
            </p>
          )}
        </form>

        <div className="bg-white rounded-lg shadow-md p-6 overflow-auto">
          <h2 className="text-xl font-semibold mb-4">
            Entry History (Log)
          </h2>
          <table className="min-w-full table-auto text-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Steps</th>
                <th className="px-4 py-2 text-left">Sleep</th>
                <th className="px-4 py-2 text-left">Water</th>
                <th className="px-4 py-2 text-left">Exercise</th>
                <th className="px-4 py-2 text-left">Mood</th>
                <th className="px-4 py-2 text-left">Reflection</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => (
                <tr
                  key={entry._id || i}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 text-sm">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">{entry.steps}</td>
                  <td className="px-4 py-2 text-sm">{entry.sleep}</td>
                  <td className="px-4 py-2 text-sm">{entry.water}</td>
                  <td className="px-4 py-2 text-sm">{entry.exercise}</td>
                  <td className="px-4 py-2 text-sm">{entry.mood}</td>
                  <td className="px-4 py-2 text-sm">
                    {entry.reflection}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
