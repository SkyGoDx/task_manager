import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([]);
  const [status, setTaskStatus] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    // console.log({userCookie})
    if(userCookie) {
      const user = JSON.parse(userCookie);
      // console.log("local storage user =>>>>>>", user)
      if (user) {
        setUser(user)
        fetchUsers(user.token)
        // fetchCurrentUser(user.token);
      }
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
  
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', credentials);
      const data = response.data;
      // console.log("token =>>>>>>", data);
      // localStorage.setItem('token', data.token);
      Cookies.set("user", JSON.stringify({ ...data.user, token: data.token }), {
        expires: 1/24
      });
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
    Cookies.remove('user');
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
