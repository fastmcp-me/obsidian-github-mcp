/**
 * Obsidian GitHub MCP Server
 *
 * A Model Context Protocol server for accessing GitHub repositories containing Obsidian vaults.
 * This server enables AI assistants to interact with your Obsidian knowledge base stored in GitHub.
 *
 * Features:
 * - File content retrieval from Obsidian vaults
 * - Search functionality for notes and documentation
 * - Issue tracking integration
 * - Commit history analysis for knowledge evolution
 *
 * For more information about MCP, visit:
 * https://modelcontextprotocol.io
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { GithubClient } from "./github/client.js";

// Read GitHub config from environment variables
const githubToken = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;

if (!githubToken || !owner || !repo) {
  throw new Error(
    "Environment variables GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO are required"
  );
}

// Create GithubClient with full config
const githubClient = new GithubClient({ githubToken, owner, repo });

/**
 * Create a new MCP server instance with full capabilities
 */
const server = new McpServer({
  name: "obsidian-github-mcp",
  version: "0.2.0",
  capabilities: {
    tools: {},
    resources: {},
    prompts: {},
    streaming: true,
  },
});

/**
 * Helper function to send log messages to the client
 */
function logMessage(level: "info" | "warn" | "error", message: string) {
  console.error(`[${level.toUpperCase()}] ${message}`);
}

/**
 * Set up error handling for the server
 */
process.on("uncaughtException", (error: Error) => {
  logMessage("error", `Uncaught error: ${error.message}`);
  console.error("Server error:", error);
});

// Register GitHub tools
try {
  githubClient.registerGithubTools(server);
  logMessage("info", "Successfully registered all tools");
} catch (error) {
  logMessage(
    "error",
    `Failed to register tools: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
  process.exit(1);
}

/**
 * Set up proper cleanup on process termination
 */
async function cleanup() {
  try {
    await server.close();
    logMessage("info", "Server shutdown completed");
  } catch (error) {
    logMessage(
      "error",
      `Error during shutdown: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  } finally {
    process.exit(0);
  }
}

// Handle termination signals
process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);

/**
 * Main server startup function
 */
async function main() {
  try {
    // Set up communication with the MCP host using stdio transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logMessage("info", "MCP Server started successfully");
    console.error("MCP Server running on stdio transport");
  } catch (error) {
    logMessage(
      "error",
      `Failed to start server: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
