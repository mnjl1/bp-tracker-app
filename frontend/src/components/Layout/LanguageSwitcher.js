import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';


export default function LanguageSwitcher() {
    const { language, setLanguage } = useContext(LanguageContext);
    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => setLanguage('en')} className={`px-3 py-1 text-sm rounded-md ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EN</button>
            <button onClick={() => setLanguage('ua')} className={`px-3 py-1 text-sm rounded-md ${language === 'ua' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>UA</button>
        </div>
    );
};