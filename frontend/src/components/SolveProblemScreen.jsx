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

// Fixed API URLs (removed extra spaces)
const api_url = import.meta.env.VITE_SERVER;
const api_com = import.meta.env.VITE_COMPILER;
const SUBMISSION_API_BASE_URL = `${api_url}/api/submissions`;
const COMPILER_RUN_URL = `${api_com}/run`;
const DRAFT_API_BASE_URL = `${api_url}/api/drafts`;
const AI_REVIEW_API_URL = `${api_url}/api/ai-review`;

// Boilerplate code templates
const boilerplateCode = {
    cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
    java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    python: `# Your solution here
def solve():
    # Write your code here
    pass

if __name__ == "__main__":
    solve()`
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

    // Load draft and set boilerplate code
    useEffect(() => {
        const loadDraftOrBoilerplate = async () => {
            if (!problem || !problem._id) return;
            
            if (isAuthenticated) {
                try {
                    const token = localStorage.getItem('token');
                    if (token) {
                        const config = { headers: { Authorization: `Bearer ${token}` } };
                        const response = await axios.get(`${DRAFT_API_BASE_URL}/${problem._id}`, config);
                        if (response.data.draft && response.data.draft.code) {
                            setCode(response.data.draft.code);
                            setLanguage(response.data.draft.language);
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error loading draft:', error);
                }
            }
            
            // If no draft found or not authenticated, set boilerplate
            setCode(boilerplateCode[language] || boilerplateCode.cpp);
        };
        
        loadDraftOrBoilerplate();
    }, [isAuthenticated, problem]);

    // Set boilerplate when language changes and no existing code
    useEffect(() => {
        if (!code || code === boilerplateCode.cpp || code === boilerplateCode.java || code === boilerplateCode.python) {
            setCode(boilerplateCode[language] || boilerplateCode.cpp);
        }
    }, [language]);

    // Save draft when code or language changes
    useEffect(() => {
        if (isAuthenticated && problem && problem._id && code && code !== boilerplateCode[language]) {
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
        if (!isAuthenticated) {
            setSubmissionMessage('Please log in to submit your solution.');
            return;
        }
        
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
            setFinalVerdict(data.verdict || 'Unknown');
            setExecutionTime(data.executionTime || 0);
            setMemoryUsed(data.memoryUsed || 0);
            setTotalTime(data.executionTime || 0);
            setVerdicts(data.verdicts && Array.isArray(data.verdicts) ? data.verdicts : []);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Submission failed';
            setSubmissionMessage(`Submission failed: ${errorMessage}`);
            setFinalVerdict('Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- AI Integration Logic ---
    const handleGetAIReview = async () => {
        if (!code || code.trim() === '') {
            setAiReviewContent('Please write some code before requesting AI review.');
            return;
        }
        
        setAiReviewContent('');
        setIsAIRunning(true);
        setActiveTab('aiReview');

        const reviewData = {
            userCode: code,
            language: language,
        };

        try {
            const response = await axios.post(AI_REVIEW_API_URL, reviewData);
            
            if (response.data && response.data.review) {
                setAiReviewContent(response.data.review);
            } else {
                setAiReviewContent('AI review could not be generated. The response from the server was empty.');
            }
        } catch (error) {
            console.error('Error fetching AI review from backend:', error);
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

    const sampleInput = problem.testCases && problem.testCases.length > 0 ? problem.testCases[0].input : problem.input || "No sample input available.";

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2d1b69 100%)',
            minHeight: '100vh',
            color: 'white'
        }}>
            <style>{`
                :root {
                    --dark-bg: #1a1a2e;
                    --dark-bg-lighter: #2c2c54;
                    --border-color: #40407a;
                    --text-light: #f0f0f0;
                    --text-muted: #a5b4fc;
                    --accent-color: #00d4ff;
                    --secondary-color: #7c3aed;
                }
                
                .ide-container {
                    display: flex;
                    flex-direction: row;
                    gap: 1.5rem;
                    height: calc(100vh - 120px);
                }
                
                @media (max-width: 768px) {
                    .ide-container {
                        flex-direction: column;
                        height: auto;
                    }
                }
                
                .panel-left, .panel-right {
                    background: rgba(30, 30, 46, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    borderRadius: 20px;
                    overflow: hidden;
                    display: flex;
                    flexDirection: column;
                    backdropFilter: blur(10px);
                }
                
                .panel-left { 
                    flex: 0 0 45%; 
                }
                
                .panel-right { 
                    flex: 1; 
                }
                
                @media (max-width: 768px) {
                    .panel-left, .panel-right {
                        flex: none;
                        width: 100%;
                    }
                    .panel-left {
                        order: 1;
                        max-height: 40vh;
                        overflow-y: auto;
                    }
                    .panel-right {
                        order: 2;
                        min-height: 60vh;
                    }
                }
                
                .panel-content { 
                    padding: 2rem; 
                    overflow-y: auto; 
                    flex-grow: 1; 
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
                    height: 35%;
                    display: flex;
                    flex-direction: column;
                    transition: height 0.3s ease-in-out;
                }
                
                .console-tabs .nav-link { 
                    background: none !important; 
                    border: none !important; 
                    color: var(--text-muted) !important; 
                    padding: 0.8rem 1.5rem;
                    border-radius: 15px 15px 0 0;
                    transition: all 0.3s ease;
                }
                
                .console-tabs .nav-link.active { 
                    color: var(--accent-color) !important; 
                    background: rgba(0, 212, 255, 0.1) !important;
                    border-bottom: 3px solid var(--accent-color) !important; 
                }
                
                .console-body {
                    padding: 1.5rem;
                    overflow-y: auto;
                    flex-grow: 1;
                    font-family: 'Fira Code', monospace;
                    background: rgba(33, 33, 51, 0.9);
                    color: var(--text-light);
                    border-radius: 0 0 20px 20px;
                }
                
                .console-container.ai-review-hover-expand:hover {
                    height: 95%;
                }
                
                .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6 {
                    color: var(--accent-color);
                    margin-top: 1.5rem;
                    margin-bottom: 0.8rem;
                }
                
                .markdown-content p {
                    margin-bottom: 1rem;
                    line-height: 1.6;
                }
                
                .markdown-content ul, .markdown-content ol {
                    margin-left: 2rem;
                    margin-bottom: 1rem;
                }
                
                .markdown-content pre {
                    background-color: rgba(0, 0, 0, 0.3);
                    padding: 1rem;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
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
                    padding: 1rem 1.5rem; 
                    background: rgba(44, 44, 84, 0.8);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex; 
                    justify-content: flex-end; 
                    align-items: center; 
                    gap: 1rem; 
                }
                
                @media (max-width: 768px) {
                    .action-bar {
                        flex-wrap: wrap;
                        gap: 0.8rem;
                    }
                    .action-bar button {
                        flex: 1;
                        min-width: 120px;
                    }
                }
                
                pre.problem-block { 
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1.5rem; 
                    border-radius: 12px; 
                    white-space: pre-wrap; 
                    word-wrap: break-word; 
                    font-size: 0.9rem; 
                    line-height: 1.5;
                }
                
                .difficulty-badge {
                    padding: 0.4rem 1rem;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                }
                
                .tag-badge {
                    background: rgba(124, 58, 237, 0.2);
                    border: 1px solid rgba(124, 58, 237, 0.3);
                    color: #a78bfa;
                    padding: 0.2rem 0.6rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    margin-right: 0.5rem;
                    margin-bottom: 0.3rem;
                }
            `}</style>
            
            <div className="container-fluid px-4">
                <header className="pb-3 mb-3 d-flex justify-content-between align-items-center" style={{ paddingTop: '1.5rem' }}>
                    <div className="d-flex align-items-center">
                        <Code size={32} className="me-3" style={{ color: '#00d4ff' }} />
                        <h1 className="h4 text-white mb-0 fw-bold" style={{ 
                            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', 
                            WebkitBackgroundClip: 'text', 
                            WebkitTextFillColor: 'transparent' 
                        }}>
                            CodeVM IDE
                        </h1>
                    </div>
                    <button 
                        onClick={onClose} 
                        style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            border: 'none',
                            color: 'white',
                            padding: '0.8rem 2rem',
                            borderRadius: '50px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <XCircle size={16} /> Back to Problems
                    </button>
                </header>
                
                <div className="ide-container">
                    <div className="panel-left">
                        <div className="panel-content">
                            <h4 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>{problem.title}</h4>
                            
                            <div className="d-flex align-items-center flex-wrap mb-3">
                                <span className={`difficulty-badge me-3 mb-2`} style={{
                                    background: problem.difficulty === 'Easy' 
                                        ? 'linear-gradient(135deg, #10b981, #34d399)' 
                                        : problem.difficulty === 'Medium' 
                                            ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
                                            : 'linear-gradient(135deg, #ef4444, #f87171)',
                                    color: 'white'
                                }}>
                                    {problem.difficulty}
                                </span>
                                <div className="d-flex flex-wrap">
                                    {problem.tags && problem.tags.map((tag, index) => (
                                        <span key={index} className="tag-badge">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-muted small mb-4" style={{ color: '#a5b4fc' }}>
                                <Clock size={16} className="me-2" />
                                Time Limit: {problem.timeLimit}s | Memory Limit: {problem.memoryLimit}MB
                            </p>
                            
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Problem Statement</h6>
                                <p className="text-light" style={{ lineHeight: '1.6' }}>{problem.statement}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Input Format</h6>
                                <p className="text-light" style={{ lineHeight: '1.6' }}>{problem.input}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Output Format</h6>
                                <p className="text-light" style={{ lineHeight: '1.6' }}>{problem.output}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>Constraints</h6>
                                <pre className="problem-block">{problem.constraints}</pre>
                            </div>
                        </div>
                    </div>
                    
                    <div className="panel-right">
                        <div className="panel-right-inner">
                            <div className="d-flex justify-content-between align-items-center p-3" 
                                 style={{ background: 'rgba(44, 44, 84, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                <div className="d-flex align-items-center">
                                    <Code size={20} className="me-2" style={{ color: '#00d4ff' }} />
                                    <span className="fw-bold" style={{ color: '#00d4ff' }}>Code Editor</span>
                                </div>
                                <select
                                    className="form-select form-select-sm"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    style={{ 
                                        width: 'auto', 
                                        background: 'rgba(255, 255, 255, 0.05)', 
                                        color: 'white', 
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px'
                                    }}
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
                                    style={{ height: '100%', fontSize: '14px' }}
                                />
                            </div>
                            
                            <div className="action-bar">
                                <button
                                    onClick={handleRunCode}
                                    disabled={isSubmitting || isRunningCustomTest || isAIRunning}
                                    style={{
                                        background: isRunningCustomTest 
                                            ? 'rgba(124, 58, 237, 0.3)' 
                                            : 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '25px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: isRunningCustomTest ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: isRunningCustomTest ? 0.7 : 1
                                    }}
                                >
                                    {isRunningCustomTest ? 'Running...' : <><Play size={16} /> Run</>}
                                </button>
                                
                                <button
                                    onClick={handleCodeSubmit}
                                    disabled={isSubmitting || isRunningCustomTest || isAIRunning || !isAuthenticated}
                                    style={{
                                        background: isSubmitting 
                                            ? 'rgba(16, 185, 129, 0.3)' 
                                            : 'linear-gradient(135deg, #10b981, #059669)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.8rem 2rem',
                                        borderRadius: '25px',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: (isSubmitting || !isAuthenticated) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: (isSubmitting || !isAuthenticated) ? 0.7 : 1
                                    }}
                                >
                                    {isSubmitting ? 'Submitting...' : <><Send size={16} /> Submit</>}
                                </button>
                                
                                <button
                                    onClick={handleGetAIReview}
                                    disabled={isSubmitting || isRunningCustomTest || isAIRunning || !code || code.trim() === ''}
                                    style={{
                                        background: isAIRunning 
                                            ? 'rgba(124, 58, 237, 0.3)' 
                                            : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.8rem 1.5rem',
                                        borderRadius: '25px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: (isAIRunning || !code) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        opacity: (isAIRunning || !code) ? 0.7 : 1
                                    }}
                                >
                                    {isAIRunning ? 'AI Reviewing...' : <><Code size={16} /> AI Review</>}
                                </button>
                            </div>
                            
                            <div className={`console-container ${activeTab === 'aiReview' ? 'ai-review-hover-expand' : ''}`}>
                                <ul className="nav nav-tabs console-tabs px-3" style={{ background: 'rgba(44, 44, 84, 0.5)' }}>
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
                                            <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>
                                                Sample Input
                                            </h6>
                                            <pre className="problem-block mb-4">{sampleInput}</pre>
                                            
                                            {compileMessage && (
                                                <div className="mb-3">
                                                    <h6 className="fw-bold mb-2" style={{ color: compileMessage.includes('Error') ? '#ef4444' : '#10b981' }}>
                                                        Status: {compileMessage}
                                                    </h6>
                                                </div>
                                            )}
                                            
                                            <h6 className="fw-bold mb-2" style={{ color: '#00d4ff' }}>
                                                Your Output
                                            </h6>
                                            <pre className="problem-block" style={{ 
                                                minHeight: '100px', 
                                                background: outputStdout ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)' 
                                            }}>
                                                {outputStdout || "Run your code to see output..."}
                                            </pre>
                                        </div>
                                    )}
                                    
                                    {activeTab === 'customTest' && (
                                        <div>
                                            <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>
                                                Custom Input
                                            </h6>
                                            <textarea
                                                className="form-control mb-3"
                                                rows="4"
                                                value={inputStdin}
                                                onChange={(e) => setInputStdin(e.target.value)}
                                                placeholder="Enter your custom input here..."
                                                style={{
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    color: 'white',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '12px',
                                                    padding: '1rem',
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                            <button 
                                                onClick={handleRunCode} 
                                                disabled={isRunningCustomTest}
                                                style={{
                                                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '0.6rem 1.5rem',
                                                    borderRadius: '20px',
                                                    fontWeight: '600',
                                                    cursor: isRunningCustomTest ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {isRunningCustomTest ? 'Running...' : 'Run with Custom Input'}
                                            </button>
                                            
                                            {outputStdout && (
                                                <div className="mt-4">
                                                    <h6 className="fw-bold mb-2" style={{ color: '#00d4ff' }}>Output</h6>
                                                    <pre className="problem-block">{outputStdout}</pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {activeTab === 'verdict' && (
                                        <div>
                                            {submissionMessage ? (
                                                <div className={`alert d-flex justify-content-between align-items-center mb-4 ${
                                                    finalVerdict === 'Accepted' ? 'alert-success' : 'alert-danger'
                                                }`} style={{
                                                    background: finalVerdict === 'Accepted' 
                                                        ? 'rgba(16, 185, 129, 0.1)' 
                                                        : 'rgba(239, 68, 68, 0.1)',
                                                    border: `1px solid ${finalVerdict === 'Accepted' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                                                    borderRadius: '12px',
                                                    color: finalVerdict === 'Accepted' ? '#10b981' : '#ef4444'
                                                }}>
                                                    <div className="d-flex align-items-center">
                                                        {finalVerdict === 'Accepted' 
                                                            ? <CheckCircle2 size={20} className="me-2" />
                                                            : <AlertTriangle size={20} className="me-2" />
                                                        }
                                                        <strong>{finalVerdict}</strong>
                                                    </div>
                                                    <div className="small d-flex align-items-center gap-3">
                                                        <span>
                                                            <Clock size={14} className="me-1" /> {totalTime} ms
                                                        </span>
                                                        <span>
                                                            <MemoryStick size={14} className="me-1" /> {memoryUsed} MB
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <p style={{ color: '#a5b4fc' }}>Submit your code to see the verdict</p>
                                                </div>
                                            )}
                                            
                                            {verdicts.length > 0 && (
                                                <div>
                                                    <h6 className="fw-bold mb-3" style={{ color: '#00d4ff' }}>
                                                        Test Case Results
                                                    </h6>
                                                    {verdicts.map((v, index) => (
                                                        <div 
                                                            key={index} 
                                                            className="d-flex justify-content-between p-3 rounded mb-2" 
                                                            style={{
                                                                background: v.status === 'Passed' 
                                                                    ? 'rgba(16, 185, 129, 0.1)' 
                                                                    : 'rgba(239, 68, 68, 0.1)',
                                                                border: `1px solid ${v.status === 'Passed' 
                                                                    ? 'rgba(16, 185, 129, 0.3)' 
                                                                    : 'rgba(239, 68, 68, 0.3)'}`,
                                                                borderRadius: '8px'
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                {v.status === 'Passed' 
                                                                    ? <CheckCircle2 size={16} className="me-2" style={{ color: '#10b981' }} />
                                                                    : <XCircle size={16} className="me-2" style={{ color: '#ef4444' }} />
                                                                }
                                                                <span style={{ 
                                                                    color: v.status === 'Passed' ? '#10b981' : '#ef4444',
                                                                    fontWeight: '600'
                                                                }}>
                                                                    Test Case {index + 1}: {v.status}
                                                                </span>
                                                            </div>
                                                            <div className="small d-flex align-items-center gap-2" style={{ color: '#a5b4fc' }}>
                                                                <span>{v.executionTime || 0} ms</span>
                                                                <span>|</span>
                                                                <span>{v.memoryUsed || 0} MB</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    {activeTab === 'aiReview' && (
                                        <div>
                                            <h6 className="fw-bold mb-3" style={{ color: '#7c3aed' }}>
                                                AI Code Review
                                            </h6>
                                            {isAIRunning ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border" role="status" style={{ color: '#7c3aed' }}>
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-3" style={{ color: '#a5b4fc' }}>
                                                        AI is analyzing your code, please wait...
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="markdown-content">
                                                    <ReactMarkdown>
                                                        {aiReviewContent || "Click 'AI Review' to analyze your code for improvements, optimizations, and best practices."}
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
    );
}

export default SolveProblemScreen;