import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TaskStatus } from '../tasks-status.enum';
import { TasksService } from '../service/tasks.service';
import { NotFoundException } from '@nestjs/common';
import { mockTask } from '../../../test/mock/task.mock';
import { mockUser } from '../../../test/mock/user.mock';

const mockTaskService = {
  getTasks: jest.fn((x) => x),
  getTaskById: jest.fn((x) => x),
  createTask: jest.fn((x) => x),
  updateTask: jest.fn((x) => x),
  deleteTask: jest.fn((x) => x),
};

describe('TasksController', () => {
  let taskController: TasksController;
  let taskService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        { provide: TasksService, useValue: mockTaskService },
      ],
    }).compile();

    taskController = module.get<TasksController>(TasksController);
    taskService = module.get<TasksService>(TasksService);
  });

  describe('TaskService', () => {
    it('should be defined', () => {
      expect(taskService).toBeDefined();
    });
  });

  describe('getTasks', () => {
    it('should get all tasks', async () => {
      jest
        .spyOn(taskService, 'getTasks')
        .mockImplementation(() => Promise.resolve([mockTask]));

      const taskResult = await taskController.getTasks(null, mockUser);

      expect(taskResult).toEqual([mockTask]);
    });

    it('should get tasks with filters', async () => {
      jest
        .spyOn(taskService, 'getTasks')
        .mockImplementation(() => Promise.resolve([mockTask]));

      const taskResult = await taskController.getTasks(
        { search: 'task', status: TaskStatus.PENDING },
        mockUser,
      );

      expect(taskResult).toEqual([mockTask]);
    });
  });

  describe('getTaskById', () => {
    it('should get task', async () => {
      jest
        .spyOn(taskService, 'getTaskById')
        .mockImplementation(() => Promise.resolve(mockTask));

      const taskResult = await taskController.getTaskById('1', mockUser);

      expect(taskResult).toEqual(mockTask);
    });

    it('should return NotFoundException error', async () => {
      jest.spyOn(taskService, 'getTaskById').mockImplementation((id) => {
        throw new NotFoundException(`Task with ID ${id} not found`);
      });

      try {
        await taskController.getTaskById('2', mockUser);
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(NotFoundException);
      }
    });
  });

  describe('createTask', () => {
    it('should create task', async () => {
      jest
        .spyOn(taskService, 'createTask')
        .mockImplementation(() => Promise.resolve(mockTask));

      const taskResult = await taskController.createTask(mockTask, mockUser);

      expect(taskResult).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      jest
        .spyOn(taskService, 'updateTask')
        .mockImplementation(() => Promise.resolve(mockTask));

      const taskResult = await taskController.updateTask(
        '1',
        mockTask,
        mockUser,
      );

      expect(taskResult).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete task', async () => {
      jest
        .spyOn(taskService, 'deleteTask')
        .mockImplementation(() => Promise.resolve());

      const taskResult = await taskController.deleteTask('1', mockUser);

      expect(taskResult).toEqual(undefined);
    });
  });
});
