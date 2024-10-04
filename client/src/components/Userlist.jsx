import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserList = ({ onAssignTask, setForm }) => {
    let { userList, loading, user } = useAuth();
    useEffect(() => {
        // Fetch the user list when the component mounts (if needed)
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">User List</h2>
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="py-3 px-4 text-left">#</th>
                        <th className="py-3 px-4 text-left">Username</th>
                        <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user, index) => (
                        <tr key={user._id} className="border-b hover:bg-gray-100">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 text-mono text-bold">{user.username}</td>
                            <td className="py-3 px-4">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    onClick={() => setForm((prev) => ({...prev, state: true, user_id: user._id}))}
                                >
                                   Asign Task
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
