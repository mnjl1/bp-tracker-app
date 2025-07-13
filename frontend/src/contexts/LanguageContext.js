import React, { createContext, useState } from 'react';



export const translations = {
    en: {
        // Auth
        welcomeBack: 'Welcome Back!',
        createAccount: 'Create Your Account',
        emailPlaceholder: 'Email Address',
        passwordPlaceholder: 'Password',
        login: 'Login',
        register: 'Register',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        registerHere: 'Register here',
        loginHere: 'Login here',
        processing: 'Processing...',
        // Auth Messages
        loginFailed: 'Login failed. Please check your credentials.',
        genericError: 'An error occurred. Please try again later.',
        registrationSuccess: 'Registration successful! You can now log in.',
        registrationFailed: 'Registration failed.',
        // Dashboard
        dashboardTitle: 'Blood Pressure Dashboard',
        logout: 'Logout',
        fetchReadingsFailed: 'Failed to fetch readings.',
        fetchError: 'An error occurred while fetching data.',
        addNewReading: 'Add New Reading',
        systolicPlaceholder: 'Systolic (e.g., 120)',
        diastolicPlaceholder: 'Diastolic (e.g., 80)',
        addReading: 'Add Reading',
        adding: 'Adding...',
        addReadingFailed: 'Failed to add reading.',
        historyChart: 'History Chart',
        noReadings: 'No readings recorded yet. Add one to get started!',
        recordedReadings: 'Recorded Readings',
        date: 'Date',
        systolic: 'Systolic',
        diastolic: 'Diastolic',
        delete: 'Delete',
        deleteFailed: 'Failed to delete reading.',
        deleteError: 'An error occurred while deleting.',
        deleteSuccess: 'Reading successfully deleted.',
        deleteConfirmTitle: 'Are you sure you want to delete this reading?',
        confirm: 'Confirm',
        cancel: 'Cancel',
    },
    ua: {
        // Auth
        welcomeBack: 'Ласкаво просимо!',
        createAccount: 'Створити обліковий запис',
        emailPlaceholder: 'Електронна адреса',
        passwordPlaceholder: 'Пароль',
        login: 'Увійти',
        register: 'Зареєструватися',
        noAccount: 'Немає облікового запису?',
        haveAccount: 'Вже є обліковий запис?',
        registerHere: 'Зареєструйтесь тут',
        loginHere: 'Увійдіть тут',
        processing: 'Обробка...',
        // Auth Messages
        loginFailed: 'Помилка входу. Перевірте свої дані.',
        genericError: 'Сталася помилка. Спробуйте ще раз пізніше.',
        registrationSuccess: 'Реєстрація успішна! Тепер ви можете увійти.',
        registrationFailed: 'Помилка реєстрації.',
        // Dashboard
        dashboardTitle: 'Панель артеріального тиску',
        logout: 'Вийти',
        fetchReadingsFailed: 'Не вдалося завантажити записи.',
        fetchError: 'Сталася помилка під час завантаження даних.',
        addNewReading: 'Додати новий запис',
        systolicPlaceholder: 'Систолічний (напр., 120)',
        diastolicPlaceholder: 'Діастолічний (напр., 80)',
        addReading: 'Додати запис',
        adding: 'Додавання...',
        addReadingFailed: 'Не вдалося додати запис.',
        historyChart: 'Графік історії',
        noReadings: 'Ще немає записів. Додайте перший, щоб почати!',
        recordedReadings: 'Збережені записи',
        date: 'Дата',
        systolic: 'Систолічний',
        diastolic: 'Діастолічний',
        delete: 'Видалити',
        deleteFailed: 'Не вдалося видалити запис.',
        deleteError: 'Сталася помилка під час видалення.',
        deleteSuccess: 'Запис успішно видалено.',
        deleteConfirmTitle: 'Ви впевнені, що хочете видалити цей запис?',
        confirm: 'Підтвердити',
        cancel: 'Скасувати',
    }
};

export const LanguageContext = createContext();


export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const t = (key) => translations[language][key] || key;

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

