import mongoose from 'mongoose';

/**
 * Connect to MongoDB with detailed logging.
 * @param {string} uri - MongoDB connection string
 * @param {object} options - Mongoose connection options
 */
const connectDB = async (uri, options = {}) => {
    const defaultOptions = {
        autoIndex: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        ...options,
    };

    console.log('📦 Attempting MongoDB connection...');
    console.log(`   URI: ${uri.replace(/\/\/.*@/, '//<credentials>@')}`);

    try {
        const conn = await mongoose.connect(uri, defaultOptions);

        console.log(`✅ MongoDB connected successfully`);
        console.log(`   Host:     ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Port:     ${conn.connection.port}`);

        // ── Connection event listeners ──
        mongoose.connection.on('error', (err) => {
            console.error(`\n❌ [MongoDB] Connection error:`);
            console.error(`   Code:    ${err.code || 'N/A'}`);
            console.error(`   Message: ${err.message}`);
            if (err.reason) console.error(`   Reason:  ${err.reason}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn(`\n⚠️  [MongoDB] Disconnected at ${new Date().toISOString()}`);
            console.warn('   The driver will attempt to reconnect automatically.');
        });

        mongoose.connection.on('reconnected', () => {
            console.log(`\n✅ [MongoDB] Reconnected successfully at ${new Date().toISOString()}`);
        });

        mongoose.connection.on('close', () => {
            console.log('🔌 [MongoDB] Connection closed');
        });

        return conn;
    } catch (err) {
        console.error(`\n❌ MongoDB initial connection FAILED`);
        console.error(`   Error:   ${err.message}`);
        console.error(`   Code:    ${err.code || 'N/A'}`);
        if (err.reason) console.error(`   Reason:  ${JSON.stringify(err.reason)}`);
        console.error(`   Stack:   ${err.stack}`);
        console.error(`\n💡 Troubleshooting:`);
        console.error(`   1. Is MongoDB running?  →  mongosh or mongod --dbpath <path>`);
        console.error(`   2. Correct URI?         →  Check MONGODB_URI in server/.env`);
        console.error(`   3. Network issues?      →  Verify firewall / VPN settings`);
        console.error(`   4. Auth required?       →  Add credentials to the URI\n`);
        process.exit(1);
    }
};

/**
 * Gracefully close the MongoDB connection.
 */
const disconnectDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed gracefully');
    } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err.message);
        process.exit(1);
    }
};

export { connectDB, disconnectDB };
