import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';


export default function ReadingsList({ readings, onDelete }) {
    if (readings.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <p className="text-gray-500">No readings recorded yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <h3 className="text-xl font-semibold text-gray-700 p-6">Recorded Readings</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Systolic</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diastolic</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Delete</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {readings.map((reading) => (
                            <tr key={reading.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(reading.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reading.systolic}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reading.diastolic}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onDelete(reading.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}