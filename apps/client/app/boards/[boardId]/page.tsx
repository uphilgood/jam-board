"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { Modal } from "../../components/Modal";

interface Task {
  id: number,
  title: string,
  description: string,
  status: WorkItemStatusEnum,
  boardId: number,
  createdBy: number,
  assignedTo: number,
  createdAt: string,
  updatedAt: string
}

enum WorkItemStatusEnum {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  QA = "QA",
  DONE = "DONE",
}

interface Column {
  id: string;
  status: WorkItemStatusEnum;
  title: string;
  tasks: Task[];
}

const initialColumns = [
  {
    id: "todo",
    status: WorkItemStatusEnum.TODO,
    title: "To Do",
    tasks: [],
  },
  {
    id: "in-progress",
    status: WorkItemStatusEnum.IN_PROGRESS,
    title: "In Progress",
    tasks: [],
  },
  {
    id: "qa",
    status: WorkItemStatusEnum.QA,
    title: "QA",
    tasks: [],
  },
  {
    id: "done",
    status: WorkItemStatusEnum.DONE,
    title: "Done",
    tasks: [],
  },
]

const JiraBoard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { boardId } = useParams();
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task>()
  const [selectedColumn, setSelectedColumn] = useState<WorkItemStatusEnum>();
  useEffect(() => {
    if (!user) {
      return router.push("/login");
    }
    const fetchBoards = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/boards/board?userId=${user.id}&boardId=${boardId}`
        );
        const newColumns = columns.map((column) => {
          return {
            ...column,
            tasks: response.data.workItems.filter((item) => item.status === column.status),
          };
        });
        setColumns(newColumns)
        // setWorkItems(response.data.workItems); // Set the work items to state
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };
    fetchBoards();
  }, [user, boardId, router]);

  const handleOpenModal = ({task, status}: {task?: Task, status?: WorkItemStatusEnum}) => {
    setSelectedColumn(status)
    setSelectedTask(task)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null)
  };

  const handleEdit = (updatedWorkItem) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === updatedWorkItem.id ? { ...task, ...updatedWorkItem } : task
        ),
      }))
    );
    handleCloseModal()
  };

  const handleCreate = (newWorkItem) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        // Check if the column matches the status of the new task
        if (column.status === newWorkItem.status) {
          return {
            ...column,
            tasks: [...column.tasks, newWorkItem], // Add the new task to the column's tasks
          };
        }
        return column; // No changes for other columns
      })
    );
    handleCloseModal()
  }

  const handleDelete = (workItemId) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== workItemId),
      }))
    );
    handleCloseModal()
  }

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;
  
    // If dropped outside the list
    if (!destination) return;
  
    const sourceColIndex = columns.findIndex((col) => col.id === source.droppableId);
    const destColIndex = columns.findIndex((col) => col.id === destination.droppableId);
  
    const sourceCol = columns[sourceColIndex];
    const destCol = columns[destColIndex];
  
    const sourceTasks = Array.from(sourceCol.tasks);
  
    if (sourceColIndex === destColIndex) {
      // Same column reordering
      const [removedTask] = sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, removedTask);
  
      const updatedColumns = [...columns];
      updatedColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
      setColumns(updatedColumns);
      return;
    }
  
    // Cross-column dragging
    const destTasks = Array.from(destCol.tasks);
  
    // Remove the dragged task from source
    const [removedTask] = sourceTasks.splice(source.index, 1);
    // Add the task to the new destination
    destTasks.splice(destination.index, 0, removedTask);
  
    // Ensure removedTask has a status property
    if (removedTask && removedTask.status !== undefined) {
      // Update the status of the task based on the new column
      removedTask.status = destCol.status;
    } else {
      console.error("Removed task does not have a valid status:", removedTask);
      return; // If no status, exit early to avoid errors
    }
  
    // Optimistically update the state
    const newColumns = [...columns];
    newColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
    newColumns[destColIndex] = { ...destCol, tasks: destTasks };
    setColumns(newColumns);
  
    // Now make the API call to update the status of the workItem
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/workItems`,
        {
          ...removedTask,
          workItemId: removedTask.id,
          status: destCol.status,
        }
      );
      console.log("WorkItem status updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating WorkItem status:", error);
  
      // If API call fails, revert the status change (optimistic update rollback)
      removedTask.status = sourceCol.status;
      const rollbackColumns = [...columns];
      rollbackColumns[sourceColIndex] = { ...sourceCol, tasks: sourceTasks };
      rollbackColumns[destColIndex] = { ...destCol, tasks: destTasks };
      setColumns(rollbackColumns);
    }
  };
  

  return (
    <div className="flex items-start gap-4 p-5 bg-gray-100 min-h-screen">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <div key={column.id} className="bg-white rounded-lg shadow-md w-72">
            <h2 className="bg-blue-500 text-white font-bold py-2 px-4 rounded-t-lg">
              {column.title}
            </h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  className="p-4 min-h-[150px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {column.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          onClick={() => handleOpenModal({task})}
                          className="bg-gray-50 hover:bg-gray-100 border rounded-lg p-3 mb-3 shadow-sm"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h1 className="text-lg font-semibold text-gray-800">{task.title}</h1>
                          <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  <div
                    onClick={() => handleOpenModal({status: column.status})}
                    className="bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 rounded-md p-2 mb-2 flex items-center justify-center cursor-pointer transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="ml-2 text-sm text-gray-500">Add Work Item</span>
                  </div>
                  {/* {provided.placeholder} */}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
      {isModalOpen ? <Modal selectedColumn={selectedColumn} handleEdit={handleEdit} selectedTask={selectedTask} handleCloseModal={handleCloseModal} handleCreate={handleCreate} handleDelete={handleDelete} /> : null}
    </div>
  );
};

export default JiraBoard;
