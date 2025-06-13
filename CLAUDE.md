# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MCP Private GitHub Search is a Model Context Protocol (MCP) server that provides tools for searching and analyzing private GitHub repositories. It acts as a bridge between AI assistants and GitHub's API, enabling file search, issue search, content retrieval, and commit history analysis.

## Key Commands

### Development
- `pnpm install` - Install dependencies
- `pnpm run build` - Build the project (includes linting and formatting)
- `pnpm run dev` - Run in development mode with inspector
- `pnpm run watch` - Watch mode for automatic recompilation
- `pnpm run debug:watch` - Debug mode with watch

### Code Quality
- `pnpm run lint:fix` - Fix linting issues with Biome
- `pnpm run format:fix` - Format code with Biome
- `pnpm run clean` - Clean build artifacts

### Debugging
- `pnpm run inspector` - Launch MCP inspector for testing tools
- `pnpm run logs` - View last 20 lines of MCP logs
- `pnpm run debug` - Run with Node.js debugger attached

## Architecture Overview

The project follows a clean modular architecture:

### Core Components
- **`src/index.ts`**: MCP server initialization using stdio transport. Handles server lifecycle, environment configuration, and graceful shutdown.
- **`src/github/client.ts`**: Encapsulates all GitHub API interactions via Octokit. Implements centralized error handling and tool registration.
- **`src/github/types.ts`**: TypeScript type definitions for configuration.

### Available MCP Tools
1. **`getFileContents`**: Retrieves raw file content from repository
2. **`searchFiles`**: Searches files with GitHub code search syntax (paginated)
3. **`searchIssues`**: Searches repository issues
4. **`getCommitHistory`**: Retrieves commit history with optional diffs (supports time-based filtering)

### Key Design Patterns
- **Environment-based configuration**: Repository details via `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`
- **Fail-fast initialization**: Server won't start without required configuration
- **Centralized error handling**: All GitHub requests go through `handleRequest` wrapper
- **Type safety**: Zod schemas for runtime validation of tool inputs
- **Pagination support**: Both searchFiles and getCommitHistory support pagination

### Development Notes
- Uses Biome for linting and formatting (configured in `biome.json`)
- TypeScript target: ES2020 with Node16 module resolution
- Pre-build hooks ensure code quality before compilation
- MCP Inspector available for testing tool interactions
- No test framework currently configured (documentation mentions Jest but not implemented)