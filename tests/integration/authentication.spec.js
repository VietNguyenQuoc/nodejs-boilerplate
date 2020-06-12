const request = require('supertest');
const { truncateUsers } = require('../../src/domain/users/user.Repository');
const { truncateUserCredentials } = require('../../src/domain/users/userCredential.Repository');
const server = require('../../src/server');
const { sequelize } = require('../../src/infra/db/sequelize/models');

describe('controller.authentication.signUp', () => {
  beforeEach(async () => {
    await Promise.all([truncateUsers(), truncateUserCredentials()]);
  });

  afterAll(async () => {
    await server.close();
    await sequelize.close();
  })

  it('should return status 400 when the email exists', async () => {
    // first signup
    await request(server).post('/auth/signup').set('Content-Type', 'application/json').send({
      "email": "test@gmail.com",
      "password": "qu0cvIet@",
      "firstName": "Nguyen Quoc",
      "lastName": "Viet"
    });

    // second signup with same email
    const response = await request(server).post('/auth/signup').set('Content-Type', 'application/json').send({
      "email": "test@gmail.com",
      "password": "qu0cvIet@",
      "firstName": "Nguyen Quoc",
      "lastName": "Viet"
    });
    expect(response.status).toBe(400);
    expect(response.text).toMatch('exist');
  });

  it('should return status 200 when successfully signup', async () => {
    const response = await request(server).post('/auth/signup').set('Content-Type', 'application/json').send({
      "email": "test@gmail.com",
      "password": "qu0cvIet@",
      "firstName": "Nguyen Quoc",
      "lastName": "Viet"
    });

    expect(response.status).toBe(200);
    expect(response.text).toMatch('Success');
  })
})