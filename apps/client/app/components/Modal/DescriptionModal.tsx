import React from 'react'
import { FaTimes } from 'react-icons/fa'


export const DescriptionModal = ({isOpen, handleCloseModal, description}) => {
    return isOpen ?
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
        Description
      </h2>
      <p className="text-xl font-medium text-gray-700 break-words mb-4">
  {description || "No Description"}
</p>
  
  
    </div>
  </div> : null
  }
