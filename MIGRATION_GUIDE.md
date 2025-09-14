# Migration Guide: Docker to HTTP Streaming Interface

This guide details how to migrate an MCP server from Docker-based deployment to HTTP streaming interface using Smithery.

## Prerequisites
- Existing MCP server with TypeScript/Node.js
- Package.json and npm/pnpm setup
- Current Docker-based deployment

## Step 1: Update Dependencies

Update your `package.json` to include Smithery SDK, latest MCP SDK, and tsx for TypeScript execution:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.17.4",
    "@smithery/sdk": "1.5.6",
    "tsx": "^4.20.5",
    "zod": "^3.24.2",
    // ... existing dependencies
  }
}
```

## Step 2: Create Smithery Configuration

Create `smithery.yaml` in your project root:

```yaml
# Smithery configuration file: https://smithery.ai/docs/config#smitheryyaml

name: "@your-org/your-mcp-server"
description: "Your MCP server description"
version: "0.4.0"  # Update to your new version

runtime: "typescript"
```

## Step 3: Refactor Server Code Structure

**CRITICAL**: The HTTP streaming interface requires a different code structure. You need to refactor your main server file (typically `src/index.ts`) to export a factory function instead of directly running the server.

### Before (stdio-only structure):
```typescript
// Old structure - direct execution
const server = new McpServer({...});
const transport = new StdioServerTransport();
server.connect(transport);
```

### After (HTTP streaming compatible structure):
```typescript
import { z } from "zod";

export const configSchema = z.object({
  githubToken: z.string().describe("GitHub API token"),
  owner: z.string().describe("GitHub repository owner"), 
  repo: z.string().describe("GitHub repository name"),
});

export default function createServer({
  config,
}: {
  config: z.infer<typeof configSchema>;
}) {
  const server = new McpServer({
    name: "your-mcp-server",
    version: "0.4.0",
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
      streaming: true, // Enable streaming
    },
  });

  // Initialize your client/tools here
  const client = new YourClient(config);
  client.registerTools(server);

  return server;
}

// Keep main function for stdio compatibility
async function main() {
  // Environment variable validation moved inside main()
  const githubToken = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;

  if (!githubToken || !owner || !repo) {
    console.error("Environment variables GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO are required");
    process.exit(1);
  }

  const server = createServer({
    config: {
      githubToken,
      owner,
      repo,
    },
  });
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Only run main if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
```

## Step 4: Update Package.json Scripts and Module Field

Add the module field and update your `package.json` scripts section:

```json
{
  "module": "src/index.ts",
  "scripts": {
    "prebuild": "npm run lint && npm run format",
    "prepublishOnly": "npm run build:stdio",
    // Update build commands
    "build": "npm run build:http",
    "build:stdio": "tsc && node -e \"require('fs').chmodSync('build/index.js', '755')\"",
    "build:http": "npx @smithery/cli build",
    
    // Update dev commands  
    "dev": "npx @smithery/cli dev",
    "dev:stdio": "concurrently \"npm run watch\" \"npm run inspector\"",
    
    // Update start commands
    "start": "npm run start:http", 
    "start:http": "node .smithery/index.cjs",
    "start:stdio": "node build/index.js",
    
    // Keep existing scripts for backwards compatibility
    "watch": "tsc --watch",
    "inspector": "npx @modelcontextprotocol/inspector node build/index.js"
    
    // Remove any Docker-related scripts like:
    // "smithery:build": "docker build..."
    // "smithery:run": "docker run..."
  }
}
```

## Step 5: Remove Docker Files

Delete these Docker-related files:
- `Dockerfile` 
- `Dockerfile.smithery`
- `docker-compose.yml` (if exists)
- `.dockerignore` (if exists)

## Step 6: Update .gitignore

Add Smithery build output to `.gitignore`:

```gitignore
# Smithery build output
.smithery/index.cjs
```

**Note**: The `.smithery/index.cjs` file should be committed for HTTP deployment, so don't ignore the entire `.smithery/` directory.

## Step 7: Build and Test

1. Install/update dependencies:
```bash
npm install
# or
pnpm install
```

2. Build the HTTP version:
```bash
npm run build:http
```

This generates `.smithery/index.cjs` - a bundled version for HTTP streaming.

3. Test locally:
```bash
npm run dev
```

## Step 8: Update Documentation

Update your README.md to reflect the new deployment options:

```markdown
## Deployment

### HTTP Streaming (Recommended)
```bash
npm run build:http
npm run start:http
```

### Traditional stdio (Legacy)
```bash
npm run build:stdio  
npm run start:stdio
```
```

## Step 9: Version and Release

1. Update version in both files:
   - `package.json` version field
   - `smithery.yaml` version field

2. Commit changes:
```bash
git add .
git commit -m "release(0.4.0) - migrate to HTTP streaming interface"
```

3. Create release:
```bash
gh release create v0.4.0 --title "Release v0.4.0: HTTP Streaming Interface" --notes "Migration to HTTP streaming interface using Smithery"
```

## Key Benefits of This Migration

- **Better Performance**: HTTP streaming is more efficient than Docker for MCP operations
- **Simplified Deployment**: No Docker runtime required
- **Backwards Compatibility**: stdio mode still available via `npm run start:stdio`
- **Development Experience**: `npm run dev` provides hot reloading

## Troubleshooting

### Common Issues

1. **Build fails**: Ensure all dependencies are installed and TypeScript compiles successfully
2. **Missing .smithery/index.cjs**: Run `npm run build:http` to generate the bundled output
3. **HTTP server not starting**: Check that port 3000 (or configured port) is available

### Verification Steps

1. Verify stdio mode still works: `npm run start:stdio`
2. Verify HTTP mode works: `npm run start:http`  
3. Test MCP tools using the inspector: `npm run inspector`

The migration maintains all existing MCP functionality while enabling more flexible deployment options.