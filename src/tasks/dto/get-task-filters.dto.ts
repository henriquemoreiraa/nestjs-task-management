import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../tasks-status.enum';

export class GetTaskFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
