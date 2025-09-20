import React, { useState, useEffect } from 'react';
import { LogIn, User, Shield, ArrowLeft, Code, Zap, Users, Trophy, Lock, Mail, Eye, EyeOff } from 'lucide-react';

function AuthScreen({ onLogin, onRegister, message }) {
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                    .randoman-bg {
                        background: #1a1a1a;
                        min-height: 100vh;
                        color: white;
                        position: relative;
                        overflow-x: hidden;
                    }

                    .hero-section {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        position: relative;
                        background: radial-gradient(ellipse at center, rgba(255, 100, 50, 0.1) 0%, transparent 70%);
                    }

                    .hero-title {
                        font-size: 4.5rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #ff6b35, #f7931e, #ff8c42);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 2rem;
                        text-shadow: 0 0 60px rgba(255, 107, 53, 0.3);
                    }

                    .hero-subtitle {
                        font-size: 1.8rem;
                        color: #8b9dc3;
                        font-style: italic;
                        margin-bottom: 2rem;
                        text-shadow: 0 0 30px rgba(139, 157, 195, 0.5);
                    }

                    .hero-description {
                        font-size: 1.1rem;
                        color: #9ca3af;
                        max-width: 800px;
                        margin: 0 auto 4rem auto;
                        line-height: 1.8;
                    }

                    .cta-buttons {
                        display: flex;
                        gap: 1.5rem;
                        justify-content: center;
                        margin-bottom: 4rem;
                        flex-wrap: wrap;
                    }

                    .cta-btn {
                        padding: 1.2rem 3rem;
                        border-radius: 50px;
                        font-weight: 600;
                        font-size: 1.1rem;
                        border: none;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    }

                    .cta-primary {
                        background: linear-gradient(135deg, #ff6b35, #f7931e);
                        color: white;
                    }

                    .cta-secondary {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                    }

                    .cta-btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
                    }

                    .features-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 2rem;
                        max-width: 1200px;
                        margin: 0 auto 4rem auto;
                        padding: 0 2rem;
                    }

                    .feature-card {
                        background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(102, 126, 234, 0.1));
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 20px;
                        padding: 2rem;
                        text-align: center;
                        transition: all 0.4s ease;
                        backdrop-filter: blur(10px);
                    }

                    .feature-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 20px 60px rgba(255, 107, 53, 0.2);
                        border-color: rgba(255, 107, 53, 0.3);
                    }

                    .feature-icon {
                        width: 70px;
                        height: 70px;
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 1.5rem auto;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                    }

                    .feature-icon-1 { background: linear-gradient(135deg, #667eea, #764ba2); }
                    .feature-icon-2 { background: linear-gradient(135deg, #f093fb, #f5576c); }
                    .feature-icon-3 { background: linear-gradient(135deg, #4facfe, #00f2fe); }
                    .feature-icon-4 { background: linear-gradient(135deg, #43e97b, #38f9d7); }

                    .feature-title {
                        font-size: 1.3rem;
                        font-weight: 700;
                        color: white;
                        margin-bottom: 1rem;
                    }

                    .feature-desc {
                        color: #9ca3af;
                        line-height: 1.6;
                    }

                    .auth-section {
                        background: rgba(30, 30, 30, 0.8);
                        backdrop-filter: blur(20px);
                        border-radius: 24px;
                        padding: 3rem;
                        max-width: 500px;
                        margin: 0 auto 4rem auto;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
                    }

                    .auth-btn {
                        width: 100%;
                        padding: 1.2rem;
                        border-radius: 16px;
                        font-weight: 600;
                        font-size: 1rem;
                        border: none;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.8rem;
                        margin-bottom: 1rem;
                    }

                    .auth-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
                    .auth-secondary { background: linear-gradient(135deg, #f093fb, #f5576c); color: white; }
                    .auth-tertiary { background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; }

                    .auth-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                    }

                    .divider {
                        position: relative;
                        text-align: center;
                        margin: 1.5rem 0;
                        color: #666;
                        font-size: 0.9rem;
                    }

                    .divider::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 1px;
                        background: rgba(255, 255, 255, 0.1);
                    }

                    .divider span {
                        background: #1e1e1e;
                        padding: 0 1rem;
                    }

                    @media (max-width: 768px) {
                        .hero-title { font-size: 3rem; }
                        .hero-subtitle { font-size: 1.4rem; }
                        .cta-buttons { flex-direction: column; align-items: center; }
                        .cta-btn { width: 280px; justify-content: center; }
                        .auth-section { margin: 0 1rem 4rem 1rem; padding: 2rem; }
                    }
                `}</style>

                <div className="randoman-bg">
                    <div className="hero-section">
                        <div className="container-fluid">
                            <h1 className="hero-title">Discover CodeVM</h1>
                            <p className="hero-subtitle">"Where Time Matters"</p>
                            <p className="hero-description">
                                Don't waste hours on uncertainty — CodeVM empowers you to act with <em>clarity, speed, and precision.</em>
                            </p>
                            
                            <div className="cta-buttons">
                                <button className="cta-btn cta-primary" onClick={handleRegisterClick}>
                                    <User size={20} />
                                    Start Coding Now
                                </button>
                                <button className="cta-btn cta-secondary">
                                    <Trophy size={20} />
                                    Watch Demo Tour
                                </button>
                            </div>

                            <div className="features-grid">
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-1">
                                        <Zap size={30} className="text-white" />
                                    </div>
                                    <h3 className="feature-title">Real-time</h3>
                                    <p className="feature-desc">Instant feedback on your solutions</p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-2">
                                        <Trophy size={30} className="text-white" />
                                    </div>
                                    <h3 className="feature-title">Rapid Prototyping</h3>
                                    <p className="feature-desc">Build and test ideas quickly</p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-3">
                                        <Users size={30} className="text-white" />
                                    </div>
                                    <h3 className="feature-title">Community</h3>
                                    <p className="feature-desc">Learn with fellow developers</p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-4">
                                        <Code size={30} className="text-white" />
                                    </div>
                                    <h3 className="feature-title">Fast</h3>
                                    <p className="feature-desc">Lightning-fast execution</p>
                                </div>
                            </div>

                            <div className="auth-section">
                                <button className="auth-btn auth-primary" onClick={handleUserLoginClick}>
                                    <User size={20} />
                                    Continue as Student
                                </button>
                                
                                <button className="auth-btn auth-secondary" onClick={handleAdminLoginClick}>
                                    <Shield size={20} />
                                    Admin Access
                                </button>
                                
                                <div className="divider">
                                    <span>or</span>
                                </div>
                                
                                <button className="auth-btn auth-tertiary" onClick={handleRegisterClick}>
                                    <LogIn size={20} />
                                    Create New Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Login/Register screen - Randoman style
    return (
        <>
            <style jsx>{`
                .auth-bg {
                    background: #1a1a1a;
                    min-height: 100vh;
                    color: white;
                    position: relative;
                }

                .auth-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }

                .auth-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4rem;
                    max-width: 1200px;
                    width: 100%;
                    align-items: center;
                }

                .auth-left {
                    text-align: left;
                }

                .auth-welcome-title {
                    font-size: 3.5rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 3rem;
                    line-height: 1.2;
                }

                .feature-grid-small {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .feature-item-small {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 1.5rem;
                    text-align: left;
                }

                .feature-emoji {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    display: block;
                }

                .feature-name {
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .auth-right {
                    display: flex;
                    justify-content: center;
                }

                .auth-card-main {
                    background: rgba(30, 30, 30, 0.9);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 3rem;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 20px 80px rgba(0, 0, 0, 0.5);
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .auth-icon-circle {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem auto;
                    box-shadow: 0 10px 40px rgba(255, 107, 53, 0.4);
                }

                .auth-form-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #ffa000, #ffc107);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .auth-form-subtitle {
                    color: #9ca3af;
                    font-size: 1rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label-custom {
                    display: block;
                    color: white;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .form-control-randoman {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.08);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 12px;
                    color: white;
                    padding: 1rem;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .form-control-randoman:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.12);
                    border-color: #ff6b35;
                    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
                }

                .form-control-randoman::placeholder {
                    color: #6b7280;
                }

                .input-group-custom {
                    position: relative;
                }

                .input-icon-left {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                    z-index: 2;
                }

                .input-with-icon {
                    padding-left: 3rem;
                }

                .password-toggle {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #6b7280;
                    cursor: pointer;
                    z-index: 2;
                }

                .password-toggle:hover {
                    color: #9ca3af;
                }

                .submit-btn-randoman {
                    width: 100%;
                    background: linear-gradient(135deg, #ff6b35, #f7931e);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 1rem;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
                    margin-bottom: 2rem;
                }

                .submit-btn-randoman:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(255, 107, 53, 0.4);
                }

                .auth-switch {
                    text-align: center;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .auth-switch-text {
                    color: #9ca3af;
                    margin-bottom: 1rem;
                }

                .auth-switch-btn {
                    background: linear-gradient(135deg, #ffa000, #ffca28);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    padding: 0.7rem 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 160, 0, 0.3);
                }

                .auth-switch-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(255, 160, 0, 0.4);
                }

                .back-btn-randoman {
                    position: absolute;
                    top: 2rem;
                    left: 2rem;
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1rem;
                    transition: color 0.3s ease;
                }

                .back-btn-randoman:hover {
                    color: white;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 12px;
                    padding: 1rem;
                    color: #fca5a5;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }

                @media (max-width: 992px) {
                    .auth-layout {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                        text-align: center;
                    }
                    
                    .auth-left {
                        text-align: center;
                    }
                    
                    .auth-welcome-title {
                        font-size: 2.5rem;
                    }
                }

                @media (max-width: 576px) {
                    .auth-card-main {
                        padding: 2rem;
                        margin: 0 1rem;
                    }
                    
                    .auth-welcome-title {
                        font-size: 2rem;
                    }
                }
            `}</style>

            <div className="auth-bg">
                <button className="back-btn-randoman" onClick={handleBackToLanding}>
                    <ArrowLeft size={20} />
                    Back to home
                </button>

                <div className="auth-container">
                    <div className="auth-layout">
                        {/* Left side - Feature highlight */}
                        <div className="auth-left">
                            <h1 className="auth-welcome-title">
                                {isLoginMode ? 'Welcome Back to CodeVM' : 'Join CodeVM Today'}
                            </h1>
                            
                            <div className="feature-grid-small">
                                <div className="feature-item-small">
                                    <span className="feature-emoji">⚡</span>
                                    <div className="feature-name">Real-time</div>
                                </div>
                                <div className="feature-item-small">
                                    <span className="feature-emoji">💾</span>
                                    <div className="feature-name">Auto Save</div>
                                </div>
                                <div className="feature-item-small">
                                    <span className="feature-emoji">🤝</span>
                                    <div className="feature-name">Community</div>
                                </div>
                                <div className="feature-item-small">
                                    <span className="feature-emoji">🚀</span>
                                    <div className="feature-name">Fast</div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Auth form */}
                        <div className="auth-right">
                            <div className="auth-card-main">
                                <div className="auth-header">
                                    <div className="auth-icon-circle">
                                        {isLoginMode ? 
                                            <User size={32} className="text-white" /> : 
                                            <Code size={32} className="text-white" />
                                        }
                                    </div>
                                    <h2 className="auth-form-title">
                                        {isLoginMode ? 'LOGIN' : 'CREATE ACCOUNT'}
                                    </h2>
                                    <p className="auth-form-subtitle">
                                        {isLoginMode ? 'Sign in to continue' : 'Get started with CodeVM'}
                                    </p>
                                </div>

                                {currentAuthMessage && (
                                    <div className="error-message">
                                        {currentAuthMessage}
                                    </div>
                                )}

                                <div>
                                    {!isLoginMode && (
                                        <div className="form-group">
                                            <label className="form-label-custom">Full Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="form-control-randoman"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="form-label-custom">Email Address</label>
                                        <div className="input-group-custom">
                                            <Mail size={20} className="input-icon-left" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-control-randoman input-with-icon"
                                                placeholder="Enter your email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label-custom">Password</label>
                                        <div className="input-group-custom">
                                            <Lock size={20} className="input-icon-left" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="form-control-randoman input-with-icon"
                                                placeholder="Enter your password"
                                                required
                                                style={{ paddingRight: '3rem' }}
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="submit-btn-randoman"
                                    >
                                        {isLoginMode ? 'Sign In to Continue' : 'Create My Account'}
                                    </button>
                                </div>

                                <div className="auth-switch">
                                    <p className="auth-switch-text">
                                        {isLoginMode ? 'New to CodeVM?' : 'Already have an account?'}
                                    </p>
                                    <button
                                        onClick={() => { setIsLoginMode(!isLoginMode); setCurrentAuthMessage(''); }}
                                        className="auth-switch-btn"
                                    >
                                        {isLoginMode ? 'Create Account' : 'Sign In Instead'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AuthScreen;

