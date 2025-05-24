import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ profile, setProfile }) {
  const [form, setForm] = useState(profile);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(form);          
    navigate('/profileUpdateInput'); 
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-green-100">
      <main className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700">Gender</label>
                <input
                  type="text"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700">Height</label>
                <input
                  type="text"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded p-2 text-black"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700">Goals</label>
              <textarea
                name="goals"
                value={form.goals}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded p-2 text-black h-24"
              />
            </div>
            <button
              type="submit"
              className="bg-[#4F4F4F] text-white px-4 py-2 rounded hover:bg-[#3d3d3d] transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
