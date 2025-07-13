import React, { useState, useEffect, useCallback, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { LanguageContext } from '../contexts/LanguageContext';
import AddReadingForm from '../components/Dashboard/AddReadingForm';
import ReadingsList from '../components/Dashboard/ReadingsList';
import HistoryChart from '../components/Dashboard/HistoryChart';
import LanguageSwitcher from '../components/Layout/LanguageSwitcher';

const API_URL = 'http://127.0.0.1:5001';

export default function DashboardPage({ token, onLogout }) {
    const { t } = useContext(LanguageContext);
    const [readings, setReadings] = useState([]);
    const [error, setError] = useState('');

    const fetchReadings = useCallback(async () => {
        setError('');
        try {
            const response = await fetch(`${API_URL}/readings`, {
                headers: { 'x-access-token': token },
            });
            if (response.ok) {
                const data = await response.json();
                setReadings(data);
            } else {
                if (response.status === 401) onLogout();
                const data = await response.json();
                setError(data.message || t('fetchReadingsFailed'));
            }
        } catch (err) {
            setError(t('fetchError'));
        }
    }, [token, onLogout, t]);

    useEffect(() => {
        fetchReadings();
    }, [fetchReadings]);

    const handleAddReading = (newReading) => {
        setReadings(prev => [newReading, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    };

    const handleDeleteReading = async (readingId) => {
        try {
            const response = await fetch(`${API_URL}/readings/${readingId}`, {
                method: 'DELETE',
                headers: { 'x-access-token': token },
            });
            if (response.ok) {
                setReadings(readings.filter(r => r.id !== readingId));
                toast.success(t('deleteSuccess'));
            } else {
                toast.error(t('deleteFailed'));
            }
        } catch (err) {
            toast.error(t('deleteError'));
        }
    };

    const askForDeleteConfirmation = (readingId) => {
        toast((toastInstance) => (
            <div className="flex flex-col items-center space-y-4">
                <span className="text-center">{t('deleteConfirmTitle')}</span>
                <div className="flex space-x-4">
                    <button
                        onClick={() => {
                            handleDeleteReading(readingId);
                            toast.dismiss(toastInstance.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        {t('confirm')}
                    </button>
                    <button
                        onClick={() => toast.dismiss(toastInstance.id)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                    >
                        {t('cancel')}
                    </button>
                </div>
            </div>
        ), {
            duration: 6000, // Keep the toast open longer for user interaction
        });
    };


    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">{t('dashboardTitle')}</h1>
                <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
                        {t('logout')}
                    </button>
                </div>
            </header>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <AddReadingForm token={token} onReadingAdded={handleAddReading} apiUrl={API_URL} />
                </div>
                <div className="lg:col-span-2">
                    <HistoryChart readings={readings} />
                </div>
            </div>

            <ReadingsList readings={readings} onDelete={askForDeleteConfirmation} />
        </div>
    );
}
