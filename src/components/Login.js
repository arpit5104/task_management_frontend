import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://task-management-backend-im0i.onrender.com/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token); // Store token in local storage
            alert("login successful, please click go to dashboard");
            navigate('/dashboard'); 
            
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-3xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="w-full max-w-sm">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="border p-2 mb-4 w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="border p-2 mb-4 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 w-full">Login</button>
            </form>
            <p className="mt-4">
                Don't have an account? 
                <button onClick={() => navigate('/signup')} className="text-blue-500 underline ml-1">
                    Sign Up
                </button>
            </p>
            <a href='/dashboard' className="text-blue-500 underline ml-1">Go to Dashboard</a>
        </div>
    );
};

export default Login;