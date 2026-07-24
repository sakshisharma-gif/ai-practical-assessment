const { app, initializeDatabase } = require('./app');
const { disconnect } = require('./config/database');
require('dotenv').config();

/**
 * Server startup file
 * Separates server startup from app configuration for better testability
 * Handles graceful shutdown and error handling
 */

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

let server;

/**
 * Start the server with database initialization
 */
async function startServer() {
  try {
    // Initialize database connection first
    console.log('🔄 Initializing database connection...');
    
    try {
      await initializeDatabase();
    } catch (dbError) {
      console.log('⚠️  Database connection failed, but server will continue running');
      console.log('💡 You can still test API endpoints that don\'t require database');
      console.log('💡 Install and start MongoDB to enable full functionality');
    }
    
    // Start the HTTP server
    server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Ticket Management API Server running on ${HOST}:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
      console.log(`🗄️  Database health: http://${HOST}:${PORT}/health/database`);
      console.log(`📝 API Base URL: http://${HOST}:${PORT}/api`);
    });

    return server;
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    // Close HTTP server first
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('✅ HTTP Server closed successfully');
            resolve();
          }
        });
      });
    }
    
    // Close database connection
    console.log('🔄 Closing database connection...');
    await disconnect();
    
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
}

/**
 * Error handlers
 */
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Graceful shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer, gracefulShutdown };