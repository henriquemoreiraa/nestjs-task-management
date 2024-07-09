import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockAuthCredentialsDto } from './mock/auth.mock';
import { mockCreateTaskDto, mockUpdateTaskDto } from './mock/task.mock';
import { TasksRepository } from '../src/tasks/tasks.repository';
import { Task } from 'src/tasks/tasks.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt-payload.interface';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let taskRepository: TasksRepository;
  let jwtService: JwtService;
  let accessToken: string;

  const URL = '/tasks';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    taskRepository = app.get<TasksRepository>(TasksRepository);
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    const payload: JwtPayload = { username: mockAuthCredentialsDto.username };
    accessToken = jwtService.sign(payload);
  });

  afterAll(async () => {
    await taskRepository.query('DELETE FROM public.task');
  });

  let task: Task;

  describe('CreateTask /tasks', () => {
    it('should create new task (POST)', async () => {
      const { body } = await request(app.getHttpServer())
        .post(URL)
        .send(mockCreateTaskDto)
        .auth(accessToken, { type: 'bearer' })
        .expect(201);

      task = body;
      return expect(body.name).toEqual(mockCreateTaskDto.name);
    });
  });

  describe('GetTasks /tasks', () => {
    it('should get all tasks (GET)', async () => {
      const { body } = await request(app.getHttpServer())
        .get(URL)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      return expect(body[0].name).toEqual(mockCreateTaskDto.name);
    });
  });

  describe('GetTaskById /tasks', () => {
    it('should get task by id (GET)', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`${URL}/${task.id}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      return expect(body.name).toEqual(mockCreateTaskDto.name);
    });
  });

  describe('UpdateTask /tasks', () => {
    it('should update task (PUT)', async () => {
      const { body } = await request(app.getHttpServer())
        .put(`${URL}/${task.id}`)
        .send(mockUpdateTaskDto)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      return expect(body.status).toEqual(mockUpdateTaskDto.status);
    });
  });

  describe('DeleteTask /tasks', () => {
    it('should delete task (DELETE)', async () => {
      return request(app.getHttpServer())
        .delete(`${URL}/${task.id}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });
  });
});
