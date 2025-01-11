import { Draggable } from "@hello-pangea/dnd";
import React from "react";

export const DraggableItem = ({ task, index, handleOpenModal }) => {
  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          onClick={() => handleOpenModal({ task })}
          className="bg-gray-50 hover:bg-gray-100 border rounded-lg p-3 mb-3 shadow-sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task?.title ? (
            <h1 className="text-lg font-semibold text-gray-800 truncate">
              {task.title}
            </h1>
          ) : (
            <h1 className="text-lg font-semibold text-gray-400"> No Title </h1>
          )}
          {task?.description ? (
            <p className="text-sm text-gray-600 mt-2 truncate">{task.description}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-2"> No Description </p>
          )}
        </div>
      )}
    </Draggable>
  );
};
