import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile({ user, setUser, setProfile }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    birthday: "",
    height: "",
    weight: "",
    location: "",
    goals: "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "age" || name === "height") && !/^\d*$/.test(value)) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (new Date(form.birthday) > new Date())
      newErrors.birthday = "Birthday cannot be in the future";

    const age = parseInt(form.age, 10);
    if (isNaN(age) || age < 0 || age > 120)
      newErrors.age = "Age must be between 0 and 120";

    const height = parseInt(form.height, 10);
    if (isNaN(height) || height < 30 || height > 300)
      newErrors.height = "Height must be between 30 and 300 cm";

    const weight = parseFloat(form.weight);
    if (isNaN(weight) || weight < 5 || weight > 300)
      newErrors.weight = "Weight must be between 5 and 300 kg";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.gender) {
      setMessage("Please select a gender.");
      return;
    }

    if (!validateForm()) {
      setMessage("Please correct the errors above.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setUser(data.user);
      setProfile(data.user);
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbd3c3] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-black">Complete Your Profile</h2>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Age</label>
          <input
            type="text"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
            placeholder="e.g. 24"
            className={`w-full border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-black`}
          />
          {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Birthday</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            required
            className={`w-full border ${errors.birthday ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-black`}
          />
          {errors.birthday && (
            <p className="text-sm text-red-500">{errors.birthday}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Height (in cm)</label>
          <input
            type="text"
            name="height"
            value={form.height}
            onChange={handleChange}
            placeholder="e.g. 170"
            required
             className={`w-full border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-black`}
          />
          {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Weight</label>
          <input
            type="text"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            required
            className={`w-full border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 text-black`}
          />
          {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Health & Fitness Goals</label>
          <textarea
            name="goals"
            value={form.goals}
            onChange={handleChange}
            placeholder="e.g. Drink more water; Exercise daily; Get 8h sleep"
            className="w-full border border-gray-300 rounded px-3 py-2 text-black h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-black"
          />
        </div>

        {message && <p className="text-red-500 text-sm">{message}</p>} 

        <button
          type="submit"
          className="w-full bg-green-300 hover:bg-green-400 text-black font-semibold py-2 rounded"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
}
