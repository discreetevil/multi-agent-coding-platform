import express from 'express';
import { createDemoRegistry } from '../../shared/src/mock/demoRegistry';
import { SimpleAgentRouter } from '../../shared/src/router/SimpleAgentRouter';
import { BasicOrchestrator } from '../../shared/src/orchestrator/BasicOrchestrator';

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

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server listening on :3000');
  });
}

export = app;
