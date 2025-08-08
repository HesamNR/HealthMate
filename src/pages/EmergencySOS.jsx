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

export default function EmergencySOS({ user }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([blankContact(), blankContact()]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user?.email) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/emergency-contacts?email=${encodeURIComponent(
            user.email
          )}`
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

  const handleCall911 = () => {
    const confirmed = window.confirm('Are you sure you want to call 911?');
    if (confirmed) {
      window.location.href = 'tel:911';
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {/* 911 Button */}
      <button
        onClick={handleCall911}
        className="w-full py-4 text-white text-xl font-bold rounded shadow"
        style={{ backgroundColor: 'red' }}
      >
        PRESS TO CONTACT 911 SERVICES
      </button>

      {/* Medical Info Button */}
      <div className="flex justify-between items-center bg-gray-100 p-3 rounded shadow cursor-pointer" onClick={() => navigate('/medical-info')}>
        <span className="text-lg font-semibold">Emergency Medical Information</span>
        <span className="text-2xl">▶</span>
      </div>

      {/* Contacts Header */}
      <div className="text-red-600 font-semibold">
        Emergency Contacts <span className="text-sm italic text-gray-500">*will be notified in case of emergency</span>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start border rounded p-3 shadow-sm bg-white relative">
            {/* Icon */}
            <div className="text-4xl text-gray-400 mr-4">👤</div>

            {/* Contact Info */}
            <div className="flex-1 space-y-1 text-sm">
              <div><span className="font-semibold">Name:</span> {contact.name}</div>
              <div><span className="font-semibold">Phone:</span> {contact.phone}</div>
              <div><span className="font-semibold">Address:</span> {contact.address}</div>
              <div><span className="font-semibold">Relationship:</span> {contact.relationship}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full py-2 rounded bg-blue-200 hover:bg-blue-300"
        onClick={() => navigate('/contacts')}
      >
        Manage Contacts
      </button>
    </div>
  );
}
