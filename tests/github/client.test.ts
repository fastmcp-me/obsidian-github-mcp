/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from "vitest";
import { GithubClient } from "../../src/github/client";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GithubConfig } from "../../src/github/types";

// Mock the McpServer
const mockTool = vi.fn();
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => {
  return {
    McpServer: vi.fn().mockImplementation(() => {
      return {
        tool: mockTool,
      };
    }),
  };
});

// Mock Octokit
const mockSearchCode = vi.fn();
const mockSearchIssuesAndPullRequests = vi.fn();
const mockReposGet = vi.fn();
const mockReposListCommits = vi.fn();
const mockReposGetCommit = vi.fn();
const mockReposGetContent = vi.fn();

vi.mock("@octokit/rest", () => {
  const Octokit = vi.fn().mockImplementation(() => {
    return {
      search: {
        code: mockSearchCode,
        issuesAndPullRequests: mockSearchIssuesAndPullRequests,
      },
      repos: {
        get: mockReposGet,
        listCommits: mockReposListCommits,
        getCommit: mockReposGetCommit,
        getContent: mockReposGetContent,
      },
    };
  });
  return { Octokit };
});

describe("GithubClient searchFiles", () => {
  const config: GithubConfig = {
    owner: "test-owner",
    repo: "test-repo",
    githubToken: "test-token",
  };

  let searchFilesImpl: (args: {
    query: string;
    searchIn: string;
  }) => Promise<void>;

  beforeEach(() => {
    vi.clearAllMocks();
    const server = new McpServer({
      name: "test-server",
      version: "1.0.0",
    });
    const client = new GithubClient(config);
    client.registerGithubTools(server);

    const searchFilesCall = mockTool.mock.calls.find(
      (call) => call[0] === "searchFiles"
    );
    if (!searchFilesCall) {
      throw new Error("searchFiles tool not registered");
    }
    searchFilesImpl = searchFilesCall[3];
    mockSearchCode.mockResolvedValue({
      data: { total_count: 0, items: [] },
    });
  });

  it("should use `in:file,path` for 'all' search", async () => {
    await searchFilesImpl({ query: "my query", searchIn: "all" });
    expect(mockSearchCode).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "my query in:file,path repo:test-owner/test-repo",
      })
    );
  });

  it("should use `in:path` for 'path' search", async () => {
    await searchFilesImpl({ query: "my/path", searchIn: "path" });
    expect(mockSearchCode).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "my/path in:path repo:test-owner/test-repo",
      })
    );
  });

  it("should use `filename:` for 'filename' search", async () => {
    await searchFilesImpl({ query: "MyFile.md", searchIn: "filename" });
    expect(mockSearchCode).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "filename:MyFile.md repo:test-owner/test-repo",
      })
    );
  });

  it("should quote multi-word filenames", async () => {
    await searchFilesImpl({ query: "My File.md", searchIn: "filename" });
    expect(mockSearchCode).toHaveBeenCalledWith(
      expect.objectContaining({
        q: 'filename:"My File.md" repo:test-owner/test-repo',
      })
    );
  });

  it("should search only content for 'content' search", async () => {
    await searchFilesImpl({ query: "some content", searchIn: "content" });
    expect(mockSearchCode).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "some content repo:test-owner/test-repo",
      })
    );
  });
});

describe("GithubClient diagnoseSearch", () => {
  const config: GithubConfig = {
    owner: "test-owner",
    repo: "test-repo",
    githubToken: "test-token",
  };

  let diagnoseSearchImpl: () => Promise<{ content: Array<{ type: string; text: string }> }>;

  beforeEach(() => {
    vi.clearAllMocks();
    const server = new McpServer({
      name: "test-server",
      version: "1.0.0",
    });
    const client = new GithubClient(config);
    client.registerGithubTools(server);

    const diagnoseSearchCall = mockTool.mock.calls.find(
      (call) => call[0] === "diagnoseSearch"
    );
    if (!diagnoseSearchCall) {
      throw new Error("diagnoseSearch tool not registered");
    }
    diagnoseSearchImpl = diagnoseSearchCall[3];
  });

  it("should diagnose a healthy public repository", async () => {
    // Mock repository info
    mockReposGet.mockResolvedValue({
      data: {
        size: 10240, // 10 MB in KB
        private: false,
        default_branch: "main",
      },
    });

    // Mock successful search
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 42,
        items: [],
      },
    });

    const result = await diagnoseSearchImpl();
    const text = result.content[0].text;

    expect(text).toContain("Repository Search Diagnostics");
    expect(text).toContain("test-owner/test-repo");
    expect(text).toContain("Visibility**: Public");
    expect(text).toContain("Size**: 0.010 GB");
    expect(text).toContain("Default Branch**: main");
    expect(text).toContain("Search API Access**: ✅ Working");
    expect(text).toContain("Indexed Branch**: Only 'main' branch is searchable");
    expect(text).toContain("Markdown Files Found**: 42");
    expect(text).toContain("Within Size Limit**: ✅ Yes");
    expect(text).toContain("All Systems Operational");
  });

  it("should diagnose a large repository exceeding size limit", async () => {
    // Mock large repository (60 GB)
    mockReposGet.mockResolvedValue({
      data: {
        size: 60 * 1024 * 1024, // 60 GB in KB
        private: false,
        default_branch: "master",
      },
    });

    // Mock successful search
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 100,
        items: [],
      },
    });

    const result = await diagnoseSearchImpl();
    const text = result.content[0].text;

    expect(text).toContain("Size**: 60.000 GB");
    expect(text).toContain("Within Size Limit**: ⚠️ No (60.000 GB > 50 GB)");
    expect(text).toContain("Large Repository**: GitHub's code search doesn't index repositories larger than ~50 GB");
    expect(text).toContain("Individual files must be < 384 KB to be searchable");
  });

  it("should diagnose a private repository with search failure", async () => {
    // Mock private repository
    mockReposGet.mockResolvedValue({
      data: {
        size: 5120, // 5 MB in KB
        private: true,
        default_branch: "develop",
      },
    });

    // Mock search failure
    mockSearchCode.mockRejectedValue(new Error("Forbidden"));

    const result = await diagnoseSearchImpl();
    const text = result.content[0].text;

    expect(text).toContain("Visibility**: Private");
    expect(text).toContain("Search API Access**: ❌ Failed");
    expect(text).toContain("Error**: GitHub API error: Forbidden");
    expect(text).toContain("Private Repository**: Ensure your GitHub token has the 'repo' scope");
  });

  it("should diagnose an empty repository", async () => {
    // Mock repository info
    mockReposGet.mockResolvedValue({
      data: {
        size: 1024, // 1 MB in KB
        private: false,
        default_branch: "main",
      },
    });

    // Mock search with no results
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 0,
        items: [],
      },
    });

    const result = await diagnoseSearchImpl();
    const text = result.content[0].text;

    expect(text).toContain("Markdown Files Found**: 0");
    expect(text).toContain("No Markdown Files**: No .md files found in the default branch");
    expect(text).toContain("Your vault might be empty, use different file extensions, or have content in other branches");
  });

  it("should handle complete failure to access repository", async () => {
    // Mock repository access failure
    mockReposGet.mockRejectedValue(new Error("Not Found"));

    const result = await diagnoseSearchImpl();
    const text = result.content[0].text;

    expect(text).toContain("Failed to diagnose repository");
    expect(text).toContain("GitHub API error: Not Found");
    expect(text).toContain("Please check your GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO configuration");
  });

  it("should show correct branch information", async () => {
    // Mock repository with non-standard default branch
    mockReposGet.mockResolvedValue({
      data: {
        size: 2048, // 2 MB in KB
        private: false,
        default_branch: "production",
      },
    });

    // Mock successful search
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 15,
        items: [],
      },
    });

    const result = await diagnoseSearchImpl();
    const text = result.content[0].text;

    expect(text).toContain("Default Branch**: production");
    expect(text).toContain("Indexed Branch**: Only 'production' branch is searchable");
  });
});

describe("GithubClient searchFiles enhanced features", () => {
  const config: GithubConfig = {
    owner: "test-owner",
    repo: "test-repo",
    githubToken: "test-token",
  };

  let searchFilesImpl: (args: {
    query: string;
    searchIn: string;
  }) => Promise<{ content: Array<{ type: string; text: string }> }>;

  beforeEach(() => {
    vi.clearAllMocks();
    const server = new McpServer({
      name: "test-server",
      version: "1.0.0",
    });
    const client = new GithubClient(config);
    client.registerGithubTools(server);

    const searchFilesCall = mockTool.mock.calls.find(
      (call) => call[0] === "searchFiles"
    );
    if (!searchFilesCall) {
      throw new Error("searchFiles tool not registered");
    }
    searchFilesImpl = searchFilesCall[3];
  });

  it("should provide enhanced error message for validation failures", async () => {
    mockSearchCode.mockRejectedValue(new Error("GitHub API error: validation failed"));

    await expect(
      searchFilesImpl({ query: "invalid query syntax", searchIn: "all" })
    ).rejects.toThrow(
      'GitHub search query invalid: "invalid query syntax in:file,path repo:test-owner/test-repo". Try simpler terms or check syntax.'
    );
  });

  it("should provide enhanced error message for rate limits", async () => {
    mockSearchCode.mockRejectedValue(new Error("GitHub API error: rate limit exceeded"));

    await expect(
      searchFilesImpl({ query: "test", searchIn: "all" })
    ).rejects.toThrow(
      "GitHub code search rate limit exceeded. Wait a moment and try again."
    );
  });

  it("should provide enhanced error message for forbidden access", async () => {
    mockSearchCode.mockRejectedValue(new Error("GitHub API error: Forbidden"));

    await expect(
      searchFilesImpl({ query: "test", searchIn: "all" })
    ).rejects.toThrow(
      "GitHub API access denied. Check that your token has 'repo' scope for private repositories."
    );
  });

  it("should provide enhanced error message for 401 unauthorized", async () => {
    mockSearchCode.mockRejectedValue(new Error("GitHub API error: 401 Unauthorized"));

    await expect(
      searchFilesImpl({ query: "test", searchIn: "all" })
    ).rejects.toThrow(
      "GitHub API access denied. Check that your token has 'repo' scope for private repositories."
    );
  });

  it("should run diagnostics and provide detailed response when no results found", async () => {
    // Mock search returning no results for main search
    mockSearchCode.mockResolvedValueOnce({
      data: {
        total_count: 0,
        items: [],
      },
    });

    // Mock repository info for diagnostics
    mockReposGet.mockResolvedValue({
      data: {
        size: 10240, // 10 MB in KB
        private: false,
        default_branch: "main",
      },
    });

    // Mock diagnostic search returning some results (so repo is considered indexed)
    mockSearchCode.mockResolvedValueOnce({
      data: {
        total_count: 5,
        items: [],
      },
    });

    const result = await searchFilesImpl({ query: "nonexistent", searchIn: "all" });
    const text = result.content[0].text;

    expect(text).toContain('Found 0 files matching "nonexistent"');
    expect(text).toContain("📊 **Search Debug Info**:");
    expect(text).toContain("Repository: Public");
    expect(text).toContain("Default branch: main (only branch searchable)");
    expect(text).toContain("Files in repo: 5 found");
    expect(text).toContain("💡 **Search Tips:**");
  });

  it("should handle diagnostics failure gracefully when no results found", async () => {
    // Mock search returning no results
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 0,
        items: [],
      },
    });

    // Mock diagnostics failure
    mockReposGet.mockRejectedValue(new Error("Diagnostic failure"));

    const result = await searchFilesImpl({ query: "test", searchIn: "all" });
    const text = result.content[0].text;

    expect(text).toContain('Found 0 files matching "test"');
    expect(text).toContain("⚠️ **Search System Issue**: GitHub API error: Diagnostic failure");
  });

  it("should detect unindexed repository when no results found", async () => {
    // Mock search returning no results
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 0,
        items: [],
      },
    });

    // Mock repository info for diagnostics
    mockReposGet.mockResolvedValue({
      data: {
        size: 1024, // 1 MB in KB
        private: true,
        default_branch: "develop",
      },
    });

    // Mock diagnostic search also returning no results (unindexed repo)
    mockSearchCode
      .mockResolvedValueOnce({
        data: { total_count: 0, items: [] },
      })
      .mockRejectedValueOnce(new Error("Search failed"));

    const result = await searchFilesImpl({ query: "test", searchIn: "content" });
    const text = result.content[0].text;

    expect(text).toContain("⚠️ **Repository May Not Be Indexed**");
    expect(text).toContain("This can happen with:");
    expect(text).toContain("Private repositories with indexing issues");
    expect(text).toContain("Use the diagnoseSearch tool for detailed diagnostics");
  });

  it("should handle empty query correctly", async () => {
    // Mock search returning results for empty query
    mockSearchCode.mockResolvedValue({
      data: {
        total_count: 3,
        items: [
          { name: "file1.md", path: "docs/file1.md" },
          { name: "file2.md", path: "docs/file2.md" },
          { name: "file3.md", path: "notes/file3.md" },
        ],
      },
    });

    const result = await searchFilesImpl({ query: "", searchIn: "all" });
    const text = result.content[0].text;

    expect(text).toContain("Found 3 files:");
    expect(text).toContain("file1.md");
    expect(text).toContain("file2.md");
    expect(text).toContain("file3.md");
  });

  it("should detect large repository in diagnostics", async () => {
    // Mock search returning no results
    mockSearchCode.mockResolvedValueOnce({
      data: { total_count: 0, items: [] },
    });

    // Mock large repository (60 GB)
    mockReposGet.mockResolvedValue({
      data: {
        size: 60 * 1024 * 1024, // 60 GB in KB
        private: false,
        default_branch: "main",
      },
    });

    // Mock diagnostic search failing (unindexed due to size)
    mockSearchCode.mockRejectedValueOnce(new Error("Repository too large"));

    const result = await searchFilesImpl({ query: "test", searchIn: "all" });
    const text = result.content[0].text;

    expect(text).toContain("⚠️ **Repository May Not Be Indexed**");
    expect(text).toContain("Large repositories (60.00 GB exceeds 50 GB limit)");
  });
});
