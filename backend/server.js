// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');
const userRoutes = require('./routes/userRoutes');
const testCaseRoutes = require('./routes/testCaseRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const draftRoutes = require('./routes/draftRoutes'); // FIX: Import draft routes

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Define Routes
app.use('/api/problems', problemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/problems', testCaseRoutes); // Test case routes are nested under problems
app.use('/api/submissions', submissionRoutes);
app.use('/api/drafts', draftRoutes); // FIX: Add draft routes

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

