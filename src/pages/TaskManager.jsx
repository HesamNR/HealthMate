import React, { useState } from "react";
import DailyTasks from "../components/DailyTasks";
import MedicalTasks from "../components/MedicalTasks";
import Prescriptions from "../components/Prescriptions";

export default function TaskManager({ user }) {
  const [tab, setTab] = useState("daily");

  const tabClasses = (active) =>
    `px-4 py-2 rounded font-semibold ${
      active
        ? "!bg-[#b5dc9c] text-black shadow-md"
        : "!bg-[#b5dc9c] text-black opacity-80 hover:opacity-100"
    }`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab("daily")}
          className={tabClasses(tab === "daily")}
        >
          Daily Tasks
        </button>
        <button
          onClick={() => setTab("medical")}
          className={tabClasses(tab === "medical")}
        >
          Medical Tasks
        </button>
        <button
          onClick={() => setTab("prescriptions")}
          className={tabClasses(tab === "prescriptions")}
        >
          Prescriptions
        </button>
      </div>

      {tab === "daily" && <DailyTasks user={user} />}
      {tab === "medical" && <MedicalTasks user={user} />}
      {tab === "prescriptions" && <Prescriptions user={user} />}
    </div>
  );
}
