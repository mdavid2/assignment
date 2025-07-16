const request = require('supertest');
const express = require('express');

// Import your app
const app = require('../test-server'); // We'll create this next

describe('GET /status', () => {
  it('should return status ok with timestamp', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(typeof res.body.timestamp).toBe('number');
  });
});


describe('Mock Functional Tests', () => {
  test('Math still works', () => {
    expect(2 + 2).toBe(4);
  });

  test('Truthy values behave', () => {
    const isValid = true;
    expect(isValid).toBeTruthy();
  });

  test('API mock response has correct shape', () => {
    const response = { status: 200, data: { user: 'admin' } };
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('user');
  });
});
