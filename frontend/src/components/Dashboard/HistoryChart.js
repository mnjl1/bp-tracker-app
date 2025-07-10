import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function HistoryChart({ readings }) {
    const { t } = useContext(LanguageContext);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{t('historyChart')}</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={readings.slice().reverse()} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                        <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="systolic" name={t('systolic')} stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="diastolic" name={t('diastolic')} stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
// This component renders a line chart using Recharts to visualize the history of blood pressure readings.