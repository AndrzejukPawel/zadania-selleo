import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { User } from '@prisma/client';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService]
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get(PrismaService);
    await app.init();
  });

  describe('(POST) /user/register', () => {
    test('register with valid data', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          "email": "test8@test.test",
          "password": "TestTest1!",
          "firstName": "test",
          "lastName": "test",
          "phoneNumber": "test",
          "shirtSize": "test",
          "preferredTechnology": "test"
        })
        .expect(201);
    });

    test('register with email that is already used', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          "email": "test8@test.test",
          "password": "TestTest1!",
          "firstName": "test",
          "lastName": "test",
          "phoneNumber": "test",
          "shirtSize": "test",
          "preferredTechnology": "test"
        })
        .expect(409);
    });

    test('register with invalid email', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          "email": "test999test.test",
          "password": "TestTest1!",
          "firstName": "test",
          "lastName": "test",
          "phoneNumber": "test",
          "shirtSize": "test",
          "preferredTechnology": "test"
        })
        .expect(422);
    });

    test('register with invalid password', () => {
      return request(app.getHttpServer())
        .post('/user/register')
        .send({
          "email": "test8@test.test",
          "password": "TestTest",
          "firstName": "test",
          "lastName": "test",
          "phoneNumber": "test",
          "shirtSize": "test",
          "preferredTechnology": "test"
        })
        .expect(422);
    });
  });

  describe('(POST) /auth/signin', () => {

    test('sign in with valid credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          "email": "test8@test.test",
          "password": "TestTest1!"
        })
        .expect(201);
      const responseObj = JSON.parse(res.text);
      token = responseObj.token;
      expect(responseObj).toMatchObject({ token: expect.any(String) });
    });

    test('sign in with invalid credentials', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          "email": "test234235@test.test",
          "password": "TestTest1!"
        })
        .expect(401);
    });
  });

  describe('(GET) /users', () => {

    test('fetch users with a valid token', async () => {
      const res = await request(app.getHttpServer())
        .get('/users')
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(JSON.parse(res.text)).toMatchObject(expect.any(Array<User>));
    });

    test('fetch users with invalid token', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .auth('invalidtoken', { type: 'bearer' })
        .expect(401);
    });

    test('fetch users without token', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(401);
    });
  });


  afterAll(async () => {
    return prismaService.user.delete({ where: { email: 'test8@test.test' } });
  })
});
