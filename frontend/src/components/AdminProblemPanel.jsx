// frontend/src/components/AdminProblemPanel.jsx
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
    Gauge,
    ChevronDown, // Added for dropdown icon
} from 'lucide-react';

const api_url = import.meta.env.VITE_SERVER;
// Base URL for your backend API
const API_BASE_URL = `${api_url}/api/problems`;

// --- Helper function to get difficulty class ---
const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return 'difficulty-easy';
        case 'Medium':
            return 'difficulty-medium';
        case 'Hard':
            return 'difficulty-hard';
        default:
            return '';
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(API_BASE_URL, config);
            setProblems(response.data);
        } catch (error) {
            console.error('Error fetching problems:', error);
            setMessage('Failed to fetch problems. Please ensure the backend server is running and you are logged in.');
        }
    };

    // --- Problem CRUD Handlers (No Changes Here) ---
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

        console.log('Submitting problem data:', problemData);

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

    // --- Test Case CRUD Handlers (No Changes Here) ---
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

    return (
        <div className="py-5" style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
        {/*
            =========================================================================
            FIX: The entire comment block below is now wrapped in { ... }
            which is the correct syntax for multi-line comments inside JSX.
            =========================================================================
        */}
        {/*
            * =========================================================================
            * UI ENHANCEMENT NOTES:
            * The following JSX has been updated to match the provided image.
            * For the full visual effect, add the following styles to your CSS file:
            *
            * body {
            * background-color: #0f0c29;
            * background-image: linear-gradient(to right top, #0c0a1f, #1a1a36, #282a4d, #363c66, #454e80);
            * color: #e0e0e0;
            * }
            *
            * .problem-card {
            * background: rgba(22, 22, 38, 0.7);
            * border: 1px solid #3a3a5a;
            * border-radius: 12px;
            * padding: 1.5rem;
            * transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            * display: flex;
            * flex-direction: column;
            * height: 100%;
            * }
            *
            * .problem-card:hover {
            * transform: translateY(-5px);
            * box-shadow: 0 8px 30px rgba(78, 78, 255, 0.2);
            * }
            *
            * .problem-card .qid {
            * color: #a0a0c0;
            * font-weight: 500;
            * font-size: 0.9rem;
            * }
            *
            * .problem-card .problem-title {
            * color: #ffffff;
            * font-size: 1.25rem;
            * font-weight: 600;
            * margin-top: 0.5rem;
            * }
            *
            * .problem-card .tags-container {
            * display: flex;
            * flex-wrap: wrap;
            * gap: 0.5rem;
            * margin-top: 1rem;
            * }
            *
            * .problem-card .tag {
            * background-color: #3a3a5a;
            * color: #c0c0e0;
            * padding: 0.25rem 0.75rem;
            * border-radius: 12px;
            * font-size: 0.75rem;
            * }
            *
            * .problem-card .info-footer {
            * margin-top: 1.5rem;
            * margin-bottom: 1.5rem;
            * display: flex;
            * align-items: center;
            * gap: 1rem;
            * flex-grow: 1; 
            * }
            *
            * .difficulty-easy, .difficulty-medium, .difficulty-hard {
            * padding: 0.3rem 1rem;
            * border-radius: 12px;
            * font-weight: 600;
            * font-size: 0.8rem;
            * text-transform: uppercase;
            * }
            *
            * .difficulty-easy { background-color: rgba(25, 135, 84, 0.2); color: #198754; }
            * .difficulty-medium { background-color: rgba(255, 193, 7, 0.2); color: #ffc107; }
            * .difficulty-hard { background-color: rgba(220, 53, 69, 0.2); color: #dc3545; }
            *
            * .problem-card .time-limit {
            * color: #a0a0c0;
            * font-size: 0.9rem;
            * }
            *
            * .btn-view, .btn-solve {
            * width: 100%;
            * padding: 0.6rem;
            * border-radius: 8px;
            * border: none;
            * font-weight: 600;
            * transition: background-color 0.2s;
            * }
            *
            * .btn-view { background-color: #0d6efd; color: white; }
            * .btn-view:hover { background-color: #0b5ed7; }
            *
            * .btn-solve { background-color: #dc3545; color: white; }
            * .btn-solve:hover { background-color: #bb2d3b; }
            *
            * .search-bar-container {
            * display: flex;
            * gap: 1rem;
            * background-color: #161626;
            * padding: 0.75rem;
            * border-radius: 12px;
            * border: 1px solid #3a3a5a;
            * }
            *
            * .search-bar-container .search-input {
            * flex-grow: 1;
            * background-color: transparent;
            * border: none;
            * color: white;
            * }
            * .search-bar-container .search-input:focus { box-shadow: none; }
            *
            * .filter-dropdown {
            * background-color: #2a2a4a;
            * color: #e0e0e0;
            * border: 1px solid #3a3a5a;
            * border-radius: 8px;
            * padding: 0.5rem 1rem;
            * }
            *
            * =========================================================================
        */}
            <div className="container">

                {message && (
                    <div className="alert alert-info alert-dismissible fade show mb-4 rounded-3" role="alert">
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}

                {/* --- Enhanced Search and Filter Bar --- */}
                <div className="search-bar-container mb-5 d-flex align-items-center">
                    <Search size={20} className="text-muted me-2" />
                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search tags: array, dp, hash, tree..."
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                    />
                    <div className="d-flex gap-3">
                        <button className="filter-dropdown d-flex align-items-center">
                            All Difficulties <ChevronDown size={16} className="ms-2" />
                        </button>
                        <button className="filter-dropdown d-flex align-items-center">
                            All Problems <ChevronDown size={16} className="ms-2" />
                        </button>
                         {isAdmin && (
                            <button onClick={openCreateProblemModal} className="btn btn-primary d-flex align-items-center">
                                <PlusCircle size={16} className="me-2" /> Add
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Enhanced Problems Grid --- */}
                {problems.length === 0 ? (
                    <div className="text-center text-muted py-5 border border-secondary rounded-3 card-themed">
                        <p className="mb-0 fs-5">
                            {isAuthenticated ? 'No problems found. Start by adding one (if admin) or check back later!' : 'Please log in to view problems.'}
                        </p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {filteredProblems.map((problem, index) => (
                            <div className="col" key={problem._id}>
                                <div className="problem-card">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="qid">QID {index + 1}</span>
                                        {isAdmin && (
                                           <div className="admin-actions d-flex gap-2">
                                                <button onClick={() => openEditProblemModal(problem)} className="btn btn-sm btn-outline-warning p-1" style={{width: '28px', height: '28px'}} title="Edit">
                                                    <SquarePen size={14}/>
                                                </button>
                                                <button onClick={() => openConfirmDeleteProblemModal(problem._id)} className="btn btn-sm btn-outline-danger p-1" style={{width: '28px', height: '28px'}} title="Delete">
                                                    <Trash size={14}/>
                                                </button>
                                           </div>
                                        )}
                                    </div>

                                    <h5 className="problem-title">{problem.title}</h5>

                                    <div className="tags-container">
                                        {problem.tags.map((tag, i) => (
                                            <span key={i} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="info-footer">
                                        <span className={getDifficultyClass(problem.difficulty)}>
                                            {problem.difficulty}
                                        </span>
                                        <span className="time-limit">{problem.timeLimit}s</span>
                                    </div>

                                    <div className="d-flex gap-3 mt-auto">
                                        <button onClick={() => openViewProblemModal(problem)} className="btn-view">
                                            View
                                        </button>
                                        {!isAdmin && isAuthenticated && (
                                            <button onClick={() => onSolveProblem(problem)} className="btn-solve">
                                                Solve
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Modals (Styling is kept as is, as they were not in the image) --- */}
            
            {/* Problem Create/Edit Modal (Admin Only) */}
             {isModalOpen && isAdmin && (
                 <div className="modal d-block fade show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                     <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                         <div className="modal-content card-themed shadow-lg rounded-4 border-secondary">
                             <div className="modal-header bg-dark text-white rounded-top-4 border-secondary">
                                 <h5 className="modal-title fw-bold" style={{ color: 'var(--primary-accent)' }}>{formMode === 'create' ? 'Create New Problem' : 'Edit Problem'}</h5>
                                 <button type="button" className="btn-close btn-close-white" onClick={closeAllModals} aria-label="Close"></button>
                             </div>
                             <form onSubmit={handleProblemSubmit}>
                                 <div className="modal-body row g-3 p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="col-md-6">
                                        <label htmlFor="title" className="form-label text-light fw-semibold">Title</label>
                                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control form-control-lg form-control-themed rounded-pill" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="difficulty" className="form-label text-light fw-semibold">Difficulty</label>
                                        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="form-select form-select-lg form-select-themed rounded-pill" required>
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="statement" className="form-label text-light fw-semibold">Problem Statement</label>
                                        <textarea id="statement" value={statement} onChange={(e) => setStatement(e.target.value)} rows="5" className="form-control form-control-themed rounded-3" required></textarea>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="input" className="form-label text-light fw-semibold">Input Format</label>
                                        <textarea id="input" value={input} onChange={(e) => setInput(e.target.value)} rows="3" className="form-control form-control-themed rounded-3" required></textarea>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="output" className="form-label text-light fw-semibold">Output Format</label>
                                        <textarea id="output" value={output} onChange={(e) => setOutput(e.target.value)} rows="3" className="form-control form-control-themed rounded-3" required></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="constraints" className="form-label text-light fw-semibold">Constraints</label>
                                        <textarea id="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} rows="3" className="form-control form-control-themed rounded-3" required></textarea>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="timeLimit" className="form-label text-light fw-semibold">Time Limit (seconds)</label>
                                        <input type="number" id="timeLimit" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="form-control form-control-lg form-control-themed rounded-pill" required min="1" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="memoryLimit" className="form-label text-light fw-semibold">Memory Limit (MB)</label>
                                        <input type="number" id="memoryLimit" value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)} className="form-control form-control-lg form-control-themed rounded-pill" required min="1" />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="tags" className="form-label text-light fw-semibold">Tags (comma-separated)</label>
                                        <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="form-control form-control-lg form-control-themed rounded-pill" placeholder="e.g., Array, DP, Graph" />
                                    </div>
                                     {formMode === 'edit' && currentProblem && (
                                         <div className="col-12 mt-5">
                                         </div>
                                     )}
                                 </div>
                                 <div className="modal-footer justify-content-center border-top-0 pt-0">
                                     <button type="button" onClick={closeAllModals} className="btn btn-secondary btn-lg rounded-pill px-4">Cancel</button>
                                     <button type="submit" className="btn btn-primary-gradient btn-lg rounded-pill px-4 fw-bold">{formMode === 'create' ? 'Create Problem' : 'Update Problem'}</button>
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
            
        );
    }

export default AdminProblemPanel; // FIX: Added export default


