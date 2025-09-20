// frontend/src/components/SubmissionsList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// NEW: Import the Code2 icon for the view code button
import { ListChecks, CheckCircle2, XCircle, Clock, Code2 } from 'lucide-react';
const api_url = import.meta.env.VITE_SERVER;


const SUBMISSION_API_BASE_URL = ` ${api_url}/api/submissions`;

function SubmissionsList({ userRole, isAuthenticated }) {
    const [submissions, setSubmissions] = useState([]);
    const [message, setMessage] = useState('');
    const [filterVerdict, setFilterVerdict] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    // NEW: State to hold the submission whose code we want to view in a modal
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSubmissions();
        } else {
            setSubmissions([]);
            setMessage('Please log in to view your submissions.');
        }
    }, [isAuthenticated, filterVerdict]);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            let url = SUBMISSION_API_BASE_URL;
            if (userRole === 'user') {
                url = `${SUBMISSION_API_BASE_URL}/user/${JSON.parse(atob(token.split('.')[1])).id}`;
            }

            const response = await axios.get(url, config);
            let filteredData = response.data;

            if (filterVerdict !== 'All') {
                filteredData = response.data.filter(sub => sub.verdict === filterVerdict);
            }
            setSubmissions(filteredData);
        } catch (error) {
            console.error('Error fetching submissions:', error);
            setMessage(`Failed to fetch submissions: ${error.response?.data?.message || error.message}`);
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

    return (
        <div className="bg-dark min-vh-100 py-5">
            <div className="container">
                <header className="bg-dark text-white p-4 mb-5 rounded-3 border-bottom border-info border-3">
                    <h1 className="h3 fw-bold mb-0 d-flex align-items-center">
                        <ListChecks size={28} className="me-2 text-info" /> Submissions Done
                    </h1>
                    <p className="text-muted">Review your past code submissions and their results.</p>
                </header>

                {message && (
                    <div className="alert alert-info alert-dismissible fade show mb-4 rounded-3" role="alert">
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}

                <div className="card card-themed shadow-lg mb-5 rounded-3">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h4 text mb-0 fw-semibold">All Submissions</h2>
                            <div className="d-flex align-items-center">
                                <label htmlFor="filterVerdict" className="form-label text mb-0 me-2">Filter by Verdict:</label>
                                <select
                                    id="filterVerdict"
                                    className="form-select form-select-themed rounded-pill"
                                    value={filterVerdict}
                                    onChange={(e) => setFilterVerdict(e.target.value)}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="All">All</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Wrong Answer">Wrong Answer</option>
                                    <option value="Time Limit Exceeded">Time Limit Exceeded</option>
                                    <option value="Memory Limit Exceeded">Memory Limit Exceeded</option>
                                    <option value="Runtime Error">Runtime Error</option>
                                    <option value="Compilation Error">Compilation Error</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="text-muted mt-2">Loading submissions...</p>
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center text-muted py-5 border border-secondary rounded-3 card-themed">
                                <p className="mb-0 fs-5">No submissions found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle table-themed">
                                    <thead className="table-secondary">
                                        <tr>
                                            <th className="text">Problem</th>
                                            <th className="text">Language</th>
                                            <th className="text">Verdict</th>
                                            <th className="text">Time</th>
                                            <th className="text">Memory</th>
                                            <th className="text">Submitted At</th>
                                            {userRole === 'admin' && <th className="text-white">User</th>}
                                            {/* NEW: Added a header for the view code action */}
                                            <th className="text text-center">Code</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map((sub) => (
                                            <tr key={sub._id}>
                                                <td>
                                                    <span className="text-info fw-semibold">{sub.problemId?.title || 'N/A'}</span>
                                                    <br/>
                                                    <span className={`badge rounded-pill ${
                                                        sub.problemId?.difficulty === 'Easy' ? 'bg-success' :
                                                        sub.problemId?.difficulty === 'Medium' ? 'bg-warning text-dark' :
                                                        sub.problemId?.difficulty === 'Hard' ? 'bg-danger' : 'bg-secondary'
                                                    } px-2 py-1 mt-1`}>
                                                        {sub.problemId?.difficulty || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="text">{sub.language.toUpperCase()}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${getVerdictBadgeClass(sub.verdict)} px-3 py-2`}>
                                                        {getVerdictIcon(sub.verdict)} {sub.verdict}
                                                    </span>
                                                </td>
                                                <td className="text">{sub.executionTime ? `${sub.executionTime} ms` : 'N/A'}</td>
                                                <td className="text">{sub.memoryUsed ? `${sub.memoryUsed} MB` : 'N/A'}</td>
                                                <td className="text">{new Date(sub.submittedAt).toLocaleString()}</td>
                                                {userRole === 'admin' && <td className="text">{sub.userId?.name || 'N/A'}</td>}
                                                {/* NEW: Added a button to trigger the modal */}
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-outline-info btn-sm"
                                                        onClick={() => setSelectedSubmission(sub)}
                                                    >
                                                        <Code2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* NEW: Modal to display the submitted code */}
            {selectedSubmission && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content bg-dark text-light border-secondary">
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">
                                    Submission for <span className="text-info">{selectedSubmission.problemId?.title}</span>
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setSelectedSubmission(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <pre className="bg-black p-3 rounded" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                                    <code>
                                        {selectedSubmission.code}
                                    </code>
                                </pre>
                            </div>
                            <div className="modal-footer border-secondary">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => setSelectedSubmission(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SubmissionsList;