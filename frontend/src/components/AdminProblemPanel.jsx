import React, { useState, useEffect } from 'react';
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
    Code,
    Trophy,
    Target,
    TrendingUp,
    Calendar,
    Clock,
    Filter,
    Zap,
    BookOpen,
    Award
} from 'lucide-react';

// Mock data for demo purposes
const mockProblems = [
    {
        _id: '1',
        title: 'Two Sum Array Problem',
        statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        constraints: '2 <= nums.length <= 10^4',
        timeLimit: 1,
        memoryLimit: 256,
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table', 'Two Pointers'],
        solved: true
    },
    {
        _id: '2',
        title: 'Longest Palindromic Substring',
        statement: 'Given a string s, return the longest palindromic substring in s.',
        input: 's = "babad"',
        output: '"bab"',
        constraints: '1 <= s.length <= 1000',
        timeLimit: 2,
        memoryLimit: 512,
        difficulty: 'Medium',
        tags: ['String', 'Dynamic Programming'],
        solved: false
    },
    {
        _id: '3',
        title: 'Merge k Sorted Lists',
        statement: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.',
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        constraints: 'k == lists.length',
        timeLimit: 3,
        memoryLimit: 1024,
        difficulty: 'Hard',
        tags: ['Linked List', 'Divide and Conquer', 'Heap'],
        solved: false
    },
    {
        _id: '4',
        title: 'Binary Tree Inorder Traversal',
        statement: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
        input: 'root = [1,null,2,3]',
        output: '[1,3,2]',
        constraints: 'The number of nodes in the tree is in the range [0, 100]',
        timeLimit: 1,
        memoryLimit: 256,
        difficulty: 'Easy',
        tags: ['Stack', 'Tree', 'Depth-First Search'],
        solved: true
    },
    {
        _id: '5',
        title: 'Valid Parentheses',
        statement: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        input: 's = "()[]{}"',
        output: 'true',
        constraints: '1 <= s.length <= 10^4',
        timeLimit: 1,
        memoryLimit: 256,
        difficulty: 'Easy',
        tags: ['String', 'Stack'],
        solved: false
    },
    {
        _id: '6',
        title: 'Maximum Subarray',
        statement: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        constraints: '1 <= nums.length <= 10^5',
        timeLimit: 2,
        memoryLimit: 512,
        difficulty: 'Medium',
        tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
        solved: false
    }
];

function AdminProblemPanel({ userRole = 'user', isAuthenticated = true, onLogout, onSolveProblem }) {
    const [problems, setProblems] = useState(mockProblems);
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

    // Problem Form state
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
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const isAdmin = userRole === 'admin';

    // Calculate statistics
    const totalProblems = problems.length;
    const solvedProblems = problems.filter(p => p.solved).length;
    const easyProblems = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumProblems = problems.filter(p => p.difficulty === 'Medium').length;
    const hardProblems = problems.filter(p => p.difficulty === 'Hard').length;

    // Filtered problems based on filters
    const filteredProblems = problems.filter(problem => {
        const matchesTag = filterTag === '' || problem.tags.some(tag => 
            tag.toLowerCase().includes(filterTag.toLowerCase())
        );
        const matchesDifficulty = difficultyFilter === '' || problem.difficulty === difficultyFilter;
        const matchesStatus = statusFilter === '' || 
            (statusFilter === 'solved' && problem.solved) ||
            (statusFilter === 'unsolved' && !problem.solved);
        
        return matchesTag && matchesDifficulty && matchesStatus;
    });

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
        setMessage('');
    };

    const handleSolveProblem = (problem) => {
        if (onSolveProblem) {
            onSolveProblem(problem);
        } else {
            alert(`Opening solve interface for: ${problem.title}`);
        }
    };

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f0f23 0%, #1e1e2e 50%, #2d1b69 100%)',
            minHeight: '100vh',
            color: 'white'
        }}>
            <div className="container py-5">
                {message && (
                    <div className="alert alert-info mb-4" 
                         style={{ 
                             background: 'rgba(0, 212, 255, 0.1)', 
                             border: '1px solid rgba(0, 212, 255, 0.3)', 
                             color: '#93c5fd', 
                             borderRadius: '12px' 
                         }}>
                        {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')} 
                                style={{ filter: 'invert(1)' }}></button>
                    </div>
                )}

                {/* Hero Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ec4899 100%)',
                    borderRadius: '24px',
                    padding: '3rem 2rem',
                    marginBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        content: '',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1))',
                        opacity: 0.5
                    }}></div>
                    <div className="row align-items-center" style={{ position: 'relative', zIndex: 2 }}>
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center mb-3">
                                <Target size={48} className="me-3" />
                                <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0 }}>Problem Dashboard</h1>
                            </div>
                            <p style={{ fontSize: '1.2rem', opacity: 0.9, fontWeight: '300', margin: 0 }}>
                                Master algorithms, solve challenges, and track your coding journey step by step
                            </p>
                        </div>
                        <div className="col-lg-4">
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                padding: '2rem',
                                backdropFilter: 'blur(15px)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    background: `conic-gradient(#00d4ff 0deg ${solvedProblems/totalProblems * 360}deg, rgba(255,255,255,0.1) ${solvedProblems/totalProblems * 360}deg 360deg)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem auto'
                                }}>
                                    <div style={{
                                        width: '90px',
                                        height: '90px',
                                        background: '#1e1e2e',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00d4ff' }}>
                                            {solvedProblems}/{totalProblems}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: '#a5b4fc' }}>
                                            Solved
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-lg-3 col-md-6">
                        <div style={{
                            background: 'rgba(30, 30, 46, 0.8)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: '700' }}>{easyProblems}</div>
                            <div style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Easy Problems</div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div style={{
                            background: 'rgba(30, 30, 46, 0.8)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ color: '#f59e0b', fontSize: '2rem', fontWeight: '700' }}>{mediumProblems}</div>
                            <div style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Medium Problems</div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div style={{
                            background: 'rgba(30, 30, 46, 0.8)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: '700' }}>{hardProblems}</div>
                            <div style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Hard Problems</div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div style={{
                            background: 'rgba(30, 30, 46, 0.8)',
                            border: '1px solid rgba(0, 212, 255, 0.3)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ color: '#00d4ff', fontSize: '2rem', fontWeight: '700' }}>{Math.round((solvedProblems/totalProblems) * 100)}%</div>
                            <div style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>Success Rate</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="row mb-4">
                    <div className="col-lg-6">
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '50px',
                            padding: '0.8rem 2rem',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <Search size={20} className="me-3" style={{ color: '#00d4ff' }} />
                            <input
                                type="text"
                                placeholder="Search tags: array, dp, hash, tree..."
                                value={filterTag}
                                onChange={(e) => setFilterTag(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'white',
                                    width: '100%',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="d-flex gap-3">
                            <select 
                                value={difficultyFilter} 
                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '25px',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    outline: 'none'
                                }}
                            >
                                <option value="">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '25px',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    outline: 'none'
                                }}
                            >
                                <option value="">All Problems</option>
                                <option value="solved">Solved</option>
                                <option value="unsolved">Unsolved</option>
                            </select>
                            {isAdmin && (
                                <button
                                    onClick={openCreateProblemModal}
                                    style={{
                                        background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.8rem 2rem',
                                        borderRadius: '50px',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 30px rgba(0, 212, 255, 0.3)'
                                    }}
                                >
                                    <PlusCircle size={20} />
                                    Add Problem
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Problems Grid */}
                {filteredProblems.length === 0 ? (
                    <div className="text-center py-5">
                        <div style={{
                            background: 'rgba(30, 30, 46, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            padding: '3rem',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            <Code size={64} className="mb-3" style={{ color: '#00d4ff', opacity: 0.5 }} />
                            <h3 style={{ color: '#a5b4fc' }}>No Problems Found</h3>
                            <p style={{ color: '#6b7280' }}>
                                {isAuthenticated ? 'Try adjusting your filters or add new problems!' : 'Please log in to view problems.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {filteredProblems.map((problem, index) => (
                            <div className="col-lg-4 col-md-6" key={problem._id}>
                                <div style={{
                                    background: 'rgba(30, 30, 46, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '20px',
                                    padding: '2rem',
                                    backdropFilter: 'blur(10px)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '100%',
                                    transition: 'all 0.4s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}>
                                    <div style={{
                                        content: '',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #ec4899)'
                                    }}></div>

                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div style={{
                                            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            fontWeight: '800',
                                            fontSize: '1.1rem'
                                        }}>
                                            QID {index + 1}
                                        </div>
                                        <div>
                                            {problem.solved ? (
                                                <div style={{
                                                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                    color: 'white',
                                                    padding: '0.4rem 1rem',
                                                    borderRadius: '20px',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}>
                                                    <CheckCircle size={16} />
                                                    Solved
                                                </div>
                                            ) : (
                                                <div style={{
                                                    background: 'rgba(236, 72, 153, 0.2)',
                                                    border: '1px solid rgba(236, 72, 153, 0.3)',
                                                    color: '#f9a8d4',
                                                    padding: '0.4rem 1rem',
                                                    borderRadius: '20px',
                                                    fontWeight: '600',
                                                    fontSize: '0.9rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem'
                                                }}>
                                                    <Trophy size={16} />
                                                    Unsolved
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        color: '#00d4ff',
                                        marginBottom: '1rem'
                                    }}>{problem.title}</h3>

                                    {problem.tags.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem',
                                            margin: '1rem 0'
                                        }}>
                                            {problem.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} style={{
                                                    background: 'rgba(124, 58, 237, 0.2)',
                                                    border: '1px solid rgba(124, 58, 237, 0.3)',
                                                    color: '#a78bfa',
                                                    padding: '0.3rem 0.8rem',
                                                    borderRadius: '15px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500'
                                                }}>{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '50px',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            background: problem.difficulty === 'Easy' ? 'linear-gradient(135deg, #10b981, #34d399)' :
                                                       problem.difficulty === 'Medium' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' :
                                                       'linear-gradient(135deg, #ef4444, #f87171)',
                                            color: 'white'
                                        }}>
                                            <Gauge size={14} />
                                            {problem.difficulty.toUpperCase()}
                                        </div>
                                        <div className="d-flex align-items-center gap-2" 
                                             style={{ color: '#a5b4fc', fontSize: '0.9rem' }}>
                                            <Clock size={14} />
                                            {problem.timeLimit}s
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                                        <button
                                            onClick={() => openViewProblemModal(problem)}
                                            style={{
                                                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '0.6rem 1.5rem',
                                                borderRadius: '25px',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                flex: 1,
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                        {!isAdmin && isAuthenticated && (
                                            <button
                                                onClick={() => handleSolveProblem(problem)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '0.6rem 1.5rem',
                                                    borderRadius: '25px',
                                                    fontWeight: '600',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <Zap size={16} />
                                                Solve
                                            </button>
                                        )}
                                        {isAdmin && (
                                            <>
                                                <button
                                                    onClick={() => openEditProblemModal(problem)}
                                                    style={{
                                                        background: 'rgba(245, 158, 11, 0.2)',
                                                        border: '1px solid rgba(245, 158, 11, 0.3)',
                                                        color: '#fbbf24',
                                                        padding: '0.6rem',
                                                        borderRadius: '20px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <SquarePen size={16} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setProblemToDeleteId(problem._id);
                                                        setIsConfirmModalOpen(true);
                                                    }}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.2)',
                                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                                        color: '#f87171',
                                                        padding: '0.6rem',
                                                        borderRadius: '20px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Problem View Modal */}
                {isViewModalOpen && currentProblem && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div style={{
                                background: 'rgba(15, 15, 35, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                color: 'white'
                            }}>
                                <div className="modal-header border-0 p-4">
                                    <h5 className="modal-title fw-bold" style={{ color: '#00d4ff' }}>
                                        {currentProblem.title}
                                    </h5>
                                    <button 
                                        type="button" 
                                        onClick={closeAllModals}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#f87171',
                                            fontSize: '1.2rem',
                                            cursor: 'pointer',
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <XCircle size={18} />
                                    </button>
                                </div>
                                <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <div className="row mb-4">
                                        <div className="col-md-4">
                                            <div style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '50px',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                                background: currentProblem.difficulty === 'Easy' ? 'linear-gradient(135deg, #10b981, #34d399)' :
                                                           currentProblem.difficulty === 'Medium' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' :
                                                           'linear-gradient(135deg, #ef4444, #f87171)',
                                                color: 'white'
                                            }}>
                                                <Gauge size={14} />
                                                {currentProblem.difficulty}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div style={{ color: '#a5b4fc' }}>
                                                <Clock size={16} className="me-2" />
                                                Time: {currentProblem.timeLimit}s
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div style={{ color: '#a5b4fc' }}>
                                                Memory: {currentProblem.memoryLimit}MB
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <strong style={{ color: '#00d4ff' }}>Tags:</strong>
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {currentProblem.tags.map((tag, index) => (
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

                                    <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '2rem 0' }} />

                                    <h6 style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '1rem' }}>
                                        Problem Statement:
                                    </h6>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        marginBottom: '2rem',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {currentProblem.statement}
                                    </div>

                                    <h6 style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '1rem' }}>
                                        Input Format:
                                    </h6>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        marginBottom: '2rem',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {currentProblem.input}
                                    </div>

                                    <h6 style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '1rem' }}>
                                        Output Format:
                                    </h6>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        marginBottom: '2rem',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {currentProblem.output}
                                    </div>

                                    <h6 style={{ color: '#00d4ff', fontWeight: 'bold', marginBottom: '1rem' }}>
                                        Constraints:
                                    </h6>
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        marginBottom: '2rem',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap'
                                    }}>
                                        {currentProblem.constraints}
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4">
                                    <button
                                        onClick={closeAllModals}
                                        style={{
                                            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0.8rem 2rem',
                                            borderRadius: '50px',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create/Edit Problem Modal (Admin Only) */}
                {isModalOpen && isAdmin && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                            <div style={{
                                background: 'rgba(15, 15, 35, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                color: 'white'
                            }}>
                                <div className="modal-header border-0 p-4">
                                    <h5 className="modal-title fw-bold" style={{ color: '#00d4ff' }}>
                                        {formMode === 'create' ? 'Create New Problem' : 'Edit Problem'}
                                    </h5>
                                    <button 
                                        type="button" 
                                        onClick={closeAllModals}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >×</button>
                                </div>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    setMessage(`Problem ${formMode}d successfully!`);
                                    closeAllModals();
                                }}>
                                    <div className="modal-body p-4" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Difficulty
                                                </label>
                                                <select
                                                    value={difficulty}
                                                    onChange={(e) => setDifficulty(e.target.value)}
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Problem Statement
                                                </label>
                                                <textarea
                                                    value={statement}
                                                    onChange={(e) => setStatement(e.target.value)}
                                                    rows="5"
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none',
                                                        resize: 'vertical'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Input Format
                                                </label>
                                                <textarea
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    rows="3"
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none',
                                                        resize: 'vertical'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Output Format
                                                </label>
                                                <textarea
                                                    value={output}
                                                    onChange={(e) => setOutput(e.target.value)}
                                                    rows="3"
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none',
                                                        resize: 'vertical'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Constraints
                                                </label>
                                                <textarea
                                                    value={constraints}
                                                    onChange={(e) => setConstraints(e.target.value)}
                                                    rows="3"
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none',
                                                        resize: 'vertical'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Time Limit (seconds)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={timeLimit}
                                                    onChange={(e) => setTimeLimit(e.target.value)}
                                                    min="1"
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Memory Limit (MB)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={memoryLimit}
                                                    onChange={(e) => setMemoryLimit(e.target.value)}
                                                    min="1"
                                                    required
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label" style={{ color: '#a5b4fc', fontWeight: '600' }}>
                                                    Tags (comma-separated)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={tags}
                                                    onChange={(e) => setTags(e.target.value)}
                                                    placeholder="e.g., Array, DP, Graph"
                                                    style={{
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '0.8rem 1rem',
                                                        width: '100%',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 p-4">
                                        <button
                                            type="button"
                                            onClick={closeAllModals}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                                color: 'white',
                                                padding: '0.8rem 2rem',
                                                borderRadius: '50px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            style={{
                                                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '0.8rem 2rem',
                                                borderRadius: '50px',
                                                fontWeight: '700',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {formMode === 'create' ? 'Create Problem' : 'Update Problem'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isConfirmModalOpen && isAdmin && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                        <div className="modal-dialog modal-sm modal-dialog-centered">
                            <div style={{
                                background: 'rgba(15, 15, 35, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '20px',
                                color: 'white'
                            }}>
                                <div className="modal-header border-0 p-4">
                                    <h5 className="modal-title fw-bold" style={{ color: '#ef4444' }}>
                                        Confirm Deletion
                                    </h5>
                                    <button 
                                        type="button" 
                                        onClick={closeAllModals}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer'
                                        }}
                                    >×</button>
                                </div>
                                <div className="modal-body p-4 text-center">
                                    <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                                        Are you sure you want to delete this problem?
                                    </p>
                                    <p style={{ color: '#ef4444', fontWeight: 'bold' }}>
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="modal-footer border-0 p-4">
                                    <button
                                        onClick={closeAllModals}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            padding: '0.8rem 2rem',
                                            borderRadius: '50px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            marginRight: '1rem'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setMessage('Problem deleted successfully!');
                                            closeAllModals();
                                        }}
                                        style={{
                                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '0.8rem 2rem',
                                            borderRadius: '50px',
                                            fontWeight: '700',
                                            cursor: 'pointer'
                                        }}
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