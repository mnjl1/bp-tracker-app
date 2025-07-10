import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides extra "matcher" functions for our assertions
import LoginPage from './LoginPage';
import { LanguageProvider } from '../contexts/LanguageContext';

// We wrap our component in a helper function to provide the LanguageContext,
// just like we do in App.js.
const renderWithProviders = (component) => {
  return render(
    <LanguageProvider>
      {component}
    </LanguageProvider>
  );
};

// 'describe' groups related tests together.
describe('LoginPage', () => {

  // The 'test' or 'it' function defines an individual test case.
  test('renders login form correctly', () => {
    // 1. Render the component
    renderWithProviders(<LoginPage />);

    // 2. Find elements on the screen. RTL encourages finding elements
    //    the way a user would, e.g., by their visible text or label.
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i }); // 'i' for case-insensitive

    // 3. Assert that the elements are in the document.
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('allows the user to type into email and password fields', () => {
    // 1. Render the component
    renderWithProviders(<LoginPage />);

    // 2. Find the input elements
    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');

    // 3. Simulate a user typing into the fields
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // 4. Assert that the input fields now contain the typed values
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls onLoginSuccess with a token on successful login', async () => {
    // 1. Mock the global fetch function
    //    jest.fn() creates a mock function.
    //    .mockResolvedValueOnce() makes it return a successful promise one time.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-jwt-token' }),
      })
    );

    // 2. Create a mock function for the onLoginSuccess prop
    const handleLoginSuccess = jest.fn();

    // 3. Render the component with the mock prop
    renderWithProviders(<LoginPage onLoginSuccess={handleLoginSuccess} />);

    // 4. Simulate user input
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // 5. Simulate clicking the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // 6. Wait for the assertions to pass. This is crucial for async operations.
    //    We wait until we can assert that our mock function was called.
    await waitFor(() => {
      expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
      expect(handleLoginSuccess).toHaveBeenCalledWith('fake-jwt-token');
    });

    // 7. Clean up the mock to avoid affecting other tests
    global.fetch.mockClear();
  });

});