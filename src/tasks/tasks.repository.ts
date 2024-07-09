import { DataSource, Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filters.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(getTaskFilterDto: GetTaskFilterDto, user: User) {
    const { search, status } = getTaskFilterDto;

    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.name) LIKE LOWER(:search) OR task.description LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { description, name } = createTaskDto;

    const newTask = this.create({
      status: TaskStatus.PENDING,
      name,
      description,
      user,
    });

    await this.save(newTask);

    return newTask;
  }

  async updateTask(task: Task, updateTaskDto: UpdateTaskDto) {
    const { description, name, status } = updateTaskDto;

    task.name = name;
    task.description = description;
    task.status = status;

    await this.save(task);

    return task;
  }
}
