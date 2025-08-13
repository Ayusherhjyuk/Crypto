// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";



export default function Navbar() {

  const location = useLocation();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left - Links */}
      <div className="flex space-x-6">
        <Link
          to="/"
          className={`font-semibold ${
            location.pathname === "/" ? "text-blue-500" : "text-gray-700 dark:text-gray-200"
          } hover:text-blue-400`}
        >
          Dashboard
        </Link>
        <Link
          to="/portfolio"
          className={`font-semibold ${
            location.pathname === "/portfolio" ? "text-blue-500" : "text-gray-700 dark:text-gray-200"
          } hover:text-blue-400`}
        >
          Portfolio
        </Link>
      </div>


    </nav>
  );
}
