# Building Consistent Workflows with Codex, MCP, and Agents SDK

This repository supports a live coding session with three stages:

1. Notebook walkthrough
2. TypeScript SDK workflow
3. Codex App workflow

## Prerequisites

- Python `3.10+`
- `uv`
- Node.js `20+`
- npm `10+`
- OpenAI API key (`OPENAI_API_KEY`)
- Codex App installed (for the final stage)

Create your environment file:

```bash
cp .env.example .env
```

Then set:

```env
OPENAI_API_KEY=your_api_key_here
```

Install Python dependencies from repo root:

```bash
uv sync
```

## Why run Codex through an MCP server?

In this lesson, agents need to perform coding actions in the local workspace. MCP is the bridge that exposes Codex as a structured tool to those agents.

Using Codex via MCP gives us:

- A consistent interface for agent-to-Codex tool calls
- Local workspace execution with controlled sandbox/approval behavior
- Reproducible behavior across both Python and TypeScript examples

In this project, Codex MCP is launched as:

```bash
npx -y @openai/codex@0.71.0 mcp-server
```

## What will be used

- Notebook:
  - `notebooks/building_consistent_workflows_codex_cli_agents_sdk.ipynb`
- Python components:
  - `codex_mcp.py`
  - `openai-agents`, `openai`, `python-dotenv`
- TypeScript components in `codex_sdk/`:
  - `src/main.ts`
  - prompt files in `prompts/`
  - `@openai/agents`, `@openai/agents-core`, `dotenv`, `tsx`, `typescript`
- Codex App instructions in `codex_app/README.md`

## Live Session Order

Follow this exact sequence:

1. Start with `notebooks/building_consistent_workflows_codex_cli_agents_sdk.ipynb`
2. Continue with `codex_sdk/README.md`, then everything inside `codex_sdk/`
3. End with `codex_app/README.md`

## Stage 1: Notebook

Open:

- `notebooks/building_consistent_workflows_codex_cli_agents_sdk.ipynb`

Goal:

- Understand the baseline pattern for Codex + MCP + Agents SDK workflows.

## Stage 2: `codex_sdk/`

Open:

- `codex_sdk/README.md`

Then run:

```bash
cd codex_sdk
npm install
npm run dev
```

Goal:

- Run the multi-agent gated workflow (PM -> Designer -> Frontend/Backend -> Tester) using Codex MCP.

## Stage 3: `codex_app/`

Open:

- `codex_app/README.md`

Goal:

- Replicate the workflow manually in Codex App using phased prompts and gate checks.

## References

- OpenAI Cookbook notebook:
  - https://github.com/openai/openai-cookbook/blob/main/examples/codex/codex_mcp_agents_sdk/building_consistent_workflows_codex_cli_agents_sdk.ipynb
- OpenAI Agents SDK guide:
  - https://developers.openai.com/codex/guides/agents-sdk
