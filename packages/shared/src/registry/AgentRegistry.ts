import { AgentDescriptor } from '../interfaces/AgentDescriptor';
import { AgentAdapter } from '../interfaces/AgentAdapter';

export class AgentRegistry {
  private adapters = new Map<string, AgentAdapter>();
  private descriptors = new Map<string, AgentDescriptor>();

  async register(adapter: AgentAdapter): Promise<void> {
    const desc = await adapter.getDescriptor();
    this.adapters.set(desc.id, adapter);
    this.descriptors.set(desc.id, desc);
  }

  unregister(agentId: string): void {
    this.adapters.delete(agentId);
    this.descriptors.delete(agentId);
  }

  getAdapter(agentId: string): AgentAdapter | undefined {
    return this.adapters.get(agentId);
  }

  getDescriptor(agentId: string): AgentDescriptor | undefined {
    return this.descriptors.get(agentId);
  }

  listDescriptors(): AgentDescriptor[] {
    return Array.from(this.descriptors.values());
  }
}
