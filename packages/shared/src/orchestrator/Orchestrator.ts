import { Project } from '../interfaces/Project';
import { Task } from '../interfaces/Task';

export interface Orchestrator {
  createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project>;
  submitTask(projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'status'>): Promise<Task>;
  assignAndRun(taskId: string): Promise<void>;
}
