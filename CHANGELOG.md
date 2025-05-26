# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-05-26

### Added

- **New Tool: `getCommitHistory`** - Get commit history and file changes/diffs for the last X days
  - Diff-focused approach with `includeDiffs: true` by default
  - Rich commit metadata with GitHub URLs for linking
  - Author filtering and pagination support
  - Performance-balanced defaults (25 max commits, 8000 char diff limit)
  - Comprehensive error handling and input validation

### Changed

- Updated documentation with commit history tool examples and usage patterns
- Added new examples directory with detailed commit history examples
- Enhanced getting started guide with commit history workflows

### Documentation

- Added `docs/examples/commit-history-examples.md` with comprehensive usage examples
- Updated all documentation files to include the new tool
- Added testing guidelines for the commit history tool
- Updated contributing guidelines with commit history tool considerations

## [0.1.1] - Previous Release

### Features

- GitHub repository search functionality
- File content retrieval
- Issue search capabilities
- Type-safe implementation with Zod validation
- Rate limiting and error handling
