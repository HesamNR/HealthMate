// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import MainNav from "./components/MainNav";
import ProfileUpdateInput from "./pages/ProfileUpdateInput";
import EditProfile from "./pages/EditProfile";
import WelcomePage from "./pages/WelcomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import CompleteProfile from "./pages/CompleteProfile";
import DeviceIntegration from "./pages/DeviceIntegration";
import Challenges from "./pages/Challenges";
import HealthEntry from "./pages/HealthEntry";
import DailyTasks from "./components/DailyTasks";
import TaskManager from "./pages/TaskManager";
import MedicalTasks from "./components/MedicalTasks";
import Prescriptions from "./components/Prescriptions";
import BreathingExercise from "./pages/BreathingExercise";
import MoodTracker from "./pages/MoodTracker";
import EmergencySOS from "./pages/EmergencySOS";
import EditEmergencyContact from "./pages/EditEmergencyContact";
import EmergencyMedicalInfo from "./pages/EmergencyMedicalInfo";
import Contacts from "./pages/Contacts";
import NotificationSettings from "./components/NotificationSettings"; // ✅ Newly added
import HelpSupport from "./components/HelpSupport"; // ✅ Newly added
import HealthGuide from "./pages/HealthGuide";
import ChatWidget from "./components/ChatWidget";

import Meals from "./pages/Meals";
import DietSuggestions from "./pages/DietSuggestions";
import WorkoutPlans from './pages/WorkoutPlans';
import CustomWorkoutForm from "./pages/CustomWorkoutForm";
import WorkoutDetails from "./pages/WorkoutDetails";
import Chat from "./pages/Chat";
import { useLocation } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import NotificationWrapper from "./components/NotificationWrapper";

export default function App() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (!user?.email) {
      setProfile(null);
      return;
    }

    fetch(`http://localhost:5000/user?email=${encodeURIComponent(user.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        if (!data.name) {
          navigate("/complete-profile");
        }
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
      });
  }, [user, navigate]);

  // ✅ Fetch health data when user is loaded
  useEffect(() => {
    if (!user?.email) return;

    const fetchHealthData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/health-entries?email=${encodeURIComponent(
            user.email
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch health data");
        const data = await res.json();
        setHealthData(data);
      } catch (err) {
        console.error("Health data fetch error:", err);
      }
    };

    fetchHealthData();
  }, [user]);

  return (
    <SocketProvider user={user}>
      <div className="flex flex-col h-screen w-screen">
        {/* Only show MainNav when user is logged in and not on auth pages */}
        {user && !['/', '/login', '/signup', '/forgot-password'].includes(location.pathname) && (
          <MainNav user={user} setUser={setUser} />
        )}

        <main className={`flex-1 overflow-auto ${!user || ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname) ? 'pt-0' : ''}`}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/complete-profile"
            element={
              <CompleteProfile
                user={user}
                setUser={setUser}
                setProfile={setProfile}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard user={user} profile={profile} />}
          />
          <Route
            path="/editprofile"
            element={<EditProfile profile={profile} setProfile={setProfile} />}
          />
          <Route
            path="/profileUpdateInput"
            element={<ProfileUpdateInput profile={profile} />}
          />
          <Route path="/deviceIntegration" element={<DeviceIntegration />} />
          <Route path="/challenges" element={<Challenges user={user} />} />
          <Route path="/health-entry" element={<HealthEntry user={user} />} />
          <Route path="/daily-tasks" element={<DailyTasks user={user} />} />
          <Route path="/tasks/medical" element={<MedicalTasks user={user} />} />
          <Route
            path="/tasks/prescriptions"
            element={<Prescriptions user={user} />}
          />
          <Route
            path="/tasks"
            element={
              user ? (
                <TaskManager user={user} />
              ) : (
                <div className="p-6 text-center">Loading user info...</div>
              )
            }
          />
          <Route
            path="/mood-tracker"
            element={
              user ? (
                <MoodTracker user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/breathing-entry"
            element={
              user ? (
                <BreathingExercise user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/sos" element={<EmergencySOS user={user} />} />
          <Route
            path="/edit-contact/:index"
            element={<EditEmergencyContact user={user} />}
          />
          <Route
            path="/medical-info"
            element={
              <EmergencyMedicalInfo
                user={user}
                profile={profile}
                setProfile={setProfile}
              />
            }
          />
          <Route path="/contacts" element={<Contacts user={user} />} />
          <Route
            path="/notification-settings"
            element={<NotificationSettings />}
          />{" "}
          {/* ✅ Added */}
          <Route path="/help" element={<HelpSupport />} /> {/* ✅ Added */}
          <Route
            path="/health-guide"
            element={
              user ? (
                <HealthGuide profile={profile} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/meals" element={<Meals user={user}/>} />
          <Route path="/dietSuggestions" element={<DietSuggestions user={user}/>} />
          
          <Route path="/workoutplans" element={<WorkoutPlans user={user}/>} />
          <Route path="/customworkout" element={<CustomWorkoutForm user={user}/>} />
          <Route path="/workoutdetails" element={<WorkoutDetails user={user}/>} />
          <Route path="/chat" element={
            user ? <Chat user={user} /> : <Navigate to="/login" replace />
          } />
        </Routes>
      </main>

      {/* ✅ Pass user and healthData to ChatWidget */}
      <ChatWidget user={user} healthData={healthData} />
      
              {/* Notification Manager */}
        {user && <NotificationWrapper />}
        </div>
      </SocketProvider>
    );
  }
