"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";
import { useRouter } from "next/navigation";
import { FaUserPlus, FaTrashAlt, FaUsers } from "react-icons/fa";
import { DeleteModal } from "../components/DeleteModal";
import { User, UserSearchInput } from "../components/UserSearchInput";
import { Tooltip } from "react-tooltip";

interface Board {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  Users: {
    id: number;
    username: string;
    email: string;
  }[]
  UserBoards: {
    id: number;
    userId: number;
    boardId: number;
    role: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export default function BoardPage() {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);
  const [newBoardName, setNewBoardName] = useState<string>("");
  const [newBoardDescription, setNewBoardDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState<boolean>(false);
  const [selectedBoard, setSelectedBoard] = useState<Board>();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
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
    }
  }, [user]);

  const handleOpenModal = (e: React.MouseEvent, board) => {
    e.stopPropagation();
    setIsModalOpen(true);
    setSelectedBoard(board);
  };

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

  const handleDeleteConfirmationModal = (e: React.MouseEvent, board: Board) => {
    e.stopPropagation();
    setSelectedBoard(board);
    setIsDeleteConfirmationModalOpen(true);
  };

  const handleCancel = () => {
    setSelectedBoard(null);
    setIsDeleteConfirmationModalOpen(false);
  };

  const handleDeleteBoard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
        data: { boardId: selectedBoard.id, userId: user.id },
      });
      setBoards((prevBoards) =>
        prevBoards.filter((board) => board.id !== selectedBoard.id)
      );
      setIsDeleteConfirmationModalOpen(false);
      console.log("Board deleted successfully");
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  const handleAddUserToBoard = async (selectedUser: User) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/userBoards`, {
        boardId: selectedBoard.id,
        username: selectedUser.username,
      });
      console.log("User added successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding user to board:", error);
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
                  className="bg-white cursor-pointer shadow-md rounded-lg p-4 hover:shadow-xl transition break-words flex flex-col justify-between h-full"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
                    <FaUsers
                      className="text-gray-600 hover:text-gray-900 cursor-pointer"
                      data-tooltip-id={`users-tooltip-${board.id}`}
                    />

                    <Tooltip
                      id={`users-tooltip-${board.id}`}
                      place="bottom"
                      className="max-w-xs p-2 text-sm text-gray-100 bg-gray-800 rounded-lg"
                    >
                      {board.Users.length > 0
                        ? board.Users.map((user) => <p>{user.username}</p>) 
                        : "No users assigned"}
                    </Tooltip>
                  </div>
                  <p className="text-sm text-gray-600 mb-12">
                    {board?.description ?? "No Descriptions"}
                  </p>

                  {/* Always show icons at the bottom */}
                  {board.ownerId === user?.id && (
                    <div className="flex items-center mt-4 space-x-2 mt-auto">
                      <button
                        onClick={(e) => handleOpenModal(e, board)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                      >
                        <FaUserPlus className="text-lg" />
                      </button>

                      <button
                        onClick={(e) => handleDeleteConfirmationModal(e, board)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                      >
                        <FaTrashAlt className="text-lg" />
                      </button>
                    </div>
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

      {/* Modal for Adding User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Add User to Board</h3>
            <UserSearchInput
              selectedBoard={selectedBoard}
              onSelectUser={setSelectedUser}
            />
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddUserToBoard(selectedUser);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Add User
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isDeleteConfirmationModalOpen && (
        <DeleteModal
          handleCancel={handleCancel}
          handleDelete={handleDeleteBoard}
        />
      )}
    </div>
  );
}
