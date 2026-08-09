import { Orchestrator } from './Orchestrator';
import { Project } from '../interfaces/Project';
import { Task } from '../interfaces/Task';
import { AgentRegistry } from '../registry/AgentRegistry';
import { AgentRouter } from '../router/AgentRouter';
import { v4 as uuidv4 } from 'uuid';

export class BasicOrchestrator implements Orchestrator {
  private projects = new Map<string, Project>();
  constructor(private registry: AgentRegistry, private router: AgentRouter) {}

  async createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const p: Project = { ...project, id, createdAt: now } as Project;
    this.projects.set(id, p);
    return p;
  }

  async submitTask(projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'status'>): Promise<Task> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('project not found');
    const id = uuidv4();
    const now = new Date().toISOString();
    const t: Task = { ...task, id, createdAt: now, status: 'pending' } as Task;
    project.tasks.push(t);
    project.updatedAt = now;
    return t;
  }

  async assignAndRun(taskId: string): Promise<void> {
    // find task
    let projectFound: Project | undefined;
    let taskFound: Task | undefined;
    for (const p of this.projects.values()) {
      const t = p.tasks.find((x) => x.id === taskId);
      if (t) {
        projectFound = p;
        taskFound = t;
        break;
      }
    }
    if (!taskFound || !projectFound) throw new Error('task not found');

    const agentDesc = await this.router.route(taskFound, this.registry);
    if (!agentDesc) throw new Error('no agent available');

    const adapter = this.registry.getAdapter(agentDesc.id);
    if (!adapter) throw new Error('adapter not found for agent');

    taskFound.assigneeId = agentDesc.id;
    taskFound.status = 'in_progress';
    taskFound.attempts = (taskFound.attempts || 0) + 1;
    taskFound.updatedAt = new Date().toISOString();

    const result = await adapter.sendTask(taskFound, projectFound);
    if (result.success) {
      taskFound.status = 'completed';
    } else {
      taskFound.status = 'failed';
    }
    taskFound.updatedAt = new Date().toISOString();
  }
}
