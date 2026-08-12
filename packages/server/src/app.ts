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
  res.json({
    status: 'ok',
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
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

    if (body.task) {
      const task = await orchestrator.submitTask(project.id, {
        title: body.task.title || 'OpenAI coding task',
        description: body.task.description || '',
        metadata: body.task.metadata || {},
      });

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({
          error: 'OPENAI_API_KEY is not configured in Vercel',
          project,
          task,
        });
      }

      const response = await fetch(
        'https://api.openai.com/v1/responses',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4.1-mini',
            input: [
              {
                role: 'system',
                content:
                  'You are the OpenAI implementation agent inside a multi-agent coding platform. Analyze coding tasks carefully. Give practical implementation guidance, identify affected files, and provide production-quality code where appropriate.',
              },
              {
                role: 'user',
                content:
                  `Project: ${project.name}\n` +
                  `Project description: ${project.description}\n\n` +
                  `Task: ${task.title}\n` +
                  `Task description: ${task.description}`,
              },
            ],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: 'OpenAI API request failed',
          details: data,
          project,
          task,
        });
      }

      const output =
        data.output_text ||
        data.output
          ?.flatMap((item: any) => item.content || [])
          ?.map((item: any) => item.text || '')
          ?.join('') ||
        '';

      task.status = 'completed';
      task.updatedAt = new Date().toISOString();
      task.metadata = {
        ...task.metadata,
        provider: 'openai',
        model: 'gpt-4.1-mini',
        output,
      };

      return res.json({
        success: true,
        project,
        task,
        openai: {
          model: 'gpt-4.1-mini',
          output,
        },
      });
    }

    return res.json(project);
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
