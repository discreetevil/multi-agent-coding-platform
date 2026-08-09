export type AgentDescriptor = {
  id: string;
  name: string;
  provider: string; // e.g. 'openai', 'anthropic'
  capabilities: string[]; // e.g. ['typescript', 'unit-tests']
  metadata?: Record<string, any>;
};
