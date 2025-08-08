import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function emptyInfo() {
  return {
    name: '',
    phone: '',
    address: '',
    allergies: '',
    conditions: '',
    implants: '',
    notes: '',
  };
}

export default function EmergencyMedicalInfo({ user, profile, setProfile }) {
  const [info, setInfo] = useState(emptyInfo());
  const [form, setForm] = useState(info);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/medical-info?email=${encodeURIComponent(user.email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setInfo({ ...emptyInfo(), ...data });
          setForm({ ...emptyInfo(), ...data });
          return;
        }
      } catch {
        // ignore
      }

      const fromProfile = {
        name: profile?.name || '',
        phone: profile?.phone || '',
        address: profile?.location || '',
      };
      setInfo({ ...emptyInfo(), ...fromProfile });
      setForm({ ...emptyInfo(), ...fromProfile });
    };

    fetchInfo();
  }, [user, profile]);

  useEffect(() => {
    setForm(info);
  }, [info]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    if (user?.email) {
      try {
        await fetch('http://localhost:5000/api/medical-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, ...form }),
        });

        await fetch('http://localhost:5000/update-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            name: form.name,
            location: form.address,
          }),
        });

        if (setProfile) {
          setProfile((p) =>
            p ? { ...p, name: form.name, location: form.address } : p
          );
        }
      } catch {
        // ignore
      }
    }

    setInfo(form);
    setEditing(false);
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(info);
  const isValid = form.name.trim() && form.address.trim();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-center text-xl font-semibold">
        Emergency Medical Information
      </h2>

      {!editing ? (
        <>
          {/* View Mode */}
          <div className="flex space-x-4 items-start bg-pink-50 p-4 rounded">
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full text-3xl text-gray-500">
              👤
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Name', value: info.name },
                { label: 'Phone', value: info.phone },
                { label: 'Address', value: info.address },
              ].map(({ label, value }) => (
                <div key={label} className="border rounded px-3 py-2 bg-white">
                  <span className="font-semibold">{label}:</span> {value}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded space-y-2">
            {[
              { label: 'Allergies', value: info.allergies },
              { label: 'Health Conditions', value: info.conditions },
              { label: 'Implants', value: info.implants },
              { label: 'Other', value: info.notes },
            ].map(({ label, value }) => (
              <div key={label} className="border rounded px-3 py-2 bg-white">
                <span className="font-semibold">{label}:</span> {value}
              </div>
            ))}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              className="px-6 py-2 rounded bg-green-500 text-white"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/sos')}
              className="px-6 py-2 rounded bg-green-200"
            >
              Back
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Edit Mode */}
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'address', label: 'Address' },
              { key: 'allergies', label: 'Allergies' },
              { key: 'conditions', label: 'Health Conditions' },
              { key: 'implants', label: 'Implants' },
              { key: 'notes', label: 'Other Notes' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block font-semibold mb-1">{label}</label>
                {key === 'notes' ? (
                  <textarea
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                ) : (
                  <input
                    name={key}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                )}
                {errors[key] && (
                  <p className="text-red-500 text-sm">{errors[key]}</p>
                )}
              </div>
            ))}

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSave}
                disabled={!hasChanges || !isValid}
                className="px-6 py-2 rounded bg-green-500 text-white disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => navigate('/sos')}
                className="px-6 py-2 rounded bg-gray-200"
              >
                Back
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
