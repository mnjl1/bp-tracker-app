import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import AuthCard from '../components/Auth/AuthCard';
import AuthInput from '../components/Auth/AuthInput';
import AuthButton from '../components/Auth/AuthButton';

const API_URL = 'http://127.0.0.1:5001';

export default function LoginPage({ onLoginSuccess, goToRegister }) {
    const { t } = useContext(LanguageContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                onLoginSuccess(data.token);
            } else {
                setError(data.message || t('loginFailed'));
            }
        } catch (err) {
            setError(t('genericError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title={t('welcomeBack')}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <AuthInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} required />
                <AuthInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')} required />
                <AuthButton loading={loading}>{t('login')}</AuthButton>
                <p className="text-center text-sm text-gray-600">
                    {t('noAccount')}{' '}
                    <button type="button" onClick={goToRegister} className="font-medium text-indigo-600 hover:text-indigo-500">
                        {t('registerHere')}
                    </button>
                </p>
            </form>
        </AuthCard>
    );
}
