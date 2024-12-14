"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

// Type Definitions
type Card = {
  id: string;
  content: string;
};

type List = {
  id: string;
  title: string;
  cards: Card[];
};

// Sample Data
const initialData: List[] = [
  {
    id: "list-1",
    title: "To Do",
    cards: [
      { id: "card-1", content: "Create Next.js project" },
      { id: "card-2", content: "Add Tailwind CSS" },
      { id: "card-3", content: "Design UI components" },
    ],
  },
  {
    id: "list-2",
    title: "In Progress",
    cards: [
      { id: "card-4", content: "Develop Trello board" },
      { id: "card-5", content: "Style components" },
    ],
  },
  {
    id: "list-3",
    title: "QA Review",
    cards: [{ id: "card-7", content: "Testing project" }],
  },
  {
    id: "list-4",
    title: "Done",
    cards: [{ id: "card-6", content: "Deploy project" }],
  },
];

// Component
const Board: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchWorkItems = () => {
        setTimeout(() => {
            setLists(initialData)
        }, 1000);
    }
    fetchWorkItems()
  },[])
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // Exit if dropped outside the list
    if (!destination) return;

    const updatedLists = [...lists];
    const sourceList = updatedLists.find((list) => list.id === source.droppableId);
    const destList = updatedLists.find((list) => list.id === destination.droppableId);

    if (!sourceList || !destList) return;

    // Moving within the same list
    if (source.droppableId === destination.droppableId) {
      const reorderedCards = Array.from(sourceList.cards);
      const [movedCard] = reorderedCards.splice(source.index, 1);
      reorderedCards.splice(destination.index, 0, movedCard);
      sourceList.cards = reorderedCards;
    } else {
      // Moving between different lists
      const sourceCards = Array.from(sourceList.cards);
      const destCards = Array.from(destList.cards);

      const [movedCard] = sourceCards.splice(source.index, 1);
      destCards.splice(destination.index, 0, movedCard);

      sourceList.cards = sourceCards;
      destList.cards = destCards;
    }

    setLists(updatedLists);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Trello Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto">
          {lists.map((list) => (
            <Droppable key={list.id} droppableId={list.id} isDropDisabled={false} isCombineEnabled={true} ignoreContainerClipping={true}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-white w-72 rounded-lg shadow-lg p-4 flex flex-col"
                >
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">{list.title}</h2>
                  <div className="flex flex-col gap-3">
                    {list.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="bg-gray-200 p-4 rounded-lg shadow cursor-grab hover:bg-gray-300 transition duration-200"
                          >
                            <p className="text-gray-800">{card.content}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
