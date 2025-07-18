import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-rose-50 w-full pt-16 pb-8">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <p className="text-gray-600 text-sm mb-4">
          © 2025 HealthMate. Empowering your journey to better health. All
          rights reserved.
        </p>
        <nav className="flex justify-center space-x-8 text-gray-600 text-sm">
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/community" className="hover:underline">
            Community
          </Link>
          <Link to="/help" className="hover:underline">
            Help
          </Link>
          <Link to="/settings" className="hover:underline">
            Settings
          </Link>
        </nav>
      </div>
    </footer>
  );
}
