import axios from 'axios';
import React, { useState } from 'react'
import { useAuth } from '../contexts/authContext';
import { useParams } from 'next/navigation';

export const Modal = ({ selectedColumn, handleEdit, selectedTask, handleCloseModal, handleCreate }) => {
    const { user } = useAuth();
    const { boardId } = useParams();
    const [title, setTitle] = useState(selectedTask?.title ?? "")
    const [description, setDescription] = useState(selectedTask?.description ?? "")
    const isNew = selectedTask ? false : true
    const handleUpdate = async () => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/workItems`,
                {
                    ...selectedTask,
                    workItemId: selectedTask.id,
                    title,
                    description
                }
            );
            // Handle success (you can update the state with the response if needed)
            console.log('WorkItem status updated successfully:', response.data);
            handleEdit({
                ...selectedTask,
                title, description
            })
        } catch (error) {
            console.error("Error updating WorkItem status:", error);
        }
    }
    const handleCreateWorkItem = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/workItems`,
                {
                    title,
                    description,
                    status: selectedColumn,
                    boardId,
                    userId: user.id
                }
            );
            // Handle success (you can update the state with the response if needed)
            console.log('WorkItem status updated successfully:', response.data);
            handleCreate(response.data.workItem)
        } catch (error) {
            console.error("Error updating WorkItem status:", error);
        }
    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative">
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                    onClick={handleCloseModal}
                >
                    ×
                </button>

                {/* Modal Content */}
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                {/* Save Button */}
                {isNew ? <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                    onClick={handleCreateWorkItem}
                >
                    Create
                </button> : <button
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                    onClick={handleUpdate}
                >
                    Save
                </button>}
            </div>
        </div>
    )

}
