import { useState } from 'react';

export const useAuthForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    // Password toggle functionality
    const handlePasswordToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const input = (event.currentTarget.parentElement?.querySelector(
            'input'
        ) as HTMLInputElement) || null;
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
            event.currentTarget.classList.toggle('active');
        }
    };

    // Check password strength
    const checkPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | '' => {
        if (!password) return '';
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return 'weak';
        if (score <= 3) return 'medium';
        return 'strong';
    };

    // Handle login submission
    const handleLoginSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        onSuccess?: () => void
    ) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                alert(data.error || 'Login failed. Please try again.');
                return;
            }

            alert('Login successful!');
            onSuccess?.();
            const redirectUrl = typeof data.redirectUrl === 'string' ? data.redirectUrl : '/workspace';
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle signup submission
    const handleSignupSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        password: string,
        confirmPassword: string,
        onSuccess?: () => void
    ) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const firstName = formData.get('firstName') as string;
            const lastName = formData.get('lastName') as string;
            const email = formData.get('email') as string;

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                alert(data.error || 'Signup failed. Please try again.');
                return;
            }

            alert('Account created successfully! Please log in.');
            const redirectUrl = typeof data.redirectUrl === 'string' ? data.redirectUrl : '/login';
            window.location.href = redirectUrl;
            onSuccess?.();
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        handlePasswordToggle,
        checkPasswordStrength,
        handleLoginSubmit,
        handleSignupSubmit,
    };
};
