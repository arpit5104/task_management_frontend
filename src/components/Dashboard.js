import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState(1);
    const [editingTaskId, setEditingTaskId] = useState(null); // For tracking the task being edited
    const [sortCriteria, setSortCriteria] = useState('priority'); // Default sorting criteria
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('https://task-management-backend-im0i.onrender.com/api/tasks', {
                headers: { Authorization: token }
            });
            setTasks(response.data);
        };
        fetchTasks();
    }, [token]);

    const handleAddOrUpdateTask = async (e) => {
        e.preventDefault();
        const taskData = { title, dueDate, priority };

        if (editingTaskId) {
            // Update existing task
            await axios.put(`https://task-management-backend-im0i.onrender.com/api/tasks/${editingTaskId}`, taskData, {
                headers: { Authorization: token }
            });
            setTasks(tasks.map(task => (task._id === editingTaskId ? { ...task, ...taskData } : task)));
            setEditingTaskId(null); // Reset editing state
        } else {
            // Add new task
            const response = await axios.post('https://task-management-backend-im0i.onrender.com/api/tasks', taskData, {
                headers: { Authorization: token }
            });
            setTasks([...tasks, response.data]);
        }

        resetForm();
    };

    const handleDeleteTask = async (id) => {
        await axios.delete(`https://task-management-backend-im0i.onrender.com/api/tasks/${id}`, {
            headers: { Authorization: token }
        });
        setTasks(tasks.filter(task => task._id !== id));
    };

    const resetForm = () => {
        setTitle('');
        setDueDate('');
        setPriority(1);
    };

    const startEditing = (task) => {
        setTitle(task.title);
        setDueDate(task.dueDate);
        setPriority(task.priority);
        setEditingTaskId(task._id); // Set the ID of the task being edited
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/'); // Redirect to login page
    };

    // Function to handle sorting
    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
    };

    // Function to get sorted tasks based on the selected criteria
    const getSortedTasks = () => {
        return [...tasks].sort((a, b) => {
            if (sortCriteria === 'priority') {
                return a.priority - b.priority; // Sort by priority
            } else if (sortCriteria === 'dueDate') {
                return new Date(a.dueDate) - new Date(b.dueDate); // Sort by due date
            }
            return 0;
        });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Dashboard</h2>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 mb-4 rounded hover:bg-red-600 transition duration-300">
                Logout
            </button>
            <form onSubmit={handleAddOrUpdateTask} className="mb-4 bg-white p-4 rounded shadow-md">
                <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title"
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                        <option value="4">Very High</option>
                        <option value="5">Extremely High</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300">
                    {editingTaskId ? 'Update Task' : 'Add Task'}
                </button>
            </form>
            <div className="mb-4">
                <label className="mr-2 text-gray-700">Sort by:</label>
                <select value={sortCriteria} onChange={handleSortChange} className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                </select>
            </div>
            <ul className="list-disc pl-5">
                {getSortedTasks().map((task) => (
                    <li key={task._id} className="flex justify-between items-center mb-2 bg-white p-2 rounded shadow hover:shadow-lg transition duration-300">
                        <span className="text-gray-700">{task.title} - {task.dueDate} - Priority: {task.priority}</span>
                        <div>
                            <button onClick={() => startEditing(task)} className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition duration-300 mr-2">Edit</button>
                            <button onClick={() => handleDeleteTask(task._id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition duration-300">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;