import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Settings } from "lucide-react";

export default function MainNav({ user, setUser }) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", to: "/", auth: false },
    { name: "Log In", to: "/login", auth: false },
    { name: "Sign Up", to: "/signup", auth: false },
    { name: "Dashboard", to: "/dashboard", auth: true },
    { name: "Profile", to: "/profileUpdateInput", auth: true },
  ];

  const links = navItems.filter((item) => item.auth === Boolean(user));

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
              style={{
                backgroundColor: "transparent",
                color: "black",        // Forces text color
                padding: 0,
                border: "none",
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                stroke="black"
                strokeWidth="2.5"
                fill="none"
                style={{
                  display: "block",
                  color: "black",
                  stroke: "black",
                  fill: "none",
                }}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
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

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-6 text-gray-700 items-center">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => handleNavigate(l.to)}
                  className="hover:underline font-semibold"
                >
                  {l.name}
                </Link>
              </li>
            ))}

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
                  onClick={() => {
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

          {/* Mobile fallback toggle (text only) */}
          <span
            className="md:hidden px-3 py-1 cursor-pointer text-gray-800"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </span>
        </div>

        {/* Mobile Nav */}
        {open && (
          <ul className="md:hidden bg-white border-t border-gray-200">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => handleNavigate(l.to)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {l.name}
                </Link>
              </li>
            ))}

            {user && (
              <>
                <li className="border-t border-gray-100 px-4 pt-2 text-gray-600 font-semibold">
                  Daily Entry
                </li>
                <li>
                  <Link
                    to="/health-entry"
                    onClick={() => handleNavigate("/health-entry")}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Health Entry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mood-tracker"
                    onClick={() => handleNavigate("/mood-tracker")}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Mood Tracker
                  </Link>
                </li>
                <li>
                  <Link
                    to="/breathing-entry"
                    onClick={() => handleNavigate("/breathing-entry")}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Breathing Entry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tasks"
                    onClick={() => handleNavigate("/tasks")}
                    className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Tasks
                  </Link>
                </li>

                <li>
                  <span
                    onClick={() => {
                      setUser(null);
                      handleNavigate("/");
                    }}
                    className="block w-full text-left px-4 py-2 text-red-500 cursor-pointer hover:bg-gray-100 font-semibold"
                  >
                    Log Out
                  </span>
                </li>
              </>
            )}
          </ul>
        )}
      </nav>

      {/* Sidebar */}
<div
  className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
    sidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <div className="p-5">
    {/* Header with X */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-xl font-bold text-[#f0743e]">Menu</h2>
      <button
        onClick={toggleSidebar}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        style={{ backgroundColor: "transparent" }} // ✅ removes green
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

    {/* Sidebar Options */}
    <div className="space-y-4 text-[15px]">
      {/* Profile */}
      <Link
        to="/profileUpdateInput"
        onClick={toggleSidebar}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]"
      >
        <span>👤</span>
        <span>Profile</span>
      </Link>

      {/* Dashboard */}
      <Link
        to="/dashboard"
        onClick={toggleSidebar}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]"
      >
        <span>🏠</span>
        <span>Dashboard</span>
      </Link>

      {/* Help & Support */}
      <Link
        to="/help"
        onClick={toggleSidebar}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]"
      >
        <span>❓</span>
        <span>Help & Support</span>
      </Link>

      {/* Settings */}
      <Link
        to="/notification-settings"
        onClick={toggleSidebar}
        className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]"
      >
        <Settings className="w-5 h-5 text-[#f0743e]" />
        <span>Settings</span>
      </Link>

      {/* Log Out */}
      {user && (
        <div
          onClick={() => {
            setUser(null);
            toggleSidebar();
            navigate("/");
          }}
          className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium text-[18px]"
        >
          <span>🚪</span>
          <span>Log Out</span>
        </div>
      )}
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
