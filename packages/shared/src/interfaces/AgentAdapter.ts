import { Task } from './Task';
import { Project } from './Project';

export type AgentTaskResult = {
  success: boolean;
  output?: string;
  artifacts?: Record<string, string>;
  error?: string;
};

export interface AgentAdapter {
  getDescriptor(): Promise<import('./AgentDescriptor').AgentDescriptor>;
  sendTask(task: Task, project?: Project): Promise<AgentTaskResult>;
  getStatus(): Promise<{ available: boolean; reason?: string }>;
  getQuotaInfo(): Promise<{ remaining: number; resetAt?: string } | null>;
  cancelTask(taskId: string): Promise<boolean>;
}
