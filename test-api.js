const request = require('supertest');
const app = require('./dist/app').default;

async function testAPI() {
    console.log('\n🧪 Testing API Setup...\n');

    // Test health endpoint
    const healthResponse = await request(app).get('/health');
    console.log('Health Check:', healthResponse.status === 200 ? '✅' : '❌');

    // Test 404 handler
    const notFoundResponse = await request(app).get('/nonexistent');
    console.log('404 Handler:', notFoundResponse.status === 404 ? '✅' : '❌');

    console.log('\nSetup complete! Ready to use.\n');
}

testAPI();