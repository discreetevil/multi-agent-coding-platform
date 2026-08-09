export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  attempts?: number;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}
