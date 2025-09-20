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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                    {/* Header Section */}
                    <div className="text-center mb-16 max-w-4xl">
                        <div className="flex items-center justify-center mb-8">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
                                <Code size={48} className="text-white" />
                            </div>
                        </div>
                        
                        <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                            CodeVM
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-slate-300 mb-4 font-light">
                            Master algorithms, ace interviews, build your future
                        </p>
                        
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Join thousands of developers improving their coding skills with our comprehensive online judge platform
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-6xl w-full">
                        <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-xl p-6 text-center hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Zap size={24} className="text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Real-time Judge</h3>
                            <p className="text-slate-400 text-sm">Instant feedback on your solutions</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-xl p-6 text-center hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Trophy size={24} className="text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Competitions</h3>
                            <p className="text-slate-400 text-sm">Weekly contests and challenges</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-xl p-6 text-center hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users size={24} className="text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Community</h3>
                            <p className="text-slate-400 text-sm">Learn with fellow developers</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-xl p-6 text-center hover:bg-white hover:bg-opacity-10 transition-all duration-300 hover:scale-105">
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Code size={24} className="text-white" />
                            </div>
                            <h3 className="text-white font-semibold mb-2">Multi-Language</h3>
                            <p className="text-slate-400 text-sm">Support for 20+ languages</p>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-8 max-w-md w-full">
                        <div className="space-y-4">
                            <button 
                                onClick={handleUserLoginClick} 
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                            >
                                <User size={20} />
                                <span>Continue as Student</span>
                            </button>
                            
                            <button 
                                onClick={handleAdminLoginClick} 
                                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                            >
                                <Shield size={20} />
                                <span>Admin Access</span>
                            </button>
                            
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-800 text-slate-400">or</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleRegisterClick} 
                                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                            >
                                <LogIn size={20} />
                                <span>Create New Account</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-2xl">
                        <div>
                            <div className="text-3xl font-bold text-blue-400 mb-1">50K+</div>
                            <div className="text-slate-400 text-sm">Active Users</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-purple-400 mb-1">10K+</div>
                            <div className="text-slate-400 text-sm">Problems</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-400 mb-1">25+</div>
                            <div className="text-slate-400 text-sm">Languages</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Login/Register screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-32 left-8 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute bottom-32 right-8 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button
                        className="mb-8 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
                        onClick={handleBackToLanding}
                    >
                        <ArrowLeft size={20} />
                        <span>Back to home</span>
                    </button>

                    {/* Auth Card */}
                    <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Code size={28} className="text-white" />
                            </div>
                            
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                {isLoginMode ? 'Welcome Back' : 'Join CodeVM'}
                            </h2>
                            
                            <p className="text-slate-400">
                                {isLoginMode ? 'Sign in to continue your coding journey' : 'Start your coding journey today'}
                            </p>
                        </div>

                        {/* Error Message */}
                        {currentAuthMessage && (
                            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-lg text-red-400 text-sm">
                                {currentAuthMessage}
                            </div>
                        )}

                        {/* Form */}
                        <div className="space-y-6">
                            {!isLoginMode && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={20} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={20} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                {isLoginMode ? 'Sign In' : 'Create Account'}
                            </button>
                        </div>
                        
                        {/* Switch Mode */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400">
                                {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
                                <button
                                    onClick={() => { setIsLoginMode(!isLoginMode); setCurrentAuthMessage(''); }}
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                                >
                                    {isLoginMode ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500">
                            Protected by enterprise-grade security
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}