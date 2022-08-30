import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {} // inject task repository to be used in task service

  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Task with id/${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    // const found = await this.taskRepository.findOne(id);

    // if (!found) {
    //   throw new NotFoundException(`Task with id/${id} not found`);
    // }

    // await this.taskRepository.remove(found);

    const result = await this.taskRepository.delete(id);
    console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id/${id} not found`);
    }
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const foundTask = await this.getTaskById(id);

    foundTask.status = status;

    await this.taskRepository.save(foundTask);

    return foundTask;
  }
}
