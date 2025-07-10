import React from 'react';
import LanguageSwitcher from '../Layout/LanguageSwitcher';


export default function AuthCard({ title, children }) {
    return (
        <div className="max-w-md mx-auto mt-10">
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <LanguageSwitcher />
                </div>
                {children}
            </div>
        </div>
    );
};
