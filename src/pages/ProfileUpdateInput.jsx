import { Link } from 'react-router-dom';

export default function ProfileUpdateInput({ profile }) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading profile…</p>
      </div>
    );
  }

  const goals = (profile.goals || '')
    .split(';')
    .map(g => g.trim())
    .filter(g => g.length > 0);

  const formattedBirthday = profile.birthday
    ? new Date(profile.birthday).toISOString().split('T')[0]
    : '';

  return (
    <div className="flex flex-col h-screen w-screen bg-green-100">
      <main className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gray-300 rounded-full" />
              <h3 className="text-xl font-semibold text-gray-800">{profile.name}</h3>
              <p className="text-gray-500">{profile.location}</p>
            </div>
            <nav className="space-y-4">
              <Link to="/calendar" className="block text-gray-700 hover:text-gray-900">
                Calendar
              </Link>
              <Link to="/notification-settings" className="block text-gray-700 hover:text-gray-900">
                Notifications
              </Link>
              <Link to="/contacts" className="block text-gray-700 hover:text-gray-900">
                Contacts
              </Link>
            </nav>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Profile Information</h3>
            <div className="space-y-2 text-gray-600">
              <div><strong>Name:</strong> {profile.name}</div>
              <div><strong>Age:</strong> {profile.age}</div>
              <div><strong>Gender:</strong> {profile.gender}</div>
              <div><strong>Birthday:</strong> {formattedBirthday}</div>
              <div><strong>Height:</strong> {profile.height}</div>
              <div><strong>Weight:</strong> {profile.weight}</div>
              <div><strong>Location:</strong> {profile.location}</div>
              <div><strong>Email:</strong> {profile.email}</div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Health and Fitness Goals</h3>
            <div className="space-y-2 text-gray-600">
              {goals.map((goal, i) => (
                <div key={i}>
                  <strong>Goal {i + 1}:</strong> {goal}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="max-w-screen-xl mx-auto px-4 mt-6 text-right">
          <Link
            to="/editprofile"
            className="inline-block bg-[#AAD59E] text-white px-4 py-2 rounded hover:bg-[#3d3d3d] transition"
          >
            Edit Profile
          </Link>
        </div>
      </main>
    </div>
  );
}
