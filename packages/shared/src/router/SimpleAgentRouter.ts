import { AgentRouter } from './AgentRouter';
import { Task } from '../interfaces/Task';
import { AgentRegistry } from '../registry/AgentRegistry';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';

export class SimpleAgentRouter implements AgentRouter {
  // Very small proof-of-concept router: finds first agent with any matching capability.
  async route(task: Task, registry: AgentRegistry): Promise<AgentDescriptor | undefined> {
    const candidates = registry.listDescriptors();
    const taskCaps: string[] = (task.metadata && (task.metadata.capabilities as string[])) || [];

    if (taskCaps.length === 0) {
      // if we have no capability hints pick the first available agent
      return candidates[0];
    }

    for (const cap of taskCaps) {
      const found = candidates.find((a) => a.capabilities.includes(cap));
      if (found) return found;
    }

    // fallback
    return candidates[0];
  }
}
