import React, { useState, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import AuthCard from '../components/Auth/AuthCard';
import AuthInput from '../components/Auth/AuthInput';
import AuthButton from '../components/Auth/AuthButton';

const API_URL = 'http://127.0.0.1:5001';

export default function RegisterPage({ goToLogin }) {
    const { t } = useContext(LanguageContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.status === 201) {
                setSuccess(t('registrationSuccess'));
                setEmail('');
                setPassword('');
                setTimeout(() => goToLogin(), 2000);
            } else {
                setError(data.message || t('registrationFailed'));
            }
        } catch (err) {
            setError(t('genericError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title={t('createAccount')}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                <AuthInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')} required />
                <AuthInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('passwordPlaceholder')} required />
                <AuthButton loading={loading}>{t('register')}</AuthButton>
                <p className="text-center text-sm text-gray-600">
                    {t('haveAccount')}{' '}
                    <button type="button" onClick={goToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                        {t('loginHere')}
                    </button>
                </p>
            </form>
        </AuthCard>
    );
}