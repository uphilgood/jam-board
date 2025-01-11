import React from 'react';

export const DeleteModal = ({ handleCancel, handleDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">Are you sure?</h3>
        <p className="text-sm text-gray-600 mb-8">Do you really want to delete? This action cannot be undone.</p>
        <div className="flex justify-end space-x-6">
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 font-semibold p-3 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
