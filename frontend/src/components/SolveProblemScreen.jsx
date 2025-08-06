import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    XCircle, Code, Send, Play, RefreshCcw, AlertTriangle, CheckCircle2,
    Gauge, Tag, Clock, MemoryStick
} from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { okaidia } from '@uiw/codemirror-theme-okaidia';


const SUBMISSION_API_BASE_URL = 'http://localhost:5000/api/submissions';
const COMPILER_RUN_URL = 'http://localhost:9000/run';
const DRAFT_API_BASE_URL = 'http://localhost:5000/api/drafts';

function SolveProblemScreen({ problem, onClose, isAuthenticated }) {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('cpp');
    const [submissionMessage, setSubmissionMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [compileMessage, setCompileMessage] = useState('');
    const [inputStdin, setInputStdin] = useState('');
    const [outputStdout, setOutputStdout] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [activeTab, setActiveTab] = useState('test');

    const [finalVerdict, setFinalVerdict] = useState('Pending');
    const [executionTime, setExecutionTime] = useState(0);
    const [memoryUsed, setMemoryUsed] = useState(0);
    const [isRunningCustomTest, setIsRunningCustomTest] = useState(false);
    const [verdicts, setVerdicts] = useState([]);
    const [totalTime, setTotalTime] = useState(null);

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
    // --- End Draft Persistence Logic ---

    const handleRunCode = async () => {
        setCompileMessage('');
        setOutputStdout('');
        setTestResults([]);
        setSubmissionMessage('');
        setIsRunningCustomTest(true);

        const runData = {
            code,
            language,
            input: activeTab === 'customTest' ? inputStdin : problem.input
        };

        try {
            const response = await axios.post(COMPILER_RUN_URL, runData);
            setCompileMessage('');
            setOutputStdout(response.data.output || '');
            setSubmissionMessage('Custom run completed.');
            setFinalVerdict('Executed');
            setActiveTab('test');
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error during custom run.';
            setCompileMessage(errorMessage);
            setOutputStdout('');
            setSubmissionMessage('Custom run failed.');
            setFinalVerdict('Error');
            setActiveTab('test');
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
        setTestResults([]);
        setFinalVerdict('Pending');
        setExecutionTime(0);
        setMemoryUsed(0);
        setVerdicts([]);
        setTotalTime(null);

        const submissionData = {
            problemId: problem._id,
            code,
            language,
        };

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(SUBMISSION_API_BASE_URL, submissionData, config);
            
            const data = response.data;
            console.log("Final Submission Response from Backend:", data);

            setSubmissionMessage(`Submission evaluated! Verdict: ${data.verdict}.`);
            setFinalVerdict(data.verdict);
            setExecutionTime(data.executionTime || 0);
            setMemoryUsed(data.memoryUsed || 0);
            setCompileMessage(data.compileMessage || '');
            setTotalTime(data.executionTime || 0);

            if (data.verdicts && Array.isArray(data.verdicts)) {
                setVerdicts(data.verdicts);
            } else {
                setVerdicts([]);
            }

            setActiveTab('verdict');

        } catch (error) {
            console.error('Error submitting code:', error);
            const errorMessage = error.response?.data?.message || error.message;
            const compileMsg = error.response?.data?.compileMessage || errorMessage;

            setSubmissionMessage(`Submission failed: ${errorMessage}`);
            setCompileMessage(compileMsg);
            setFinalVerdict('Error');
            setActiveTab('test');
        } finally {
            setIsSubmitting(false);
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

    return (
        <div className="bg-dark min-vh-100 py-5 text-white">
            <div className="container-fluid px-5">
                <header className="bg-dark border-bottom border-secondary pb-3 mb-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <img src="/codevm_logo.jpeg" alt="CodeVM Logo" className="me-3" style={{ maxWidth: '40px', height: 'auto' }} />
                        <h1 className="h4 text-white mb-0 fw-bold" style={{ backgroundImage: 'linear-gradient(to right, #a770ef, #cf8bf3, #fdb99b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            CodeVM
                        </h1>
                        <p className="text-muted mb-0 ms-3 d-none d-md-block">
                            Solve Problem
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-outline-light d-flex align-items-center rounded-pill px-3 py-2">
                        <XCircle size={16} className="me-2" /> Back to Problems
                    </button>
                </header>

                {submissionMessage && (
                    <div className={`alert ${finalVerdict === 'Accepted' || finalVerdict === 'Passed' ? 'alert-success' : finalVerdict === 'Pending' || finalVerdict === 'Executed' ? 'alert-info' : 'alert-danger'} alert-dismissible fade show mb-4 rounded-3`} role="alert">
                        {submissionMessage}
                        {(finalVerdict === 'Accepted' || finalVerdict === 'Passed' || finalVerdict === 'Error' || finalVerdict === 'Executed') && executionTime > 0 && (
                            <span className="ms-3">
                                <Clock size={16} className="me-1" /> {executionTime} ms
                                <MemoryStick size={16} className="ms-3 me-1" /> {memoryUsed} MB
                            </span>
                        )}
                        <button type="button" className="btn-close" onClick={() => setSubmissionMessage('')} aria-label="Close"></button>
                    </div>
                )}
                
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="card card-themed shadow-lg rounded-3 h-100">
                            <div className="card-header bg-dark border-bottom border-secondary fw-bold">Problem Details</div>
                            <div className="card-body d-flex flex-column" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                                <h5 className="card-title text-white fw-bold mb-3">{problem.title}</h5>
                                <div className="d-flex align-items-center mb-3">
                                    <span className={`badge rounded-pill me-2 ${
                                        problem.difficulty === 'Easy' ? 'bg-success' :
                                        problem.difficulty === 'Medium' ? 'bg-warning text-dark' :
                                        'bg-danger'
                                    } px-3 py-2`}>
                                        <Gauge size={14} className="me-1" /> {problem.difficulty}
                                    </span>
                                    <span className="text-muted small d-flex align-items-center">
                                        <Tag size={14} className="me-1" />
                                        {problem.tags.length > 0 ? (
                                            problem.tags.map((tag, index) => (
                                                <span key={index} className="badge bg-info text-dark me-1 rounded-pill">{tag}</span>
                                            ))
                                        ) : (
                                            <span className="fst-italic">None</span>
                                        )}
                                    </span>
                                </div>
                                <p className="text-muted small mb-3">Time Limit: <span className="fw-bold text-info">{problem.timeLimit}s</span> | Memory Limit: <span className="fw-bold text-info">{problem.memoryLimit}MB</span></p>
                                <hr className="my-3 border-secondary" />

                                <h6 className="fw-bold text-info">Problem Statement:</h6>
                                <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">{problem.statement}</pre>

                                <h6 className="fw-bold text-info">Input Format:</h6>
                                <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">{problem.input}</pre>

                                <h6 className="fw-bold text-info">Output Format:</h6>
                                <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">{problem.output}</pre>

                                <h6 className="fw-bold text-info">Constraints:</h6>
                                <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">{problem.constraints}</pre>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Code Editor and Results */}
                    <div className="col-lg-6">
                        <div className="card card-themed shadow-lg rounded-3 h-100">
                            <div className="card-header bg-dark border-bottom border-secondary fw-bold d-flex justify-content-between align-items-center">
                                <span><Code size={18} className="me-2" /> Your Solution</span>
                                <div className="d-flex align-items-center">
                                    <label htmlFor="languageSelect" className="form-label mb-0 me-2 small text-muted">Language:</label>
                                    <select
                                        className="form-select form-select-sm form-select-themed rounded-pill"
                                        id="languageSelect"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        style={{ width: 'auto' }}
                                        required
                                    >
                                        <option value="cpp">C++</option>
                                        <option value="java">Java</option>
                                        <option value="python">Python</option>
                                    </select>
                                </div>
                            </div>
                            <div className="card-body p-0 d-flex flex-column">
                                <CodeMirror
                                    value={code}
                                    theme={okaidia}
                                    extensions={[getLanguageExtension(language)]}
                                    onChange={(value) => setCode(value)}
                                    minHeight="300px"
                                />
                                <div className="card-footer bg-dark border-top border-secondary d-flex justify-content-end gap-2 p-3">
                                    <button
                                        onClick={handleRunCode}
                                        type="button"
                                        className="btn btn-outline-info d-flex align-items-center rounded-pill px-3 py-2"
                                        disabled={isSubmitting || isRunningCustomTest}
                                    >
                                        {isRunningCustomTest ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Running...
                                            </>
                                        ) : (
                                            <>
                                                <Play size={16} className="me-2" /> Run
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCodeSubmit}
                                        type="submit"
                                        className="btn btn-success-gradient d-flex align-items-center rounded-pill px-3 py-2 fw-bold"
                                        disabled={isSubmitting || isRunningCustomTest}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} className="me-2" /> Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Results Panel */}
                        <div className="card card-themed shadow-lg rounded-3 mt-4">
                            <div className="card-header bg-dark border-bottom border-secondary fw-bold">
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'test' ? 'active text-info' : 'text-white'}`} onClick={() => setActiveTab('test')} style={{ backgroundColor: activeTab === 'test' ? '#343a40' : 'transparent', borderBottom: 'none' }}>
                                            Test
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'customTest' ? 'active text-info' : 'text-white'}`} onClick={() => setActiveTab('customTest')} style={{ backgroundColor: activeTab === 'customTest' ? '#343a40' : 'transparent', borderBottom: 'none' }}>
                                            Custom Test
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`nav-link ${activeTab === 'verdict' ? 'active text-info' : 'text-white'}`} onClick={() => setActiveTab('verdict')} style={{ backgroundColor: activeTab === 'verdict' ? '#343a40' : 'transparent', borderBottom: 'none' }}>
                                            Verdict
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-body">
                                {activeTab === 'test' && (
                                    <div>
                                        <h6 className="fw-bold text-info mb-2 d-flex align-items-center">
                                            {compileMessage.includes('Error') ? <AlertTriangle size={18} className="me-2 text-danger" /> : (compileMessage ? <CheckCircle2 size={18} className="me-2 text-success" /> : null)}
                                            Compile Message:
                                        </h6>
                                        <pre className={`bg-dark p-3 rounded border ${compileMessage.includes('Error') ? 'border-danger' : 'border-success'} text-light fs-6 mb-4`}>
                                            {compileMessage || "No compilation message yet."}
                                        </pre>

                                        <h6 className="fw-bold text-info mb-2">Input (stdin):</h6>
                                        <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">
                                            {problem.input || "No sample input available."}
                                        </pre>

                                        <h6 className="fw-bold text-info mb-2">Your Output (stdout):</h6>
                                        <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">
                                            {outputStdout || "Run your code to see output."}
                                        </pre>
                                    </div>
                                )}
                                {activeTab === 'customTest' && (
                                    <div>
                                        <h6 className="fw-bold text-info mb-2">Custom Input (stdin):</h6>
                                        <textarea
                                            className="form-control form-control-themed border-secondary rounded-3 mb-4"
                                            rows="8"
                                            value={inputStdin}
                                            onChange={(e) => setInputStdin(e.target.value)}
                                            placeholder="Enter your custom test input here..."
                                            style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                        ></textarea>

                                        <h6 className="fw-bold text-info mb-2 d-flex align-items-center">
                                            {compileMessage.includes('Error') ? <AlertTriangle size={18} className="me-2 text-danger" /> : (compileMessage ? <CheckCircle2 size={18} className="me-2 text-success" /> : null)}
                                            Compile Message:
                                        </h6>
                                        <pre className={`bg-dark p-3 rounded border ${compileMessage.includes('Error') ? 'border-danger' : 'border-success'} text-light fs-6 mb-4`}>
                                            {compileMessage || "No compilation message yet."}
                                        </pre>

                                        <h6 className="fw-bold text-info mb-2">Your Output (stdout):</h6>
                                        <pre className="bg-dark p-3 rounded border border-secondary text-light fs-6 mb-4">
                                            {outputStdout || "Run your code to see output."}
                                        </pre>
                                    </div>
                                )}
                                {activeTab === 'verdict' && (
                                    <div className="verdict-panel">
                                        <h6 className="fw-bold text-info mb-2 d-flex align-items-center">
                                            <span className={`me-2 ${finalVerdict === 'Accepted' || finalVerdict === 'Passed' ? 'text-success' : 'text-danger'}`}>
                                                {finalVerdict === 'Accepted' || finalVerdict === 'Passed' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                                            </span>
                                            Final Verdict: <span className="ms-2">{finalVerdict}</span>
                                        </h6>
                                        {totalTime !== null && (
                                            <p className="small text-muted mb-2">Total Execution Time: <span className="fw-bold text-info">{totalTime} ms</span></p>
                                        )}
                                        {verdicts.length > 0 ? (
                                            <ul className="list-group list-group-flush">
                                                {verdicts.map((v, index) => (
                                                    <li key={index} className={`list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center ${v.status === 'Passed' ? 'text-success' : 'text-danger'}`}>
                                                        <span>
                                                            Test Case {index + 1}: {v.status}
                                                        </span>
                                                        <span className="small">
                                                            {v.executionTime} ms | {v.memoryUsed} MB
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="alert alert-secondary text-center small card-themed text-muted border-secondary rounded-3" role="alert">No detailed verdicts available.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SolveProblemScreen;