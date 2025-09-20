import React, { useState, useEffect } from 'react';
import { LogIn, User, Shield, ArrowLeft, Code, Zap, Users, Trophy, Lock, Mail, Eye, EyeOff, Bot, BarChart3, FileCode2 } from 'lucide-react';

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

    const handleWatchDemo = () => {
        window.open('https://drive.google.com/file/d/1VLrT-q3xZACkMPXXfZDeflO2qKnN2R_u/view?usp=sharing', '_blank');
    };

    // Landing Screen
    if (showLanding) {
        return (
            <>
                <style jsx>{`
                    .codevm-bg {
                        background: linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2d1b69 100%);
                        min-height: 100vh;
                        color: white;
                        position: relative;
                        overflow-x: hidden;
                    }

                    .hero-section {
                        min-height: 100vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        position: relative;
                        padding: 4rem 2rem;
                    }

                    .hero-title {
                        font-size: 5rem;
                        font-weight: 900;
                        background: linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        margin-bottom: 1.5rem;
                        text-shadow: 0 0 60px rgba(0, 212, 255, 0.3);
                    }

                    .hero-subtitle {
                        font-size: 2rem;
                        color: #a5b4fc;
                        font-weight: 600;
                        margin-bottom: 2rem;
                        text-shadow: 0 0 30px rgba(165, 180, 252, 0.3);
                    }

                    .hero-description {
                        font-size: 1.2rem;
                        color: #cbd5e1;
                        max-width: 900px;
                        margin: 0 auto 4rem auto;
                        line-height: 1.8;
                    }

                    .cta-buttons {
                        display: flex;
                        gap: 2rem;
                        justify-content: center;
                        margin-bottom: 6rem;
                        flex-wrap: wrap;
                    }

                    .cta-btn {
                        padding: 1.3rem 3.5rem;
                        border-radius: 50px;
                        font-weight: 700;
                        font-size: 1.1rem;
                        border: none;
                        cursor: pointer;
                        transition: all 0.4s ease;
                        display: flex;
                        align-items: center;
                        gap: 0.7rem;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                        position: relative;
                        overflow: hidden;
                    }

                    .cta-primary {
                        background: linear-gradient(135deg, #00d4ff, #7c3aed);
                        color: white;
                    }

                    .cta-secondary {
                        background: linear-gradient(135deg, #ec4899, #f97316);
                        color: white;
                    }

                    .cta-btn:hover {
                        transform: translateY(-4px) scale(1.05);
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    }

                    .cta-btn::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                        transition: left 0.5s;
                    }

                    .cta-btn:hover::before {
                        left: 100%;
                    }

                    .why-choose-section {
                        margin-bottom: 6rem;
                    }

                    .section-title {
                        font-size: 3.5rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #00d4ff, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        text-align: center;
                        margin-bottom: 4rem;
                    }

                    .features-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                        gap: 3rem;
                        max-width: 1400px;
                        margin: 0 auto;
                        padding: 0 2rem;
                    }

                    .feature-card {
                        background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
                        border: 2px solid rgba(255, 255, 255, 0.1);
                        border-radius: 24px;
                        padding: 3rem;
                        text-align: center;
                        transition: all 0.5s ease;
                        backdrop-filter: blur(15px);
                        position: relative;
                        overflow: hidden;
                    }

                    .feature-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(124, 58, 237, 0.05));
                        opacity: 0;
                        transition: opacity 0.5s ease;
                    }

                    .feature-card:hover::before {
                        opacity: 1;
                    }

                    .feature-card:hover {
                        transform: translateY(-15px) scale(1.02);
                        box-shadow: 0 25px 80px rgba(0, 212, 255, 0.3);
                        border-color: rgba(0, 212, 255, 0.4);
                    }

                    .feature-icon {
                        width: 90px;
                        height: 90px;
                        border-radius: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 2rem auto;
                        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
                        position: relative;
                        z-index: 2;
                    }

                    .feature-icon-1 { background: linear-gradient(135deg, #00d4ff, #7c3aed); }
                    .feature-icon-2 { background: linear-gradient(135deg, #ec4899, #f97316); }
                    .feature-icon-3 { background: linear-gradient(135deg, #10b981, #06b6d4); }

                    .feature-title {
                        font-size: 1.6rem;
                        font-weight: 800;
                        color: white;
                        margin-bottom: 1rem;
                        position: relative;
                        z-index: 2;
                    }

                    .feature-badge {
                        display: inline-block;
                        background: linear-gradient(135deg, #7c3aed, #ec4899);
                        color: white;
                        padding: 0.4rem 1rem;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        margin-bottom: 1.5rem;
                    }

                    .feature-desc {
                        color: #cbd5e1;
                        line-height: 1.8;
                        font-size: 1.1rem;
                        position: relative;
                        z-index: 2;
                    }

                    .highlight-text {
                        color: #00d4ff;
                        font-weight: 700;
                    }

                    .languages-section {
                        background: rgba(15, 15, 35, 0.8);
                        backdrop-filter: blur(20px);
                        border-radius: 32px;
                        padding: 4rem;
                        margin: 6rem auto 4rem auto;
                        max-width: 1200px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .languages-title {
                        font-size: 2.5rem;
                        font-weight: 800;
                        background: linear-gradient(135deg, #00d4ff, #ec4899);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        text-align: center;
                        margin-bottom: 3rem;
                    }

                    .languages-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 2rem;
                        margin-bottom: 3rem;
                    }

                    .language-card {
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                        padding: 2rem;
                        text-align: center;
                        transition: all 0.3s ease;
                    }

                    .language-card:hover {
                        transform: translateY(-5px);
                        background: rgba(0, 212, 255, 0.1);
                        border-color: rgba(0, 212, 255, 0.3);
                    }

                    .language-icon {
                        font-size: 2.5rem;
                        margin-bottom: 1rem;
                        display: block;
                    }

                    .language-name {
                        font-weight: 700;
                        color: white;
                        font-size: 1.1rem;
                    }

                    .final-cta {
                        text-align: center;
                        margin-top: 4rem;
                    }

                    .final-cta-title {
                        font-size: 2.8rem;
                        font-weight: 800;
                        color: white;
                        margin-bottom: 2rem;
                    }

                    .final-cta-btn {
                        padding: 1.5rem 4rem;
                        background: linear-gradient(135deg, #00d4ff, #7c3aed);
                        border: none;
                        border-radius: 50px;
                        color: white;
                        font-weight: 700;
                        font-size: 1.2rem;
                        cursor: pointer;
                        transition: all 0.4s ease;
                        box-shadow: 0 15px 50px rgba(0, 212, 255, 0.4);
                        position: relative;
                        overflow: hidden;
                    }

                    .final-cta-btn:hover {
                        transform: translateY(-5px) scale(1.05);
                        box-shadow: 0 25px 80px rgba(0, 212, 255, 0.6);
                    }

                    .stats-text {
                        color: #a5b4fc;
                        font-size: 1.1rem;
                        margin-top: 2rem;
                    }

                    @media (max-width: 768px) {
                        .hero-title { font-size: 3.5rem; }
                        .hero-subtitle { font-size: 1.5rem; }
                        .section-title { font-size: 2.5rem; }
                        .cta-buttons { flex-direction: column; align-items: center; }
                        .cta-btn { width: 280px; justify-content: center; }
                        .features-grid { grid-template-columns: 1fr; }
                        .languages-section { padding: 2rem; margin: 4rem 1rem 2rem 1rem; }
                    }
                `}</style>

                <div className="codevm-bg">
                    <div className="hero-section">
                        <h1 className="hero-title">CodeVM</h1>
                        <p className="hero-subtitle">"Code Fast. Think Faster. Win Faster."</p>
                        <p className="hero-description">
                            Your scalable online judge platform designed for competitive programming. 
                            Experience secure code execution, AI-powered reviews, and real-time analytics 
                            that elevate your coding journey to professional standards.
                        </p>
                        
                        <div className="cta-buttons">
                            <button className="cta-btn cta-primary" onClick={handleRegisterClick}>
                                <Code size={24} />
                                Start Coding Now
                            </button>
                            <button className="cta-btn cta-secondary" onClick={handleWatchDemo}>
                                <Trophy size={24} />
                                Video Demo
                            </button>
                        </div>

                        <div className="why-choose-section">
                            <h2 className="section-title">Why Choose CodeVM?</h2>
                            
                            <div className="features-grid">
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-1">
                                        <Bot size={40} className="text-white" />
                                    </div>
                                    <div className="feature-badge">AI-Powered</div>
                                    <h3 className="feature-title">AI-Powered Code Review</h3>
                                    <p className="feature-desc">
                                        Get <span className="highlight-text">instant, contextual feedback</span> on your code directly in the editor before submission. 
                                        Our AI acts as your virtual mentor, enhancing code quality and suggesting improvements.
                                    </p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-2">
                                        <BarChart3 size={40} className="text-white" />
                                    </div>
                                    <div className="feature-badge">Analytics</div>
                                    <h3 className="feature-title">Advanced Analytics Dashboard</h3>
                                    <p className="feature-desc">
                                        Track your progress with <span className="highlight-text">detailed performance metrics</span>. 
                                        Monitor submissions, acceptance rates, and difficulty breakdowns with comprehensive analytics.
                                    </p>
                                </div>
                                
                                <div className="feature-card">
                                    <div className="feature-icon feature-icon-3">
                                        <FileCode2 size={40} className="text-white" />
                                    </div>
                                    <div className="feature-badge">Secure</div>
                                    <h3 className="feature-title">Auto Save Technology</h3>
                                    <p className="feature-desc">
                                        Never lose your progress. Every change is applied in <span className="highlight-text">milliseconds</span>, 
                                        automatically saved, and instantly replicated across any browser with Docker-secured execution.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="languages-section">
                            <h2 className="languages-title">Supported Languages</h2>
                            
                            <div className="languages-grid">
                                <div className="language-card">
                                    <span className="language-icon">⚡</span>
                                    <div className="language-name">C++ (GCC)</div>
                                </div>
                                <div className="language-card">
                                    <span className="language-icon">🐍</span>
                                    <div className="language-name">Python 3</div>
                                </div>
                                <div className="language-card">
                                    <span className="language-icon">☕</span>
                                    <div className="language-name">Java (OpenJDK)</div>
                                </div>
                            </div>

                            <div className="final-cta">
                                <h3 className="final-cta-title">Ready to Transform Your Coding Experience?</h3>
                                <button className="final-cta-btn" onClick={handleRegisterClick}>
                                    Get Started Today →
                                </button>
                                <p className="stats-text">
                                    Join thousands of developers • Docker-secured execution • JWT authentication
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Login/Register screen - Updated color scheme
    return (
        <>
            <style jsx>{`
                .auth-bg {
                    background: linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2d1b69 100%);
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
                    background: linear-gradient(135deg, #00d4ff, #7c3aed, #ec4899);
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
                    background: linear-gradient(135deg, #00d4ff, #7c3aed);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem auto;
                    box-shadow: 0 10px 40px rgba(0, 212, 255, 0.4);
                }

                .auth-form-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #00d4ff, #ec4899);
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

                .form-control-codevm {
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

                .form-control-codevm:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.12);
                    border-color: #00d4ff;
                    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
                }

                .form-control-codevm::placeholder {
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

                .submit-btn-codevm {
                    width: 100%;
                    background: linear-gradient(135deg, #00d4ff, #7c3aed);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-weight: 600;
                    font-size: 1rem;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
                    margin-bottom: 2rem;
                }

                .submit-btn-codevm:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 35px rgba(0, 212, 255, 0.4);
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
                    background: linear-gradient(135deg, #ec4899, #f97316);
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    padding: 0.7rem 1.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
                }

                .auth-switch-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
                }

                .back-btn-codevm {
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

                .back-btn-codevm:hover {
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
                <button className="back-btn-codevm" onClick={handleBackToLanding}>
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
                                    <span className="feature-emoji">🤖</span>
                                    <div className="feature-name">AI Reviews</div>
                                </div>
                                <div className="feature-item-small">
                                    <span className="feature-emoji">📊</span>
                                    <div className="feature-name">Analytics</div>
                                </div>
                                <div className="feature-item-small">
                                    <span className="feature-emoji">🔒</span>
                                    <div className="feature-name">Secure</div>
                                </div>
                                <div className="feature-item-small">
                                    <span className="feature-emoji">⚡</span>
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
                                        {isLoginMode ? 'Sign in to continue coding' : 'Start your coding journey'}
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
                                                className="form-control-codevm"
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
                                                className="form-control-codevm input-with-icon"
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
                                                className="form-control-codevm input-with-icon"
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
                                        className="submit-btn-codevm"
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

