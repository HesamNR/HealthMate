import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const [form, setForm] = useState({ identity: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    const { identity, password } = form;

    if (!identity || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbd3c3] flex flex-col items-center justify-center px-4">
      {/*Title*/}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-black">Hello, HealthMate</h1>
        <p className="text-gray-700 text-xl">let's get back on track!</p>
      </div>

      {/*Card*/}
      <div className="w-full max-w-sm bg-white rounded-xl p-6 shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-black mb-1">
            Email or Username
          </label>
          <input
            type="text"
            name="identity"
            placeholder="Enter Username/Email"
            value={form.identity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-black mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-green-300 hover:bg-green-400 text-black font-semibold py-2 rounded mb-3"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="w-full bg-green-300 hover:bg-green-400 text-black font-semibold py-2 rounded mb-3"
        >
          Create Account
        </button>

        <div className="text-sm text-left">
          <Link to="/forgot-password" className="text-black underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
