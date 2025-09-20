import React, { useState, useEffect } from 'react';
import { LogIn, User, Shield, ArrowLeft, Code, Zap, Users, Trophy, Lock, Mail } from 'lucide-react';

function AuthScreen({ onLogin, onRegister, message }) {
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentAuthMessage, setCurrentAuthMessage] = useState(message);
    const [showLanding, setShowLanding] = useState(true);

    useEffect(() => {
        setCurrentAuthMessage(message);
    }, [message, isLoginMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCurrentAuthMessage('');
        if (isLoginMode) {
            onLogin(email, password);
        } else {
            onRegister(name, email, password);
        }
    };

    const handleUserLoginClick = () => {
        setShowLanding(false);
        setIsLoginMode(true);
    };

    const handleAdminLoginClick = () => {
        setShowLanding(false);
        setIsLoginMode(true);
    };

    const handleRegisterClick = () => {
        setShowLanding(false);
        setIsLoginMode(false);
    };

    const handleBackToLanding = () => {
        setShowLanding(true);
        setName('');
        setEmail('');
        setPassword('');
        setCurrentAuthMessage('');
    };

    // Landing Screen
    if (showLanding) {
        return (
            <>
                <style jsx>{`
                    .landing-bg {
                        background: linear-gradient(135deg, #0f172a 0%, #1e40af 35%, #1e293b 100%);
                        min-height: 100vh;
                        position: relative;
                        overflow: hidden;
                    }

                    .floating-orb {
                        position: absolute;
                        border-radius: 50%;
                        filter: blur(40px);
                        opacity: 0.2;
                        animation: float 8s ease-in-out infinite;
                    }

                    .floating-orb:nth-child(1) {
                        width: 300px;
                        height: 300px;
                        background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                        top: -150px;
                        right: -150px;
                    }

                    .floating-orb:nth-child(2) {
                        width: 250px;
                        height: 250px;
                        background: linear-gradient(45deg, #a855f7, #ec4899);
                        bottom: -100px;
                        left: -100px;
                        animation-delay: -4s;
                    }

                    .floating-orb:nth-child(3) {
                        width: 200px;
                        height: 200px;
                        background: linear-gradient(45deg, #6366f1, #06b6d4);
                        top: 50%;
                        left: 10%;
                        animation-delay: -2s;
                    }

                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(180deg); }
                    }

                    .hero-title {
                        background: linear-gradient(135deg, #60a5fa, #a78bfa, #818cf8);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        font-size: 4rem;
                        font-weight: 800;
                    }

                    .feature-card {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                        padding: 2rem;
                        text-align: center;
                        transition: all 0.3s ease;
                        height: 100%;
                    }

                    .feature-card:hover {
                        background: rgba(255, 255, 255, 0.1);
                        transform: translateY(-8px);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    }

                    .feature-icon {
                        width: 60px;
                        height: 60px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1rem auto;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                    }

                    .auth-card {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 2.5rem;
                        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                    }

                    .auth-btn {
                        padding: 1rem 2rem;
                        border-radius: 12px;
                        font-weight: 600;
                        border: none;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                    }

                    .auth-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                    }

                    .btn-primary-custom {
                        background: linear-gradient(135deg, #3b82f6, #6366f1);
                        color: white;
                    }

                    .btn-purple-custom {
                        background: linear-gradient(135deg, #8b5cf6, #a855f7);
                        color: white;
                    }

                    .btn-indigo-custom {
                        background: linear-gradient(135deg, #6366f1, #8b5cf6);
                        color: white;
                    }

                    .stats-item {
                        text-align: center;
                    }

                    .stats-number {
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin-bottom: 0.5rem;
                    }

                    .stats-label {
                        color: #94a3b8;
                        font-size: 0.9rem;
                    }

                    .divider {
                        position: relative;
                        text-align: center;
                        margin: 1.5rem 0;
                    }

                    .divider::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 1px;
                        background: rgba(255, 255, 255, 0.2);
                    }

                    .divider span {
                        background: #1e293b;
                        padding: 0 1rem;
                        color: #94a3b8;
                        font-size: 0.9rem;
                    }

                    @media (max-width: 768px) {
                        .hero-title {
                            font-size: 2.5rem;
                        }
                    }
                `}</style>

                <div className="landing-bg">
                    <div className="floating-orb"></div>
                    <div className="floating-orb"></div>
                    <div className="floating-orb"></div>

                    <div className="container-fluid h-100 position-relative" style={{ zIndex: 10 }}>
                        <div className="row min-vh-100 align-items-center">
                            <div className="col-12">
                                {/* Header Section */}
                                <div className="text-center mb-5">
                                    <div className="d-flex justify-content-center mb-4">
                                        <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                                            <Code size={32} className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <h1 className="hero-title mb-4">CodeVM</h1>
                                    
                                    <p className="text-light fs-4 mb-3" style={{ fontWeight: 300 }}>
                                        Master algorithms, ace interviews, build your future
                                    </p>
                                    
                                    <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
                                        Join thousands of developers improving their coding skills with our comprehensive online judge platform
                                    </p>
                                </div>

                                {/* Feature Cards */}
                                <div className="row g-4 mb-5 justify-content-center">
                                    <div className="col-lg-3 col-md-6">
                                        <div className="feature-card">
                                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1e40af)' }}>
                                                <Zap size={24} className="text-white" />
                                            </div>
                                            <h5 className="text-white fw-bold mb-2">Real-time Judge</h5>
                                            <p className="text-muted small mb-0">Instant feedback on your solutions</p>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-6">
                                        <div className="feature-card">
                                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                                                <Trophy size={24} className="text-white" />
                                            </div>
                                            <h5 className="text-white fw-bold mb-2">Competitions</h5>
                                            <p className="text-muted small mb-0">Weekly contests and challenges</p>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-6">
                                        <div className="feature-card">
                                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                                                <Users size={24} className="text-white" />
                                            </div>
                                            <h5 className="text-white fw-bold mb-2">Community</h5>
                                            <p className="text-muted small mb-0">Learn with fellow developers</p>
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-3 col-md-6">
                                        <div className="feature-card">
                                            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                                <Code size={24} className="text-white" />
                                            </div>
                                            <h5 className="text-white fw-bold mb-2">Multi-Language</h5>
                                            <p className="text-muted small mb-0">Support for 20+ languages</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Auth Buttons */}
                                <div className="row justify-content-center">
                                    <div className="col-lg-4 col-md-6">
                                        <div className="auth-card">
                                            <div className="d-grid gap-3">
                                                <button 
                                                    onClick={handleUserLoginClick} 
                                                    className="auth-btn btn-primary-custom d-flex align-items-center justify-content-center"
                                                >
                                                    <User size={20} className="me-2" />
                                                    Continue as Student
                                                </button>
                                                
                                                <button 
                                                    onClick={handleAdminLoginClick} 
                                                    className="auth-btn btn-purple-custom d-flex align-items-center justify-content-center"
                                                >
                                                    <Shield size={20} className="me-2" />
                                                    Admin Access
                                                </button>
                                                
                                                <div className="divider">
                                                    <span>or</span>
                                                </div>
                                                
                                                <button 
                                                    onClick={handleRegisterClick} 
                                                    className="auth-btn btn-indigo-custom d-flex align-items-center justify-content-center"
                                                >
                                                    <LogIn size={20} className="me-2" />
                                                    Create New Account
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="row justify-content-center mt-5">
                                    <div className="col-lg-6">
                                        <div className="row text-center">
                                            <div className="col-4">
                                                <div className="stats-item">
                                                    <div className="stats-number" style={{ color: '#60a5fa' }}>50K+</div>
                                                    <div className="stats-label">Active Users</div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="stats-item">
                                                    <div className="stats-number" style={{ color: '#a78bfa' }}>10K+</div>
                                                    <div className="stats-label">Problems</div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="stats-item">
                                                    <div className="stats-number" style={{ color: '#818cf8' }}>25+</div>
                                                    <div className="stats-label">Languages</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Login/Register screen
    return (
        <>
            <style jsx>{`
                .auth-bg {
                    background: linear-gradient(135deg, #0f172a 0%, #1e40af 35%, #1e293b 100%);
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                }

                .auth-floating-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(30px);
                    opacity: 0.15;
                    animation: float 8s ease-in-out infinite;
                }

                .auth-floating-orb:nth-child(1) {
                    width: 200px;
                    height: 200px;
                    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                    top: 20%;
                    right: 10%;
                }

                .auth-floating-orb:nth-child(2) {
                    width: 180px;
                    height: 180px;
                    background: linear-gradient(45deg, #10b981, #34d399);
                    bottom: 20%;
                    left: 15%;
                    animation-delay: -4s;
                }

                .main-auth-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                }

                .auth-header-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .auth-title {
                    background: linear-gradient(135deg, #60a5fa, #a78bfa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                }

                .form-control-custom {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: white;
                    padding: 1rem;
                    transition: all 0.3s ease;
                }

                .form-control-custom:focus {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
                    color: white;
                }

                .form-control-custom::placeholder {
                    color: #94a3b8;
                }

                .input-icon {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    z-index: 5;
                }

                .input-with-icon {
                    position: relative;
                }

                .input-with-icon .form-control-custom {
                    padding-left: 3rem;
                }

                .submit-btn {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    padding: 1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
                    background: linear-gradient(135deg, #2563eb, #7c3aed);
                    color: white;
                }

                .back-btn {
                    color: #94a3b8;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .back-btn:hover {
                    color: white;
                }

                .switch-btn {
                    color: #60a5fa;
                    background: none;
                    border: none;
                    font-weight: 600;
                    transition: color 0.3s ease;
                }

                .switch-btn:hover {
                    color: #93c5fd;
                }

                .error-alert {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #fca5a5;
                    border-radius: 12px;
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                }
            `}</style>

            <div className="auth-bg">
                <div className="auth-floating-orb"></div>
                <div className="auth-floating-orb"></div>

                <div className="container-fluid position-relative" style={{ zIndex: 10 }}>
                    <div className="row min-vh-100 align-items-center justify-content-center">
                        <div className="col-lg-5 col-md-7 col-sm-9">
                            {/* Back Button */}
                            <div className="mb-4">
                                <button
                                    className="back-btn d-flex align-items-center"
                                    onClick={handleBackToLanding}
                                    style={{ background: 'none', border: 'none' }}
                                >
                                    <ArrowLeft size={20} className="me-2" />
                                    Back to home
                                </button>
                            </div>

                            {/* Auth Card */}
                            <div className="main-auth-card">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="auth-header-icon">
                                        <Code size={32} className="text-white" />
                                    </div>
                                    
                                    <h2 className="auth-title">
                                        {isLoginMode ? 'Welcome Back' : 'Join CodeVM'}
                                    </h2>
                                    
                                    <p className="text-muted mb-0">
                                        {isLoginMode ? 'Sign in to continue your coding journey' : 'Start your coding journey today'}
                                    </p>
                                </div>

                                {/* Error Message */}
                                {currentAuthMessage && (
                                    <div className="error-alert">
                                        {currentAuthMessage}
                                    </div>
                                )}

                                {/* Form */}
                                <div>
                                    {!isLoginMode && (
                                        <div className="mb-3">
                                            <label className="form-label text-light fw-semibold mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control form-control-custom"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="mb-3">
                                        <label className="form-label text-light fw-semibold mb-2">
                                            Email Address
                                        </label>
                                        <div className="input-with-icon">
                                            <Mail size={20} className="input-icon" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-control form-control-custom"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="form-label text-light fw-semibold mb-2">
                                            Password
                                        </label>
                                        <div className="input-with-icon">
                                            <Lock size={20} className="input-icon" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="form-control form-control-custom"
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="d-grid mb-4">
                                        <button 
                                            type="button"
                                            onClick={handleSubmit}
                                            className="submit-btn"
                                        >
                                            {isLoginMode ? 'Sign In' : 'Create Account'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Switch Mode */}
                                <div className="text-center">
                                    <p className="text-muted mb-0">
                                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                                        <button
                                            onClick={() => { setIsLoginMode(!isLoginMode); setCurrentAuthMessage(''); }}
                                            className="switch-btn"
                                        >
                                            {isLoginMode ? 'Sign up' : 'Sign in'}
                                        </button>
                                    </p>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="text-center mt-3">
                                <p className="text-muted small mb-0">
                                    Protected by enterprise-grade security
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default AuthScreen;