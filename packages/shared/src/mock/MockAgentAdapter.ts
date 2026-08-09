import { AgentAdapter } from '../interfaces/AgentAdapter';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';
import { Task } from '../interfaces/Task';
import { Project } from '../interfaces/Project';

export class MockAgentAdapter implements AgentAdapter {
  private descriptor: AgentDescriptor;

  constructor(descriptor: AgentDescriptor) {
    this.descriptor = descriptor;
  }

  async getDescriptor(): Promise<AgentDescriptor> {
    return this.descriptor;
  }

  async sendTask(task: Task, project?: Project) {
    // Simulate work
    await new Promise((r) => setTimeout(r, 10));
    return {
      success: true,
      output: `Mock output for task ${task.id} by ${this.descriptor.name}`,
      artifacts: { 'result.txt': 'Hello from mock agent' },
    };
  }

  async getStatus() {
    return { available: true };
  }

  async getQuotaInfo() {
    return { remaining: 1000, resetAt: undefined };
  }

  async cancelTask(_taskId: string) {
    return true;
  }
}
