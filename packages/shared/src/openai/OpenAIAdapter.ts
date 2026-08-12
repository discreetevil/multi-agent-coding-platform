import https from 'https';
import { AgentAdapter, AgentTaskResult } from '../interfaces/AgentAdapter';
import { AgentDescriptor } from '../interfaces/AgentDescriptor';
import { Task } from '../interfaces/Task';
import { Project } from '../interfaces/Project';

function callOpenAI(prompt: string, apiKey: string): Promise<any> {
  const body = JSON.stringify({ model: 'gpt-4o-mini', input: prompt });

  const options: https.RequestOptions = {
    hostname: 'api.openai.com',
    path: '/v1/responses',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      Authorization: `Bearer ${apiKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export class OpenAIAdapter implements AgentAdapter {
  private descriptor: AgentDescriptor;
  private apiKey: string | undefined;

  constructor(descriptor: AgentDescriptor, apiKey?: string) {
    this.descriptor = descriptor;
    // Prefer explicit apiKey, fallback to server env var
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
  }

  async getDescriptor(): Promise<AgentDescriptor> {
    return this.descriptor;
  }

  async sendTask(task: Task, _project?: Project): Promise<AgentTaskResult> {
    if (!this.apiKey) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    const prompt = `Task Title: ${task.title}\n\nTask Description:\n${task.description}`;

    try {
      const resp = await callOpenAI(prompt, this.apiKey);

      // The Responses API can vary in shape; try several extraction strategies.
      let text = '';

      if (typeof resp.output === 'string') {
        text = resp.output;
      } else if (Array.isArray(resp.output)) {
        // output is an array of content pieces
        text = resp.output
          .map((o: any) => {
            if (typeof o === 'string') return o;
            if (o.content && Array.isArray(o.content)) {
              return o.content.map((c: any) => c.text || c).join('');
            }
            return '';
          })
          .join('\n');
      } else if (resp.results && Array.isArray(resp.results)) {
        // Newer formats include results with output
        text = resp.results
          .map((r: any) => {
            if (r.output && Array.isArray(r.output)) {
              return r.output
                .map((o: any) => (o.content ? o.content.map((c: any) => c.text || c).join('') : o.text || ''))
                .join('');
            }
            return r.output_text || '';
          })
          .join('\n');
      } else if (resp.output_text) {
        text = resp.output_text;
      } else if (resp.choices && resp.choices[0]) {
        const c = resp.choices[0];
        text = c.message?.content?.map((p: any) => p.text || '').join('') || c.text || '';
      }

      // Fallback to raw JSON if nothing parsed
      if (!text) text = JSON.stringify(resp);

      return { success: true, output: text };
    } catch (err: any) {
      return { success: false, error: String(err) };
    }
  }

  async getStatus() {
    return { available: !!this.apiKey };
  }

  async getQuotaInfo() {
    // Not implemented: Responses API does not provide simple quota endpoint here.
    return null;
  }

  async cancelTask(_taskId: string) {
    // Cancellation not supported in this simple adapter
    return false;
  }
}
