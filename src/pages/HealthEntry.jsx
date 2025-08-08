import { useEffect, useRef, useState } from "react";

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
  const [existingEntry, setExistingEntry] = useState(null);
  const [history, setHistory] = useState([]);
  const skipCheckRef = useRef(false);

  const loadHistory = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/health-entries?email=${encodeURIComponent(
          user.email
        )}`
      );
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('History load error:', err);
    }
  }; 

    useEffect(() => {
    if (skipCheckRef.current) {
      skipCheckRef.current = false;
      return;
    }
    if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
    loadHistory();
  }, [user]);

  useEffect(() => {
    const checkExisting = async () => {
      if (!form.email || !form.date) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/health-entry?email=${encodeURIComponent(
            form.email
          )}&date=${form.date}`
        );
        if (res.ok) {
          const data = await res.json();
          setExistingEntry(data);
          if (
            window.confirm(
              "An entry for this date already exists. Do you want to edit it?"
            )
          ) {
            setForm((prev) => ({
              ...prev,
              steps: data.steps?.toString() || "",
              sleep: data.sleep?.toString() || "",
              water: data.water?.toString() || "",
              exercise: data.exercise?.toString() || "",
              mood: data.mood ?? "Happy",
              reflection: data.reflection || "",
            }));
          }
        } else {
          setExistingEntry(null);
          setForm((prev) => ({
            ...prev,
            steps: "",
            sleep: "",
            water: "",
            exercise: "",
            mood: "Happy",
            reflection: "",
          }));
        }
      } catch {
        setExistingEntry(null);
      }
    };

    checkExisting();
  }, [form.date, form.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    // Email format check
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";

    if (!form.date) newErrors.date = "Date is required";
    else if (new Date(form.date) > new Date()) newErrors.date = "Date cannot be in the future";

    if (!form.steps.trim() || parseInt(form.steps) <= 0) newErrors.steps = "Enter a valid number of steps";
    const sleep = parseFloat(form.sleep);
    if (!form.sleep.trim() || sleep <= 0 || sleep > 24) newErrors.sleep = "Sleep hours must be between 0 and 24";

    const water = parseInt(form.water, 10);
    if (!form.water.trim() || water <= 0 || water > 99) newErrors.water = "Water intake must be between 1 and 99";

    const exercise = parseFloat(form.exercise);
    if (!form.exercise.trim() || exercise < 0 || exercise > 24) {
      newErrors.exercise = "Exercise must be between 0 and 24 hours";
    } else if (sleep + exercise > 24) {
      newErrors.exercise = "Sleep and exercise together cannot exceed 24 hours";
    }
    if (!form.reflection.trim()) newErrors.reflection = "Reflection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setRecommendation("");

    if (!validateForm()) {
      setMessage("❌ Please correct the errors above.");
      return;
    }

    try {
      let url = "http://localhost:5000/api/health-entry";
      let method = "POST";
      if (existingEntry) {
        const confirmUpdate = window.confirm(
          "An entry already exists for this date. Update it?"
        );
        if (!confirmUpdate) {
          setMessage("❌ Update cancelled.");
          alert("❌ Update cancelled.");
          // navigate("/dashboard");
          return;
        }
        method = "PUT";
      }
       const sanitizedForm = {
        ...form,
        steps: parseInt(form.steps, 10),
        sleep: parseFloat(form.sleep),
        water: parseInt(form.water, 10),
        exercise: parseFloat(form.exercise),
        mood: form.mood,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage(method === "POST" ? "✅ Submission successful!" : "✅ Entry updated!");
      if (method === "POST") {
        skipCheckRef.current = true;
        setExistingEntry(null);
        // setForm(getInitialForm(form.email, form.date));
      } else {
        setExistingEntry(data.entry);
        alert("✅ Entry updated!");
        // navigate("/dashboard");
      }

       await loadHistory();

      let rec = "";
      if (form.steps < 5000) rec += "Try walking a bit more today. ";
      if (form.water < 8) rec += "Drink some extra water. ";
      if (form.sleep < 7) rec += "You may need more sleep tonight. ";
      if (form.exercise < 0.5) rec += "Add some movement to your day. ";
      if (["sad", "angry", "stressed", "tried"].includes(form.mood.toLowerCase()))
        rec += "Take time for mental wellness. ";

      setRecommendation(rec || "You're doing great! Keep it up!");
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

   const handleEdit = (entry) => {
    setForm({
      email: entry.email,
      date: entry.date.split("T")[0],
      steps: entry.steps?.toString() || "",
      sleep: entry.sleep?.toString() || "",
      water: entry.water?.toString() || "",
      exercise: entry.exercise?.toString() || "",
      mood: entry.mood ?? "Happy",
      reflection: entry.reflection || "",
    });
    setExistingEntry(entry);
    skipCheckRef.current = true;
    setMessage("");
    setRecommendation("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderInput = (label, name, type = "text", readOnly = false) => (
    <div>
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        readOnly={readOnly}
        className={`w-full border rounded p-2 ${
        errors[name] ? "border-red-500" : "border-gray-300"
      } ${readOnly ? "bg-gray-100" : "bg-white"} text-black ${
        type === "date" ? "cursor-pointer" : ""
      }`}
    />
      {errors[name] && <p className="text-sm text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📝 Daily Health Entry</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="mt-1 w-full border border-gray-300 rounded p-2 bg-gray-100 text-black">
            {renderInput("Email", "email", "email", true)}
          </div>
          {renderInput("Entry Date", "date", "date")}
          {renderInput("Steps walked", "steps", "number")}
          {renderInput("Sleep hours", "sleep", "number")}
          {renderInput("Water intake (glasses)", "water", "number")}
          {renderInput("Exercise (hours)", "exercise", "number")}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mood: <span className="font-semibold">{form.mood}</span>
            </label>
              <select
              name="mood"
              value={form.mood}
              onChange={handleChange}
              className="w-full border rounded p-2 bg-white text-black"
            >
              {[
                "Happy",
                "Neutral",
                "sad",
                "Angry",
                "Stressed",
                "tried",
              ].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-1">Daily Reflection</label>
          <textarea
            name="reflection"
            value={form.reflection}
            onChange={handleChange}
            className={`input h-24 ${errors.reflection ? "border-red-500" : ""}`}
          />
          {errors.reflection && <p className="text-sm text-red-500">{errors.reflection}</p>}
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-[#AAD59E] text-black font-semibold py-2 px-4 rounded hover:bg-[#94c88a] transition"
        >
          Submit
        </button>

  {message && (
          <p className="text-center text-sm mt-4 text-gray-800">{message}</p>
        )}
        {recommendation && (
          <div className="mt-4 p-4 bg-blue-50 border rounded text-sm text-gray-800">
            {recommendation}
          </div>
        )}
      </form>
      {history.length > 0 && (
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-auto w-full max-w-2xl">
          <h3 className="font-semibold p-4">Entry History</h3>
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Steps</th>
                <th className="px-4 py-2 text-left">Sleep</th>
                <th className="px-4 py-2 text-left">Mood</th>
                <th className="px-4 py-2 text-center">Edit</th>
              </tr>
            </thead>
            <tbody>
              {history.map((e, i) => (
                <tr key={e._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{e.steps}</td>
                  <td className="px-4 py-2">{e.sleep}</td>
                  <td className="px-4 py-2">{e.mood}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleEdit(e)} className="text-blue-500 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}