import { Task } from './Task';

export interface Project {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}
