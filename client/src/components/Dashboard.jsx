import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import TaskList from './TaskList';
import CreateTaskForm from './TaskForm';
import io from 'socket.io-client';
import UserList from './Userlist';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    state: false,
    user_id: null
  });
  const { user, status, comment } = useAuth();
//   console.log("current user ==?>>>>>>>>>>>.", user)

  const handleCreateTask = async (newTask) => {
    try {
      const response = await axios.post('/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }
//   console.log("task status", status)
  useEffect(() => {
    const socket = io('http://localhost:9000');
    // console.log("user object =>>", user)
    const fetchTasks = async () => {
      const response = await axios.get(`/api/tasks?id=${user._id}&role=${user.role}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setTasks(response.data);
    };

    fetchTasks();

    socket.on('taskUpdated', (updatedTask) => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    });

    return () => socket.disconnect();
  }, [form, user, status]);
  
  return (
    <div className="space-y-6">
      {
        user.role === "Admin"?  <UserList onAssignTask={handleCreateTask} setForm={setForm}/> : <></>
      }
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user.role === 'Admin' && form.state ? (
        <CreateTaskForm onCreateTask={handleCreateTask} setForm={setForm} userId={form.user_id}/>
    ) : (
        <></>
    )
}
      <TaskList tasks={tasks} />
    </div>
  );
};

export default Dashboard;