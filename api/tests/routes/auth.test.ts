import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/index';
import User from '../../src/models/user';
import { connectDB, disconnectDB } from "../../src/db/connect";

const testUser = { email: 'testuser@example.com', password: 'TestPass123!' };
const COOKIE_NAME = 'snipify_token';

beforeAll(async () => {
  await connectDB(true);
  await User.deleteMany({ email: testUser.email });
});
afterAll(async () => {
  await User.deleteMany({ email: testUser.email });
  await disconnectDB();
});

describe('Auth API', () => {
  it('should sign up a new user and set a cookie', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser).expect(201);
    expect(res.body.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should not allow duplicate signup', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser).expect(400);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('should login with correct credentials and set a cookie', async () => {
    const res = await request(app).post('/api/auth/login').send(testUser).expect(200);
    expect(res.body.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...testUser, password: 'wrongpass' })
      .expect(400);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('should logout and clear the cookie', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ email: 'a@b.com', password: 'test1234' });
    const res = await agent.post('/api/auth/logout').expect(204);
    const cookieHeader = res.headers['set-cookie'];
    expect(cookieHeader).toBeDefined();
    const cookies = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
    const clearedCookie = cookies.find(
      (c: string) =>
        c.startsWith(`${COOKIE_NAME}=`) && (c.includes('Expires=') || c.includes('Max-Age=0')),
    );
    expect(clearedCookie).toBeDefined();
  });
});
