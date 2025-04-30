---
title: MCP Private GitHub Search
description: A Model Context Protocol (MCP) server for interacting with a specific private GitHub repository defined during configuration
---

# MCP Private GitHub Search

A Model Context Protocol (MCP) server that provides tools for interacting with a specific private GitHub repository defined during configuration. This server enables seamless integration with GitHub's API while handling rate limiting, type safety, and error handling automatically.

## Features

- **Targeted GitHub Repository Integration**: Interact with files, issues, and code within a pre-configured repository.
- **Built-in Rate Limiting**: Respects GitHub's API limits (automatically handled by `@octokit/rest`).
- **Type-Safe Implementation**: Written in TypeScript with comprehensive type definitions
- **Input Validation**: Robust validation for all API inputs using Zod schemas
- **Error Handling**: Graceful error handling with informative messages

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
pnpm add @Hint-Services/mcp-private-github-search
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
        "GITHUB_TOKEN": "your-personal-access-token",
        "GITHUB_OWNER": "owner-of-the-repo",
        "GITHUB_REPO": "name-of-the-repo"
      }
    }
  }
}
```

### Required Environment Variables

- `GITHUB_TOKEN`: Your GitHub Personal Access Token (classic or fine-grained with repo access). Get from https://github.com/settings/tokens
- `GITHUB_OWNER`: The username or organization name that owns the target repository.
- `GITHUB_REPO`: The name of the target repository.

## Available Tools

All tools operate within the context of the repository defined by the `GITHUB_OWNER` and `GITHUB_REPO` environment variables.

### getFileContents

Get the contents of a specific file in the configured repository.

```typescript
{
  name: 'getFileContents',
  arguments: {
    filePath: string  // Path to the file within the repository
  }
}
```

### searchFiles

Search for files (code search) within the configured repository based on a query.

```typescript
{
  name: 'searchFiles',
  arguments: {
    query: string  // Search query (uses GitHub Code Search syntax)
  }
}
```

### searchIssues

Search for issues within the configured repository based on a query.

```typescript
{
  name: 'searchIssues',
  arguments: {
    query: string  // Search query (uses GitHub Issue Search syntax)
  }
}
```

## Rate Limiting

Rate limiting is handled automatically by the underlying `@octokit/rest` library to comply with GitHub's API limits. Requests may be queued or retried if limits are approached or exceeded.

## Error Handling

The server provides detailed error messages for various scenarios:

- Invalid input parameters
- Rate limit exceeded
- API authentication errors
- Network issues

## Development

### Prerequisites

- Node.js v18 or higher
- pnpm v7 or higher

### Setup

1. Clone the repository

```bash
git clone https://github.com/Hint-Services/mcp-private-github-search.git
cd mcp-private-github-search
```

2. Install dependencies

```bash
pnpm install
```

3. Build the project

```bash
pnpm run build
```

### Running in Development Mode

```bash
pnpm run watch
```

### Running with Debugging

```bash
pnpm run inspector
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Uses the [GitHub REST API](https://docs.github.com/en/rest)
