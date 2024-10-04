import React, { useState } from 'react';
// import Modal from './Modal';

const TaskForm = ({ onCreateTask, setForm, userId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    // console.log(userId, "=->>>>>>>>>>>>>>>>>>")
    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateTask({ title, description, assignedTo: userId });
        setTitle('');
        setDescription('');
        setForm((prev) => ({...prev, state: false, user_id: ""}))
    };

    return (
        // <Modal>
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" ></div>
            <div className="bg-white rounded-lg shadow-lg z-10 overflow-hidden w-1/3">
                <div className="p-4 border-b">
                    <button className="text-gray-500" onClick={() => setForm((prev) => ({...prev, state: false}))}>
                        &times; {/* Close button */}
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 px-2 py-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                rows="3"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assign To (User ID)</label>
                            <input
                                type="text"
                                id="assignedTo"
                                value={userId}
                                disabled={true}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                            Create Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskForm;