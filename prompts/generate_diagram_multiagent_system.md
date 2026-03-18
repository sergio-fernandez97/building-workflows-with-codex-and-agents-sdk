› Analyze this repository and identify the multi-agent architecture implemented 
with the OpenAI Agents SDK, check `codex_sdk/src/main.ts` and 
`notebooks/building_consistent_workflows_codex_cli_agents_sdk.ipynb`. 
 
# I need:
1. A list of all agents
2. Their tools
3. Their MCP servers
4. Their handoffs / delegation relationships
5. The main entrypoint(s)
6. A Mermaid flowchart showing the system architecture
7. A second Mermaid sequence diagram showing a typical request lifecycle

# Rules:
- Infer relationships only from code
- Mention the file and symbol where each relationship is defined
- If something is uncertain, mark it as "inferred"
- Output the Mermaid blocks first, then a short explanation

# Expected output:
Two files, each one with one of diagrams:
- images/architecture_flow.svg
- images/architecture_sequence.svg