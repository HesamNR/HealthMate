import React from 'react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-[#4F4F4F]">Welcome To</h1>
          <h1 className="text-6xl font-bold text-[#AAD59E]">HealthMate!</h1>
          <p className="text-xl text-[#4F4F4F]">
            We're here to support your journey to better health!
          </p>
          <a
            href="/signup"
            className="inline-block bg-[#AAD59E] px-6 py-2 rounded text-white hover:bg-[#3d3d3d] transition"
          >
            Sign Up
          </a>
        </div>
      </div>
      <footer className="bg-rose-50 w-full pt-16 pb-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm mb-4">
            © 2025 HealthMate. Empowering your journey to better health. All rights reserved.
          </p>
          <nav className="flex justify-center space-x-8 text-gray-600 text-sm">
            <Link to="/about" className="hover:underline">About Us</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/community" className="hover:underline">Community</Link>
            <Link to="/help" className="hover:underline">Help</Link>
            <Link to="/settings" className="hover:underline">Settings</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}