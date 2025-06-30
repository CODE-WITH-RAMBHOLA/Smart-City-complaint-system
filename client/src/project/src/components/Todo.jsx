import React from 'react';
import { FaTrash, FaCheck } from 'react-icons/fa';

const Todo = ({ todo, onToggle, onDelete }) => {
  const priorityColors = {
    high: 'bg-red-100 border-red-300',
    medium: 'bg-yellow-100 border-yellow-300',
    low: 'bg-green-100 border-green-300'
  };

  const priorityTextColors = {
    high: 'text-red-700',
    medium: 'text-yellow-700',
    low: 'text-green-700'
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-2 rounded-lg border ${priorityColors[todo.priority]} transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center space-x-4 flex-grow">
        <button
          onClick={() => onToggle(todo.id)}
          className={`p-2 rounded-full transition-colors duration-300 ${
            todo.completed
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          <FaCheck className="w-4 h-4" />
        </button>
        
        <div className="flex flex-col flex-grow">
          <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.text}
          </span>
          <div className="flex items-center space-x-2 text-sm">
            <span className={`font-medium ${priorityTextColors[todo.priority]}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
            </span>
            <span className="text-gray-500">
              {new Date(todo.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="p-2 text-red-500 hover:text-red-700 transition-colors duration-300"
      >
        <FaTrash className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Todo; 