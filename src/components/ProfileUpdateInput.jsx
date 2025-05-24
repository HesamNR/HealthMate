import React from 'react';

export default function ProfileUpdateInput({ profile }) {
  return (
    <div className="flex flex-col h-screen w-screen bg-green-100">
      {/* Main Content */}
      <main className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar with links */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full" />
              <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-gray-500">{profile.location}</p>
            </div>
            <nav className="space-y-4">
              <a href="/calendar" className="block text-gray-700 hover:text-gray-900">Calendar</a>
              <a href="/notifications" className="block text-gray-700 hover:text-gray-900">Notifications</a>
              <a href="/contacts" className="block text-gray-700 hover:text-gray-900">Contacts</a>
            </nav>
          </div>

          {/* Profile Information card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            <div className="space-y-2 text-gray-600">
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Age:</strong> {profile.age}</div>
              <div><strong>Gender:</strong> {profile.gender}</div>
              <div><strong>Birthday:</strong> {profile.birthday}</div>
              <div><strong>Height:</strong> {profile.height}</div>
              <div><strong>Weight:</strong> {profile.weight}</div>
              <div><strong>Location:</strong> {profile.location}</div>
              <div><strong>Email:</strong> {profile.email}</div>
            </div>
          </div>

          {/* Goals card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Health and Fitness Goals</h3>
            <div className="space-y-2 text-gray-600">
              {profile.goals.split(';').map((goal, i) => (
                <div key={i}><strong>Goal {i + 1}:</strong> {goal.trim()}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Profile button */}
        <div className="max-w-screen-xl mx-auto px-4 mt-6 text-right">
          <a
            href="/editprofile"
            className="inline-block bg-[#AAD59E] text-white px-4 py-2 rounded hover:bg-[#3d3d3d] transition"
          >
            Edit Profile
          </a>
        </div>
      </main>

      {/* Footer section */}
      <footer className="bg-rose-50 w-full pt-16 pb-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm mb-4">
            © 2025 HealthMate. Empowering your journey to better health. All rights reserved.
          </p>
          <nav className="flex justify-center space-x-8 text-gray-600 text-sm">
            <a href="/about" className="hover:underline">About Us</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/community" className="hover:underline">Community</a>
            <a href="/help" className="hover:underline">Help</a>
            <a href="/settings" className="hover:underline">Settings</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
