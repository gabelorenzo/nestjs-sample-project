import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  /**
   * Calls the TaskRepository to get an array of Tasks, optionally filtering down the results.
   * @param filterDto The GetTasksFilterDto object used to filter down the Tasks.
   */
  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  /**
   * Calls the TaskRepository to get a single Task by ID.
   * @param id The unique identifier of the Task to retrieve.
   */
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  /**
   * Calls the TaskRepository to creates a new Task.
   * @param createTaskDto The CreateTaskDto containing data to create the new Task.
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  /**
   * Calls the TaskRepository to update the TaskStatus of a single Task.
   * @param id The id of the Task to update.
   * @param status The status to set on the Task.
   */
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const result = await this.getTaskById(id);
    result.status = status;
    await result.save();

    return result;
  }

  /**
   * Calls the TaskRepository to delete a Task by ID.
   * @param id The unique identifier of the Task to delete.
   */
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id} not found`);
    }
  }
}
