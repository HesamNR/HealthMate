import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import MainNav from "./components/MainNav";
import ProfileUpdateInput from "./components/ProfileUpdateInput";
import EditProfile from "./components/EditProfile";
import WelcomePage from "./components/WelcomePage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    age: "24",
    gender: "Female",
    birthday: "2002-02-26",
    height: "170 cm / 5'7\"",
    weight: "65 kg / 143 lbs",
    location: "Toronto, Ontario",
    email: "janedoe@example.com",
    goals: "Drink more water; Be more active!",
  });

  return (
    <div className="flex flex-col h-screen w-screen">
      <MainNav />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<WelcomePage />} />

          <Route path="/dashboard" element={<Dashboard profile={profile} />} />

          <Route
            path="/profileUpdateInput"
            element={<ProfileUpdateInput profile={profile} />}
          />

          <Route
            path="/editprofile"
            element={<EditProfile profile={profile} setProfile={setProfile} />}
          />
        </Routes>
      </main>
    </div>
  );
}
