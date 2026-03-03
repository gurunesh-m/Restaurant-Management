import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB, disconnectDB, dbConfig } from './database/index.js';
import menuRoutes from './routes/menuRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Request logger ── */
app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
});

/* ── Routes ── */
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contacts', contactRoutes);

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── Handle Chrome DevTools probe & unknown routes ── */
app.use((_req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${_req.method} ${_req.originalUrl} does not exist`,
        availableEndpoints: [
            'GET/POST        /api/menu',
            'GET/PUT/DELETE  /api/menu/:id',
            'GET/POST        /api/reservations',
            'GET/PUT/DELETE  /api/reservations/:id',
            'GET/POST        /api/contacts',
            'PUT/DELETE      /api/contacts/:id',
            'GET             /api/health',
        ],
    });
});

/* ── Global error handler ── */
app.use((err, req, res, _next) => {
    const timestamp = new Date().toISOString();
    console.error(`\n❌ [${timestamp}] Unhandled Error`);
    console.error(`   Route:   ${req.method} ${req.originalUrl}`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Stack:   ${err.stack}\n`);

    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
});

/* ── Connect to MongoDB and start server ── */
const startServer = async () => {
    console.log('\n🔧 Starting server...');
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Port:        ${PORT}`);
    console.log(`   MongoDB URI: ${dbConfig.uri.replace(/\/\/.*@/, '//<credentials>@')}\n`);

    await connectDB(dbConfig.uri, dbConfig.options);

    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`   API Endpoints:`);
        console.log(`   GET/POST        /api/menu`);
        console.log(`   GET/PUT/DELETE  /api/menu/:id`);
        console.log(`   GET/POST        /api/reservations`);
        console.log(`   GET/PUT/DELETE  /api/reservations/:id`);
        console.log(`   GET/POST        /api/contacts`);
        console.log(`   PUT/DELETE      /api/contacts/:id`);
        console.log(`   GET             /api/health\n`);
    });
};

/* ── Graceful shutdown ── */
process.on('SIGINT', async () => {
    console.log('\n⏹  SIGINT received — shutting down...');
    await disconnectDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⏹  SIGTERM received — shutting down...');
    await disconnectDB();
    process.exit(0);
});

/* ── Catch unhandled rejections / exceptions ── */
process.on('unhandledRejection', (reason, promise) => {
    console.error('\n⚠️  Unhandled Promise Rejection:');
    console.error('   Promise:', promise);
    console.error('   Reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('\n🔥 Uncaught Exception:');
    console.error('   Error:', err.message);
    console.error('   Stack:', err.stack);
    process.exit(1);
});

startServer();
