import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { GetTaskFilterDto } from '../dto/get-task-filters.dto';
import { Task } from '../tasks.entity';
import { TasksRepository } from '../tasks.repository';
import { User } from '../../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(getTaskFilterDto: GetTaskFilterDto, user: User) {
    return this.tasksRepository.getTasks(getTaskFilterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id, user });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto, user: User) {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.getTaskById(id, user);

    return this.tasksRepository.updateTask(task, updateTaskDto);
  }

  async deleteTask(id: string, user: User) {
    const task = await this.tasksRepository.delete({ id, user });

    if (task.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
