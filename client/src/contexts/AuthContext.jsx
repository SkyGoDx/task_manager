import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [status, setTaskStatus] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // console.log("local storage user =>>>>>>", user)
    if (user) {
      setUser(user)
      fetchUsers(user.token)
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsers(token);
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("User list response => ", response.data);
      setUserList(response.data.userList); // Assuming the response is an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCurrentUser = async (token) => {
    try {
      const response = await axios.get('/api/currentUser', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data); // Assuming the response contains the current user's info
    } catch (error) {
      // console.error("Error fetching current user:", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', credentials);
      const data = response.data;
      // console.log("token =>>>>>>", data);
      // localStorage.setItem('token', data.token);
      localStorage.setItem("user", JSON.stringify({ ...data.user, token: data.token }));
      setUser({ ...data.user, token: data.token }); // Assuming the login response contains the user info
      await fetchUsers(data.token); // Fetch the user list after logging in
      return [null, null];
    } catch (error) {
      // console.error("Error during login:", error);
      if (error.response && error.response.data.result === 0) {
        return [null, error.response.data.result]; // Not registered
      }
      return [error, null];
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setUserList([]); // Clear the user list on logout
  };

  const handleStatusChange = async (task, newStatus) => {
    // console.log(task, "taskkkkkkkkkkkkkkkkkkkkkkkkk")
    try {
      const res = await axios.put(`/api/tasks/${task.assignedTo._id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const data = await res.data;
      if (data.result === 1) {
        // console.log(data, "task status=>>>>>>>>>>")
        setTaskStatus(newStatus);
      }
    } catch (e) {
      console.log(e)
    }
  };

 
  // console.log({
  //   user,
  //   userList,
  // });

  return (
    <AuthContext.Provider value={{
      user,
      userList,
      login,
      logout,
      loading,
      status,
      handleStatusChange,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
