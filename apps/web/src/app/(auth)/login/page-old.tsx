'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import '../auth.css';
import styles from '../auth.module.css';
import { useAuthForm } from '@/hooks/useAuthForm';

const LoginIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const EmailIcon = () => (
    <svg
        className={styles.inputIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PasswordIcon = () => (
    <svg
        className={styles.inputIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            ry="2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const EyeIcon = () => (
    <svg className={styles.eyeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const GoogleSocialIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

const GitHubSocialIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
);

export default function LoginPage() {
    const { isLoading, handlePasswordToggle, handleLoginSubmit } = useAuthForm();
    const [rememberMe, setRememberMe] = useState(false);

    return (
        <div>
            {/* Background Effects */}
            <div className={styles.backgroundEffects}>
                <div className={`${styles.gradientOrb} ${styles.orb1}`}></div>
                <div className={`${styles.gradientOrb} ${styles.orb2}`}></div>
                <div className={`${styles.gradientOrb} ${styles.orb3}`}></div>
            </div>

            {/* Main Container */}
            <div className={styles.container}>
                <div className={styles.authCard}>
                    {/* Card Header */}
                    <div className={styles.cardHeader}>
                        <div className={styles.logo}>
                            <div className={styles.logoIcon}>
                                <LoginIcon />
                            </div>
                            <span className={styles.logoText}>NEXUS</span>
                        </div>
                        <h1>Welcome Back</h1>
                        <p className={styles.subtitle}>Sign in to continue to your account</p>
                    </div>

                    {/* Login Form */}
                    <form className={styles.authForm} onSubmit={(e) => handleLoginSubmit(e)}>
                        {/* Email Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <div className={styles.inputWrapper}>
                                <EmailIcon />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputWrapper}>
                                <PasswordIcon />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    aria-label="Toggle password visibility"
                                    onClick={handlePasswordToggle}
                                >
                                    <EyeIcon />
                                </button>
                            </div>
                        </div>

                        {/* Form Options */}
                        <div className={styles.formOptions}>
                            <label className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span className={styles.checkmark}></span>
                                <span className={styles.checkboxLabel}>Remember me</span>
                            </label>
                            <a href="#" className={styles.forgotLink}>
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className={`${styles.btnPrimary} ${isLoading ? styles.loading : ''}`} disabled={isLoading}>
                            <span className={styles.btnText}>Sign In</span>
                            <div className={styles.btnLoader}></div>
                        </button>

                        {/* Divider */}
                        <div className={styles.divider}>
                            <span>or continue with</span>
                        </div>

                        {/* Social Login */}
                        <div className={styles.socialLogin}>
                            <button type="button" className={styles.btnSocial} id="googleBtn">
                                <GoogleSocialIcon />
                                <span>Google</span>
                            </button>
                            <button type="button" className={styles.btnSocial} id="githubBtn">
                                <GitHubSocialIcon />
                                <span>GitHub</span>
                            </button>
                        </div>
                    </form>

                    {/* Card Footer */}
                    <div className={styles.cardFooter}>
                        <p>
                            Don't have an account?{' '}
                            <Link href="/signup" className={styles.signupLink}>
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
