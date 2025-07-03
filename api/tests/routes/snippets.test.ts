import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import type { Response } from 'supertest';
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import app from '../../src';
import { makeLongText, summarizeTextFake, countWords, sleep } from '../../src/utils';
import * as summarizeService from '../../src/services/summarize';
import { connectDB, disconnectDB } from '../../src/db/connect';
import { Snippet } from '../../src/models/snippet';
import { User } from '../../src/models/user';
import { config } from '../../config';

const wordLimit = config.wordLimit;
const testUser = { email: 'snippetuser@example.com', password: 'TestPass123!' };
let cookie: string;

beforeAll(async () => {
  await connectDB(true);
  await User.deleteMany({ email: testUser.email });
  await request(app).post('/api/auth/signup').send(testUser);
  const loginRes = await request(app).post('/api/auth/login').send(testUser);
  cookie = loginRes.headers['set-cookie'][0];
});
afterAll(async () => {
  await Snippet.deleteMany({});
  await User.deleteMany({ email: testUser.email });
  await disconnectDB();
});
beforeEach(async () => {
  await Snippet.deleteMany({});
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe('Snippets API', () => {
  describe('Creating a snippet', () => {
    it('POST /api/snippets creates a new snippet (with fake summarizer)', async () => {
      vi.spyOn(summarizeService, 'summarizeContent').mockImplementation(
        async (text: string, wordCount?: number) => summarizeTextFake(text, wordCount ?? wordLimit),
      );
      const { text } = makeLongText(50);
      const res = await request(app).post('/api/snippets').set('Cookie', cookie).send({ text });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('text');
      expect(res.body).toHaveProperty('summary');
      expect(res.body.text).toBe(text);
      expect(res.body.summary).toBe(summarizeTextFake(text, wordLimit).text);
      expect(countWords(res.body.summary)).toBeLessThanOrEqual(wordLimit);
      // Check DB count
      const count = await Snippet.countDocuments();
      expect(count).toBe(1);
    });

    it('POST /api/snippets return 400 on too little words', async () => {
      const text = 'Too short';
      const res = await request(app).post('/api/snippets').set('Cookie', cookie).send({ text });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Text must contain at least 5 words/);
      const count = await Snippet.countDocuments();
      expect(count).toBe(0);
    });

    it('POST /api/snippets with the exact same text twice should return previous summary but no errors', async () => {
      vi.spyOn(summarizeService, 'summarizeContent').mockImplementation(
        async (text: string, wordCount?: number) => summarizeTextFake(text, wordCount ?? wordLimit),
      );
      const { text } = makeLongText(50);
      const res1 = await request(app).post('/api/snippets').set('Cookie', cookie).send({ text });
      expect(res1.status).toBe(201);
      expect(res1.body).toHaveProperty('id');
      expect(res1.body.text).toBe(text);
      expect(res1.body.summary).toBe(summarizeTextFake(text, wordLimit).text);

      const res2 = await request(app).post('/api/snippets').set('Cookie', cookie).send({ text });
      expect(res2.status).toBe(200);
      expect(res2.body.id).toBe(res1.body.id);
      expect(res2.body.text).toBe(text);
      expect(res2.body.summary).toBe(summarizeTextFake(text, wordLimit).text); // Same summary
    });

    it('POST /api/snippets creates multiple snippets and checks DB count', async () => {
      vi.spyOn(summarizeService, 'summarizeContent').mockImplementation(
        async (text: string, wordCount?: number) => summarizeTextFake(text, wordCount ?? wordLimit),
      );
      await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: makeLongText(10).text });
      await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: makeLongText(20).text });
      const count = await Snippet.countDocuments();
      expect(count).toBe(2);
    });

    it('POST /api/snippets returns 400 if summary exceeds word limit', async () => {
      // Simulate a summarizer that returns too many words
      vi.spyOn(summarizeService, 'summarizeContent').mockResolvedValue(makeLongText(100));
      const { text } = makeLongText(100);
      const res = await request(app).post('/api/snippets').set('Cookie', cookie).send({ text });
      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Summary must be/);
      const count = await Snippet.countDocuments();
      expect(count).toBe(0);
    });

    it('POST /api/snippets returns 400 on missing text', async () => {
      const res = await request(app).post('/api/snippets').set('Cookie', cookie).send({});
      expect(res.status).toBe(400);
      const count = await Snippet.countDocuments();
      expect(count).toBe(0);
    });

    it('POST /api/snippets creates a new snippet (with real summarizeContent)', async () => {
      // This will call the real summarizeContent service (ensure AI key is set for this test)
      const longerText = `
      Once upon a time, in a land far away, there lived a wise old owl.
      The owl was known throughout the forest for its wisdom and knowledge.
      Animals from all over would come to seek the owl's advice on various matters.
      One day, a young rabbit approached the owl with a problem.
      "Wise Owl," said the rabbit, "I am afraid of the dark and I cannot sleep at night."
      The owl listened patiently and then replied, "Fear not, little rabbit.
      The dark is not something to be afraid of. It is simply the absence of light.
      Close your eyes and listen to the sounds of the night; they will soothe you to sleep."
      The rabbit thanked the owl and went home, feeling much better. From that day on, whenever the rabbit felt scared at night,
      it would remember the wise words of the owl and find comfort in the darkness.
      The owl's wisdom spread far and wide, and it became a symbol of knowledge and understanding in the animal kingdom.
      Animals would often gather around the old oak tree where the owl lived, sharing stories and learning from one another.
      The owl taught them that knowledge is not just about facts,
      but also about understanding and compassion. And so,
      the forest thrived under the guidance of the wise old owl,
      who continued to share its wisdom with all who sought it.
    `;

      const shorterText = `

        There was a race between a tortoise and hare.
        The hare so confident, it took a nap.
        The tortoise made haste slowly.
        The hare woke up, saw the tortoise had won.


    `;
      const testCode = async (response: Response, { text = '' }) => {
        if (response.status === 201) {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('text');
          expect(response.body).toHaveProperty('summary');
          const textWordCount = countWords(text.trim());
          expect(response.body.text).toBe(text.trim());
          // check the word count of the summary is less than that of the text
          expect(countWords(response.body.summary.trim())).toBeLessThanOrEqual(textWordCount);
          expect(countWords(response.body.summary.trim())).toBeLessThanOrEqual(wordLimit);
        } else if ([400, 500, 503].includes(response.status)) {
          expect(response.body.message).toMatch(
            /Failed to summarize content|Failed to create snippet|model is overloaded|Service Unavailable|summary|error/i,
          );
        } else {
          throw new Error(`Unexpected status code: ${res.status}`);
        }
      };
      const res = await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: shorterText });
      await testCode(res, {
        text: shorterText,
      });
      await sleep(2000); // to avoid rate limiting
      // Now test with a longer text
      const longRes = await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: longerText });
      await testCode(longRes, {
        text: longerText,
      });
    }, 10000);
  });

  describe('Getting one snippet', () => {
    it('GET /api/snippets/:id returns the correct snippet', async () => {
      vi.spyOn(summarizeService, 'summarizeContent').mockImplementation(
        async (text: string, wordCount?: number) => summarizeTextFake(text, wordCount ?? wordLimit),
      );
      const postRes = await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: makeLongText(50).text });
      const id = postRes.body.id;
      const getRes = await request(app).get(`/api/snippets/${id}`).set('Cookie', cookie);
      expect(getRes.status).toBe(200);
      expect(getRes.body.id).toBe(id);
      expect(getRes.body.text).toBe(postRes.body.text);
      expect(getRes.body.summary).toBe(summarizeTextFake(postRes.body.text, wordLimit).text);
    });

    it('GET /api/snippets/:id returns 404 for non-existent snippet', async () => {
      const res = await request(app)
        .get('/api/snippets/64b7e7e7e7e7e7e7e7e7e7e7')
        .set('Cookie', cookie);
      expect(res.status).toBe(404);
    });
  });

  describe('Getting all snippets', () => {
    it('GET /api/snippets returns all snippets and checks count', async () => {
      vi.spyOn(summarizeService, 'summarizeContent').mockImplementation(
        async (text: string, wordCount?: number) => summarizeTextFake(text, wordCount ?? wordLimit),
      );
      await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: makeLongText(10).text });
      await request(app)
        .post('/api/snippets')
        .set('Cookie', cookie)
        .send({ text: makeLongText(20).text });
      const res = await request(app).get('/api/snippets').set('Cookie', cookie);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });
});
