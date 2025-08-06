// frontend/src/components/Navbar.jsx
import React from 'react';
import { Sun, Moon, User as UserIcon, Shield, LogOut, LogIn, LayoutDashboard, Code, Trophy, ListChecks } from 'lucide-react';

function Navbar({ isAuthenticated, userRole, onLogout, onNavigate, toggleTheme, isDarkMode }) {
    const isAdmin = userRole === 'admin';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
            <div className="container-fluid px-5">
                <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => onNavigate('problems')}>
                    <img src="/codevm_logo.jpeg" alt="CodeVM Logo" className="me-2" style={{ maxWidth: '35px', height: 'auto' }} />
                    <span className="fw-bold fs-5" style={{ backgroundImage: 'linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        CodeVM
                    </span>
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {isAuthenticated && (
                            <>
                                <li className="nav-item">
                                    <a className={`nav-link ${userRole === 'admin' ? 'text-info' : 'text-light'}`} href="#" onClick={() => onNavigate('dashboard')}>
                                        <LayoutDashboard size={18} className="me-1" /> Dashboard
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-light" href="#" onClick={() => onNavigate('problems')}>
                                        <Code size={18} className="me-1" /> Problems
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-light" href="#" onClick={() => onNavigate('contests')}>
                                        <Trophy size={18} className="me-1" /> Contests
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-light" href="#" onClick={() => onNavigate('submissions')}>
                                        <ListChecks size={18} className="me-1" /> Submissions
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                    <div className="d-flex align-items-center">
                        {isAuthenticated && (
                            <span className="badge bg-secondary me-3 p-2 rounded-pill">
                                {isAdmin ? <Shield size={16} className="me-1" /> : <UserIcon size={16} className="me-1" />}
                                {userRole.toUpperCase()}
                            </span>
                        )}
                        <button onClick={toggleTheme} className="btn btn-outline-secondary rounded-circle me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        {isAuthenticated ? (
                            <button onClick={onLogout} className="btn btn-outline-danger d-flex align-items-center rounded-pill px-3 py-2">
                                <LogOut size={16} className="me-2" /> Logout
                            </button>
                        ) : (
                            <button onClick={() => alert('Please implement actual navigation to login page or open login modal.')} className="btn btn-outline-success d-flex align-items-center rounded-pill px-3 py-2">
                                <LogIn size={16} className="me-2" /> Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
