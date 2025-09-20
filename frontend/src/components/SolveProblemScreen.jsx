import React, { useState, useEffect, useCallback } from 'https://esm.sh/react';
import axios from 'https://esm.sh/axios';
import {
    XCircle, Code, Send, Play, CheckCircle2, AlertTriangle, Clock, MemoryStick
} from 'https://esm.sh/lucide-react';
import CodeMirror from 'https://esm.sh/@uiw/react-codemirror?external=react,react-dom';
import { cpp } from 'https://esm.sh/@codemirror/lang-cpp';
import { java } from 'https://esm.sh/@codemirror/lang-java';
import { python } from 'https://esm.sh/@codemirror/lang-python';
import { okaidia } from 'https://esm.sh/@uiw/codemirror-theme-okaidia';
import ReactMarkdown from 'https://esm.sh/react-markdown?external=react';


// API URLs
// MODIFIED: Replaced environment variables with placeholder strings to resolve errors.
// You should replace these with your actual backend and compiler URLs.
const api_url = 'http://localhost:5000'; // Example: Your backend server URL
const api_com = 'http://localhost:2358'; // Example: Your code execution engine URL
const SUBMISSION_API_BASE_URL = `${api_url}/api/submissions`;
const COMPILER_RUN_URL = `${api_com}/run`;
const DRAFT_API_BASE_URL = `${api_url}/api/drafts`;
const AI_REVIEW_API_URL = `${api_url}/api/ai-review`;

// Boilerplate code templates
const getBoilerplateCode = (language) => {
    switch (language) {
        case 'cpp':
            return `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`;
        case 'java':
            return `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        
        // Your code here
        
    }
}`;
        case 'python':
            return `# Your code here
`;
        default:
            return '';
    }
};

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
    const [aiReviewContent, setAiReviewContent] = useState('');
    const [isAIRunning, setIsAIRunning] = useState(false);

    useEffect(() => {
        if (!code) {
            setCode(getBoilerplateCode(language));
        }
    }, []);

    useEffect(() => {
        const currentBoilerplate = getBoilerplateCode(language);
        if (!code.trim() || code === getBoilerplateCode('cpp') || code === getBoilerplateCode('java') || code === getBoilerplateCode('python')) {
            setCode(currentBoilerplate);
        }
    }, [language]);

    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const saveDraft = useCallback(debounce(async (currentCode, currentLanguage, currentProblemId) => {
        if (!isAuthenticated || !currentCode || !currentProblemId) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
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
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get(`${DRAFT_API_BASE_URL}/${problem._id}`, config);
                if (response.data.draft && response.data.draft.code) {
                    setCode(response.data.draft.code);
                    setLanguage(response.data.draft.language || 'cpp');
                } else {
                    setCode(getBoilerplateCode(language));
                }
            } catch (error) {
                console.error('Error loading draft:', error);
                setCode(getBoilerplateCode(language));
            }
        };
        loadDraft();
    }, [isAuthenticated, problem]);

    useEffect(() => {
        if (isAuthenticated && problem && problem._id && code && code.trim()) {
            saveDraft(code, language, problem._id);
        }
    }, [code, language, problem, isAuthenticated, saveDraft]);

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
            // NEW: Added a timeout to the custom run as well.
            const response = await axios.post(COMPILER_RUN_URL, runData, { timeout: 15000 });
            setCompileMessage(response.data.error ? 'Compilation Error' : 'Successfully Executed');
            setOutputStdout(response.data.output || response.data.error || '');
        } catch (error) {
            console.error('Run error:', error);
            // NEW: Added specific timeout handling for the custom run.
            if (error.code === 'ECONNABORTED') {
                 setCompileMessage('Execution Failed');
                 setOutputStdout('Execution timed out. Your code took too long to run with the custom input.');
            } else {
                const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error during custom run.';
                setCompileMessage('Execution Failed');
                setOutputStdout(errorMessage);
            }
        } finally {
            setIsRunningCustomTest(false);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setSubmissionMessage('Please log in to submit code.');
            return;
        }

        setSubmissionMessage('');
        setIsSubmitting(true);
        setCompileMessage('');
        setOutputStdout('');
        setFinalVerdict('Evaluating...');
        setExecutionTime(0);
        setMemoryUsed(0);
        setVerdicts([]);
        setTotalTime(null);
        setActiveTab('verdict');

        const infiniteLoopPatterns = [/while\s*\(\s*true\s*\)/, /for\s*\(\s*;\s*;\s*\)/];
        if (infiniteLoopPatterns.some(pattern => pattern.test(code))) {
            setSubmissionMessage("Submission cancelled: Your code appears to contain an infinite loop (e.g., 'while(true)').");
            setFinalVerdict('Review Code');
            setIsSubmitting(false);
            return;
        }

        const submissionData = {
            problemId: problem._id,
            code: code.trim(),
            language
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 30000 
            };

            const response = await axios.post(SUBMISSION_API_BASE_URL, submissionData, config);
            const data = response.data;

            setSubmissionMessage(`Submission evaluated successfully!`);
            setFinalVerdict(data.verdict || 'Unknown');
            setExecutionTime(data.executionTime || 0);
            setMemoryUsed(data.memoryUsed || 0);
            setTotalTime(data.executionTime || 0);
            setVerdicts(data.verdicts && Array.isArray(data.verdicts) ? data.verdicts : []);

        } catch (error) {
            console.error('Submission error:', error);
            let errorMessage = 'Submission failed. Please try again.';
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = "Request timed out after 30 seconds. This often means your code has an infinite loop or is too inefficient.";
                setSubmissionMessage(`Submission failed: ${errorMessage}`);
                setFinalVerdict('Time Limit Exceeded');
            } else if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
                setSubmissionMessage(`Submission failed: ${errorMessage}`);
                setFinalVerdict('Error');
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
                setSubmissionMessage(`Submission failed: ${errorMessage}`);
                setFinalVerdict('Error');
            } else {
                errorMessage = error.message || 'An unexpected error occurred.';
                setSubmissionMessage(`Submission failed: ${errorMessage}`);
                setFinalVerdict('Error');
            }

        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleGetAIReview = async () => {
        if (!code || !code.trim()) {
            setAiReviewContent('Please write some code before requesting a review.');
            setActiveTab('aiReview');
            return;
        }

        setAiReviewContent('');
        setIsAIRunning(true);
        setActiveTab('aiReview');

        const reviewData = {
            userCode: code,
            language: language,
            problemStatement: problem.statement || ''
        };

        try {
            const response = await axios.post(AI_REVIEW_API_URL, reviewData, {
                timeout: 60000
            });

            if (response.data && response.data.review) {
                setAiReviewContent(response.data.review);
            } else {
                setAiReviewContent('AI review could not be generated. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching AI review:', error);
            let errorMessage = 'Failed to get AI review. Please try again.';

            if (error.response) {
                errorMessage = error.response.data?.message || 'Server error occurred while getting AI review.';
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }

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
                :root {
                    --dark-bg: #0f0f23;
                    --dark-bg-lighter: #1e1e2e;
                    --border-color: rgba(255, 255, 255, 0.1);
                    --text-light: #f0f0f0;
                    --text-muted: #a5b4fc;
                    --accent-color: #00d4ff;
                    --accent-gradient: linear-gradient(135deg, #00d4ff, #7c3aed);
                }
                
                .ide-container {
                    display: flex;
                    flex-direction: row;
                    gap: 1.5rem;
                    height: calc(100vh - 120px);
                    background: var(--dark-bg);
                }
                
                @media (max-width: 768px) {
                    .ide-container {
                        flex-direction: column;
                        height: auto;
                        gap: 1rem;
                    }
                }
                
                .panel-left, .panel-right {
                    background: rgba(30, 30, 46, 0.8);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                
                .panel-left { flex: 0 0 45%; }
                .panel-right { flex: 1; }
                
                @media (max-width: 768px) {
                    .panel-left, .panel-right {
                        flex: none;
                        width: 100%;
                    }
                    .panel-left {
                        order: 1;
                        max-height: 50vh;
                        overflow-y: auto;
                    }
                    .panel-right {
                        order: 2;
                        min-height: 60vh;
                    }
                }
                
                .panel-content { 
                    padding: 1.5rem 2rem; 
                    overflow-y: auto; 
                    flex-grow: 1;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 212, 255, 0.3) transparent;
                }
                
                .panel-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .panel-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .panel-content::-webkit-scrollbar-thumb {
                    background: rgba(0, 212, 255, 0.3);
                    border-radius: 3px;
                }
                
                .panel-right-inner { 
                    display: flex; 
                    flex-direction: column; 
                    height: 100%; 
                }
                
                .editor-container {
                    flex-grow: 1;
                    overflow: hidden;
                    transition: flex-grow 0.3s ease-in-out;
                }
                
                .console-container {
                    flex-shrink: 0;
                    height: 40%; 
                    display: flex;
                    flex-direction: column;
                    transition: height 0.3s ease-in-out;
                }
                
                .console-tabs { 
                    background: rgba(255, 255, 255, 0.03);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .console-tabs .nav-link { 
                    background: none !important; 
                    border: none !important; 
                    color: var(--text-muted) !important; 
                    padding: 1rem 1.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }
                
                .console-tabs .nav-link.active { 
                    color: var(--accent-color) !important; 
                    border-bottom: 3px solid var(--accent-color) !important;
                    background: rgba(0, 212, 255, 0.05) !important;
                }
                
                .console-tabs .nav-link:hover {
                    color: var(--accent-color) !important;
                    background: rgba(0, 212, 255, 0.03) !important;
                }
                
                .console-body {
                    padding: 1.5rem;
                    overflow-y: auto;
                    flex-grow: 1;
                    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
                    background: rgba(15, 15, 35, 0.8);
                    color: var(--text-light);
                    font-size: 0.9rem;
                    line-height: 1.6;
                }
                
                .console-container.ai-review-hover-expand:hover {
                    height: 90%;
                }
                
                .markdown-content h1, .markdown-content h2, .markdown-content h3, 
                .markdown-content h4, .markdown-content h5, .markdown-content h6 {
                    background: var(--accent-gradient);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-top: 1.5rem;
                    margin-bottom: 0.8rem;
                    font-weight: 700;
                }
                
                .markdown-content p {
                    margin-bottom: 0.8rem;
                    color: var(--text-light);
                }
                
                .markdown-content ul, .markdown-content ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--text-light);
                }
                
                .markdown-content pre {
                    background: rgba(0, 0, 0, 0.4);
                    padding: 1rem;
                    border-radius: 12px;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                    border: 1px solid var(--border-color);
                }
                
                .markdown-content code {
                    font-family: 'Fira Code', monospace;
                    color: #fdb99b;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                }
                
                .markdown-content pre code {
                    color: #f0f0f0;
                    background: none;
                    padding: 0;
                }
                
                .action-bar { 
                    padding: 0.5rem 1.5rem;
                    background: rgba(255, 255, 255, 0.03);
                    border-top: 1px solid var(--border-color);
                    border-bottom: 1px solid var(--border-color);
                    display: flex; 
                    justify-content: flex-end; 
                    align-items: center; 
                    gap: 1rem; 
                }
                
                @media (max-width: 768px) {
                    .action-bar {
                        flex-wrap: wrap;
                        gap: 0.8rem;
                        padding: 1rem;
                    }
                    .action-bar button {
                        flex: 1;
                        min-width: 120px;
                    }
                }
                
                pre.problem-block { 
                    background: rgba(0, 0, 0, 0.3); 
                    padding: 1.2rem; 
                    border-radius: 12px; 
                    border: 1px solid var(--border-color); 
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                    font-size: 0.9rem;
                    font-family: 'Fira Code', monospace;
                    color: var(--text-light);
                }
                
                .btn-modern {
                    border: none;
                    padding: 0.6rem 1.5rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    justify-content: center;
                }
                
                .btn-modern:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }
                
                .btn-modern:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                .btn-primary-modern {
                    background: var(--accent-gradient);
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
                }
                
                .btn-success-modern {
                    background: linear-gradient(135deg, #10b981, #34d399);
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }
                
                .btn-outline-modern {
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    color: var(--accent-color);
                }
                
                .language-selector {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    color: white;
                    padding: 0.6rem 1rem;
                    border-radius: 12px;
                    outline: none;
                    font-weight: 600;
                }
                
                .custom-input {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-color);
                    color: white;
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    outline: none;
                    resize: vertical;
                    font-family: 'Fira Code', monospace;
                }
                
                .custom-input:focus {
                    border-color: var(--accent-color);
                    box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
                }
                
                .verdict-item {
                    padding: 0.8rem 1rem;
                    border-radius: 12px;
                    margin-bottom: 0.8rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                }
                
                .verdict-passed {
                    background: rgba(16, 185, 129, 0.1);
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    color: #34d399;
                }
                
                .verdict-failed {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                }
                
                .verdict-summary {
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 1rem;
                }
            `}</style>

            <div style={{
                background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2d1b69 100%)',
                minHeight: '100vh',
                color: 'white'
            }}>
                <div className="container-fluid px-4 py-3">
                    <header className="pb-3 mb-3 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            
                                <img src="/codevm_logo.svg" 
                                 alt="CodeVM Logo" 
                                 className="logo-image" 
                                 style={{ 
                                     maxWidth: '38px', 
                                     height: 'auto',
                                     filter: 'drop-shadow(0 0 10px rgba(167, 112, 239, 0.3))',
                                     transition: 'filter 0.3s ease'
                                 }} />
                            
                            <h1 style={{
                                fontSize: '1.8rem',
                                fontWeight: '800',
                                margin: 0,
                                background: 'var(--accent-gradient)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                CodeVM
                            </h1>
                        </div>
                        <button
                            onClick={onClose}
                            className="btn-modern btn-outline-modern"
                            style={{ minWidth: 'auto' }}
                        >
                            <XCircle size={18} />
                            Back to Problems
                        </button>
                    </header>

                    <div className="ide-container">
                        <div className="panel-left">
                            <div className="panel-content">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h4 style={{
                                        fontWeight: '700',
                                        background: 'var(--accent-gradient)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        margin: 0
                                    }}>{problem.title}</h4>
                                </div>

                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <span style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600',
                                        background: problem.difficulty === 'Easy' ? 'linear-gradient(135deg, #10b981, #34d399)' :
                                            problem.difficulty === 'Medium' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' :
                                                'linear-gradient(135deg, #ef4444, #f87171)',
                                        color: 'white'
                                    }}>
                                        {problem.difficulty}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <Clock size={14} className="me-1" />
                                        {problem.timeLimit}s | {problem.memoryLimit}MB
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem'
                                    }}>
                                        {problem.tags?.map((tag, index) => (
                                            <span key={index} style={{
                                                background: 'rgba(124, 58, 237, 0.2)',
                                                border: '1px solid rgba(124, 58, 237, 0.3)',
                                                color: '#a78bfa',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '15px',
                                                fontSize: '0.8rem',
                                                fontWeight: '500'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 style={{
                                        color: 'var(--accent-color)',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        marginBottom: '0.8rem'
                                    }}>Problem Statement</h6>
                                    <div style={{
                                        color: 'var(--text-light)',
                                        lineHeight: '1.6',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {problem.statement}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h6 style={{
                                        color: 'var(--accent-color)',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        marginBottom: '0.8rem'
                                    }}>Input Format</h6>
                                    <pre className="problem-block">{problem.input}</pre>
                                </div>

                                <div className="mb-4">
                                    <h6 style={{
                                        color: 'var(--accent-color)',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        marginBottom: '0.8rem'
                                    }}>Output Format</h6>
                                    <pre className="problem-block">{problem.output}</pre>
                                </div>

                                <div className="mb-4">
                                    <h6 style={{
                                        color: 'var(--accent-color)',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        marginBottom: '0.8rem'
                                    }}>Constraints</h6>
                                    <pre className="problem-block">{problem.constraints}</pre>
                                </div>
                            </div>
                        </div>

                        <div className="panel-right">
                            <div className="panel-right-inner">
                                <div className="d-flex justify-content-between align-items-center py-2 px-3" style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <div className="d-flex align-items-center">
                                        <Code size={18} className="me-2" style={{ color: 'var(--accent-color)' }} />
                                        <span style={{
                                            color: 'var(--text-light)',
                                            fontWeight: '600'
                                        }}>Your Code</span>
                                    </div>
                                    <select
                                        className="language-selector"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
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
                                        style={{ height: '100%' }}
                                    />
                                </div>

                                <div className="action-bar">
                                    <button
                                        onClick={handleRunCode}
                                        className="btn-modern btn-outline-modern"
                                        disabled={isSubmitting || isRunningCustomTest || isAIRunning}
                                    >
                                        {isRunningCustomTest ? (
                                            <>Running...</>
                                        ) : (
                                            <>
                                                <Play size={16} />
                                                Run
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCodeSubmit}
                                        className="btn-modern btn-success-modern"
                                        disabled={isSubmitting || isRunningCustomTest || isAIRunning}
                                    >
                                        {isSubmitting ? (
                                            <>Submitting...</>
                                        ) : (
                                            <>
                                                <Send size={16} />
                                                Submit
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleGetAIReview}
                                        className="btn-modern btn-primary-modern"
                                        disabled={isSubmitting || isRunningCustomTest || isAIRunning || !code.trim()}
                                    >
                                        {isAIRunning ? (
                                            <>Getting AI Review...</>
                                        ) : (
                                            <>
                                                <Code size={16} />
                                                AI Review
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className={`console-container ${activeTab === 'aiReview' ? 'ai-review-hover-expand' : ''}`}>
                                    <ul className="nav nav-tabs console-tabs d-flex">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'test' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('test')}
                                            >
                                                Test Case
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'customTest' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('customTest')}
                                            >
                                                Custom Input
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'verdict' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('verdict')}
                                            >
                                                Verdict
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link ${activeTab === 'aiReview' ? 'active' : ''}`}
                                                onClick={() => setActiveTab('aiReview')}
                                            >
                                                AI Review
                                            </button>
                                        </li>
                                    </ul>

                                    <div className="console-body">
                                        {activeTab === 'test' && (
                                            <div>
                                                <h6 style={{
                                                    color: 'var(--accent-color)',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    marginBottom: '0.8rem'
                                                }}>Sample Input</h6>
                                                <pre className="problem-block" style={{ marginBottom: '1.5rem' }}>
                                                    {sampleInput}
                                                </pre>

                                                {compileMessage && (
                                                    <div style={{
                                                        padding: '0.8rem 1rem',
                                                        borderRadius: '8px',
                                                        marginBottom: '1rem',
                                                        background: compileMessage.includes('Error') || compileMessage.includes('Failed') ?
                                                            'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        border: `1px solid ${compileMessage.includes('Error') || compileMessage.includes('Failed') ?
                                                            'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                                        color: compileMessage.includes('Error') || compileMessage.includes('Failed') ?
                                                            '#f87171' : '#34d399',
                                                        fontWeight: '600'
                                                    }}>
                                                        {compileMessage}
                                                    </div>
                                                )}

                                                <h6 style={{
                                                    color: 'var(--accent-color)',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    marginBottom: '0.8rem'
                                                }}>Your Output</h6>
                                                <pre className="problem-block">
                                                    {outputStdout || "Run your code to see the output..."}
                                                </pre>
                                            </div>
                                        )}

                                        {activeTab === 'customTest' && (
                                            <div>
                                                <h6 style={{
                                                    color: 'var(--accent-color)',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    marginBottom: '0.8rem'
                                                }}>Custom Input</h6>
                                                <textarea
                                                    className="custom-input w-100"
                                                    rows="4"
                                                    value={inputStdin}
                                                    onChange={(e) => setInputStdin(e.target.value)}
                                                    placeholder="Enter your custom input here..."
                                                    style={{ marginBottom: '1rem' }}
                                                />
                                                <button
                                                    onClick={() => {
                                                        setActiveTab('customTest');
                                                        handleRunCode();
                                                    }}
                                                    className="btn-modern btn-primary-modern"
                                                    disabled={isRunningCustomTest}
                                                    style={{ marginBottom: '1rem' }}
                                                >
                                                    {isRunningCustomTest ? 'Running...' : 'Run with Custom Input'}
                                                </button>

                                                {compileMessage && (
                                                    <div style={{
                                                        padding: '0.8rem 1rem',
                                                        borderRadius: '8px',
                                                        marginBottom: '1rem',
                                                        background: compileMessage.includes('Error') || compileMessage.includes('Failed') ?
                                                            'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        border: `1px solid ${compileMessage.includes('Error') || compileMessage.includes('Failed') ?
                                                            'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                                        color: compileMessage.includes('Error') || compileMessage.includes('Failed') ?
                                                            '#f87171' : '#34d399',
                                                        fontWeight: '600'
                                                    }}>
                                                        {compileMessage}
                                                    </div>
                                                )}

                                                <h6 style={{
                                                    color: 'var(--accent-color)',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    marginBottom: '0.8rem'
                                                }}>Output</h6>
                                                <pre className="problem-block">
                                                    {outputStdout || "Run your code with custom input to see the output..."}
                                                </pre>
                                            </div>
                                        )}

                                        {activeTab === 'verdict' && (
                                            <div>
                                                <h6 style={{
                                                    color: 'var(--accent-color)',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    marginBottom: '1rem'
                                                }}>Submission Results</h6>

                                                {submissionMessage && (
                                                    <div className="verdict-summary">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <div style={{
                                                                    fontWeight: '700',
                                                                    fontSize: '1.1rem',
                                                                    color: finalVerdict === 'Accepted' ? '#34d399' :
                                                                        finalVerdict === 'Error' || finalVerdict === 'Time Limit Exceeded' ? '#f87171' : 'var(--accent-color)'
                                                                }}>
                                                                    {finalVerdict === 'Accepted' && <CheckCircle2 size={18} className="me-2" />}
                                                                    {finalVerdict === 'Error' && <XCircle size={18} className="me-2" />}
                                                                    {finalVerdict !== 'Accepted' && finalVerdict !== 'Error' && <AlertTriangle size={18} className="me-2" />}
                                                                    {finalVerdict}
                                                                </div>
                                                                <div style={{
                                                                    fontSize: '0.9rem',
                                                                    color: 'var(--text-muted)',
                                                                    marginTop: '0.3rem'
                                                                }}>
                                                                    {submissionMessage}
                                                                </div>
                                                            </div>
                                                            <div style={{
                                                                textAlign: 'right',
                                                                color: 'var(--text-muted)',
                                                                fontSize: '0.9rem'
                                                            }}>
                                                                <div>
                                                                    <Clock size={14} className="me-1" />
                                                                    {totalTime || executionTime} ms
                                                                </div>
                                                                <div>
                                                                    <MemoryStick size={14} className="me-1" />
                                                                    {memoryUsed} MB
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {verdicts.length > 0 ? (
                                                    <div>
                                                        <h6 style={{
                                                            color: 'var(--text-muted)',
                                                            fontSize: '0.9rem',
                                                            marginBottom: '1rem'
                                                        }}>Test Case Results:</h6>
                                                        {verdicts.map((v, index) => (
                                                            <div key={index} className={`verdict-item ${v.status === 'Passed' ? 'verdict-passed' : 'verdict-failed'}`}>
                                                                <div className="d-flex align-items-center">
                                                                    {v.status === 'Passed' ?
                                                                        <CheckCircle2 size={16} className="me-2" /> :
                                                                        <XCircle size={16} className="me-2" />
                                                                    }
                                                                    Test Case {index + 1}
                                                                </div>
                                                                <div style={{ fontSize: '0.8rem' }}>
                                                                    {v.executionTime}ms | {v.memoryUsed}MB
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    !submissionMessage && (
                                                        <div style={{
                                                            textAlign: 'center',
                                                            color: 'var(--text-muted)',
                                                            paddingTop: '2rem'
                                                        }}>
                                                            Submit your code to see the verdict and test case results.
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'aiReview' && (
                                            <div>
                                                <h6 style={{
                                                    color: 'var(--accent-color)',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    marginBottom: '1rem'
                                                }}>AI Code Review</h6>

                                                {isAIRunning ? (
                                                    <div style={{
                                                        textAlign: 'center',
                                                        color: 'var(--text-muted)',
                                                        paddingTop: '2rem'
                                                    }}>
                                                        <div style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            border: '3px solid rgba(0, 212, 255, 0.3)',
                                                            borderTop: '3px solid var(--accent-color)',
                                                            borderRadius: '50%',
                                                            animation: 'spin 1s linear infinite',
                                                            margin: '0 auto 1rem auto'
                                                        }}></div>
                                                        Analyzing your code with AI, please wait...
                                                    </div>
                                                ) : (
                                                    <div className="markdown-content">
                                                        <ReactMarkdown>
                                                            {aiReviewContent || "Click 'AI Review' button to get intelligent feedback on your code including suggestions for optimization, best practices, and potential improvements."}
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

                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
}

export default SolveProblemScreen;

