const { connect, disconnect, getConnectionStatus } = require('../config/database');

/**
 * Database connection test utility
 * Used to verify database connectivity before starting the application
 */

class ConnectionTester {
  /**
   * Test database connection
   * @returns {Promise<Object>} Test results
   */
  static async testConnection() {
    const startTime = Date.now();
    const testResult = {
      success: false,
      duration: 0,
      error: null,
      connectionInfo: null
    };

    try {
      console.log('🧪 Testing database connection...');
      
      // Attempt to connect
      await connect();
      
      // Get connection status
      const connectionStatus = getConnectionStatus();
      
      testResult.success = true;
      testResult.duration = Date.now() - startTime;
      testResult.connectionInfo = connectionStatus;
      
      console.log('✅ Database connection test passed');
      console.log(`⏱️  Connection time: ${testResult.duration}ms`);
      console.log('📊 Connection details:', {
        host: connectionStatus.host,
        port: connectionStatus.port,
        database: connectionStatus.name,
        readyState: this.getReadyStateDescription(connectionStatus.readyState)
      });
      
      return testResult;
    } catch (error) {
      testResult.success = false;
      testResult.error = error.message;
      testResult.duration = Date.now() - startTime;
      
      console.error('❌ Database connection test failed');
      console.error('⏱️  Failed after:', testResult.duration + 'ms');
      console.error('💥 Error:', error.message);
      
      return testResult;
    } finally {
      // Always try to disconnect after test
      try {
        await disconnect();
      } catch (disconnectError) {
        console.error('⚠️  Error during disconnect:', disconnectError.message);
      }
    }
  }

  /**
   * Test connection with retry logic
   * @param {number} maxRetries Maximum number of retry attempts
   * @param {number} retryDelay Delay between retries in milliseconds
   * @returns {Promise<Object>} Test results
   */
  static async testConnectionWithRetry(maxRetries = 3, retryDelay = 2000) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔄 Connection attempt ${attempt}/${maxRetries}`);
      
      try {
        const result = await this.testConnection();
        if (result.success) {
          return result;
        }
        lastError = result.error;
      } catch (error) {
        lastError = error.message;
      }
      
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
        await this.delay(retryDelay);
      }
    }
    
    return {
      success: false,
      error: lastError || 'Connection failed after all retry attempts',
      attempts: maxRetries
    };
  }

  /**
   * Get human-readable description of connection ready state
   * @param {number} readyState Mongoose connection ready state
   * @returns {string} Description
   */
  static getReadyStateDescription(readyState) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[readyState] || 'unknown';
  }

  /**
   * Utility method for delay
   * @param {number} ms Delay in milliseconds
   * @returns {Promise<void>}
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Run connection test from command line
   */
  static async runCliTest() {
    console.log('🚀 Starting database connection test...');
    console.log('=' .repeat(50));
    
    const result = await this.testConnectionWithRetry();
    
    console.log('=' .repeat(50));
    console.log('📋 Test Summary:');
    console.log(`Status: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (result.success) {
      console.log(`Duration: ${result.duration}ms`);
      console.log(`Database: ${result.connectionInfo?.name}`);
    } else {
      console.log(`Error: ${result.error}`);
    }
    
    process.exit(result.success ? 0 : 1);
  }
}

// Allow running this file directly for testing
if (require.main === module) {
  ConnectionTester.runCliTest().catch(console.error);
}

module.exports = ConnectionTester;