import React, { useContext } from 'react';
import { LanguageContext } from '../../contexts/LanguageContext';


export default function AuthButton({ loading, children }) {
    const { t } = useContext(LanguageContext);
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
            {loading ? t('processing') : children}
        </button>
    );
};
