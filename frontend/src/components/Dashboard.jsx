// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// FIX: Added all necessary lucide-react icon imports
import { User as UserIcon, Mail, BarChart, Clock, Award, Activity, CheckCircle, LogOut, ListChecks, Tag as TagIcon, Gauge, CheckCircle2, XCircle, MemoryStick } from 'lucide-react';

const USER_API_BASE_URL = 'http://localhost:5000/api/users';
const SUBMISSION_API_BASE_URL = 'http://localhost:5000/api/submissions';

function Dashboard({ userRole, isAuthenticated }) {
    const [userData, setUserData] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDashboardData();
        } else {
            setUserData(null);
            setUserStats(null);
            setRecentSubmissions([]);
            setUserActivity([]);
            setMessage('Please log in to view your dashboard.');
            setIsLoading(false);
        }
    }, [isAuthenticated, userRole]); // Re-fetch if auth status or role changes

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch user profile
            const profileResponse = await axios.get(`${USER_API_BASE_URL}/profile`, config);
            const currentUser = profileResponse.data;
            setUserData(currentUser);

            // Fetch user stats
            const statsResponse = await axios.get(`${USER_API_BASE_URL}/${currentUser._id}/stats`, config);
            setUserStats(statsResponse.data);

            // Fetch recent submissions
            const recentSubmissionsResponse = await axios.get(`${USER_API_BASE_URL}/${currentUser._id}/recent-submissions`, config);
            setRecentSubmissions(recentSubmissionsResponse.data);

            // Fetch user activity
            const activityResponse = await axios.get(`${USER_API_BASE_URL}/${currentUser._id}/activity`, config);
            setUserActivity(activityResponse.data);

        } catch (error) {
            console.error('Error fetching dashboard data:', error.response?.data || error.message);
            setMessage(`Failed to load dashboard data: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getVerdictBadgeClass = (verdict) => {
        switch (verdict) {
            case 'Accepted': return 'bg-success';
            case 'Wrong Answer': return 'bg-danger';
            case 'Time Limit Exceeded': return 'bg-warning text-dark';
            case 'Memory Limit Exceeded': return 'bg-warning text-dark';
            case 'Runtime Error': return 'bg-danger';
            case 'Compilation Error': return 'bg-danger';
            case 'Pending': return 'bg-secondary';
            default: return 'bg-info';
        }
    };

    const getVerdictIcon = (verdict) => {
        switch (verdict) {
            case 'Accepted': return <CheckCircle2 size={16} className="me-1" />;
            case 'Pending': return <Clock size={16} className="me-1" />;
            default: return <XCircle size={16} className="me-1" />;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-dark min-vh-100 d-flex align-items-center justify-content-center py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark min-vh-100 py-5">
            <div className="container">
                <header className="bg-dark text-white p-4 mb-5 rounded-3 border-bottom border-info border-3">
                    <h1 className="h3 fw-bold mb-0">Dashboard</h1>
                    <p className="text-light">Welcome back to CodeVM, {userData?.name || 'User'}!</p>
                </header>

                {message && (
                    <div className="alert alert-info alert-dismissible fade show mb-4 rounded-3" role="alert">
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}

                <div className="row g-4 mb-5">
                    {/* User Profile Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card card-themed shadow-lg rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <UserIcon size={48} className="text-primary-gradient mb-3" style={{backgroundImage: 'linear-gradient(to right, #a770ef, #cf8bf3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}/>
                                <h5 className="card-title text-light fw-bold mb-1">{userData?.name || 'N/A'}</h5>
                                <p className="card-text text-muted mb-3 d-flex align-items-center justify-content-center">
                                    <Mail size={16} className="me-2" /> {userData?.email || 'N/A'}
                                </p>
                                <span className="badge bg-info text-dark rounded-pill px-3 py-2">{userRole.toUpperCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="col-lg-4 col-md-6">
                        <div className="card card-themed shadow-lg rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <BarChart size={48} className="text-success-gradient mb-3" style={{backgroundImage: 'linear-gradient(to right, #20bf55, #01baef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}/>
                                <h5 className="card-title text-light fw-bold mb-2">Your Stats</h5>
                                {userStats ? (
                                    <ul className="list-unstyled text-start text-light small">
                                        <li className="mb-1"><strong>Total Submissions:</strong> {userStats.totalSubmissions}</li>
                                        <li className="mb-1"><strong>Accepted Submissions:</strong> {userStats.acceptedSubmissions}</li>
                                        <li className="mb-1"><strong>Problems Solved:</strong> {userStats.solvedProblemsCount}</li>
                                        <li className="mb-1"><strong>Difficulty Solved:</strong>
                                            <ul>
                                                <li>Easy: {userStats.difficultyStats.Easy || 0}</li>
                                                <li>Medium: {userStats.difficultyStats.Medium || 0}</li>
                                                <li>Hard: {userStats.difficultyStats.Hard || 0}</li>
                                            </ul>
                                        </li>
                                        <li className="mb-1"><strong>Tags Solved:</strong>
                                            <ul>
                                                {Object.entries(userStats.tagStats).length > 0 ? (
                                                    Object.entries(userStats.tagStats).map(([tag, count]) => (
                                                        <li key={tag}><TagIcon size={14} className="me-1 text-muted"/>{tag}: {count}</li>
                                                    ))
                                                ) : (
                                                    <li>None yet</li>
                                                )}
                                            </ul>
                                        </li>
                                    </ul>
                                ) : (
                                    <p className="text-muted">No stats available yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Submissions Card */}
                    <div className="col-lg-4 col-md-12">
                        <div className="card card-themed shadow-lg rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <ListChecks size={48} className="text-info-gradient mb-3" style={{backgroundImage: 'linear-gradient(to right, #01baef, #20bf55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}/>
                                <h5 className="card-title text-light fw-bold mb-2">Recent Submissions</h5>
                                {recentSubmissions.length > 0 ? (
                                    <ul className="list-group list-group-flush text-start small">
                                        {recentSubmissions.map(sub => (
                                            <li key={sub._id} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="text-info fw-semibold">{sub.problemId?.title || 'N/A'}</span>
                                                    <br/>
                                                    <span className={`badge rounded-pill ${getVerdictBadgeClass(sub.verdict)} px-2 py-1 mt-1`}>
                                                        {getVerdictIcon(sub.verdict)} {sub.verdict}
                                                    </span>
                                                </div>
                                                <span className="text-muted">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No recent submissions found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div className="row g-4">
                    <div className="col-12">
                        <div className="card card-themed shadow-lg rounded-3 h-100">
                            <div className="card-body text-center p-4">
                                <h5 className="card-title text-light fw-bold mb-3 d-flex align-items-center justify-content-center">
                                    <Activity size={24} className="me-2 text-info" /> Recent Activity
                                </h5>
                                {userActivity.length > 0 ? (
                                    <ul className="list-group list-group-flush text-start small">
                                        {userActivity.map((activity, index) => (
                                            <li key={index} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center">
                                                <span>{activity.description}</span>
                                                <span className="text-muted">{new Date(activity.timestamp).toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No recent activity found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
