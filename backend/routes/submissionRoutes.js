const express = require('express');
const router = require('express').Router();
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const TestCase = require('../models/TestCase');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const axios = require('axios');

const COMPILER_URL = 'http://localhost:9000/submit';

// @route   POST /api/submissions
// @desc    Submit code for a problem
// @access  Private
router.post('/', protect, async (req, res) => {
    const { problemId, code, language } = req.body;
    const userId = req.user._id;

    if (!problemId || !code || !language) {
        return res.status(400).json({ message: 'Problem ID, code, and language are required' });
    }

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }
        
        const testCases = await TestCase.find({ problemId: problemId });
        if (testCases.length === 0) {
            return res.status(400).json({ message: 'No test cases found for this problem.' });
        }

        const newSubmission = new Submission({
            userId,
            problemId,
            code,
            language,
            verdict: 'Pending',
        });
        const submission = await newSubmission.save();

        let finalVerdict = 'Accepted';
        let totalExecutionTime = 0;
        let maxMemoryUsed = 0;
        let compileMessage = '';
        const verdicts = [];

        try {
            for (const testCase of testCases) {
                const compilerResponse = await axios.post(COMPILER_URL, {
                    id: submission._id,
                    QID: problemId,
                    code: submission.code,
                    language: submission.language,
                    input: testCase.input,
                    expectedOutput: testCase.output,
                });
                
                const { verdict, totalTimeMs, memoryUsed, compileMessage: tcCompileMessage } = compilerResponse.data;

                const currentExecutionTime = parseFloat(totalTimeMs) || 0;
                const currentMemoryUsed = parseFloat(memoryUsed) || 0;

                verdicts.push({
                    status: verdict,
                    executionTime: currentExecutionTime,
                    memoryUsed: currentMemoryUsed,
                    message: tcCompileMessage || '',
                });

                if (verdict !== 'Passed') {
                    finalVerdict = verdict;
                    break;
                }
                
                totalExecutionTime += currentExecutionTime;
                maxMemoryUsed = Math.max(maxMemoryUsed, currentMemoryUsed);
            }
            
            submission.verdict = finalVerdict;
            submission.executionTime = totalExecutionTime;
            submission.memoryUsed = maxMemoryUsed;
            submission.compileMessage = compileMessage;
            submission.verdicts = verdicts;
            
            await submission.save();

            res.status(200).json({
                message: `Submission evaluated! Verdict: ${finalVerdict}.`,
                submissionId: submission._id,
                verdict: finalVerdict,
                executionTime: totalExecutionTime,
                memoryUsed: maxMemoryUsed,
                compileMessage: compileMessage,
                verdicts: verdicts,
            });

        } catch (compilerError) {
            console.error(`Error sending submission to Compiler:`, compilerError.message);
            submission.verdict = 'Internal Error';
            submission.compileMessage = compilerError.response?.data?.message || 'Unknown error from compiler.';
            await submission.save();

            res.status(500).json({
                message: `Submission failed: ${submission.compileMessage}`,
                submissionId: submission._id,
                verdict: submission.verdict,
                compileMessage: submission.compileMessage
            });
        }
    } catch (error) {
        console.error('Error submitting solution to main backend:', error);
        res.status(500).json({ message: 'Internal server error during submission.' });
    }
});

// @route   GET /api/submissions/user/:userId
// @desc    Get all submissions for a specific user
// @access  Private (User should only access their own submissions, Admin can access any)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const requestedUserId = req.params.userId;
        const authenticatedUserId = req.user._id; // ID from the authenticated token
        const userRole = req.user.role; // Role from the authenticated token

        // Ensure a user can only fetch their own submissions unless they are an admin
        if (userRole !== 'admin' && requestedUserId !== authenticatedUserId.toString()) {
            return res.status(403).json({ message: 'Access denied. You can only view your own submissions.' });
        }

        const submissions = await Submission.find({ userId: requestedUserId })
            .populate('problemId', 'title difficulty')
            .sort({ submittedAt: -1 });

        res.status(200).json(submissions);
    } catch (error) {
        console.error(`Error fetching submissions for user ${req.params.userId}:`, error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/submissions
// @desc    Get all submissions (for admin)
// @access  Private (Admin only)
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const submissions = await Submission.find({})
            .populate('userId', 'name')
            .populate('problemId', 'title difficulty')
            .sort({ submittedAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching all submissions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;