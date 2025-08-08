// src/components/NotificationSettings.jsx
import React, { useEffect, useState } from "react";
import { Switch } from "./Switch";
import { Link } from "react-router-dom";
import axios from "axios";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    healthAlerts: true,
    reminders: true,
    aiSuggestions: true,
  });

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const email = localStorage.getItem("email");
        const res = await axios.get(`/api/notifications?email=${email}`);
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error("Error fetching notification settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Update settings in DB
  const handleToggle = async (key, value) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    try {
      const email = localStorage.getItem("email");
      await axios.put("/api/notifications", {
        email,
        notifications: updated,
      });
    } catch (err) {
      console.error("Failed to update notification settings:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-[#212529] font-[system-ui]">
      <Link to="/dashboard" className="text-sm text-[#4F4F4F] hover:text-[#AAD59E]">
        &larr; Back to dashboard
      </Link>

      <h1 className="text-5xl font-bold mt-4">Settings</h1>
      <h2 className="text-lg font-semibold mt-2">Notification Settings</h2>
      <p className="text-sm text-gray-600 mt-1 mb-6">
        Change settings according to your preference. We may continue to give alerts on important notifications.
      </p>

      <hr className="border-t border-gray-300 mb-6" />

      {/* Toggle Items */}
      <div className="space-y-8">
        {/* Health Alerts */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Health Alerts</h3>
            <p className="text-sm text-gray-600">
              Updates on heart rate, sleep, hydration, and fitness progress.
            </p>
          </div>
          <Switch
            checked={settings.healthAlerts}
            onCheckedChange={(val) => handleToggle("healthAlerts", val)}
          />
        </div>

        {/* Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Reminders</h3>
            <p className="text-sm text-gray-600">
              Medication, exercise, hydration, and wellness check-ins.
            </p>
          </div>
          <Switch
            checked={settings.reminders}
            onCheckedChange={(val) => handleToggle("reminders", val)}
          />
        </div>

        {/* AI Suggestions */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">AI Suggestions</h3>
            <p className="text-sm text-gray-600">
              Personalized tips based on user data.
            </p>
          </div>
          <Switch
            checked={settings.aiSuggestions}
            onCheckedChange={(val) => handleToggle("aiSuggestions", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;