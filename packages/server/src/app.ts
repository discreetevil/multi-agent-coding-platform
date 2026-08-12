import express from 'express';
import { createDemoRegistry } from '../../shared/src/mock/demoRegistry';
import { SimpleAgentRouter } from '../../shared/src/router/SimpleAgentRouter';
import { BasicOrchestrator } from '../../shared/src/orchestrator/BasicOrchestrator';
import { Task } from '../../shared/src/interfaces/Task';

const app = express();

app.use(express.json());

const registryPromise = createDemoRegistry();

const router = new SimpleAgentRouter();

const orchestratorPromise = registryPromise.then(
  (registry) => new BasicOrchestrator(registry, router),
);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/projects', async (req, res, next) => {
  try {
    const orchestrator = await orchestratorPromise;
    const body = req.body;

    const project = await orchestrator.createProject({
      name: body.name,
      description: body.description || '',
      tasks: [],
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
});

app.post('/openai/test', async (req, res, next) => {
  try {
    const registry = await registryPromise;
    const descriptors = registry.listDescriptors();
    const openaiDesc = descriptors.find((d) => d.provider === 'openai');
    if (!openaiDesc) {
      return res.status(404).json({ error: 'OpenAI adapter not registered' });
    }
    const adapter = registry.getAdapter(openaiDesc.id);
    if (!adapter) {
      return res.status(500).json({ error: 'OpenAI adapter instance missing' });
    }

    const testTask: Task = {
      id: 'test-task',
      title: 'Test OpenAI Call',
      description: 'Please respond with a short confirmation message.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const result = await adapter.sendTask(testTask);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server listening on :3000');
  });
}

export = app;
