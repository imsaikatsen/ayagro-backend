const request = require('supertest');
const app = require('../app'); // Your Express app
const mongoose = require('mongoose');
const User = require('../models/user.model'); // Make sure this points to your correct model

require('dotenv').config(); // Ensure environment variables are loaded

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // Clean test DB
  await mongoose.connection.close();
});

describe('Auth Controller', () => {
  const testUser = {
    username: 'saikat',
    firstName: 'Saikat',
    lastName: 'Sen',
    email: 'saikat@example.com',
    password: '123456',
    dateOfBirth: '1995-05-12',
    nid: '1234567890',
    phone: '01717529587',
  };

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('_id');
  });

  it('should fail to register the same user twice', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('User already exists with this email');
  });

  it('should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should not login with unregistered email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'notexist@example.com',
      password: 'password',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
