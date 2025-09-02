import React, { useState, useEffect } from 'react';
import { LogIn, User, Shield, ArrowLeft, Sparkles, Code, Lock } from 'lucide-react';

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
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse bg-gradient-to-br from-purple-500 to-blue-600 -top-20 -right-20 blur-3xl" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute w-80 h-80 rounded-full opacity-15 animate-pulse bg-gradient-to-br from-pink-500 to-red-500 -bottom-20 -left-20 blur-3xl" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                    <div className="absolute w-64 h-64 rounded-full opacity-10 animate-pulse bg-gradient-to-br from-green-500 to-teal-500 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-2xl" style={{ animationDuration: '8s', animationDelay: '4s' }}></div>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        ></div>
                    ))}
                </div>

                <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                    <div className="w-full max-w-2xl">
                        <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-12 shadow-2xl relative">
                            {/* Header glow effect */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 rounded-full"></div>
                            
                            {/* Logo section */}
                            <div className="text-center mb-12">
                                <div className="inline-block relative">
                                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                        <Code size={48} className="text-white relative z-10" />
                                        <div className="absolute -top-2 -right-2">
                                            <Sparkles size={20} className="text-yellow-300 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-purple-500/30 rounded-full blur-md"></div>
                                </div>
                                
                                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                                    CodeVM
                                </h1>
                                <p className="text-xl text-white/80 mb-2">Your Gateway to Cloud Development</p>
                                <p className="text-sm text-white/60">Powerful virtual machines for coding, testing, and deployment</p>
                            </div>

                            {/* Action buttons */}
                            <div className="space-y-4 max-w-md mx-auto">
                                <button 
                                    onClick={handleUserLoginClick} 
                                    className="group w-full relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg shadow-purple-500/30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center space-x-3">
                                        <User size={24} className="text-white" />
                                        <span className="text-white font-semibold text-lg">User Login</span>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={handleAdminLoginClick} 
                                    className="group w-full relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-green-500 to-teal-500 shadow-lg shadow-green-500/30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center space-x-3">
                                        <Shield size={24} className="text-white" />
                                        <span className="text-white font-semibold text-lg">Admin Login</span>
                                    </div>
                                </button>
                                
                                <button 
                                    onClick={handleRegisterClick} 
                                    className="group w-full relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-pink-500 to-red-500 shadow-lg shadow-pink-500/30"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center justify-center space-x-3">
                                        <LogIn size={24} className="text-white" />
                                        <span className="text-white font-semibold text-lg">Create Account</span>
                                    </div>
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-12 text-white/60">
                                <p className="text-sm">Secure • Fast • Reliable</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Login/Register screen
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute w-72 h-72 rounded-full opacity-20 animate-pulse bg-gradient-to-br from-purple-500 to-blue-600 top-20 right-20 blur-3xl" style={{ animationDuration: '6s' }}></div>
                <div className="absolute w-60 h-60 rounded-full opacity-15 animate-pulse bg-gradient-to-br from-green-500 to-teal-500 bottom-32 left-32 blur-3xl" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="w-full max-w-md">
                    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl relative">
                        {/* Header glow */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 rounded-full"></div>
                        
                        {/* Back button */}
                        <button
                            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-6 group"
                            onClick={handleBackToLanding}
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back</span>
                        </button>

                        {/* Logo */}
                        <div className="text-center mb-8">
                            <div className="inline-block relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <Code size={32} className="text-white relative z-10" />
                                </div>
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-2 bg-purple-500/30 rounded-full blur-sm"></div>
                            </div>
                            
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                                {isLoginMode ? 'Welcome Back' : 'Join CodeVM'}
                            </h2>
                            <p className="text-white/60 text-sm">
                                {isLoginMode ? 'Sign in to your account' : 'Create your account to get started'}
                            </p>
                        </div>

                        {currentAuthMessage && (
                            <div className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
                                {currentAuthMessage}
                            </div>
                        )}

                        <div className="space-y-6">
                            {!isLoginMode && (
                                <div className="group">
                                    <label className="block text-white/80 text-sm font-medium mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="group">
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <div className="group">
                                <label className="block text-white/80 text-sm font-medium mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all duration-300"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleSubmit}
                                className="group w-full relative overflow-hidden rounded-xl py-3 px-4 font-semibold text-white transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center space-x-2">
                                    <Lock size={18} />
                                    <span>{isLoginMode ? 'Sign In' : 'Create Account'}</span>
                                </div>
                            </button>
                        </div>
                        
                        <div className="text-center mt-6">
                            <p className="text-white/60 text-sm">
                                {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={() => { setIsLoginMode(!isLoginMode); setCurrentAuthMessage(''); }}
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    {isLoginMode ? 'Sign up here' : 'Sign in here'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                }
            `}</style>
        </div>
    );
}

export default AuthScreen;