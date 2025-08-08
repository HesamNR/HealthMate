import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function blankContact() {
  return { name: '', phone: '', address: '', relationship: '' };
}

function normalizeContacts(list) {
  const arr = Array.isArray(list) ? [...list] : [];
  while (arr.length < 2) arr.push(blankContact());
  return arr;
}

export default function EditEmergencyContact({ user }) {
  const { index } = useParams();
  const idx = parseInt(index, 10) || 0;
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([blankContact(), blankContact()]);
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    address: '',
    relationship: '',
  });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/emergency-contacts?email=${encodeURIComponent(user.email)}`
        );
        if (res.ok) {
          const data = await res.json();
          const list = normalizeContacts(data);
          setContacts(list);
          setContact(list[idx] || blankContact());
        }
      } catch {
        const list = normalizeContacts([]);
        setContacts(list);
        setContact(list[idx]);
      }
    };
    fetchContacts();
  }, [idx, user]);

  useEffect(() => {
    const validPhone = /^\+?[0-9()\s-]{7,}$/.test(contact.phone);
    const valid =
      contact.name.trim() &&
      validPhone &&
      contact.address.trim() &&
      contact.relationship.trim();
    setIsValid(Boolean(valid));
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const newContacts = [...contacts];
    newContacts[idx] = contact;
    setContacts(newContacts);
    if (user?.email) {
      try {
        const validContacts = newContacts.filter(
          (c) =>
            c.name.trim() &&
            /^\+?[0-9()\s-]{7,}$/.test(c.phone) &&
            c.address.trim() &&
            c.relationship.trim()
        );
        await fetch('http://localhost:5000/api/emergency-contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, contacts: validContacts }),
        });
      } catch {
        // ignore errors
      }
    }
    navigate('/sos');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded space-y-6">
      <h2 className="text-center text-xl font-semibold">Edit Emergency Contact</h2>

      <div className="space-y-4">
        {[
          { key: 'name', label: 'Name' },
          { key: 'phone', label: 'Phone' },
          { key: 'address', label: 'Address' },
          { key: 'relationship', label: 'Relationship' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block font-semibold mb-1">{label}</label>
            <input
              name={key}
              value={contact[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
        ))}

        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleSave}
            disabled={!isValid}
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
    </div>
  );
}
