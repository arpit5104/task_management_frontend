import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null; // Check if user is authenticated
    };

    return (
        <Router>
            <div className="container mx-auto">
                <Routes>
                    <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;