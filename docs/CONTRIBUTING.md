---
title: Contributing to MCP Private GitHub Search
description: Guidelines for contributing to the MCP Private GitHub Search project
---

# Contributing to MCP Private GitHub Search

Thank you for your interest in contributing to MCP Private GitHub Search! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

We expect all contributors to follow these basic principles:

- Be respectful and inclusive in your communication
- Focus on constructive feedback
- Respect the time and effort of maintainers and other contributors
- Help create a positive environment for everyone

## Getting Started

### Development Environment

We recommend using VS Code with the Dev Containers extension for the best development experience:

1. Clone the repository
2. Open in VS Code with Dev Containers
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Build the project:
   ```bash
   pnpm run build
   ```

### Development Scripts

- **Build**: `pnpm run build` - Compiles TypeScript and sets permissions
- **Watch mode**: `pnpm run watch` - Automatically recompiles on changes
- **Debug mode**: `pnpm run inspector` - Runs with inspector for debugging

## Development Workflow

1. **Set Up Your Environment**

   ```bash
   # Clone the repository
   git clone https://github.com/your-username/mcp-private-github-search.git
   cd mcp-private-github-search

   # Install dependencies
   pnpm install

   # Build the project
   pnpm run build
   ```

2. **Development Scripts**

   - Build the project: `pnpm run build`
   - Watch mode for development: `pnpm run watch`
   - Debug mode with inspector: `pnpm run inspector`

3. **Testing Your Changes**

   - Write unit tests for new functionality
   - Run the test suite: `pnpm test`
   - Ensure all existing tests pass
   - Add new test cases for bug fixes

4. **Code Style**

   - Follow TypeScript best practices
   - Use ESLint and Prettier for code formatting
   - Maintain consistent error handling patterns
   - Document new functions and types

5. **Making Changes**

   - Create a feature branch: `git checkout -b feature/your-feature`
   - Make your changes with clear commit messages
   - Keep commits focused and atomic
   - Update documentation as needed

6. **Testing with AI Platforms**

   ### Testing with Cursor

   1. Build your development version:

      ```bash
      pnpm run build
      ```

   2. Configure in Cursor:

      - Open Cursor settings
      - Navigate to Features > MCP
      - Add a new MCP server with these settings:
        - Transport: stdio
        - Name: mcp-github-dev (or your preferred name)
        - Command: `node /path/to/your/mcp-private-github-search/build/index.js`
        - Environment Variables: Set `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`

   3. Testing:
      - Open a new Cursor window
      - Use the AI features to test your tools
      - Check the debug console for errors
      - Verify tool responses match expectations

   ### Testing with Claude

   1. Build your development version:

      ```bash
      pnpm run build
      ```

   2. Configure Claude Desktop:

      - Create or update your Claude config file:
        ```json
        {
          "mcpServers": {
            "mcp-private-github-search": {
              "command": "node",
              "args": [
                "/path/to/your/mcp-private-github-search/build/index.js"
              ],
              "env": {
                "GITHUB_TOKEN": "your-token",
                "GITHUB_OWNER": "your-owner",
                "GITHUB_REPO": "your-repo"
              }
            }
          }
        }
        ```

   3. Testing:
      - Start Claude Desktop
      - Use the chat interface to test your tools
      - Verify responses and error handling
      - Check logs for any issues

   ### Using the Inspector

   The inspector is a powerful tool for debugging:

   ```bash
   pnpm run inspector
   ```

   This provides:

   - Real-time request/response monitoring
   - Tool execution tracing
   - Schema validation feedback
   - Performance metrics

7. **Submitting Changes**
   - Push your changes: `git push origin feature/your-feature`
   - Create a Pull Request with:
     - Clear description of changes
     - Test results
     - Documentation updates
     - Any breaking changes noted
   - Respond to review feedback
   - Update your PR as needed

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Include tests for new functionality
3. Update documentation as needed
4. Ensure all CI checks pass
5. Wait for a maintainer to review your pull request
6. Address any feedback from the review
7. Once approved, a maintainer will merge your pull request

## Coding Standards

### TypeScript Implementation

We follow strict TypeScript practices:

- Use proper typing for all functions and variables
- Use async/await for asynchronous operations
- Follow the existing code structure and patterns

### Commit History Tool (`getCommitHistory`)

When working on the commit history tool:

1. **Rate Limiting**: Be aware that the tool makes multiple API calls by default to fetch file changes
2. **Response Size**: Implement truncation for large diffs
3. **Error Handling**: Handle cases where commits may not exist or be accessible
4. **Testing**: Always test with both small and large commit histories
5. **Documentation**: Keep examples up to date with any parameter changes

### Tool Implementation

When implementing new tools, follow this pattern:

```typescript
import { z } from "zod";
import { Octokit } from "@octokit/rest"; // Assuming Octokit is used

// Define strict schema for input validation
const GetFileContentsSchema = z
  .object({
    filePath: z.string().min(1),
  })
  .strict();

// Register tool with the server
// Assuming 'server', 'githubClient', 'logger' are defined elsewhere
server.tool(
  "getFileContents",
  `Get the contents of a specific file in the configured repository.`,
  GetFileContentsSchema.shape,
  async (params) => {
    try {
      // Rate limiting is handled by Octokit internally

      // Implement tool logic using the client
      const result = await githubClient.getFileContents(params.filePath); // Example call

      // Return formatted response
      return {
        content: [
          {
            type: "text",
            text: `Content of ${params.filePath}:\n\n${result}`,
          },
        ],
      };
    } catch (error) {
      // Handle errors properly
      logger.error(error);

      return {
        content: [
          {
            type: "text",
            text: `Failed to get file contents for ${params.filePath}. Please check the path and permissions. Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);
```

### Security Best Practices

All contributions must follow these security guidelines:

1. **Input Validation**:

   - Always validate input parameters using Zod schemas
   - Implement strict type checking
   - Sanitize user inputs before processing
   - Use the `strict()` option in schemas to prevent extra properties

2. **Error Handling**:

   - Never expose internal error details to clients
   - Implement proper error boundaries
   - Log errors securely
   - Return user-friendly error messages

3. **Resource Management**:

   - Implement proper cleanup procedures
   - Handle process termination signals
   - Close connections and free resources
   - Implement timeouts for long-running operations

4. **API Security**:
   - Use secure transport protocols
   - Implement rate limiting
   - Store sensitive data securely
   - Use environment variables for configuration

## Testing

- Write unit tests for all new functionality
- Ensure existing tests continue to pass
- Test edge cases and error handling
- For GitHub API interactions, use mocks (e.g., with `jest-mock-extended` or `nock`) to avoid actual API calls in tests

## Documentation

- Update API documentation for any changes to existing tools
- Add documentation for new tools
- Keep the README up to date
- Include examples for new functionality

## Testing Best Practices

1. **Unit Testing**

   ```typescript
   import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
   import { GithubClient } from "../src/github/client"; // Adjust path as needed
   import { registerGithubTools } from "../src/github/client"; // Assuming registration logic is separate or mockable
   import { jest } from "@jest/globals";

   describe("GitHub Tools", () => {
     let server: McpServer;
     let mockGithubClient: jest.Mocked<GithubClient>; // Use jest.Mocked for type safety

     beforeEach(() => {
       server = new McpServer({
         name: "test-server",
         version: "1.0.0",
         capabilities: { tools: {} },
       });

       // Mock the GithubClient
       mockGithubClient = {
         // Mock methods used by registerGithubTools
         octokit: {} as any, // Mock octokit if needed directly
         config: {
           githubToken: "test",
           owner: "test-owner",
           repo: "test-repo",
         },
         handleRequest: jest.fn(), // Mock handleRequest if used directly
         getFileContents: jest.fn().mockResolvedValue("mock file content"),
         searchFiles: jest.fn().mockResolvedValue({
           total_count: 1,
           items: [{ path: "test.ts", score: 1 }],
         }),
         searchIssues: jest.fn().mockResolvedValue({
           total_count: 1,
           items: [{ number: 1, title: "Test Issue", html_url: "..." }],
         }),
         // Add registerGithubTools mock *if* it's part of the class, otherwise import/mock it separately
       } as jest.Mocked<GithubClient>;

       // Pass the mocked client to the registration function
       registerGithubTools(server, mockGithubClient);
     });

     test("getFileContents calls client correctly", async () => {
       const result = await server.executeTool("getFileContents", {
         filePath: "src/index.ts",
       });
       expect(mockGithubClient.getFileContents).toHaveBeenCalledWith(
         "src/index.ts"
       );
       expect(result.content[0].text).toContain("mock file content");
     });

     // Add tests for searchFiles and searchIssues similarly
   });
   ```

2. **Integration Testing**

   - Test with actual GitHub API (use a dedicated test repository if possible)
   - Verify rate limiting behavior (though mostly handled by Octokit)
   - Test error handling scenarios (invalid paths, permissions errors)
   - Check response formatting

3. **Error Handling Tests**

   ```typescript
   test("handles API errors gracefully for getFileContents", async () => {
     // Mock failure
     mockGithubClient.getFileContents.mockRejectedValue(new Error("Not Found"));

     const result = await server.executeTool("getFileContents", {
       filePath: "nonexistent.txt",
     });
     expect(result.isError).toBe(true);
     expect(result.content[0].text).toContain("Failed to get file contents");
     expect(result.content[0].text).toContain("Not Found");
   });
   ```

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have questions about contributing, please open an issue in the repository or contact the maintainers directly.

Thank you for contributing to MCP Private GitHub Search!
