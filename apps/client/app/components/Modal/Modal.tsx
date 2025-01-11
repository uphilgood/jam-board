import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useParams } from "next/navigation";
import { DeleteModal } from "./DeleteModal";
import { User, UserSearchInput } from "../UserSearchInput";
import { FaTimes } from "react-icons/fa";

export const Modal = ({
  selectedColumn,
  handleEdit,
  selectedTask,
  handleCloseModal,
  handleCreate,
  handleDelete,
}) => {
  const { user } = useAuth();
  const { boardId } = useParams();
  const [title, setTitle] = useState(selectedTask?.title ?? "");
  const [description, setDescription] = useState(
    selectedTask?.description ?? ""
  );
  const [assignedTo, setAssignedTo] = useState(
    selectedTask?.assignedTo ?? null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignedUsername, setAssignedUsername] = useState("");
  const [error, setError] = useState("")
  const isNew = selectedTask ? false : true;

  const fetchUser = async (user) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user}`
      );
      setAssignedUsername(response.data.user.username);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    console.log("assignedTo in modal", assignedTo);
    if (assignedTo) {
      fetchUser(assignedTo);
    }
  }, [assignedTo]);

  const handleUpdateWorkItem = async () => {
    try {
      setError("")
      const trimTitle = title.trim()
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/workItems`,
        {
          ...selectedTask,
          workItemId: selectedTask.id,
          title: trimTitle,
          description,
          assignedTo,
        }
      );
      // Handle success (you can update the state with the response if needed)
      console.log("WorkItem updated successfully:", response.data);
      handleEdit({
        ...selectedTask,
        title: trimTitle,
        description,
        assignedTo,
      });
    } catch (error) {
      setError(error.response.data.message)
      console.error("Error updating WorkItem status:", error);
    }
  };
  const handleCreateWorkItem = async () => {
    try {
      setError("")
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/workItems`,
        {
          title: title.trim(),
          description,
          status: selectedColumn,
          boardId,
          userId: user.id,
          assignedTo: assignedTo,
        }
      );
      // Handle success (you can update the state with the response if needed)
      console.log("WorkItem created successfully:", response.data);
      handleCreate(response.data.workItem);
    } catch (error) {
      setError(error.response.data.message)
      console.error("Error updating WorkItem status:", error);
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteWorkItem = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/workItems`,
        {
          data: { workItemId: selectedTask.id, userId: user.id },
        }
      );
      // Handle success (you can update the state with the response if needed)
      console.log("WorkItem removed successfully:", response.data);
      setIsDeleteModalOpen(false);
      handleDelete(selectedTask.id);
    } catch (error) {
      console.error("Error updating WorkItem status:", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
          onClick={handleCloseModal}
        >
          <FaTimes size="20" />
        </button>

        {/* Modal Content */}
        <h2 className="text-xl font-bold mb-4">
          {isNew ? "Add New Work Item" : "Edit Work Item"}
        </h2>
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-lg font-semibold text-gray-800 mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            maxLength={30}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 rounded-xl border-2 ${error ? "border-red-500 focus:border-red-500 focus:ring-red-300" : "border-gray-300 focus:border-blue-500 focus:ring-blue-300"
              } text-gray-800 placeholder-gray-500 transition duration-300 ease-in-out`}
            placeholder="Enter title (max 30 characters)"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 pl-3">{error}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-lg font-semibold text-gray-800 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            maxLength={250}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 text-gray-800 placeholder-gray-500 transition duration-300 ease-in-out"
            placeholder="Enter description (max 250 characters)"
            rows={5}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="assignedTo"
            className="block text-lg font-semibold text-gray-800 mb-2"
          >
            Assigned to
          </label>
          <div className="flex items-center mb-2">
            <span>{assignedUsername || "Not assigned"}</span>
          </div>
          <UserSearchInput
            selectedBoard={{ id: boardId }}
            onSelectUser={(user: User) => {
              setAssignedUsername(user.username);
              setAssignedTo(user.id);
            }}
          />
        </div>

        {/* Save Button */}
        {isNew ? (
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleCreateWorkItem}
          >
            Create
          </button>
        ) : (
          <div className="flex justify-end items-center gap-2">
            <button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
              onClick={handleUpdateWorkItem}
            >
              Save
            </button>
            <button
              className="p-2 text-red-500 hover:text-red-700"
              onClick={handleOpenDeleteModal}
              title="Delete"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {isDeleteModalOpen ? (
        <DeleteModal
          handleCancel={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDeleteWorkItem}
        />
      ) : null}
    </div>
  );
};