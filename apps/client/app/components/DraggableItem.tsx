import { Draggable } from '@hello-pangea/dnd'
import React from 'react'

export const DraggableItem = ({ task, index, handleOpenModal }) => {
  return (
    <Draggable
      key={task.id}
      draggableId={task.id.toString()}
      index={index}
    >
      {(provided) => (
        <div
          onClick={() => handleOpenModal({ task })}
          className="bg-gray-50 hover:bg-gray-100 border rounded-lg p-3 mb-3 shadow-sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h1 className="text-lg font-semibold text-gray-800">
            {task.title || "Title"}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {task.description || "Description"}
          </p>
        </div>
      )}
    </Draggable>
  )
}
