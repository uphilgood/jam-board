"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";

interface Board {
  id: number;
  name: string;
  description: string;
}

export default function BoardPage() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);
  const [newBoardName, setNewBoardName] = useState<string>("");
  const [newBoardDescription, setNewBoardDescription] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return router.push("/login");
    }

    // Fetch boards for the user
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/boards?userId=${user.id}`
        );
        setBoards(response.data.boards);
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, [user]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/boards`,
        {
          name: newBoardName,
          description: newBoardDescription,
          userId: user?.id,
        }
      );

      setBoards((prevBoards) => [...prevBoards, response.data.board]);
      setIsCreatingBoard(false);
      setNewBoardName("");
      setNewBoardDescription("");
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-white shadow-md fixed top-0 left-64 right-0 z-10">
          <h1 className="text-2xl font-bold">My Boards</h1>
          <button
            onClick={() => setIsCreatingBoard(!isCreatingBoard)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isCreatingBoard ? "Cancel" : "Create Board"}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 pt-24 p-8 overflow-y-auto">
          {isCreatingBoard && (
            <form
              onSubmit={handleCreateBoard}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">Create a New Board</h2>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="boardName"
                >
                  Board Name
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter board name"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="boardDescription"
                >
                  Description (optional)
                </label>
                <textarea
                  id="boardDescription"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter a short description (optional)"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Create Board
              </button>
            </form>
          )}

          {boards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {boards.map((board) => (
                <div
                onClick={() => router.push(`/boards/${board.id}`)}
                  key={board.id}
                  className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition break-words"
                >
                  <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
                  {board.description && (
                    <p className="text-sm text-gray-600">{board.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                You don't have any boards yet.
              </p>
              <button
                onClick={() => setIsCreatingBoard(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Create Your First Board
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
