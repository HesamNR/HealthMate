import React, { useState, useEffect } from 'react';
import WelcomeBanner from '../components/WelcomeBanner';

const LABELS = {
  steps: 'Steps',
  sleep: 'Sleep (h)',
  water: 'Water (glasses)',
  exercise: 'Exercise (h)',
  mood: 'Mood',
  avgSleep: 'Avg Sleep (h)',
  avgSteps: 'Avg Steps',
  avgExercise: 'Avg Exercise (h)',
  avgWater: 'Avg Water (glasses)',
  sadCount: 'Low-Mood Logs',
  moodHits: 'Total Mood Logs',
};

const UNITS = {
  steps: '',
  sleep: 'h',
  water: ' glasses',
  exercise: 'h',
  avgSleep: 'h',
  avgSteps: '',
  avgExercise: 'h',
  avgWater: ' glasses',
};

export default function HealthGuide({ profile }) {
  const [guide, setGuide]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!profile?.email) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/health-guide?email=${encodeURIComponent(profile.email)}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load guide');
        return res.json();
      })
      .then(data => setGuide(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [profile]);

  if (loading) return <p className="p-4">Loading your guide…</p>;
  if (error)   return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!guide) return null; 

  const { dailyMetrics, dailyRecs, weeklyMetrics, weeklyRecs } = guide;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <WelcomeBanner profile={profile} />

        <h2 className="text-2xl font-bold">Your Personalized Health Guide</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Today’s Recommendations</h3>

            {Object.entries(dailyMetrics).map(([key, val]) => (
              <div key={key} className="mb-6 p-4 bg-white rounded shadow">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-medium">{LABELS[key]}</span>
                  <span className="text-lg font-bold">
                    {val}{UNITS[key] || ''}
                  </span>
                </div>
                {dailyRecs[key] && dailyRecs[key].length > 0 ? (
                  <ul className="list-disc ml-5 text-sm space-y-1">
                    {dailyRecs[key].map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    You’re on track with your {LABELS[key].toLowerCase()} today.
                  </p>
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">This Week’s Overview</h3>

            <div className="bg-white rounded shadow p-4 mb-6">
              {Object.entries(weeklyMetrics).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1">
                  <span>{LABELS[key]}</span>
                  <span className="font-medium">
                    {val}{UNITS[key] || ''}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded shadow p-4">
              <h4 className="font-medium mb-2">Weekly Suggestions</h4>
              <ul className="list-disc ml-5 text-sm space-y-1">
                {weeklyRecs.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
