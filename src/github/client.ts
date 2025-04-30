import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

import type { GithubConfig } from "./types.js";

export class GithubClient {
  private octokit: Octokit;

  constructor(private config: GithubConfig) {
    this.octokit = new Octokit({
      auth: config.githubToken,
    });
  }

  // Simplified error handler for Octokit requests
  private async handleRequest<T>(
    request: () => Promise<{ data: T }>
  ): Promise<T> {
    try {
      const { data } = await request();
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`GitHub API error: ${error.message}`);
      }
      throw new Error(`GitHub API error: ${String(error)}`);
    }
  }

  registerGithubTools(server: McpServer) {
    server.tool(
      "getFileContents",
      `Get the contents of a specific file in the configured repository (${this.config.owner}/${this.config.repo}).`,
      {
        filePath: z
          .string()
          .describe("Path to the file within the repository."),
      },
      async ({ filePath }) => {
        const fileContent = await this.handleRequest(async () => {
          return this.octokit.repos.getContent({
            owner: this.config.owner,
            repo: this.config.repo,
            path: filePath,
            // Request raw content to avoid base64 decoding complexities for now
            mediaType: {
              format: "raw",
            },
          });
        });

        // The raw format returns the content directly as a string
        if (typeof fileContent !== "string") {
          throw new Error(
            "Received unexpected content format from GitHub API."
          );
        }

        return {
          content: [{ type: "text", text: fileContent }],
        };
      }
    );

    // Placeholder for searchFiles tool
    server.tool(
      "searchFiles",
      `Search for files within the configured repository (${this.config.owner}/${this.config.repo}).`,
      {
        query: z
          .string()
          .describe("Search query (uses GitHub Code Search syntax)"),
      },
      async ({ query }) => {
        const repoQualifier = `repo:${this.config.owner}/${this.config.repo}`;
        const qualifiedQuery = `${query} ${repoQualifier}`;
        const searchResults = await this.handleRequest(async () => {
          return this.octokit.search.code({ q: qualifiedQuery });
        });
        // Format results as a markdown list
        const formattedResults = searchResults.items
          .map((item) => `- ${item.path} (score: ${item.score})`)
          .join("\n");
        return {
          // Return formatted text instead of raw JSON string
          content: [
            {
              type: "text",
              text: `Found ${searchResults.total_count} files:\n${formattedResults}`,
            },
          ],
        };
      }
    );

    // Placeholder for searchIssues tool
    server.tool(
      "searchIssues",
      `Search for issues within the configured repository (${this.config.owner}/${this.config.repo}).`,
      {
        query: z
          .string()
          .describe("Search query (uses GitHub Issue Search syntax)"),
      },
      async ({ query }) => {
        const repoQualifier = `repo:${this.config.owner}/${this.config.repo}`;
        const qualifiedQuery = `${query} is:issue ${repoQualifier}`;
        const searchResults = await this.handleRequest(async () => {
          return this.octokit.search.issuesAndPullRequests({
            q: qualifiedQuery,
          });
        });
        // Format results as a markdown list
        const formattedResults = searchResults.items
          .map((item) => `- #${item.number} ${item.title} (${item.html_url})`)
          .join("\n");
        return {
          // Return formatted text instead of raw JSON string
          content: [
            {
              type: "text",
              text: `Found ${searchResults.total_count} issues:\n${formattedResults}`,
            },
          ],
        };
      }
    );
  }
}
