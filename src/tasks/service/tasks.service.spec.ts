import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from '../tasks.repository';
import { NotFoundException } from '@nestjs/common';
import { mockTask } from '../../../test/mock/task.mock';
import { mockUser } from '../../../test/mock/user.mock';

describe('TaskService', () => {
  let taskService: TasksService;

  const mockTaskRepository = {
    findOneBy: jest.fn(({ id }) => (id === '1' ? mockTask : null)),
    delete: jest.fn(({ id, user }) =>
      id === '1' && user.id === '1' ? { affected: 1 } : { affected: 0 },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: mockTaskRepository },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('getTaskById', () => {
    it('should get task by id', async () => {
      expect(await taskService.getTaskById(mockTask.id, mockUser)).toEqual(
        mockTask,
      );
    });

    it('should return NotFoundException error when task with ID not found', async () => {
      try {
        await taskService.getTaskById('2', mockUser);
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(NotFoundException);
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete task by ID and USER.ID', async () => {
      expect(await taskService.deleteTask(mockTask.id, mockUser)).toEqual(
        undefined,
      );
    });

    it('should return NotFoundException error when task with ID and USER.ID not found', async () => {
      try {
        await taskService.deleteTask('2', mockUser);
      } catch (error) {
        expect(() => {
          throw error;
        }).toThrow(NotFoundException);
      }
    });
  });
});
