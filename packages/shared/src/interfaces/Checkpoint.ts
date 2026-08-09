export interface Checkpoint {
  id: string;
  projectId: string;
  createdAt: string;
  summary?: string;
  snapshot: any; // opaque snapshot of project state (to be typed in later milestones)
}
