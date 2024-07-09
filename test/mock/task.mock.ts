import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { TaskStatus } from '../../src/tasks/tasks-status.enum';
import { Task } from '../../src/tasks/tasks.entity';
import { mockUser } from './user.mock';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';

const mockTask: Task = {
  id: '1',
  name: 'task test',
  description: 'description test',
  status: TaskStatus.PENDING,
  user: mockUser,
};

const mockCreateTaskDto: CreateTaskDto = {
  name: 'task test',
  description: 'description test',
};

const mockUpdateTaskDto: UpdateTaskDto = {
  name: 'task test',
  description: 'description test',
  status: TaskStatus.DONE,
};

export { mockTask, mockCreateTaskDto, mockUpdateTaskDto };
