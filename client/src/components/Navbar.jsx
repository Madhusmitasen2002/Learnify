import React, { useState, useEffect, useContext, useRef } from "react";
import { Sun, Moon, Menu, X, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Authcontext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 transition-colors duration-300 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-blue-600 cursor-pointer select-none dark:text-blue-400"
        >
          Learnify.
        </div>

        {/* Desktop Menu */}
        <ul className="hidden space-x-8 font-medium text-gray-700 md:flex dark:text-gray-200">
          <li><Link to="/" className="transition hover:text-blue-500">Home</Link></li>
          <li><Link to="/courses" className="transition hover:text-blue-500">Courses</Link></li>
          <li><Link to="/about" className="transition hover:text-blue-500">About</Link></li>
          <li><Link to="/contact" className="transition hover:text-blue-500">Contact</Link></li>
        </ul>

        {/* Desktop Right Side */}
        <div className="items-center hidden gap-4 md:flex">
          <button
            onClick={toggleTheme}
            className="p-2 transition bg-gray-100 rounded-full dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>

          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-blue-500 transition border border-blue-500 rounded-md dark:text-blue-400 hover:bg-blue-500 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="w-4 h-4" />
                {user.name || "Profile"}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 w-48 mt-2 bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    My Profile
                  </Link>
                  {user.role === "instructor" && (
                    <Link
                      to="/instructor-dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      Instructor Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-left text-red-600 transition hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-100 rounded-full dark:bg-gray-800"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 text-gray-700 transition rounded-md dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      {isOpen && (
        <div className="px-6 pb-4 space-y-3 font-medium text-gray-700 border-t md:hidden dark:text-gray-200 dark:border-gray-700">
          <Link to="/" className="block transition hover:text-blue-500" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/courses" className="block transition hover:text-blue-500" onClick={() => setIsOpen(false)}>Courses</Link>
          <Link to="/about" className="block transition hover:text-blue-500" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="block transition hover:text-blue-500" onClick={() => setIsOpen(false)}>Contact</Link>

          {!user ? (
            <div className="pt-2 space-y-2">
              <Link
                to="/login"
                className="block px-4 py-2 text-center text-blue-500 border border-blue-500 rounded-md dark:text-blue-400 hover:bg-blue-500 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 text-center text-white bg-blue-500 rounded-md hover:bg-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-2 space-y-2">
              <Link to="/profile" className="block transition hover:text-blue-500" onClick={() => setIsOpen(false)}>My Profile</Link>
              {user.role === "instructor" && (
                <Link to="/instructor-dashboard" className="block transition hover:text-blue-500" onClick={() => setIsOpen(false)}>Instructor Dashboard</Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-center text-red-600 border border-red-500 rounded-md hover:bg-red-500 hover:text-white dark:text-red-400 dark:border-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
