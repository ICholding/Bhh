const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:10000';

const runTests = async () => {
  console.log(`Starting BHH Smoke Test Suite on ${BASE_URL}...`);
  let passed = 0;
  let failed = 0;

  const tests = [
    {
      name: 'Root Endpoint',
      run: async () => {
        const res = await axios.get(`${BASE_URL}/`);
        if (res.data.status !== 'operational') throw new Error('Status not operational');
      }
    },
    {
      name: 'Health Check (Recursive)',
      run: async () => {
        const res = await axios.get(`${BASE_URL}/healthz`);
        if (!res.data.ok) throw new Error('Health check failed');
      }
    },
    {
      name: 'AI Proxy (Mock Routing)',
      run: async () => {
        const res = await axios.post(`${BASE_URL}/ai/invoke`, {
          prompt: "Analyze user activity"
        });
        if (res.data.suggestedRole !== 'Supervisor') throw new Error('AI routing failed to identify Supervisor role');
      }
    },
    {
      name: 'Client Log Sink',
      run: async () => {
        const res = await axios.post(`${BASE_URL}/logs/client`, {
          level: "info",
          message: "Smoke test log entry"
        });
        if (res.status !== 204) throw new Error('Log sink failed to respond with 204');
      }
    }
  ];

  for (const test of tests) {
    try {
      await test.run();
      console.log(`[PASS] ${test.name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${test.name}: ${e.message}`);
      failed++;
    }
  }

  console.log(`--- Results: ${passed} Passed, ${failed} Failed ---`);
  process.exit(failed > 0 ? 1 : 0);
};

runTests();
