import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile({ profile, setProfile }) {
  const [form, setForm] = useState(profile || {
    name: '',
    age: '',
    gender: '',
    birthday: '',
    height: '',
    weight: '',
    location: '',
    email: profile?.email || '',
    goals: profile?.goals || ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        birthday: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : '',
        height: profile.height || '',
        weight: profile.weight || '',
        location: profile.location || '',
        email: profile.email || '',
        goals: profile.goals || ''
      });
      setErrors({});
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.age || parseInt(form.age) <= 0) newErrors.age = 'Enter a valid age';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.birthday) newErrors.birthday = 'Birthday is required';
    if (!form.height || parseFloat(form.height) <= 0) newErrors.height = 'Enter a valid height';
    if (!form.weight || parseFloat(form.weight) <= 0) newErrors.weight = 'Enter a valid weight';
    if (!form.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validateForm()) {
      setMessage('Please correct the errors above.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setProfile(data.user);
      alert("✅ Profile updated!");
      navigate('/profileUpdateInput');
    } catch (err) {
      console.error('Edit failed:', err);
      setMessage(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-green-100">
      <main className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
          {message && <p className="text-red-500">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`mt-1 w-full border rounded p-2 text-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
               {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className={`mt-1 w-full border rounded p-2 text-black ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
              </div>

              <div>
                <label className="block font-bold text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={`mt-1 w-full border rounded p-2 text-black ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700">Birthday</label>
              <input
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                className={`mt-1 w-full border rounded p-2 text-black ${errors.birthday ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700">Height (cm)</label>
                <input
                  type="text"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                  className={`mt-1 w-full border rounded p-2 text-black ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
              </div>

              <div>
                <label className="block font-bold text-gray-700">Weight (kg)</label>
                <input
                  type="text"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  className={`mt-1 w-full border rounded p-2 text-black ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                 {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className={`mt-1 w-full border rounded p-2 text-black ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
            </div>

            <div>
              <label className="block font-bold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="mt-1 w-full border border-gray-300 rounded p-2 bg-gray-100 text-black"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700">Health & Fitness Goals</label>
              <textarea
                name="goals"
                value={form.goals}
                onChange={handleChange}
                placeholder="Separate goals with semicolons (;)"
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
