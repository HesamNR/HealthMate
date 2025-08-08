import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword({ loggedIn }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = ["+", "-", "*"][Math.floor(Math.random() * 3)];

    let question = `What is ${num1} ${operator} ${num2}?`;
    let answer;

    switch (operator) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
    }

    setCaptchaQuestion(question);
    setCorrectAnswer(String(answer));
    setCaptchaAnswer("");
  };

  useEffect(() => {
    if (step === 1) generateCaptcha();
  }, [step]);

  useEffect(() => {
    if (loggedIn) navigate("/");
  }, [loggedIn, navigate]);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setMessage("Username or Email is required.");
      return;
    }
    if (captchaAnswer.trim() === correctAnswer) {
      setStep(2);
      setMessage("");
    } else {
      setMessage("CAPTCHA incorrect. Try again.");
      generateCaptcha();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (passwordError || confirmError) {
      setMessage("Please fix the validation errors above.");
      return;
    }

    if (!password || !confirmPassword) {
      setMessage("Please fill in both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setMessage("Password has been reset successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcd7c6] px-4">
      <div className="bg-white rounded-md shadow-md p-8 w-full max-w-sm text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleVerify} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-black">Username or Email</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md text-black bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-black">{captchaQuestion}</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md text-black bg-white"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-300 hover:bg-green-400 text-black font-medium py-2 rounded-md"
            >
              Verify
            </button>
            {message && <p className="text-sm mt-2 text-red-500">{message}</p>}
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-black">New Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md text-black bg-white"
                value={password}
                onChange={(e) => {
                  const val = e.target.value;
                  setPassword(val);

                  if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(val)) {
                    setPasswordError("Password must be 8+ characters and include a number and a symbol.");
                  } else {
                    setPasswordError("");
                  }

                  if (confirmPassword && val !== confirmPassword) {
                    setConfirmError("Passwords do not match.");
                  } else {
                    setConfirmError("");
                  }
                }}
                required
              />
              {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-black">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-md text-black bg-white"
                value={confirmPassword}
                onChange={(e) => {
                  const val = e.target.value;
                  setConfirmPassword(val);

                  if (val !== password) {
                    setConfirmError("Passwords do not match.");
                  } else {
                    setConfirmError("");
                  }
                }}
                required
              />
              {confirmError && <p className="text-sm text-red-500">{confirmError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-green-300 hover:bg-green-400 text-black font-medium py-2 rounded-md"
            >
              Reset Password
            </button>
            {message && (
              <p className={`text-sm mt-2 ${message.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
