import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';

const DashboardInput = (props) => (
     <input
        {...props}
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
);


export default function AddReadingForm({ token, onReadingAdded, apiUrl }) {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/readings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                },
                body: JSON.stringify({ systolic, diastolic, date }),
            });
            const data = await response.json();
            if (response.ok) {
                onReadingAdded(data.reading);
                setSystolic('');
                setDiastolic('');
            } else {
                setError(data.message || 'Failed to add reading.');
            }
        } catch (err) {
            setError('An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Reading</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <DashboardInput type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <DashboardInput type="number" value={systolic} onChange={(e) => setSystolic(e.target.value)} placeholder="Systolic (e.g., 120)" required />
                <DashboardInput type="number" value={diastolic} onChange={(e) => setDiastolic(e.target.value)} placeholder="Diastolic (e.g., 80)" required />
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 disabled:bg-indigo-300">
                    {loading ? 'Adding...' : 'Add Reading'}
                </button>
            </form>
        </div>
    );
}