import { Link, useLocation } from "react-router-dom";
import { FaBitcoin } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 px-6 py-5 flex justify-between items-center transition-all duration-300
        ${isScrolled
          ? "bg-white/20 dark:bg-gray-800/30 backdrop-blur-lg border-b border-white/10 shadow-lg"
          : " bg-white dark:bg-gray-800 shadow-md"
        }`}
    >
      {/* Left - Logo */}
<Link to="/" className="flex items-center gap-2">
  <FaBitcoin className="text-yellow-500 text-2xl" />
  <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
    CryptoDash
  </span>
</Link>


      {/* Right - Links */}
      <div className="flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`relative font-medium  right-5 transition-colors duration-200 ${
              location.pathname === link.path
                ? "text-blue-500"
                : "text-gray-950 dark:text-gray-200 hover:text-black"
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
