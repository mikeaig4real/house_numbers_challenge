import request from 'supertest';
import app from '../src';
import { describe, expect, test } from 'vitest';

describe('Health Check', () => {
  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Snipify');
  });
});
