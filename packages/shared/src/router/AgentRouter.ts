import { Task } from '../interfaces/Task';
import { AgentRegistry } from '../registry/AgentRegistry';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';

export interface AgentRouter {
  // Select an agent for the task given registry state
  route(task: Task, registry: AgentRegistry): Promise<AgentDescriptor | undefined>;
}
