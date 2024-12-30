import { useEffect, useState } from "react";
import { debounce, set } from "lodash";
import axios from "axios";

export interface User {
  id: number;
  username: string;
  email: string;
  UserBoards?: {
    userId: number;
    boardId: number;
  }[];
}

export const UserSearchInput = ({ selectedBoard, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search users for autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUserSuggestions([]);
      return;
    }

    const fetchUsers = debounce(async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users/search`,
          { params: { searchQuery } }
        );
        setUserSuggestions(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }, 300);

    fetchUsers();
    return () => fetchUsers.cancel();
  }, [searchQuery]);

  const onSelect = (user: User) => {
    setSelectedUser(user);
    onSelectUser(user);
  };

  return (
    <>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for users..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <ul className="max-h-60 overflow-y-auto">
        {userSuggestions.map((suggestionUser) => {
          const isDisabled = suggestionUser.UserBoards.some(
            (userBoard) => userBoard.boardId === selectedBoard.id
          );
          const isSelected = suggestionUser.id === selectedUser?.id;
          return (
            <li key={suggestionUser.id} className="mb-2">
              <button
                disabled={isDisabled}
                onClick={() => onSelect(suggestionUser)} // Disable click if isDisabled is true
                className={`w-full text-left p-2 ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
              >
                {suggestionUser.username}
                {isDisabled && (
                  <span className="text-xs text-gray-500 ml-2">
                    (Already assigned)
                  </span>
                )}
                {isSelected && (
                  <span className="ml-2 text-green-500">✔</span> // Add a checkmark when selected
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
