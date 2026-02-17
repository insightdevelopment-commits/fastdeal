require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// Database - Supabase initialized in services/routes
// const connectDB = require('./config/database'); // Removed for Supabase migration

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/search', require('./routes/search'));
app.use('/api/v1/tracking', require('./routes/tracking'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/ai', require('./routes/ai'));

// Serve static assets in production (or fallback for local)
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
} else {
    // Development fallback if needed, though usually handled by Vite
    // app.get('*', (req, res) => res.send('API Running')); 
}

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`FastDeal Backend running on port ${PORT}`);
});
