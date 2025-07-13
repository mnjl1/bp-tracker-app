import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
    return (
        <LanguageProvider>
            <MainApp />
        </LanguageProvider>
    );
}

function MainApp() {
    const [page, setPage] = useState('login');
    const [token, setToken] = useState(localStorage.getItem('bp_tracker_token'));

    useEffect(() => {
        const currentToken = localStorage.getItem('bp_tracker_token');
        setToken(currentToken);
        if (currentToken) {
            setPage('dashboard');
        } else {
            setPage('login');
        }
    }, []);

    const handleLoginSuccess = (newToken) => {
        localStorage.setItem('bp_tracker_token', newToken);
        setToken(newToken);
        setPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('bp_tracker_token');
        setToken(null);
        setPage('login');
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {page === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} goToRegister={() => setPage('register')} />}
                {page === 'register' && <RegisterPage goToLogin={() => setPage('login')} />}
                {page === 'dashboard' && token && <DashboardPage token={token} onLogout={handleLogout} />}
            </div>
        </div>
    );
}