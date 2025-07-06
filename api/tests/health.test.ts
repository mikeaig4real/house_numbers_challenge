import request from 'supertest';
import initApp from '../src/app';
import { describe, expect, test } from 'vitest';

const app = initApp();

describe('Health Check', () => {
  test('GET / should return welcome message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Snipify');
  });
});
