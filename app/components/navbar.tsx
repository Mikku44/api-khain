import { useState, useEffect } from "react";
import { Link } from "react-router";
import { logoutUser } from "~/libs/firebase/auth";
import UserPopover from "./UserPopover";


export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Load user from localStorage
    const user = localStorage.getItem("currentUser");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) setCurrentUser(null);
  };

  return (
    <nav className=" fixed top-0 w-full z-10 ">
      <div className="max-w-[960px] mx-auto px-4 bg-white/70 border border-zinc-200 mt-2 rounded-xl">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className=" flex items-center gap-2">
            <div className="text-xl size-10 font-bold text-gray-800 dark:text-white">
              <img src="/khain.png" alt="khain logo" />
            </div>
            <div className="font-medium">API KHAIN</div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-6 items-center">


            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center space-x-4">
              
                {/* <Avatar.Root className={"Root"}>
                  <Avatar.Image
                   src={"currentUser.photoURL"} 
                    width="48"
                    height="48"
                    className={"Image"}
                  />
                  <Avatar.Fallback className={"Fallback"}>{currentUser.displayName?.slice(0, 3)}</Avatar.Fallback>
                </Avatar.Root> */}
                <UserPopover currentUser={currentUser}  />
             
               
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-[#111a22]">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#192633]">
            Home
          </Link>
          <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#192633]">
            About
          </Link>
          <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#192633]">
            Dashboard
          </Link>

          {currentUser ? (
            <div className="px-3 py-2">
              <div className="flex items-center space-x-2">
                <img src={currentUser.photoURL || "/default-avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full" />
                <span className="text-gray-700 dark:text-gray-200 text-sm">{currentUser.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md bg-primary text-white text-sm text-center hover:bg-primary-dark"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
