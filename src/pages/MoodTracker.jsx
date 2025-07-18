import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const EMOJIS = [
  { label: 'Happy',    symbol: '😄' },
  { label: 'Neutral',  symbol: '😐' },
  { label: 'Sad',      symbol: '☹️' },
  { label: 'Angry',    symbol: '😠' },
  { label: 'Stressed', symbol: '😰' },
  { label: 'Tired',    symbol: '😴' },
  { label: 'Excited',  symbol: '🤩' },
  { label: 'Nervous',  symbol: '😬' },
  { label: 'Confused', symbol: '😕' },
]

export default function MoodTracker({ user }) {
  const [mood, setMood]       = useState('')
  const [notes, setNotes]     = useState('')
  const [history, setHistory] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.email) return
    fetch(`http://localhost:5000/api/mood-entries?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(setHistory)
      .catch(console.error)
  }, [user?.email])

  const handleSave = async () => {
    if (!mood) return
    const symbol = EMOJIS.find(e => e.label === mood)?.symbol || ''
    const payload = {
      email:  user.email,
      mood,
      symbol,
      notes,
      date:   new Date().toISOString()
    }

    try {
      const res = await fetch('http://localhost:5000/api/mood-entry', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Save failed')
      const saved = await res.json()
      setHistory([saved, ...history])
      setMood('')
      setNotes('')
    } catch (err) {
      console.error(err)
      alert('Error saving mood')
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/mood-entry/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Delete failed')
      setHistory(history.filter(e => e._id !== id))
    } catch (err) {
      console.error(err)
      alert('Error deleting entry')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fde4db] text-black">
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">
          How Are You Feeling Today?
        </h1>
        <p className="text-center text-gray-600 italic">Log your feelings over days to notice patterns and understand yourself better!</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-3 gap-4">
              {EMOJIS.map(e => (
                <button
                  key={e.label}
                  onClick={() => setMood(e.label)}
                  className={`p-4 rounded-lg transition ${
                    mood === e.label
                      ? 'ring-4 ring-green-300 bg-green-50'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-3xl">{e.symbol}</span>
                  <div className="mt-1 text-sm">{e.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex flex-col">
            <label className="mb-2 font-medium">Describe How You Feel</label>
            <textarea
              rows={6}
              placeholder="Write any thoughts…"
              className="flex-1 border rounded p-3 focus:ring-2 focus:ring-green-200"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={handleSave}
                disabled={!mood}
                className={`py-2 px-5 rounded-lg font-medium transition ${
                  mood
                    ? 'bg-[#AAD59E] hover:bg-[#8bbd83]'
                    : 'bg-gray-300 cursor-not-allowed text-gray-600'
                }`}
              >
                Save
              </button>
              <button
                onClick={() => navigate(-1)}
                className="py-2 px-5 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow overflow-auto">
            <h2 className="mb-4 font-semibold">Track Your Daily Mood - Mood History</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Mood</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map(entry => (
                  <tr key={entry._id} className="border-t">
                    <td className="px-4 py-2 text-sm">
                      {new Date(entry.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {entry.symbol}{' '}
                      <span className="font-medium">{entry.mood}</span>
                    </td>
                    <td className="px-4 py-2 text-sm">{entry.notes}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
