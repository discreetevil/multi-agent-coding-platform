import express from 'express';
import { createDemoRegistry } from '../../shared/src/mock/demoRegistry';
import { SimpleAgentRouter } from '../../shared/src/router/SimpleAgentRouter';
import { BasicOrchestrator } from '../../shared/src/orchestrator/BasicOrchestrator';

async function createApp() {
  const app = express();
  app.use(express.json());

  const registry = await createDemoRegistry();
  const router = new SimpleAgentRouter();
  const orchestrator = new BasicOrchestrator(registry, router);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/projects', async (req, res) => {
    const body = req.body;
    const project = await orchestrator.createProject({ name: body.name, description: body.description || '', tasks: [] });
    res.json(project);
  });

  return app;
}

if (require.main === module) {
  createApp().then((app) => app.listen(3000, () => console.log('Server listening on :3000')));
}
