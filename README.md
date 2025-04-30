[![smithery badge](https://smithery.ai/badge/@Hint-Services/mcp-private-github-search)](https://smithery.ai/server/@Hint-Services/mcp-private-github-search)
[![npm version](https://img.shields.io/npm/v/mcp-private-github-search)](https://www.npmjs.com/package/mcp-private-github-search)

# MCP Private GitHub Search

A Model Context Protocol (MCP) server that provides tools for searching private GitHub repositories. This server enables seamless integration with GitHub's API while handling rate limiting, type safety, and error handling automatically.

## Features

- **GitHub Repository Search**: Search private GitHub repositories (you must have a GitHub token with access to the repository)
- **Type-Safe Implementation**: Written in TypeScript with comprehensive type definitions
- **Input Validation**: Robust validation for all API inputs using Zod schemas
- **Error Handling**: Graceful error handling with informative messages

## Core Components

- **MCP Servers**: These servers act as bridges, exposing APIs, databases, and code libraries to external AI hosts. By implementing an MCP server in TypeScript, developers can share data sources or computational logic in a standardized way using JSON-RPC 2.0.
- **MCP Clients**: These are the consumer-facing side of MCP, communicating with servers to query data or perform actions. MCP clients use TypeScript SDKs, ensuring type-safe interactions and uniform approach to tool usage.
- **MCP Hosts**: Systems such as Claude, Cursor, Windsurf, Cline, and other TypeScript-based platforms coordinate requests between servers and clients, ensuring seamless data flow. A single MCP server can thus be accessed by multiple AI hosts without custom integrations.

## Available Tools

MCP Private GitHub Search provides the following tools for searching private GitHub repositories :

### Search

- **searchFiles**: Search for files in a repository based on various criteria
- **searchIssues**: Search for issues in a repository based on various criteria

### Get File Information

- **getFileContents**: Get the contents of a specific file in a repository

## Project Structure

```
mcp-private-github-search/
├── src/
│   ├── index.ts          # Main entry point
│   └── github/           # GitHub API integration
│       ├── client.ts     # GitHub client implementation
│       └── types.ts      # TypeScript type definitions
├── docs/                 # Documentation
├── package.json          # Project configuration
└── tsconfig.json         # TypeScript configuration
```

## Installation

### Using Smithery

The easiest way to install MCP Private GitHub Search is using Smithery:

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

```bash
pnpm add mcp-private-github-search
```

## Configuration

Add the server to your MCP settings file with the following configuration:

```json
{
  "mcpServers": {
    "privateGithubSearch": {
      "command": "npx",
      "args": ["-y", "@Hint-Services/mcp-private-github-search"],
      "env": {
        "GITHUB_TOKEN": "your-token",
        "GITHUB_OWNER": "your-owner",
        "GITHUB_REPO": "your-repo"
      }
    }
  }
}
```

### Required Environment Variables

- `githubToken`: Your GitHub token (get from https://github.com/settings/tokens)
- `githubOwner`: The owner of the GitHub repository
- `githubRepo`: The name of the GitHub repository

## For Developers

If you're interested in contributing to this project or developing your own tools with this server, please see the [Development Guide](docs/development.md).

## Learn More

For further information on the MCP ecosystem, refer to:

- [Model Context Protocol Documentation](https://modelcontextprotocol.io): Detailed coverage of MCP architecture, design principles, and more advanced usage examples.
- [Smithery - MCP Server Registry](https://smithery.ai/docs): Guidelines for publishing your tools to Smithery and best practices for their registry.
- [MCP TypeScript SDK Documentation](https://modelcontextprotocol.io/typescript): Comprehensive documentation of the TypeScript SDK.
- [MCP Security Guidelines](https://modelcontextprotocol.io/security): Detailed security best practices and recommendations.

## About Hint Services

> "The future is already here, it's just unevenly distributed"
>
> - William Gibson, Author

Hint Services is a boutique consultancy with a mission to develop and expand how user interfaces leverage artificial intelligence technology. We architect ambition at the intersection of AI and User Experience, founded and led by Ben Hofferber.

We offer specialized AI workshops for design teams looking to embrace AI tools without becoming developers. [Learn more about our training and workshops](https://hint.services/training-workshops).
