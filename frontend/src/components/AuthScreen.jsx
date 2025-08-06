// frontend/src/components/AuthScreen.jsx
import React, { useState } from 'react';
// FIX: Added missing lucide-react icon imports
import { LogIn, User as UserIcon, Shield } from 'lucide-react';

// Note: USER_API_BASE_URL is now passed as a prop if needed, or handled by onLogin/onRegister

function AuthScreen({ onLogin, onRegister, message }) {
    const [isLoginMode, setIsLoginMode] = useState(false); // Start with landing page
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentAuthMessage, setCurrentAuthMessage] = useState(message); // Local state for messages

    // Clear message when mode changes
    React.useEffect(() => {
        setCurrentAuthMessage(message);
    }, [message, isLoginMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentAuthMessage(''); // Clear message on new submission attempt
        if (isLoginMode) {
            onLogin(email, password);
        } else {
            // Registering as a regular user
            onRegister(name, email, password);
        }
    };

    const handleUserLoginClick = () => {
        setIsLoginMode(true);
        setCurrentAuthMessage(''); // Clear message
    };

    const handleAdminLoginClick = () => {
        setIsLoginMode(true);
        setCurrentAuthMessage(''); // Clear message
        // In a real app, you might pre-fill admin email or have a separate admin-only login form
        // For now, it just takes them to the general login form.
    };

    // Render landing page or login/register form
    if (!isLoginMode) {
        return (
            <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center py-5">
                <div className="card card-themed shadow-lg p-5 rounded-4 text-center" style={{ maxWidth: '700px', width: '100%', border: 'none' }}>
                    <div className="card-body">
                        {/* CodeVM Logo */}
                        <img src="/codevm_logo.jpeg" alt="CodeVM Logo" className="mb-4" style={{ maxWidth: '180px', height: 'auto' }} />
                        <h1 className="card-title display-4 fw-bold mb-4" style={{ backgroundImage: 'linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Welcome to CodeVM
                        </h1>
                        <p className="lead text-light mb-5">
                            Your go-to platform for competitive programming and skill enhancement.
                            Write, compile, and test your code against challenging problems.
                        </p>
                        <div className="d-grid gap-3 col-md-8 mx-auto">
                            <button onClick={handleUserLoginClick} className="btn btn-lg btn-primary-gradient rounded-pill py-3 px-5 d-flex align-items-center justify-content-center fw-bold">
                                <UserIcon size={20} className="me-3" /> User Login
                            </button>
                            <button onClick={handleAdminLoginClick} className="btn btn-lg btn-success-gradient rounded-pill py-3 px-5 d-flex align-items-center justify-content-center fw-bold">
                                <Shield size={20} className="me-3" /> Admin Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center py-5">
            <div className="card card-themed shadow-lg p-5 rounded-4" style={{ maxWidth: '450px', width: '100%', border: 'none' }}>
                <div className="card-body">
                    {/* CodeVM Logo for Login/Register */}
                    <img src="/codevm_logo.jpeg" alt="CodeVM Logo" className="mb-4 mx-auto d-block" style={{ maxWidth: '120px', height: 'auto' }} />
                    <h2 className="card-title text-center mb-4 fw-bold" style={{ color: 'var(--primary-accent)' }}> {/* Blue accent for headings */}
                        {isLoginMode ? 'Login to CodeVM' : 'Register for CodeVM'}
                    </h2>
                    {currentAuthMessage && (
                        <div className="alert alert-info text-center mb-4 rounded-pill" role="alert">
                            {currentAuthMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        {!isLoginMode && (
                            <div className="mb-4">
                                <label htmlFor="name" className="form-label text-light">Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-themed rounded-pill py-2 px-3"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="email" className="form-label text-light">Email address</label>
                            <input
                                type="email"
                                className="form-control form-control-themed rounded-pill py-2 px-3"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="form-label text-light">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-themed rounded-pill py-2 px-3"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid gap-2 mt-4">
                            <button type="submit" className="btn btn-lg btn-primary-gradient rounded-pill py-3 fw-bold">
                                {isLoginMode ? 'Login' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-muted mt-4">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                        <button
                            onClick={() => { setIsLoginMode(!isLoginMode); setCurrentAuthMessage(''); }}
                            className="btn btn-link p-0 border-0 text-info fw-semibold"
                        >
                            {isLoginMode ? 'Register here' : 'Login here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthScreen;
