import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck, FaClock } from 'react-icons/fa';
import { addToHistory, getFromLocalStorage, saveToLocalStorage, STORAGE_KEYS } from '../../utils/localStorage';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    // Load todos from localStorage
    const savedTodos = getFromLocalStorage('todos') || [];
    setTodos(savedTodos);
  }, []);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      priority,
      timestamp: new Date().toISOString()
    };

    const updatedTodos = [todo, ...todos];
    setTodos(updatedTodos);
    saveToLocalStorage('todos', updatedTodos);

    // Add to history
    addToHistory(STORAGE_KEYS.STUDY_HISTORY, {
      type: 'todo',
      content: `Added task: ${todo.text}`,
      priority: todo.priority
    });

    setNewTodo('');
    setPriority('medium');
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveToLocalStorage('todos', updatedTodos);
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveToLocalStorage('todos', updatedTodos);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-16">
      <h2 className="text-2xl font-bold mb-6">Todo List</h2>

      <form onSubmit={handleAddTodo} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaPlus />
            <span>Add Task</span>
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks yet. Add some tasks to get started!
          </div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    todo.completed
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {todo.completed && <FaCheck className="w-3 h-3" />}
                </button>
                <div className="flex-1">
                  <p className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {new Date(todo.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-4 text-red-500 hover:text-red-600 p-2"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList; 