import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
