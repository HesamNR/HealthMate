// import React, { useState, useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'

// const TECHNIQUES = [
//   { name: 'Box Breathing', instructions: 'Inhale 4s → hold 4s → exhale 4s → hold 4s' },
//   { name: '4-7-8 Breathing', instructions: 'Inhale 4s → hold 7s → exhale 8s' },
//   { name: 'Alternate Nostril', instructions: 'Close right nostril → inhale left 4s → hold 4s → switch → exhale right 4s → reverse.' },
// ]

// export default function BreathingExercise({ user }) {
//   const navigate = useNavigate()
//   const [seconds, setSeconds] = useState(0)
//   const timerRef = useRef(null)
//   const [technique, setTechnique] = useState('')
//   const [notes, setNotes] = useState('')
//   const [history, setHistory] = useState([])

//   // Load existing sessions
//   useEffect(() => {
//     if (!user?.email) return
//     fetch(
//       `http://localhost:5000/api/breathing-entries?email=${encodeURIComponent(
//         user.email
//       )}`
//     )
//       .then((res) => res.json())
//       .then(setHistory)
//       .catch(console.error)
//   }, [user?.email])

//   // Timer controls
//   const startTimer = () => {
//     if (timerRef.current) return
//     timerRef.current = setInterval(() => setSeconds((s) => s + 0.1), 100)
//   }
//   const pauseTimer = () => {
//     if (!timerRef.current) return
//     clearInterval(timerRef.current)
//     timerRef.current = null
//   }
//   const stopTimer = () => {
//     if (timerRef.current) clearInterval(timerRef.current)
//     timerRef.current = null
//   }

//   // Save session
//   const saveSession = async () => {
//     pauseTimer()
//     if (!technique || seconds <= 0) {
//       alert('Select a technique and run timer before saving.')
//       return
//     }
//     const payload = {
//       email: user.email,
//       technique,
//       duration: Number(seconds.toFixed(1)),
//       notes,
//       date: new Date().toISOString(),
//     }
//     try {
//       const res = await fetch('http://localhost:5000/api/breathing-entry', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       })
//       if (!res.ok) throw new Error('Save failed')
//       const saved = await res.json()
//       setHistory((h) => [saved, ...h])
//       setSeconds(0)
//       setNotes('')
//     } catch (err) {
//       console.error(err)
//       alert('Error saving session')
//     }
//   }

//   // Delete a session
//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/breathing-entry/${id}`,
//         { method: 'DELETE' }
//       )
//       if (!res.ok) throw new Error('Delete failed')
//       setHistory((h) => h.filter((e) => e._id !== id))
//     } catch (err) {
//       console.error(err)
//       alert('Error deleting session')
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-[#fde4db] text-black">
//       <div className="container mx-auto p-6 space-y-6">
//         <h1 className="text-xl font-semibold text-center">
//           Breathe and Let Go!
//         </h1>
//         <p className="text-center text-gray-600 italic">Practice breathing exercises when you're feeling overwhelmed!</p>

//         {/* Upper: timer on left, technique+notes on right */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Timer & Controls */}
//           <div className="flex flex-col items-center space-y-4">
//             <div className="w-64 h-64 rounded-full bg-green-200 flex items-center justify-center">
//               <span className="text-4xl font-bold text-gray-800">
//                 {seconds.toFixed(1)}
//               </span>
//             </div>
//             <div className="space-x-4">
//               <button
//                 onClick={startTimer}
//                 className="px-6 py-2 bg-[#AAD59E] text-white rounded-lg hover:bg-[#8bbd83] transition"
//               >
//                 Start
//               </button>
//               <button
//                 onClick={pauseTimer}
//                 className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
//               >
//                 Pause
//               </button>
//               <button
//                 onClick={stopTimer}
//                 className="px-6 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition"
//               >
//                 Stop
//               </button>
//             </div>
//           </div>

//           {/* Technique + Notes + Save */}
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg shadow p-6">
//               <label className="font-medium block mb-2">Technique</label>
//               <select
//                 value={technique}
//                 onChange={(e) => setTechnique(e.target.value)}
//                 className="w-full border border-gray-300 rounded p-2"
//               >
//                 <option value="">-- Select Technique --</option>
//                 {TECHNIQUES.map((t) => (
//                   <option key={t.name} value={t.name}>
//                     {t.name}
//                   </option>
//                 ))}
//               </select>
//               {technique && (
//                 <div className="mt-4 bg-gray-50 border border-gray-200 rounded p-4 text-sm">
//                   {TECHNIQUES.find((t) => t.name === technique).instructions}
//                 </div>
//               )}
//             </div>

//             <div className="bg-white rounded-lg shadow p-6">
//               <label className="font-medium block mb-2">Notes (optional)</label>
//               <textarea
//                 rows={3}
//                 className="w-full border border-gray-300 rounded p-2"
//                 placeholder="How did that feel?"
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </div>

//             <button
//               onClick={saveSession}
//               className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
//             >
//               Save Session
//             </button>
//           </div>
//         </div>

//         {/* History */}
//         {history.length > 0 && (
//           <div className="bg-white rounded-lg shadow p-6 overflow-auto">
//             <h2 className="mb-4 font-semibold">Session History</h2>
//             <table className="min-w-full table-auto">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="px-4 py-2 text-left">Date</th>
//                   <th className="px-4 py-2 text-left">Technique</th>
//                   <th className="px-4 py-2 text-left">Duration (s)</th>
//                   <th className="px-4 py-2 text-left">Notes</th>
//                   <th className="px-4 py-2 text-center">Delete</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {history.map((e, i) => (
//                   <tr
//                     key={e._id}
//                     className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
//                   >
//                     <td className="px-4 py-2 text-sm">
//                       {new Date(e.date).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-2 text-sm font-medium">
//                       {e.technique}
//                     </td>
//                     <td className="px-4 py-2 text-sm">{e.duration}</td>
//                     <td className="px-4 py-2 text-sm">{e.notes}</td>
//                     <td className="px-4 py-2 text-center">
//                       <button
//                         onClick={() => handleDelete(e._id)}
//                         className="text-red-500 hover:underline text-sm"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// src/pages/BreathingExercise.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TECHNIQUES = [
  { 
    name: 'Box Breathing',
    steps: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold',   duration: 4 },
      { label: 'Exhale', duration: 4 },
      { label: 'Hold',   duration: 4 },
    ]
  },
  {
    name: '4-7-8 Breathing',
    steps: [
      { label: 'Inhale', duration: 4 },
      { label: 'Hold',   duration: 7 },
      { label: 'Exhale', duration: 8 },
    ]
  },
  {
    name: 'Alternate Nostril',
    steps: [
      { label: 'Inhale L', duration: 4 },
      { label: 'Hold',     duration: 4 },
      { label: 'Exhale R', duration: 4 },
      { label: 'Inhale R', duration: 4 },
      { label: 'Hold',     duration: 4 },
      { label: 'Exhale L', duration: 4 },
    ]
  },
];

export default function BreathingExercise({ user }) {
  const navigate = useNavigate();
  const [technique, setTechnique] = useState('');
  const [stepIndex, setStepIndex]     = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const timerRef = useRef(null);

  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState([]);

  // Load existing sessions
  useEffect(() => {
    if (!user?.email) return;
    fetch(
      `http://localhost:5000/api/breathing-entries?email=${encodeURIComponent(
        user.email
      )}`
    )
      .then(res => res.json())
      .then(setHistory)
      .catch(console.error);
  }, [user?.email]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-advance steps
  useEffect(() => {
    if (!technique) return;
    const tech = TECHNIQUES.find(t => t.name === technique);
    const current = tech.steps[stepIndex];
    if (phaseSeconds >= current.duration) {
      clearInterval(timerRef.current);
      if (stepIndex < tech.steps.length - 1) {
        setStepIndex(i => i + 1);
        setPhaseSeconds(0);
      } else {
        // End of cycle
        clearInterval(timerRef.current);
      }
    }
  }, [phaseSeconds, stepIndex, technique]);

  // Start or restart phase timer
  useEffect(() => {
    clearInterval(timerRef.current);
    setPhaseSeconds(0);
    if (!technique) return;
    timerRef.current = setInterval(() => {
      setPhaseSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [technique, stepIndex]);

  const startTimer = () => {
    if (!technique) return;
    setStepIndex(0);
    setPhaseSeconds(0);
  };
  const pauseTimer = () => clearInterval(timerRef.current);
  const stopTimer = () => {
    clearInterval(timerRef.current);
    setPhaseSeconds(0);
    setStepIndex(0);
  };

  const saveSession = async () => {
    pauseTimer();
    if (!technique || phaseSeconds <= 0) {
      alert('Select a technique and run at least one phase before saving.');
      return;
    }
    const payload = {
      email: user.email,
      technique,
      duration: phaseSeconds,
      notes,
      date: new Date().toISOString(),
    };
    try {
      const res = await fetch('http://localhost:5000/api/breathing-entry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      const saved = await res.json();
      setHistory(h => [saved, ...h]);
      stopTimer();
      setNotes('');
    } catch {
      alert('Error saving session');
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/breathing-entry/${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error();
      setHistory(h => h.filter(e => e._id !== id));
    } catch {
      alert('Error deleting session');
    }
  };

  const tech = TECHNIQUES.find(t => t.name === technique) || { steps: [] };
  const current = tech.steps[stepIndex] || { label: '', duration: 0 };

  return (
    <div className="flex flex-col min-h-screen bg-[#fde4db] text-black">
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-xl font-semibold text-center">Breathe and Let Go!</h1>
        <p className="text-center text-gray-600 italic">
          Practice breathing exercises when you're feeling overwhelmed!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-64 h-64 rounded-full bg-green-200 flex flex-col items-center justify-center">
              <span className="text-lg text-gray-700 mb-1">{current.label}</span>
              <span className="text-4xl font-bold text-gray-800">{phaseSeconds}s</span>
            </div>
            <div className="space-x-4">
              <button onClick={startTimer} className="px-6 py-2 bg-[#AAD59E] text-white rounded-lg hover:bg-[#8bbd83] transition">Start</button>
              <button onClick={pauseTimer} className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition">Pause</button>
              <button onClick={stopTimer} className="px-6 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition">Stop</button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <label className="font-medium block mb-2">Technique</label>
              <select
                value={technique}
                onChange={e => setTechnique(e.target.value)}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">-- Select Technique --</option>
                {TECHNIQUES.map(t => (
                  <option key={t.name} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <label className="font-medium block mb-2">Notes (optional)</label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded p-2"
                placeholder="How did that feel?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <button onClick={saveSession} className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Save Session</button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 overflow-auto">
            <h2 className="mb-4 font-semibold">Session History</h2>
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Technique</th>
                  <th className="px-4 py-2 text-left">Duration (s)</th>
                  <th className="px-4 py-2 text-left">Notes</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {history.map((e, i) => (
                  <tr key={e._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm">{new Date(e.date).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm font-medium">{e.technique}</td>
                    <td className="px-4 py-2 text-sm">{e.duration}</td>
                    <td className="px-4 py-2 text-sm">{e.notes}</td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => handleDelete(e._id)} className="text-red-500 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
