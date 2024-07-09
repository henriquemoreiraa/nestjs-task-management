import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRepository } from '../src/auth/user.repository';
import { mockAuthCredentialsDto } from './mock/auth.mock';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = app.get<UserRepository>(UserRepository);
  });

  beforeAll(async () => {
    await userRepository.query(
      `DELETE FROM public.user WHERE username = '${mockAuthCredentialsDto.username}'`,
    );
  });

  describe('Signup /auth/signup', () => {
    const URL = '/auth/signup';

    it('should signup user (POST)', () => {
      return request(app.getHttpServer())
        .post(URL)
        .send(mockAuthCredentialsDto)
        .expect(201);
    });

    it('should return 409 "Username already exists" (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post(URL)
        .send(mockAuthCredentialsDto)
        .expect(409);

      return expect(res.body.message).toEqual('Username already exists');
    });
  });

  describe('Signin /auth/signin', () => {
    const URL = '/auth/signin';

    it('should signin user (POST)', () => {
      return request(app.getHttpServer())
        .post(URL)
        .send(mockAuthCredentialsDto)
        .expect(201);
    });

    it('should return 401 "Please check you login credentials" (POST)', async () => {
      const res = await request(app.getHttpServer())
        .post(URL)
        .send({ ...mockAuthCredentialsDto, password: '123456' })
        .expect(401);

      return expect(res.body.message).toEqual(
        'Please check you login credentials',
      );
    });
  });
});
