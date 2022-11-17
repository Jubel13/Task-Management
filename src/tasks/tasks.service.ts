import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

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

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with id/${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    // const found = await this.taskRepository.findOne(id);

    // if (!found) {
    //   throw new NotFoundException(`Task with id/${id} not found`);
    // }

    // await this.taskRepository.remove(found);

    const result = await this.taskRepository.delete({ id, user });
    console.log(result);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with id/${id} not found`);
    }
  }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const foundTask = await this.getTaskById(id, user);

    foundTask.status = status;

    await this.taskRepository.save(foundTask);

    return foundTask;
  }
}
