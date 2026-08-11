import { AgentRegistry } from '../registry/AgentRegistry';
import { MockAgentAdapter } from './MockAgentAdapter';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';

export async function createDemoRegistry(): Promise<AgentRegistry> {
  const reg = new AgentRegistry();
  const demoAgent: AgentDescriptor = {
    id: 'agent-mock-1',
    name: 'Mock Agent 1',
    provider: 'mock',
    capabilities: ['typescript', 'unit-tests'],
  };
  const adapter = new MockAgentAdapter(demoAgent);
  await reg.register(adapter);
  return reg;
}
