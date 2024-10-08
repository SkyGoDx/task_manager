import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MdDeleteOutline } from "react-icons/md";

const TaskItem = ({ task }) => {
    const { user, handleStatusChange, handelComment, loading, setComment, handelDeleteComment } = useAuth();
    const [taskButton, setTaskbuttons] = useState(null);
    // console.log({task})
    useEffect(() => {
        setTaskbuttons(task.assignedTo._id !== user._id);
    }, [task.assignedTo._id, user._id]);


    return (
        <div className="bg-gray-100 p-4 mb-4 rounded">
            <h1 className="font-semibold bg-blue-400 rounded-sm font-mono px-2 py-1 uppercase text-white">
                {task.assignedTo.username}
            </h1>
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <div className="mt-2">
                <button
                    disabled={taskButton}
                    onClick={() => handleStatusChange(task, 'Pending')}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs mr-2"
                >
                    Pending
                </button>
                <button
                    disabled={taskButton}
                    onClick={() => handleStatusChange(task, 'In Progress')}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2"
                >
                    In Progress
                </button>
                <button
                    disabled={taskButton}
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
                            <div className="flex justify-between items-center gap-1">
                                <p className="text-sm font-medium text-gray-800 flex-1">{comment.username}</p>
                                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                {
                                    comment.username === user.username ?
                                        <span className="text-red-500 cursor-pointer">
                                            <MdDeleteOutline
                                                disabled={taskButton}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handelDeleteComment(comment._id, task._id)
                                                }} />
                                        </span> : ""}
                            </div>
                            <p className="text-sm text-gray-600">{comment.text}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => (
                    e.preventDefault(),
                    handelComment(task._id),
                    e.target.reset()
                )
                } className="mt-2" key={task._id}>
                    <input
                        type="text"
                        onChange={(e) => setComment(
                            (prev) =>
                            ({
                                ...prev,
                                [task._id]: e.target.value
                            }
                            ))
                        }
                        className="border rounded px-2 py-1 w-full text-gray-600 font-mono font-bold"
                        placeholder="Add a comment"
                    />
                    <button
                        disabled={loading}
                        type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                        Add Comment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskItem;