import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link to="/dashboard" className="text-white font-bold text-xl">Task Manager</Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link
                                    to="/dashboard"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="ml-4 flex items-center md:ml-6"> {/* Removed hidden class */}
                        <span className="text-gray-300 mr-4">{user?.username.toUpperCase()}</span>
                        {(location.pathname === "/login" || location.pathname === "/register")? (
                            ""
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
