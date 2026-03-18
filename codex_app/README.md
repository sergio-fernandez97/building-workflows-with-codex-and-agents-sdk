# Codex App Workflow

## Install Codex App

### Where to get it
- Official download page: https://openai.com/codex/get-started/
- Product page: https://openai.com/codex/

### How to install
1. Download Codex for macOS from the official OpenAI page.
2. Drag the Codex app into `Applications`.
3. Open Codex and sign in with your ChatGPT account.
4. In Codex, open your local project folder (path below).

## Prerequisites To Launch This Project
- `Codex app` installed and signed in.
- `Node.js` and `npm` installed (for `backend/server.js` and backend route tests).
- `bash` and `curl` available (for `tests/test.sh`).
- Access to this project folder:
  `/Users/sergio.fernandez/Documents/AI-Initiative/AI-Literacy-Culture-Sales/courses/Coding-Assistants-&-AI-Agents/module-3/codex-sdk-workflows`
- Optional for Python workflow files in this repo: `Python 3.10+` and `uv`.

## 1. Open Codex App In Your Project Folder
`./codex-sdk-workflows`

## 2. (OPTIONAL) Create A Clean Workspace For The Demo 
Ask Codex:

```bash
Create folders: design, frontend, backend, tests.
Do not modify anything else yet.
```

## 3. Replicate Section 2 As Phased "Role Simulation" In Codex App
In Codex app, do it as explicit phases (PM -> Designer -> Frontend/Backend -> Tester), using file gates.

## 4. Phase PM (Create Planning Artifacts) -> initialize first thread
Prompt:

```bash
Act as Project Manager.
From this task list, create in project root:
- REQUIREMENTS.md
- TEST.md
- AGENT_TASKS.md

Task list:
Goal: Build a tiny browser game to showcase a multi-agent workflow.
High-level requirements:
- Single-screen game called "Bug Busters".
- Player clicks a moving bug to earn points.
- Game ends after 20 seconds and shows final score.
- Optional: submit score to backend and display top-10 leaderboard.
Roles:
- Designer: one-page UI/UX spec and wireframe.
- Frontend Developer: page and game logic.
- Backend Developer: minimal API (GET /health, GET/POST /scores).
- Tester: test plan and simple route-check script.
Constraints:
- No external database (in-memory ok).
- Keep beginner-friendly, no frameworks required.
- Outputs must be small files in clearly named folders.
```

## 5. (OPTIONAL) Gate Check #1
Prompt:

```bash
Confirm REQUIREMENTS.md, TEST.md, and AGENT_TASKS.md exist.
If any is missing, create it now.
```

## 6. Phase Designer -> create new thread
Prompt:

```bash
Act as Designer.
Read REQUIREMENTS.md and AGENT_TASKS.md.
Create:
- design/design_spec.md
- design/wireframe.md
Keep outputs short and implementation-friendly.
```

## 7. (OPTIONAL) Gate Check #2
Prompt:

```bash
Confirm design/design_spec.md exists before continuing.
```

## 8. Phase Frontend -> create new thread
Prompt:

```bash
Act as Frontend Developer.
Read AGENT_TASKS.md and design/design_spec.md.
Implement:
- frontend/index.html
- frontend/styles.css
- frontend/main.js
Do not add features not requested.
```

## 9. Phase Backend -> create new thread
Prompt:

```bash
Act as Backend Developer.
Read REQUIREMENTS.md and AGENT_TASKS.md.
Implement:
- backend/package.json
- backend/server.js
Endpoints: GET /health, GET /scores, POST /scores.
Use in-memory storage only.
```

## 10. (OPTIONAL) Gate Check #3
Prompt:

```bash
Confirm frontend/index.html and backend/server.js both exist.
If missing, create/fix them now.
```

## 11. Phase Tester -> create new thread
Prompt:

```bash
Act as Tester.
Read TEST.md and produced artifacts.
Create:
- tests/TEST_PLAN.md
- tests/test.sh
test.sh should verify backend core routes quickly.
```

## 12. Final Validation -> create new thread
Prompt:

```bash
List all generated files and provide a brief status report against requirements.
```

## 13. Optional Run Commands (Through Codex Terminal)

```bash
node backend/server.js
bash tests/test.sh
```
