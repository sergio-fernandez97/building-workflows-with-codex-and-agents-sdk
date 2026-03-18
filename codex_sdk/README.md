# Codex SDK (TypeScript) - Section 2 Replica

This folder replicates section **2. Orchestrating Multi-Agent Workflows** from:

- `notebooks/building_consistent_workflows_codex_cli_agents_sdk.ipynb`

It uses a Project Manager agent that gates handoffs across Designer -> (Frontend + Backend) -> Tester.

## 1. Prerequisites

- Node.js 20+
- npm 10+
- OpenAI API key

## 2. Install

From the `codex_sdk` folder:

```bash
npm install
```

## 3. Configure environment

```bash
cp .env.example .env
```

Set your key in `.env`:

```env
OPENAI_API_KEY=your_api_key_here
```

## 4. Run the workflow

```bash
npm run dev
```

This launches:

- A Codex MCP server via `npx -y @openai/codex@0.71.0 mcp-server`
- A 5-agent workflow with the same role structure as notebook section 2

## 5. What gets generated

The agents should create artifacts in the project root/workspace, including:

- `REQUIREMENTS.md`
- `TEST.md`
- `AGENT_TASKS.md`
- `/design/design_spec.md`
- `/frontend/index.html`
- `/backend/server.js`
- `/test/test_plan.md`

Exact outputs depend on the run, but the gating flow should match section 2 behavior.

## 6. Files in this folder

- `src/main.ts`: multi-agent orchestration entrypoint
- `prompts/project_manager.md`: PM prompt with gating rules
- `prompts/designer.md`: Designer role prompt
- `prompts/frontend.md`: Frontend role prompt
- `prompts/backend.md`: Backend role prompt
- `prompts/tester.md`: Tester role prompt
- `prompts/task_list.md`: initial high-level task list

## 7. Live coding flow (suggested)

1. Open `src/main.ts` and explain the 5 agents and handoffs.
2. Open `prompts/project_manager.md` and highlight gating logic.
3. Run `npm run dev`.
4. Show the generated files appearing in the workspace.
5. Modify `prompts/task_list.md` live (for a second scenario) and rerun.

## 8. Troubleshooting

- If `OPENAI_API_KEY` is missing, startup fails immediately.
- If `npx` cannot launch Codex MCP, check Node/npm install and network access.
- If the workflow stalls, increase `maxTurns` in `src/main.ts`.

