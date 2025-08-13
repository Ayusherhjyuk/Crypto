// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { FaBitcoin } from "react-icons/fa"; // crypto icon

export default function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Markets", path: "/markets" }, // example extra page
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <FaBitcoin className="text-yellow-500 text-2xl" />
        <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
          CryptoDash
        </span>
      </div>

      {/* Right - Links */}
      <div className="flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative font-medium transition-colors duration-200 ${
              location.pathname === link.path
                ? "text-blue-500"
                : "text-gray-700 dark:text-gray-200 hover:text-blue-400"
            }`}
          >
            {link.name}
            {location.pathname === link.path && (
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-500 rounded-full"></span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
