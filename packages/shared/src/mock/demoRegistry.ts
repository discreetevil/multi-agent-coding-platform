import { AgentRegistry } from '../registry/AgentRegistry';
import { MockAgentAdapter } from './MockAgentAdapter';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';
import { OpenAIAdapter } from '../openai/OpenAIAdapter';

export async function createDemoRegistry(): Promise<AgentRegistry> {
  const reg = new AgentRegistry();

  // If OPENAI_API_KEY exists in the server environment, register the OpenAI adapter.
  // Otherwise, register the mock adapter as a fallback.
  if (process.env.OPENAI_API_KEY) {
    const aiDesc: AgentDescriptor = {
      id: 'agent-openai',
      name: 'OpenAI Adapter',
      provider: 'openai',
      capabilities: ['language-model', 'text'],
    };
    const aiAdapter = new OpenAIAdapter(aiDesc);
    await reg.register(aiAdapter);
  } else {
    const demoAgent: AgentDescriptor = {
      id: 'agent-mock-1',
      name: 'Mock Agent 1',
      provider: 'mock',
      capabilities: ['typescript', 'unit-tests'],
    };
    const adapter = new MockAgentAdapter(demoAgent);
    await reg.register(adapter);
  }

  return reg;
}
