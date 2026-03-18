import "dotenv/config";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Agent,
  MCPServerStdio,
  run,
  setDefaultOpenAIKey,
  webSearchTool,
} from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const promptsDir = path.join(__dirname, "..", "prompts");

function withHandoffPrefix(instructions: string): string {
  return `${RECOMMENDED_PROMPT_PREFIX}\n${instructions.trim()}`;
}

async function loadPrompt(name: string): Promise<string> {
  const filePath = path.join(promptsDir, name);
  return readFile(filePath, "utf-8");
}

async function main(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to .env or your shell.");
  }
  setDefaultOpenAIKey(apiKey);

  const [
    designerPrompt,
    frontendPrompt,
    backendPrompt,
    testerPrompt,
    projectManagerPrompt,
    taskList,
  ] = await Promise.all([
    loadPrompt("designer.md"),
    loadPrompt("frontend.md"),
    loadPrompt("backend.md"),
    loadPrompt("tester.md"),
    loadPrompt("project_manager.md"),
    loadPrompt("task_list.md"),
  ]);

  const codexMcp = new MCPServerStdio({
    name: "Codex CLI",
    command: "npx",
    args: ["-y", "@openai/codex@0.71.0", "mcp-server"],
    clientSessionTimeoutSeconds: 360000,
  });

  await codexMcp.connect();

  try {
    // PM is created first so specialists can point their handoffs back to PM.
    const projectManagerAgent = new Agent({
      name: "Project Manager Agent",
      model: "gpt-5",
      instructions: withHandoffPrefix(projectManagerPrompt),
      modelSettings: {
        reasoning: { effort: "medium" },
      },
      mcpServers: [codexMcp],
      handoffs: [],
    });

    const designerAgent = new Agent({
      name: "Designer Agent",
      model: "gpt-5",
      instructions: withHandoffPrefix(designerPrompt),
      tools: [webSearchTool()],
      mcpServers: [codexMcp],
      handoffs: [projectManagerAgent],
    });

    const frontendDeveloperAgent = new Agent({
      name: "Frontend Developer Agent",
      model: "gpt-5",
      instructions: withHandoffPrefix(frontendPrompt),
      mcpServers: [codexMcp],
      handoffs: [projectManagerAgent],
    });

    const backendDeveloperAgent = new Agent({
      name: "Backend Developer Agent",
      model: "gpt-5",
      instructions: withHandoffPrefix(backendPrompt),
      mcpServers: [codexMcp],
      handoffs: [projectManagerAgent],
    });

    const testerAgent = new Agent({
      name: "Tester Agent",
      model: "gpt-5",
      instructions: withHandoffPrefix(testerPrompt),
      mcpServers: [codexMcp],
      handoffs: [projectManagerAgent],
    });

    // Fill PM handoffs after all specialists exist.
    (projectManagerAgent as any).handoffs = [
      designerAgent,
      frontendDeveloperAgent,
      backendDeveloperAgent,
      testerAgent,
    ];

    const result = await run(projectManagerAgent, taskList.trim(), {
      maxTurns: 30,
      workflowName: "multi_agent_codex_run",
      groupId: "session-123",
      traceMetadata: {
        repo: "codex-sdk-workflows",
        env: "dev",
      },
    });

    console.log(result.finalOutput ?? "Workflow completed with empty final output.");
  } finally {
    await codexMcp.close();
  }
}

main().catch((error) => {
  console.error("Workflow failed:", error);
  process.exitCode = 1;
});
