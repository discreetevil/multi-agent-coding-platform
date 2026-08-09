# MULTI-AGENT CODING PLATFORM

This repository contains the initial scaffold for the Multi-Agent Coding Platform (MACP).

Purpose
- Provide interfaces, a minimal orchestration scaffold, and mock implementations so we can iteratively build the system.

Structure
- Monorepo (pnpm workspaces) with the following packages:
  - packages/shared: Core TypeScript interfaces, mocks, and unit tests for orchestrator components.
  - packages/server: Minimal backend server skeleton that wires the orchestrator.

Quick start (Codespaces)
1. Install dependencies: pnpm install
2. Run typecheck: pnpm run typecheck
3. Run tests: pnpm run test
4. Start dev server: pnpm run dev

What is included in this milestone
- Core interfaces: AgentAdapter, AgentDescriptor, AgentRegistry, AgentRouter, Task, Project, Checkpoint, CredentialManager, Orchestrator
- Mock implementations and a simple router
- Basic unit tests (vitest)
- Minimal server with a health endpoint

Next steps (recommended)
- Add persistent storage (Postgres) and migrations
- Implement Task Queue and worker processes
- Add Provider Adapters (OpenAI, Anthropic) behind AgentAdapter interface
- Implement GitHub integration for code pushes and PRs

See packages/shared/architecture.md for a concise architecture document.
