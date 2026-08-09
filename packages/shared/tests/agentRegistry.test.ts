import { describe, it, expect } from 'vitest';
import { AgentRegistry } from '../registry/AgentRegistry';
import { MockAgentAdapter } from '../mock/MockAgentAdapter';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';

describe('AgentRegistry', () => {
  it('registers and lists agents', async () => {
    const reg = new AgentRegistry();
    const desc: AgentDescriptor = {
      id: 'a1',
      name: 'A1',
      provider: 'mock',
      capabilities: ['ts'],
    };
    const adapter = new MockAgentAdapter(desc);
    await reg.register(adapter);
    const list = reg.listDescriptors();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('a1');
  });
});
