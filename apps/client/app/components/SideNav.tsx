"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../contexts/authContext";

export default function SideNav() {
  const { user, logout } = useAuth(); // Access the user and logout function

  const [showDropdown, setShowDropdown] = useState(false);

  return !user ? null : (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="text-xl font-bold mb-6">Jam Board</div>

      {/* My Boards link */}
      <Link href="/boards" className="block py-2 px-4 hover:bg-gray-700">
        My Boards
      </Link>

      {/* User info and logout dropdown */}
      <div className="mt-4">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="block w-full text-left py-2 px-4 hover:bg-gray-700"
        >
          {user?.username}
        </button>

        {showDropdown && (
          <div className="absolute bg-gray-700 text-white rounded shadow-lg mt-2 py-2 w-48">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-600"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
