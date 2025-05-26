import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MainNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { name: 'Home', to: '/' },
    { name: 'Dashboard', to: '/dashboard' },
    { name: 'Log In', to: '/login' },
    { name: 'Sign Up', to: '/signup' },
    { name: 'Profile Update', to: '/profileUpdateInput' },
  ];

  return (
    <nav className="w-full bg-rose-50 shadow">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          HealthMate
        </Link>
        <ul className="hidden md:flex space-x-6 text-gray-700">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="hover:underline">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="md:hidden px-3 py-1 border rounded text-gray-800"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <ul className="md:hidden bg-white border-t border-gray-200">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}