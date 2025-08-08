import React, { useState } from "react";

const HelpSupport = () => {
  const faqItems = [
  {
    question: "How do I enable or disable notifications?",
    answer:
      "To manage your notifications, simply go to the Notification Settings screen from the sidebar menu. From there, you can turn on or off alerts like Health Reminders, Daily Suggestions, and AI-powered Tips. Just tap the toggle next to each option — it’s that easy!",
  },
  {
    question: "What is HealthMate and how does it work?",
    answer:
      "HealthMate is your personal health companion app designed to make wellness easy and smarter. It helps you track your daily habits like sleep, steps, blood pressure, mood, and more. You can sync data from devices like Fitbit or Apple Health, get timely reminders, and even receive smart suggestions to improve your lifestyle. Everything is stored securely and tailored just for you.",
  },
  {
    question: "Do I need an account to use the platform?",
    answer:
      "Yes, creating an account is required to use HealthMate. This allows us to securely store your health data, sync across devices, and personalize your experience. Don’t worry — signing up is quick, and we never share your data without your permission.",
  },
  ];

  const [openIndex, setOpenIndex] = useState(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [message, setMessage] = useState("");

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubmit = async () => {
    if (!userQuestion.trim()) {
      setMessage("Please enter a question.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/support/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Question submitted successfully!");
        setUserQuestion("");
      } else {
        setMessage(`❌ ${data.error || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setMessage("❌ Failed to submit question.");
    }
  };

  return (
    <div className="bg-white flex justify-center w-full px-6 py-8 min-h-screen">
      <div className="w-full max-w-4xl relative">

        {/* Input box */}
        <div className="mb-10 rounded-[10px] shadow-[inset_0px_4px_4px_#00000040]">
          <input
            type="text"
            placeholder="Enter your question here!"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            className="w-full h-15 px-4 py-2 text-center text-xl font-medium text-[#1e1e1e] border-none outline-none rounded-[10px]"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-4 mb-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#aad59e] text-[#1e1e1e] h-[47px] w-[162px] px-6 py-3 rounded-lg font-medium text-[17px] border border-[#aad59e] hover:bg-[#9ac98e] transition"
          >
            Submit
          </button>
        </div>

        {/* Submission message */}
        {message && (
          <div className="text-sm text-right mb-4 text-gray-700">{message}</div>
        )}

        {/* FAQ Header */}
        <div className="mb-6">
          <div className="bg-[#aad59e] h-[52px] rounded-lg flex items-center justify-center border">
            <h2 className="font-semibold text-black text-lg">FAQs</h2>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div
              key={index}
              className="rounded-[10px] bg-white shadow-[inset_0px_4px_4px_#00000040] overflow-hidden"
            >
              <div
                className="flex justify-between items-center px-6 py-4 cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-[#1e1e1e] text-sm font-medium">
                  {faq.question}
                </span>
                <img
                  src="https://c.animaapp.com/md8fjohloUUHEP/img/image-6.png"
                  alt="Toggle"
                  className="w-[33px] h-[42px] object-cover"
                />
              </div>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700 text-sm">
                  {faq.answer || "Answer not available."}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* HealthBot Button */}
        <div className="flex justify-end mt-12">
          <button className="bg-[#aad59e] text-[#1e1e1e] px-6 py-3 rounded-lg font-medium text-sm hover:bg-[#9ac98e] border border-[#aad59e] transition">
            Chat with HealthBot
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
