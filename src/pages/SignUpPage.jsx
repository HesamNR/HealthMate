import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage({setUser }) {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const { email, username, password, confirmPassword } = form;

    if (!email || !username || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (username.length < 4) {
      setError("Username must be at least 4 characters.");
      return false;
    }

    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(password)) {
      setError("Password must be 8+ characters, with 1 number & 1 symbol.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register");

      setUser({
        username: form.username,
        email: form.email,
      });

      navigate("/complete-profile");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fddbcf] px-4">
      <h1 className="text-3xl font-bold text-black mb-2">
        Welcome to HealthMate
      </h1>
      <p className="text-lg text-black mb-6">Create your account below</p>

      <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-md">
        {["email", "username", "password", "confirmPassword"].map(
          (field, idx) => (
            <div className="mb-4" key={idx}>
              <label className="block text-sm font-semibold text-black mb-1 capitalize">
                {field === "confirmPassword" ? "Confirm Password" : field}
              </label>
              <input
                type={
                  field.toLowerCase().includes("password") ? "password" : "text"
                }
                name={field}
                placeholder={`Enter ${
                  field === "confirmPassword" ? "Confirm Password" : field
                }`}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-300"
                value={form[field]}
                onChange={handleChange}
              />
            </div>
          )
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleSignUp}
          className="w-full bg-[#AAD59E] hover:bg-[#8bbd83] text-black font-semibold py-2 rounded mb-3 transition"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full bg-green-300 hover:bg-green-400 text-black font-semibold py-2 rounded transition"
        >
          Already a member?
        </button>
      </div>
    </div>
  );
}
