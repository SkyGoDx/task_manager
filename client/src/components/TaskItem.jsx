import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TaskItem = ({ task }) => {
    const [comment, setComment] = useState("")
    const { user, handleStatusChange } = useAuth();

    const handleAddComment = async (e) => {
        await axios.post(`/api/tasks/${task._id}/comment`, { text: comment, username: user.username }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setComment('');
    };
    useEffect(() => {
        console.log("testing")
    }, [comment])
    return (
        <div className="bg-gray-100 p-4 mb-4 rounded">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-2">
                <button
                    onClick={() => handleStatusChange(task, 'Pending')}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-2"
                >
                    Pending
                </button>
                <button
                    onClick={() => handleStatusChange(task, 'In Progress')}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2"
                >
                    In Progress
                </button>
                <button
                    onClick={() => handleStatusChange(task, 'Completed')}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                >
                    Completed
                </button>
            </div>
            {/* Comments Section */}
            <div className="mt-4 border-t pt-4">
                <h4 className="text-lg font-semibold mb-4">Comments</h4>
                <div className="space-y-4">
                    {task.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-100 p-3 rounded-md shadow-sm">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-800">{comment.username}</p>
                                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-600">{comment.text}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddComment} className="mt-2" key={task._id}>
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        placeholder="Add a comment"
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskItem;