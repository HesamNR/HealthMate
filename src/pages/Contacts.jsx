import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function blankContact() {
  return { name: '', phone: '', address: '', relationship: '' };
}

function normalizeContacts(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  while (arr.length < 2) arr.push(blankContact());
  return arr;
}

export default function Contacts({ user }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([blankContact(), blankContact()]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/emergency-contacts?email=${encodeURIComponent(user.email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setContacts(normalizeContacts(data));
        }
      } catch {
        setContacts(normalizeContacts([]));
      }
    };
    fetchContacts();
  }, [user]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setContacts((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [name]: value } : c))
    );
  };

  const handleAdd = () => {
    setErrorMsg('');
    setContacts((prev) => [...prev, blankContact()]);
  };

  const handleDelete = (index) => {
    if (contacts.length <= 2) {
      setErrorMsg('A minimum of two contact slots are required.');
      return;
    }
    setErrorMsg('');
    setContacts((prev) => prev.filter((_, i) => i !== index));
  };

  const phoneRegex = /^\+?[0-9()\s-]{7,}$/;
  const allValid = contacts.every(
    (c) =>
      c.name.trim() &&
      phoneRegex.test(c.phone) &&
      c.address.trim() &&
      c.relationship.trim()
  );

  const handleSave = async () => {
    const validContacts = contacts.filter(
      (c) =>
        c.name.trim() &&
        phoneRegex.test(c.phone) &&
        c.address.trim() &&
        c.relationship.trim()
    );
    if (user?.email) {
      try {
        await fetch('http://localhost:5000/api/emergency-contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, contacts: validContacts }),
        });
      } catch {
        // ignore
      }
    }
    navigate('/sos');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded shadow">
      <h2 className="text-center text-xl font-semibold">Update Emergency Contacts</h2>

      {contacts.map((contact, idx) => (
        <div key={idx} className="bg-gray-50 rounded shadow px-4 py-4 space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold bg-green-100 text-gray-700 px-2 py-1 rounded-t w-max">
              Contact {idx + 1}
            </div>
            {contacts.length > 2 && (
              <button
                onClick={() => handleDelete(idx)}
                className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition text-sm font-medium"
              >
                <span className="text-lg">❌</span> Delete
              </button>
            )}
          </div>

          <div className="flex space-x-4 items-start">
            <div className="text-4xl text-gray-400">👤</div>
            <div className="flex-1 grid grid-cols-4 gap-2 items-center">
              {['name', 'phone', 'address', 'relationship'].map((key) => (
                <React.Fragment key={key}>
                  <label className="font-semibold col-span-1 capitalize">
                    {key}
                  </label>
                  <input
                    name={key}
                    value={contact[key]}
                    onChange={(e) => handleChange(idx, e)}
                    className={`col-span-3 w-full border rounded p-2 ${
                      key === 'phone' && contact[key] && !phoneRegex.test(contact[key])
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ))}

      {errorMsg && (
        <div className="text-red-600 text-sm font-semibold">{errorMsg}</div>
      )}

      <div className="flex space-x-4 pt-4">
        <button onClick={handleAdd} className="px-4 py-2 rounded bg-blue-200">
          Add Contact
        </button>
        <button
          onClick={handleSave}
          disabled={!allValid}
          className="px-4 py-2 rounded bg-green-500 text-white disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={() => navigate('/sos')}
          className="px-4 py-2 rounded bg-gray-200"
        >
          Back
        </button>
      </div>
    </div>
  );
}
