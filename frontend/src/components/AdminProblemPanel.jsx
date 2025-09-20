import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    PlusCircle,
    SquarePen,
    Trash,
    Eye,
    User as UserIcon,
    Shield,
    FlaskConical,
    CheckCircle,
    XCircle,
    LogIn,
    LogOut,
    Search,
    Tag,
    Gauge
} from 'lucide-react';

const api_url = import.meta.env.VITE_SERVER;
// Base URL for your backend API
const API_BASE_URL = `${api_url}/api/problems`;

// --- Helper for Difficulty Badge Styles ---
const getDifficultyStyles = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return { backgroundColor: '#22c55e', color: 'white', border: '1px solid #16a34a' };
        case 'Medium':
            return { backgroundColor: '#f59e0b', color: 'black', border: '1px solid #d97706' };
        case 'Hard':
            return { backgroundColor: '#ef4444', color: 'white', border: '1px solid #dc2626' };
        default:
            return { backgroundColor: '#6b7280', color: 'white' };
    }
};

function AdminProblemPanel({ userRole, isAuthenticated, onLogout, onSolveProblem }) {
    const [problems, setProblems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [message, setMessage] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [problemToDeleteId, setProblemToDeleteId] = useState(null);

    // Test Case Management States
    const [testCases, setTestCases] = useState([]);
    const [isTestCaseModalOpen, setIsTestCaseModalOpen] = useState(false);
    const [currentTestCase, setCurrentTestCase] = useState(null);
    const [testCaseFormMode, setTestCaseFormMode] = useState('create');

    // Test Case Form States
    const [testCaseInput, setTestCaseInput] = useState('');
    const [testCaseOutput, setTestCaseOutput] = useState('');
    const [testCaseIsHidden, setTestCaseIsHidden] = useState(true);
    const [testCasePoints, setTestCasePoints] = useState(0);

    // Problem Form state (existing)
    const [title, setTitle] = useState('');
    const [statement, setStatement] = useState('');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [constraints, setConstraints] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [memoryLimit, setMemoryLimit] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [tags, setTags] = useState('');

    // Filter state
    const [filterTag, setFilterTag] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchProblems();
        } else {
            setProblems([]);
        }
    }, [isAuthenticated]);

    const fetchProblems = async () => {
        console.log(`Attempting to fetch problems from: ${API_BASE_URL}`);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers:
                {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await
                axios.get(API_BASE_URL, config);
            setProblems(response.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setMessage('Failed to fetch problems. Please ensure the backend server is running and you are logged in.');
        }
    };

    // --- Problem CRUD Handlers (Existing logic, no changes) ---
    const resetProblemForm = () => {
        setTitle('');
        setStatement('');
        setInput('');
        setOutput('');
        setConstraints('');
        setTimeLimit('');
        setMemoryLimit('');
        setDifficulty('Easy');
        setTags('');
        setCurrentProblem(null);
        setMessage('');
    };

    const openCreateProblemModal = () => {
        setFormMode('create');
        resetProblemForm();
        setIsModalOpen(true);
    };

    const openEditProblemModal = (problem) => {
        setFormMode('edit');
        setCurrentProblem(problem);
        setTitle(problem.title);
        setStatement(problem.statement);
        setInput(problem.input);
        setOutput(problem.output);
        setConstraints(problem.constraints);
        setTimeLimit(problem.timeLimit);
        setMemoryLimit(problem.memoryLimit);
        setDifficulty(problem.difficulty);
        setTags(problem.tags.join(', '));
        setIsModalOpen(true);
        fetchTestCases(problem._id);
    };

    const openViewProblemModal = (problem) => {
        setCurrentProblem(problem);
        setIsViewModalOpen(true);
    };

    const closeAllModals = () => {
        setIsModalOpen(false);
        setIsViewModalOpen(false);
        setIsConfirmModalOpen(false);
        setIsTestCaseModalOpen(false);
        setProblemToDeleteId(null);
        setCurrentProblem(null);
        resetProblemForm();
        resetTestCaseForm();
        setTestCases([]);
        setMessage('');
    };

    const handleProblemSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const problemData = {
            title,
            statement,
            input,
            output,
            constraints,
            timeLimit: Number(timeLimit),
            memoryLimit: Number(memoryLimit),
            difficulty,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        };

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (formMode === 'create') {
                await axios.post(API_BASE_URL, problemData, config);
                setMessage('Problem created successfully!');
            } else {
                await axios.put(`${API_BASE_URL}/${currentProblem._id}`, problemData, config);
                setMessage('Problem updated successfully!');
            }
            fetchProblems();
            closeAllModals();
        } catch (error) {
            console.error('Error submitting problem:', error);
            setMessage(`Failed to ${formMode} problem: ${error.response?.data?.message || error.message}`);
        }
    };

    const openConfirmDeleteProblemModal = (id) => {
        setProblemToDeleteId(id);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteProblem = async () => {
        if (!problemToDeleteId) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_BASE_URL}/${problemToDeleteId}`, config);
            setMessage('Problem deleted successfully!');
            fetchProblems();
            closeAllModals();
        } catch (error) {
            console.error('Error deleting problem:', error);
            setMessage(`Failed to delete problem: ${error.response?.data?.message || error.message}`);
            closeAllModals();
        }
    };

    // --- Test Case CRUD Handlers (Existing logic, no changes) ---
    const fetchTestCases = async (problemId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${API_BASE_URL}/${problemId}/testcases`, config);
            setTestCases(response.data);
        } catch (error) {
            console.error('Error fetching test cases:', error);
            setMessage('Failed to fetch test cases.');
        }
    };

    const resetTestCaseForm = () => {
        setTestCaseInput('');
        setTestCaseOutput('');
        setTestCaseIsHidden(true);
        setTestCasePoints(0);
        setCurrentTestCase(null);
    };

    const openCreateTestCaseModal = () => {
        setTestCaseFormMode('create');
        resetTestCaseForm();
        setIsTestCaseModalOpen(true);
    };

    const openEditTestCaseModal = (testCase) => {
        setTestCaseFormMode('edit');
        setCurrentTestCase(testCase);
        setTestCaseInput(testCase.input);
        setTestCaseOutput(testCase.output);
        setTestCaseIsHidden(testCase.isHidden);
        setTestCasePoints(testCase.points);
        setIsTestCaseModalOpen(true);
    };

    const handleTestCaseSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!currentProblem || !currentProblem._id) {
            setMessage('Error: Select a problem first to manage test cases.');
            return;
        }

        const testCaseData = {
            input: testCaseInput,
            output: testCaseOutput,
            isHidden: testCaseIsHidden,
            points: Number(testCasePoints),
        };

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (testCaseFormMode === 'create') {
                await axios.post(`${API_BASE_URL}/${currentProblem._id}/testcases`, testCaseData, config);
                setMessage('Test case created successfully!');
            } else {
                await axios.put(`${API_BASE_URL}/${currentProblem._id}/testcases/${currentTestCase._id}`, testCaseData, config);
                setMessage('Test case updated successfully!');
            }
            fetchTestCases(currentProblem._id);
            setIsTestCaseModalOpen(false);
            resetTestCaseForm();
        } catch (error) {
            console.error('Error submitting test case:', error);
            setMessage(`Failed to ${testCaseFormMode} test case: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteTestCase = async (testCaseId) => {
        if (!currentProblem || !currentProblem._id) {
            setMessage('Error: Select a problem first to delete test cases.');
            return;
        }
        if (window.confirm('Are you sure you want to delete this test case?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`${API_BASE_URL}/${currentProblem._id}/testcases/${testCaseId}`, config);
                setMessage('Test case deleted successfully!');
                fetchTestCases(currentProblem._id);
            } catch (error) {
                console.error('Error deleting test case:', error);
                setMessage(`Failed to delete test case: ${error.response?.data?.message || error.message}`);
            }
        }
    };


    const isAdmin = userRole === 'admin';

    const filteredProblems = problems.filter(problem =>
        problem.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())) || filterTag === ''
    );
    
    // --- Custom Styles for Themed UI ---
    const modalStyle = {
        backgroundColor: 'rgba(23, 23, 31, 1)',
        border: '1px solid #372948',
        color: '#d1d5db'
    };
    
    const inputStyle = {
        backgroundColor: '#2d3748',
        color: '#e2e8f0',
        border: '1px solid #4a5568'
    };


    return (
        <div className="min-vh-100 py-5" style={{ background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)', color: '#d1d5db' }}>
            <div className="container">

                {message && (
                    <div className="alert alert-info alert-dismissible fade show mb-4 rounded-3" role="alert" style={{backgroundColor: '#1e3a8a', color: '#e0f2fe', border: '1px solid #3b82f6'}}>
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}
                
                <div className="card shadow-lg mb-5" style={{ backgroundColor: 'rgba(23, 23, 31, 0.85)', border: '1px solid #372948', backdropFilter: 'blur(8px)', borderRadius: '1rem' }}>
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h4 text-light mb-0 fw-semibold">Problems List</h2>
                            {isAdmin && (
                                <button
                                    onClick={openCreateProblemModal}
                                    className="btn btn-lg d-flex align-items-center justify-content-center px-4 py-2 fw-bold rounded-pill"
                                    style={{ background: 'linear-gradient(90deg, #9333ea, #581c87)', border: 'none', color: 'white' }}
                                >
                                    <PlusCircle className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                    Add New Problem
                                </button>
                            )}
                        </div>

                        {/* Filter by Tags Input */}
                        <div className="mb-4">
                            <div className="input-group input-group-lg">
                                <span className="input-group-text rounded-start-pill" style={{backgroundColor: '#2d3748', border: '1px solid #4a5568'}}><Search size={20} color="#9333ea"/></span>
                                <input
                                    type="text"
                                    className="form-control rounded-end-pill"
                                    style={inputStyle}
                                    placeholder="Search tags: array, dp, hash..."
                                    value={filterTag}
                                    onChange={(e) => setFilterTag(e.target.value)}
                                />
                            </div>
                        </div>

                        {problems.length === 0 ? (
                            <div className="text-center text-muted py-5 rounded-3" style={{border: '2px dashed #372948'}}>
                                <p className="mb-0 fs-5">
                                    {isAuthenticated ? 'No problems found. Start by adding one!' : 'Please log in to view problems.'}
                                </p>
                            </div>
                        ) : (
                            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                                {filteredProblems.map((problem) => (
                                    <div className="col" key={problem._id}>
                                        <div className="card h-100 shadow-sm" style={{ backgroundColor: '#1f2029', border: '1px solid #3c305c', transition: 'transform 0.2s ease, box-shadow 0.2s ease', borderRadius: '0.75rem'}}>
                                            <div className="card-body d-flex flex-column">
                                                <h5 className="card-title text-light fw-bold mb-3"> {problem.title}</h5>
                                                
                                                <div className="mb-3">
                                                    <span className="badge rounded-pill me-2 px-3 py-2" style={getDifficultyStyles(problem.difficulty)}>
                                                        {problem.difficulty}
                                                    </span>
                                                </div>
                                                
                                                <div className="d-flex flex-wrap gap-2 mb-3">
                                                {problem.tags.map((tag, index) => (
                                                    <span key={index} className="badge rounded-pill" style={{backgroundColor: '#5843a1', color: '#e0d8ff'}}>{tag}</span>
                                                ))}
                                                </div>

                                              

                                                <div className="d-flex justify-content-start gap-2 mt-auto pt-3 border-top" style={{borderColor: '#3c305c'}}>
                                                    <button
                                                        onClick={() => onSolveProblem(problem)}
                                                        className="btn btn-sm rounded-pill px-3 fw-bold"
                                                        style={{ background: '#be123c', color: 'white', border: 'none' }}
                                                        title="Solve Problem"
                                                    >
                                                        Solve
                                                    </button>
                                                    <button
                                                        onClick={() => openViewProblemModal(problem)}
                                                        className="btn btn-sm rounded-pill px-3"
                                                        style={{ background: '#3b3b8f', color: 'white', border: 'none' }}
                                                        title="View Problem"
                                                    >
                                                        View
                                                    </button>
                                                    {isAdmin && (
                                                        <>
                                                            <button
                                                                onClick={() => openEditProblemModal(problem)}
                                                                className="btn btn-sm rounded-pill px-3"
                                                                style={{ background: '#b45309', color: 'white', border: 'none' }}
                                                                title="Edit Problem"
                                                            >
                                                                <SquarePen size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => openConfirmDeleteProblemModal(problem._id)}
                                                                className="btn btn-sm rounded-pill px-3"
                                                                style={{ background: '#4b5563', color: 'white', border: 'none' }}
                                                                title="Delete Problem"
                                                            >
                                                                <Trash size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- ALL MODALS --- */}
                
                {/* Problem Create/Edit Modal */}
                {isModalOpen && isAdmin && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content shadow-lg rounded-4" style={modalStyle}>
                                <div className="modal-header rounded-top-4" style={{backgroundColor: '#111827', borderBottom: '1px solid #372948'}}>
                                    <h5 className="modal-title fw-bold" style={{ color: '#a78bfa' }}>{formMode === 'create' ? 'Create New Problem' : 'Edit Problem'}</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={closeAllModals}></button>
                                </div>
                                <form onSubmit={handleProblemSubmit}>
                                    <div className="modal-body row g-3 p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        {/* Form fields with updated styles */}
                                        <div className="col-md-6"><label className="form-label text-light fw-semibold">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control form-control-lg rounded-pill" style={inputStyle} required /></div>
                                        <div className="col-md-6"><label className="form-label text-light fw-semibold">Difficulty</label><select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="form-select form-select-lg rounded-pill" style={inputStyle} required><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                                        <div className="col-12"><label className="form-label text-light fw-semibold">Problem Statement</label><textarea value={statement} onChange={(e) => setStatement(e.target.value)} rows="5" className="form-control rounded-3" style={inputStyle} required></textarea></div>
                                        <div className="col-md-6"><label className="form-label text-light fw-semibold">Input Format</label><textarea value={input} onChange={(e) => setInput(e.target.value)} rows="3" className="form-control rounded-3" style={inputStyle} required></textarea></div>
                                        <div className="col-md-6"><label className="form-label text-light fw-semibold">Output Format</label><textarea value={output} onChange={(e) => setOutput(e.target.value)} rows="3" className="form-control rounded-3" style={inputStyle} required></textarea></div>
                                        <div className="col-12"><label className="form-label text-light fw-semibold">Constraints</label><textarea value={constraints} onChange={(e) => setConstraints(e.target.value)} rows="3" className="form-control rounded-3" style={inputStyle} required></textarea></div>
                                        <div className="col-md-6"><label className="form-label text-light fw-semibold">Time Limit (s)</label><input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="form-control form-control-lg rounded-pill" style={inputStyle} required min="1" /></div>
                                        <div className="col-md-6"><label className="form-label text-light fw-semibold">Memory Limit (MB)</label><input type="number" value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} className="form-control form-control-lg rounded-pill" style={inputStyle} required min="1" /></div>
                                        <div className="col-12"><label className="form-label text-light fw-semibold">Tags (comma-separated)</label><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="form-control form-control-lg rounded-pill" style={inputStyle} placeholder="e.g., Array, DP, Graph" /></div>
                                        
                                        {/* Test Cases Section */}
                                        {formMode === 'edit' && currentProblem && (
                                            <div className="col-12 mt-5">
                                                <h4 className="mb-3 d-flex align-items-center" style={{color: '#818cf8'}}><FlaskConical size={24} className="me-2" /> Test Cases</h4>
                                                <button onClick={openCreateTestCaseModal} type="button" className="btn btn-outline-success d-flex align-items-center rounded-pill px-3 py-2 float-end mb-3"><PlusCircle size={16} className="me-2" /> Add Test Case</button>
                                                {testCases.length === 0 ? <div className="alert alert-secondary text-center rounded-3" style={{...inputStyle, color: '#a7a3b3'}}>No test cases found.</div> : (
                                                    <div className="table-responsive">
                                                        <table className="table table-sm table-bordered table-hover align-middle" style={{'--bs-table-bg': 'transparent', '--bs-table-border-color': '#4a5568', color: '#d1d5db'}}>
                                                            <thead style={{backgroundColor: '#372948'}}><tr className="text-white"><th>#</th><th>Input</th><th>Output</th><th>Hidden</th><th>Points</th><th>Actions</th></tr></thead>
                                                            <tbody>{testCases.map((tc, index) => (
                                                                <tr key={tc._id}>
                                                                    <td>{index + 1}</td>
                                                                    <td><pre className="mb-0 small p-2 rounded" style={inputStyle}>{tc.input}</pre></td>
                                                                    <td><pre className="mb-0 small p-2 rounded" style={inputStyle}>{tc.output}</pre></td>
                                                                    <td>{tc.isHidden ? <XCircle size={20} className="text-danger" /> : <CheckCircle size={20} className="text-success" />}</td>
                                                                    <td>{tc.points}</td>
                                                                    <td><div className="d-flex gap-2"><button onClick={() => openEditTestCaseModal(tc)} type="button" className="btn btn-sm btn-outline-warning rounded-circle p-1"><SquarePen size={14} /></button><button onClick={() => handleDeleteTestCase(tc._id)} type="button" className="btn btn-sm btn-outline-danger rounded-circle p-1"><Trash size={14} /></button></div></td>
                                                                </tr>))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer justify-content-center border-top-0 pt-0 pb-3">
                                        <button type="button" onClick={closeAllModals} className="btn btn-secondary btn-lg rounded-pill px-5" style={{backgroundColor: '#4b5563'}}>Cancel</button>
                                        <button type="submit" className="btn btn-lg rounded-pill px-5 fw-bold" style={{ background: 'linear-gradient(90deg, #9333ea, #581c87)', border: 'none', color: 'white' }}>{formMode === 'create' ? 'Create Problem' : 'Update Problem'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {/* Test Case Create/Edit Modal (NEW) */}
                {isTestCaseModalOpen && isAdmin && currentProblem && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content card-themed shadow-lg rounded-4 border-secondary">
                                <div className="modal-header bg-dark text-white rounded-top-4 border-secondary">
                                    <h5 className="modal-title fw-bold" style={{ color: 'var(--success-accent)' }}>
                                        {testCaseFormMode === 'create' ? 'Add New Test Case' : 'Edit Test Case'} for "{currentProblem.title}"
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setIsTestCaseModalOpen(false)} aria-label="Close"></button>
                                </div>
                                <form onSubmit={handleTestCaseSubmit}>
                                    <div className="modal-body row g-3 p-4">
                                        <div className="col-12">
                                            <label htmlFor="testCaseInput" className="form-label text-light fw-semibold">Input</label>
                                            <textarea id="testCaseInput" value={testCaseInput} onChange={(e) => setTestCaseInput(e.target.value)} className="form-control form-control-themed rounded-3" required rows="5"></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="testCaseOutput" className="form-label text-light fw-semibold">Output</label>
                                            <textarea id="testCaseOutput" value={testCaseOutput} onChange={(e) => setTestCaseOutput(e.target.value)} className="form-control form-control-themed rounded-3" required rows="5"></textarea>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="testCasePoints" className="form-label text-light fw-semibold">Points</label>
                                            <input type="number" id="testCasePoints" value={testCasePoints} onChange={(e) => setTestCasePoints(e.target.value)} className="form-control form-control-themed rounded-pill" required min="0" />
                                        </div>
                                        <div className="col-md-6 d-flex align-items-center">
                                            <div className="form-check form-switch mt-4">
                                                <input className="form-check-input" type="checkbox" id="testCaseIsHidden" checked={testCaseIsHidden} onChange={(e) => setTestCaseIsHidden(e.target.checked)} />
                                                <label className="form-check-label text-light fw-semibold" htmlFor="testCaseIsHidden">Hidden Test Case</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer justify-content-center border-top-0 pt-0">
                                        <button type="button" onClick={() => setIsTestCaseModalOpen(false)} className="btn btn-secondary btn-lg rounded-pill px-4">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success-gradient btn-lg rounded-pill px-4 fw-bold">
                                            {testCaseFormMode === 'create' ? 'Add Test Case' : 'Update Test Case'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Problem View Modal (Accessible by both Admin and User) */}
                {isViewModalOpen && currentProblem && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content card-themed shadow-lg rounded-4 border-secondary">
                                <div className="modal-header bg-dark text-white rounded-top-4 border-secondary">
                                    <h5 className="modal-title fw-bold" style={{ color: 'var(--primary-accent)' }}>{currentProblem.title}</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={closeAllModals} aria-label="Close"></button>
                                </div>
                                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <p className="mb-1 text"><strong>Difficulty:</strong></p>
                                            <span className={`badge rounded-pill ${
                                                currentProblem.difficulty === 'Easy' ? 'bg-success' :
                                                currentProblem.difficulty === 'Medium' ? 'bg-warning text-dark' :
                                                'bg-danger'
                                            } px-3 py-2`}>
                                                <Gauge size={14} className="me-1" /> {currentProblem.difficulty}
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <p className="mb-1 text"><strong>Time Limit:</strong></p>
                                            <span className="fw-bold text-info">{currentProblem.timeLimit}</span> seconds
                                        </div>
                                        <div className="col-md-4">
                                            <p className="mb-1 text"><strong>Memory Limit:</strong></p>
                                            <span className="fw-bold text-info">{currentProblem.memoryLimit}</span> MB
                                        </div>
                                    </div>
                                    <p className="mb-3 text"><strong>Tags:</strong> {currentProblem.tags.length > 0 ? (
                                        currentProblem.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-info text-dark me-1 rounded-pill"><Tag size={12} className="me-1" />{tag}</span>
                                        ))
                                    ) : (
                                        <span className="fst-italic">None</span>
                                    )}</p>
                                    <hr className="my-4 border-secondary" />
                                    <h6 className="mt-3 fw-bold text-info">Problem Statement:</h6>
                                    <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6">{currentProblem.statement}</pre>
                                    <h6 className="mt-4 fw-bold text-info">Input Format:</h6>
                                    <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6">{currentProblem.input}</pre>
                                    <h6 className="mt-4 fw-bold text-info">Output Format:</h6>
                                    <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6">{currentProblem.output}</pre>
                                    <h6 className="mt-4 fw-bold text-info">Constraints:</h6>
                                    <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6">{currentProblem.constraints}</pre>
                                </div>
                                <div className="modal-footer justify-content-center border-top-0 pt-0">
                                    <button
                                        type="button"
                                        onClick={closeAllModals}
                                        className="btn btn-primary-gradient btn-lg rounded-pill px-4 fw-bold"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Custom Confirmation Modal for Deletion (Admin Only) */}
                {isConfirmModalOpen && isAdmin && (
                    <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-sm modal-dialog-centered">
                            <div className="modal-content card-themed shadow-lg rounded-3 border-secondary">
                                <div className="modal-header bg-dark text-white rounded-top-3 border-secondary">
                                    <h5 className="modal-title fw-bold text-danger">Confirm Deletion</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={closeAllModals} aria-label="Close"></button>
                                </div>
                                <div className="modal-body text-center p-4">
                                    <p className="mb-4 fs-5 text-light">Are you sure you want to delete this problem?</p>
                                    <p className="text-danger fw-bold">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer justify-content-center border-top-0 pt-0">
                                    <button
                                        type="button"
                                        onClick={closeAllModals}
                                        className="btn btn-secondary btn-lg rounded-pill px-4"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteProblem}
                                        className="btn btn-danger btn-lg rounded-pill px-4 fw-bold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
       
            </div>
        </div>
    );
}

export default AdminProblemPanel;

