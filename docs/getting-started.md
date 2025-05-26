---
title: Getting Started with MCP Private GitHub Search
description: How to get started using the MCP Private GitHub Search server
---

# Getting Started with MCP Private GitHub Search

This guide will help you set up and start using the MCP Private GitHub Search server with your AI agents.

## Prerequisites

Before you begin, make sure you have:

1. A GitHub account
2. GitHub token
3. Node.js v18 or later
4. npm v7 or later

## Obtaining GitHub Credentials

1. Visit [https://github.com/settings/tokens](https://github.com/settings/tokens) while logged into your GitHub account
2. Click "Generate new token"
3. Copy the generated token

## Installation

### Using Smithery (Recommended)

Smithery provides the easiest way to install and configure MCP Private GitHub Search:

```bash
# For Claude
npx -y @smithery/cli install @Hint-Services/mcp-private-github-search --client claude

# For Cursor
npx -y @smithery/cli install @Hint-Services/mcp-private-github-search --client cursor

# For Windsurf
npx -y @smithery/cli install @Hint-Services/mcp-private-github-search --client windsurf

# For Cline
npx -y @smithery/cli install @Hint-Services/mcp-private-github-search --client cline

# For TypeScript
npx -y @smithery/cli install @Hint-Services/mcp-private-github-search --client typescript
```

### Manual Installation

If you prefer to install manually:

```bash
npm install mcp-private-github-search
```

## Configuration

To use the MCP Private GitHub Search server, you need to configure it in your MCP client settings.

1.  **Environment Variables**: Ensure you have the following environment variables set:

- `GITHUB_TOKEN`: Your GitHub Personal Access Token (classic or fine-grained) with access to the target repository.
- `GITHUB_OWNER`: The owner (user or organization) of the target repository.
- `GITHUB_REPO`: The name of the target repository.

2.  **MCP Settings**: Add the server configuration to your MCP settings file (e.g., `mcp-settings.json`):

```json
{
  "mcpServers": {
    "privateGithubSearch": {
      "command": "npx",
      "args": ["-y", "@Hint-Services/mcp-private-github-search"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}", // Or paste your token directly
        "GITHUB_OWNER": "${env:GITHUB_OWNER}", // Or paste the owner directly
        "GITHUB_REPO": "${env:GITHUB_REPO}" // Or paste the repo name directly
      }
    }
  }
}
```

_Replace placeholders or use environment variable references as shown._

## Using with AI Agents

Once configured, your AI agent can use the MCP Private GitHub Search tools through the MCP interface. Here are some example prompts:

### For Claude

```
You have access to a private GitHub repository through the MCP Private GitHub Search tools.
Please help me manage my repository by:
1. Showing me all the files matching a given search query
2. Showing me all the issues matching a given search query
3. Getting commit history with actual file changes and diffs for the last X days
```

### For GPT

```
You have access to a private GitHub repository through function calls.
First, get all files by calling the search_files function.
Then, get issues by calling search_issues.
You can also get commit history by calling getCommitHistory.
```

## Basic Workflow Examples

### Managing Tasks

```typescript
// Get all files matching a given search query
const files = await mcp.invoke("privateGithubSearch", "search_files", {
  query: "search query",
});

// Get all issues matching a given search query
const issues = await mcp.invoke("privateGithubSearch", "search_issues", {
  query: "search query",
});

// Get the contents of a specific file
const fileContents = await mcp.invoke(
  "privateGithubSearch",
  "getFileContents",
  {
    filePath: "path/to/file.txt",
  }
);
```

### Reviewing Recent Changes

```typescript
// Get recent commits from the last 7 days
const recentCommits = await mcp.invoke(
  "privateGithubSearch",
  "getCommitHistory",
  {
    days: 7,
  }
);

// Get commits with diffs from specific author (diffs included by default)
const detailedCommits = await mcp.invoke(
  "privateGithubSearch",
  "getCommitHistory",
  {
    days: 30,
    author: "octocat",
    maxCommits: 25,
  }
);

// Get commits for code review pagination
const commitPage = await mcp.invoke("privateGithubSearch", "getCommitHistory", {
  days: 14,
  maxCommits: 20,
  page: 0,
});
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your GitHub token is correct and has appropriate permissions
2. **Rate Limiting**: If you encounter rate limit errors, consider implementing retry logic with exponential backoff

### Getting Help

If you encounter any issues, please open an issue on the GitHub repository or join our community Discord for support.
