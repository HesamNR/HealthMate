import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Settings } from "lucide-react";
import { useSocket } from "../contexts/SocketContext";

export default function MainNav({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  const { disconnectSocket } = useSocket();

  const handleNavigate = (to) => {
    setOpen(false);
    setDropdownOpen(false);
    navigate(to);
  };

  return (
    <>
      <nav className="w-full bg-rose-50 shadow">
        <div className="w-full px-8 py-3 flex items-center justify-between">
          {/* Left group: Hamburger + Logo + Search */}
          <div className="flex items-center gap-6">
            {/* Hamburger Icon */}
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 flex items-center justify-center rounded-full mr-2"
              style={{ backgroundColor: "transparent", color: "black", padding: 0, border: "none" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                stroke="black"
                strokeWidth="2.5"
                fill="none"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* HealthMate Logo */}
            <Link
              to={user ? "/dashboard" : "/"}
              className="text-2xl font-bold text-gray-800"
              onClick={() => handleNavigate(user ? "/dashboard" : "/")}
            >
              HealthMate
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex items-center w-[300px] h-[40px] bg-[#f3d4c6] rounded-full px-4 ml-2">
              <input
                type="text"
                placeholder="Search or type command"
                className="flex-1 bg-transparent border-none outline-none placeholder-gray-700 text-gray-800"
              />
              <Search className="w-5 h-5 text-gray-800" />
            </div>
          </div>

          {/* Daily Entry + Logout */}
          <ul className="hidden md:flex space-x-6 text-gray-700 items-center">
            {user && (
              <li className="relative">
                <span
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="hover:underline font-semibold cursor-pointer"
                >
                  Daily Entry
                </span>
                {dropdownOpen && (
                  <ul className="absolute left-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                    <li>
                      <Link
                        to="/health-entry"
                        onClick={() => handleNavigate("/health-entry")}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Health Entry
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/mood-tracker"
                        onClick={() => handleNavigate("/mood-tracker")}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Mood Tracker
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/breathing-entry"
                        onClick={() => handleNavigate("/breathing-entry")}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Breathing Entry
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/tasks"
                        onClick={() => handleNavigate("/tasks")}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Tasks
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {user && (
              <li>
                <span
                  onClick={async () => {
                    try {
                      // Call logout endpoint
                      await fetch('http://localhost:5000/logout', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: user.email })
                      });
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                    
                    // Disconnect socket
                    disconnectSocket();
                    setUser(null);
                    handleNavigate("/");
                  }}
                  className="hover:underline font-semibold cursor-pointer"
                >
                  Log Out
                </span>
              </li>
            )}
          </ul>

          {/* Mobile fallback toggle */}
          <span
            className="md:hidden px-3 py-1 cursor-pointer text-gray-800"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </span>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="p-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#f0743e]">Menu</h2>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                style={{ backgroundColor: "transparent" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-4 text-[15px]">
            <Link to="/profileUpdateInput" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>👤</span>
              <span>Profile</span>
            </Link>
            <Link to="/dashboard" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>🏠</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/workoutplans" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>🏋️‍♂️</span>
              <span>Workout Plans</span>
            </Link>
            <Link to="/challenges" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>💪</span>
              <span>Challenges</span>
            </Link>
             <Link to="/meals" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
             <span>🥗</span>
              <span>Recipe and Meal Plan</span>
            </Link>
            <Link to="/dietSuggestions" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
             <span>🥦</span>
              <span>DietSuggestions</span>
            </Link>
            <Link to="/contacts" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>📇</span>
              <span>Contacts</span>
            </Link>
            <Link to="/sos" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>🚨</span>
              <span>Emergency SOS</span>
            </Link>
            <Link to="/health-guide" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>📘</span>
              <span>Health Guide</span>
            </Link>
            <Link to="/help" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>❓</span>
              <span>Help & Support</span>
            </Link>
            <Link to="/chat" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <span>💬</span>
              <span>Chat</span>
            </Link>
            <Link to="/notification-settings" onClick={toggleSidebar} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]">
              <Settings className="w-5 h-5 text-[#f0743e]" />
              <span>Settings</span>
            </Link>
            
            {user && (
              <div
                onClick={async () => {
                  try {
                    // Call logout endpoint
                    await fetch('http://localhost:5000/logout', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: user.email })
                    });
                  } catch (error) {
                    console.error('Logout error:', error);
                  }
                  
                  // Disconnect socket
                  disconnectSocket();
                  setUser(null);
                  toggleSidebar();
                  navigate("/");
                }}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px] cursor-pointer"
              >
                <span>🚪</span>
                <span>Log Out</span>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent backdrop-blur-[2px] z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
