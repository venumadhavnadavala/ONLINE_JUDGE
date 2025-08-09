import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    XCircle, Code, Send, Play, CheckCircle2, AlertTriangle, Clock, MemoryStick
} from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import ReactMarkdown from 'react-markdown';

// API URLs
const api_url = import.meta.env.VITE_SERVER;
const api_com = import.meta.env.VITE_COMPILER;
const SUBMISSION_API_BASE_URL = ` ${api_url}/api/submissions`;
const COMPILER_RUN_URL = ` ${api_com}/run`;
const DRAFT_API_BASE_URL =  ` ${api_url}/api/drafts`;
// New API URL for the backend's AI review endpoint
const AI_REVIEW_API_URL =  ` ${api_url}/api/ai-review`;


function SolveProblemScreen({ problem, onClose, isAuthenticated }) {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [compileMessage, setCompileMessage] = useState('');
    const [inputStdin, setInputStdin] = useState('');
    const [outputStdout, setOutputStdout] = useState('');
    const [activeTab, setActiveTab] = useState('test');
    const [finalVerdict, setFinalVerdict] = useState('Pending');
    const [executionTime, setExecutionTime] = useState(0);
    const [memoryUsed, setMemoryUsed] = useState(0);
    const [isRunningCustomTest, setIsRunningCustomTest] = useState(false);
    const [verdicts, setVerdicts] = useState([]);
    const [totalTime, setTotalTime] = useState(null);
    const [testResults, setTestResults] = useState([]);

    // State for AI review content and loading status
    const [aiReviewContent, setAiReviewContent] = useState('');
    const [isAIRunning, setIsAIRunning] = useState(false);

    // --- Draft Persistence Logic ---
    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const saveDraft = useCallback(debounce(async (currentCode, currentLanguage, currentProblemId) => {
        if (!isAuthenticated || !currentCode || !currentProblemId) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(DRAFT_API_BASE_URL, {
                problemId: currentProblemId,
                code: currentCode,
                language: currentLanguage,
            }, config);
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }, 1000), [isAuthenticated]);

    useEffect(() => {
        const loadDraft = async () => {
            if (!isAuthenticated || !problem || !problem._id) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${DRAFT_API_BASE_URL}/${problem._id}`, config);
                if (response.data.draft) {
                    setCode(response.data.draft.code);
                    setLanguage(response.data.draft.language);
                }
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        };
        loadDraft();
    }, [isAuthenticated, problem]);

    useEffect(() => {
        if (isAuthenticated && problem && problem._id && (code !== '' || language !== 'cpp')) {
            saveDraft(code, language, problem._id);
        }
    }, [code, language, problem, isAuthenticated, saveDraft]);

    // --- Event Handlers ---
    const handleRunCode = async () => {
        setCompileMessage('');
        setOutputStdout('');
        setTestResults([]);
        setSubmissionMessage('');
        setIsRunningCustomTest(true);
        setActiveTab('test');

        const currentInput = activeTab === 'customTest'
            ? inputStdin
            : (problem.testCases && problem.testCases.length > 0 ? problem.testCases[0].input : '');

        const runData = {
            code,
            language,
            input: currentInput
        };

        try {
            const response = await axios.post(COMPILER_RUN_URL, runData);
            setCompileMessage(response.data.error ? 'Compilation Error' : 'Successfully Executed');
            setOutputStdout(response.data.output || response.data.error || '');
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error during custom run.';
            setCompileMessage('Execution Failed');
            setOutputStdout(errorMessage);
        } finally {
            setIsRunningCustomTest(false);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setSubmissionMessage('');
        setIsSubmitting(true);
        setCompileMessage('');
        setOutputStdout('');
        setFinalVerdict('Pending...');
        setExecutionTime(0);
        setMemoryUsed(0);
        setVerdicts([]);
        setTotalTime(null);
        setActiveTab('verdict');

        const submissionData = { problemId: problem._id, code, language };

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.post(SUBMISSION_API_BASE_URL, submissionData, config);

            const data = response.data;
            setSubmissionMessage(`Submission evaluated!`);
            setFinalVerdict(data.verdict);
            setExecutionTime(data.executionTime || 0);
            setMemoryUsed(data.memoryUsed || 0);
            setTotalTime(data.executionTime || 0);
            setVerdicts(data.verdicts && Array.isArray(data.verdicts) ? data.verdicts : []);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            setSubmissionMessage(`Submission failed: ${errorMessage}`);
            setFinalVerdict('Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- AI Integration Logic (Updated) ---
    const handleGetAIReview = async () => {
        setAiReviewContent('');
        setIsAIRunning(true);
        setActiveTab('aiReview'); // Switch to AI Review tab

        // The payload now only contains the code and language
        const reviewData = {
            userCode: code,
            language: language,
        };

        try {
            // Call your backend's API endpoint
            const response = await axios.post(AI_REVIEW_API_URL, reviewData);
            
            // Your backend returns a JSON object with a 'review' key
            if (response.data && response.data.review) {
                setAiReviewContent(response.data.review);
            } else {
                setAiReviewContent('AI review could not be generated. The response from the server was empty.');
            }
        } catch (error) {
            console.error('Error fetching AI review from backend:', error);
            // Display the error message from the backend, or a generic one
            const errorMessage = error.response?.data?.message || 'Failed to get AI review. Please try again.';
            setAiReviewContent(`Error: ${errorMessage}`);
        } finally {
            setIsAIRunning(false);
        }
    };

    const getLanguageExtension = (lang) => {
        switch (lang) {
            case 'cpp': return cpp();
            case 'java': return java();
            case 'python': return python();
            default: return cpp();
        }
    };

    const sampleInput = problem.testCases && problem.testCases.length > 0 ? problem.testCases[0].input : "No sample input available.";

    return (
        <>
            <style>{`
                /* Your existing CSS styles... (no changes needed here) */
                :root {
                    --dark-bg: #1a1a1a;
                    --dark-bg-lighter: #2c2c2c;
                    --border-color: #444;
                    --text-light: #f0f0f0;
                    --text-muted: #888;
                    --accent-color: #a770ef;
                }
                .ide-container {
                    display: flex;
                    gap: 1rem;
                    height: calc(100vh - 100px);
                }
                .panel-left, .panel-right {
                    background-color: var(--dark-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .panel-left { flex: 0 0 45%; }
                .panel-right { flex: 1; }
                .panel-content { padding: 1rem 1.5rem; overflow-y: auto; flex-grow: 1; }
                .panel-right-inner { display: flex; flex-direction: column; height: 100%; }
                .editor-container {
                    flex-grow: 1;
                    overflow: hidden;
                    transition: flex-grow 0.3s ease-in-out;
                }
                .console-container {
                    flex-shrink: 0;
                    height: 35%;
                    display: flex;
                    flex-direction: column;
                    transition: height 0.3s ease-in-out;
                }
                .console-tabs .nav-link { background: none !important; border: none !important; color: var(--text-muted) !important; padding: 0.5rem 1rem; }
                .console-tabs .nav-link.active { color: var(--accent-color) !important; border-bottom: 2px solid var(--accent-color) !important; }
                .console-body {
                    padding: 1rem;
                    overflow-y: auto;
                    flex-grow: 1;
                    font-family: 'Fira Code', monospace;
                    background-color: #212121;
                    color: var(--text-light);
                }
                .console-container.ai-review-hover-expand:hover {
                    height: 95%;
                }
                .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6 {
                    color: var(--accent-color);
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                .markdown-content p {
                    margin-bottom: 0.5rem;
                }
                .markdown-content ul, .markdown-content ol {
                    margin-left: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .markdown-content pre {
                    background-color: #333;
                    padding: 0.75rem;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }
                .markdown-content code {
                    font-family: 'Fira Code', monospace;
                    color: #fdb99b;
                }
                .markdown-content pre code {
                    color: #f0f0f0;
                }
                .action-bar { padding: 0.5rem 1rem; background-color: var(--dark-bg-lighter); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem; }
                pre.problem-block { background-color: var(--dark-bg-lighter); padding: 1rem; border-radius: 6px; border: 1px solid var(--border-color); white-space: pre-wrap; word-wrap: break-word; font-size: 0.9rem; }
            `}</style>
            
            {/* Your existing JSX (no changes needed here) */}
            <div className="bg-dark min-vh-100 py-4 text-white">
                <div className="container-fluid px-4">
                    <header className="pb-3 mb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img src="/codevm_logo.svg" alt="CodeVM Logo" className="me-3" style={{ maxWidth: '40px', height: 'auto' }} />
                            <h1 className="h4 text-white mb-0 fw-bold" style={{ backgroundImage: 'linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                CodeVM
                            </h1>
                        </div>
                        <button onClick={onClose} className="btn btn-outline-secondary d-flex align-items-center rounded-pill px-3 py-2">
                            <XCircle size={16} className="me-2" /> Back to Problems
                        </button>
                    </header>
                    <div className="ide-container">
                        <div className="panel-left">
                            <div className="panel-content">
                                <h4 className="fw-bold mb-3">{problem.title}</h4>
                                <div className="d-flex align-items-center mb-3">
                                    <span className={`badge me-2 ${
                                        problem.difficulty === 'Easy' ? 'bg-success' :
                                        problem.difficulty === 'Medium' ? 'bg-warning text-dark' : 'bg-danger'
                                    }`}>{problem.difficulty}</span>
                                    <span className="text-muted small">
                                        {problem.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary me-1">{tag}</span>
                                        ))}
                                    </span>
                                </div>
                                <p className="text-muted small mb-4">Time Limit: {problem.timeLimit}s | Memory Limit: {problem.memoryLimit}MB</p>
                                <h6 className="fw-bold text-info">Problem Statement</h6>
                                <p className="text-light mb-4">{problem.statement}</p>
                                <h6 className="fw-bold text-info">Input Format</h6>
                                <p className="text-light mb-4">{problem.input}</p>
                                <h6 className="fw-bold text-info">Output Format</h6>
                                <p className="text-light mb-4">{problem.output}</p>
                                <h6 className="fw-bold text-info">Constraints</h6>
                                <pre className="problem-block">{problem.constraints}</pre>
                            </div>
                        </div>
                        <div className="panel-right">
                            <div className="panel-right-inner">
                                <div className="d-flex justify-content-between align-items-center p-2" style={{backgroundColor: '#2c2c2c'}}>
                                    <span className="ms-2 small text-light"><Code size={16} /> Your Code</span>
                                    <select
                                        className="form-select form-select-sm"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        style={{ width: 'auto', backgroundColor: '#3a3a3a', color: 'white', border: '1px solid #555' }}
                                    >
                                        <option value="cpp">C++</option>
                                        <option value="java">Java</option>
                                        <option value="python">Python</option>
                                    </select>
                                </div>
                                <div className="editor-container">
                                    <CodeMirror
                                        value={code}
                                        theme={okaidia}
                                        extensions={[getLanguageExtension(language)]}
                                        onChange={(value) => setCode(value)}
                                        height="100%"
                                        style={{height: '100%'}}
                                    />
                                </div>
                                <div className="action-bar">
                                    <button
                                        onClick={handleRunCode}
                                        className="btn btn-outline-info rounded-pill px-3 py-1"
                                        disabled={isSubmitting || isRunningCustomTest || isAIRunning}
                                    >
                                        {isRunningCustomTest ? 'Running...' : <><Play size={16} className="me-1" /> Run</>}
                                    </button>
                                    <button
                                        onClick={handleCodeSubmit}
                                        className="btn btn-success rounded-pill px-4 py-1 fw-bold"
                                        disabled={isSubmitting || isRunningCustomTest || isAIRunning}
                                    >
                                        {isSubmitting ? 'Submitting...' : <><Send size={16} className="me-1" /> Submit</>}
                                    </button>
                                    <button
                                        onClick={handleGetAIReview}
                                        className="btn btn-outline-primary rounded-pill px-3 py-1"
                                        disabled={isSubmitting || isRunningCustomTest || isAIRunning || !code}
                                    >
                                        {isAIRunning ? 'Getting AI Review...' : <><Code size={16} className="me-1" /> Get AI Review</>}
                                    </button>
                                </div>
                                <div className={`console-container ${activeTab === 'aiReview' ? 'ai-review-hover-expand' : ''}`}>
                                    <ul className="nav nav-tabs console-tabs px-2">
                                        <li className="nav-item">
                                            <button className={`nav-link ${activeTab === 'test' ? 'active' : ''}`} onClick={() => setActiveTab('test')}>Test Case</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`nav-link ${activeTab === 'customTest' ? 'active' : ''}`} onClick={() => setActiveTab('customTest')}>Custom Input</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`nav-link ${activeTab === 'verdict' ? 'active' : ''}`} onClick={() => setActiveTab('verdict')}>Verdict</button>
                                        </li>
                                        <li className="nav-item">
                                            <button className={`nav-link ${activeTab === 'aiReview' ? 'active' : ''}`} onClick={() => setActiveTab('aiReview')}>AI Review</button>
                                        </li>
                                    </ul>
                                    <div className="console-body">
                                        {activeTab === 'test' && (
                                            <div>
                                                <h6 className="fw-bold text-info small mb-1">Input (stdin)</h6>
                                                <pre className="problem-block">{sampleInput}</pre>
                                                <h6 className="fw-bold text-info small mt-3 mb-1">Your Output (stdout)</h6>
                                                <pre className="problem-block">{outputStdout || "Run code to see output..."}</pre>
                                            </div>
                                        )}
                                        {activeTab === 'customTest' && (
                                            <div>
                                                <h6 className="fw-bold text-info small mb-2">Your Custom Input</h6>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={inputStdin}
                                                    onChange={(e) => setInputStdin(e.target.value)}
                                                    placeholder="Enter custom input here..."
                                                    style={{backgroundColor: '#2c2c2c', color: 'white', border: '1px solid #555'}}
                                                ></textarea>
                                                <button onClick={handleRunCode} className="btn btn-sm btn-info mt-2">Run with Custom Input</button>
                                            </div>
                                        )}
                                        {activeTab === 'verdict' && (
                                            <div>
                                                {submissionMessage && (
                                                    <div className={`alert alert-dark d-flex justify-content-between align-items-center ${finalVerdict === 'Accepted' ? 'border-success' : 'border-danger'}`}>
                                                        <span><strong>{finalVerdict}</strong></span>
                                                        <span className="small text-muted">
                                                            <Clock size={14} className="me-1" /> {totalTime} ms
                                                            <MemoryStick size={14} className="ms-2 me-1" /> {memoryUsed} MB
                                                        </span>
                                                    </div>
                                                )}
                                                {verdicts.length > 0 ? verdicts.map((v, index) => (
                                                    <div key={index} className={`d-flex justify-content-between p-2 rounded mb-1 ${v.status === 'Passed' ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'}`}>
                                                        <span className={v.status === 'Passed' ? 'text-success' : 'text-danger'}>Test Case {index + 1}</span>
                                                        <span className="small text-muted">{v.executionTime} ms | {v.memoryUsed} MB</span>
                                                    </div>
                                                )) : <p className="text-muted text-center mt-3">Submit your code to see the verdict.</p>}
                                            </div>
                                        )}
                                        {activeTab === 'aiReview' && (
                                            <div>
                                                <h6 className="fw-bold text-info small mb-2">AI Code Review</h6>
                                                {isAIRunning ? (
                                                    <p className="text-muted text-center mt-3">Getting AI review, please wait...</p>
                                                ) : (
                                                    <div className="markdown-content">
                                                        <ReactMarkdown>
                                                            {aiReviewContent || "Click 'Get AI Review' to analyze your code."}
                                                        </ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        )}
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

export default SolveProblemScreen;