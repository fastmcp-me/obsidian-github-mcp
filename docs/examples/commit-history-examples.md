---
title: Commit History Tool Examples
description: Detailed examples of using the getCommitHistory tool
---

# Commit History Tool Examples

This document provides detailed examples of how to use the `getCommitHistory` tool effectively.

## Basic Usage

### Get Recent Commits (Simple)

```typescript
{
  name: 'getCommitHistory',
  arguments: {
    days: 7
  }
}
```

**Expected Output:**

```
Found 15 commits in the last 7 days:

## Commit a1b2c3d (a1b2c3d4e5f6789abc123...)
**Fix authentication bug in login module**
Author: jane.doe@example.com
Date: 2024-01-15T10:30:00Z
URL: https://github.com/owner/repo/commit/a1b2c3d4e5f6789abc123...

### Files Changed (3):
- src/auth/login.ts (+15, -8)
- tests/auth.test.ts (+12, -2)
- docs/auth.md (+3, -1)

### File Changes:
[Detailed diffs for each file showing actual code changes...]

## Commit d4e5f6g (d4e5f6g7h8i9012def...)
**Add new user dashboard component**
Author: john.smith@example.com
Date: 2024-01-14T15:45:00Z
URL: https://github.com/owner/repo/commit/d4e5f6g7h8i9012def...

### Files Changed (5):
[Similar format with actual diffs...]
```

## Advanced Usage

### Get Commits without Diffs (Metadata Only)

```typescript
{
  name: 'getCommitHistory',
  arguments: {
    days: 3,
    includeDiffs: false,
    maxCommits: 10
  }
}
```

### Filter by Author

```typescript
{
  name: 'getCommitHistory',
  arguments: {
    days: 30,
    author: "jane.doe",
    maxCommits: 25
  }
}
```

### Pagination Example

```typescript
// Get first page
{
  name: 'getCommitHistory',
  arguments: {
    days: 30,
    maxCommits: 20,
    page: 0
  }
}

// Get second page
{
  name: 'getCommitHistory',
  arguments: {
    days: 30,
    maxCommits: 20,
    page: 1
  }
}
```

## Use Cases

### Code Review Preparation

Get recent commits with diffs to prepare for code reviews.

### Release Notes Generation

Collect commits from the last release cycle to generate release notes.

### Developer Activity Tracking

Monitor individual developer contributions over time periods.

### Debugging Investigation

Review recent changes when investigating bugs or issues.

## Performance Considerations

### Recommended Settings by Use Case

| Use Case         | Days | Max Commits | Include Diffs | Expected API Calls |
| ---------------- | ---- | ----------- | ------------- | ------------------ |
| Daily Standup    | 1    | 10          | true          | 11 calls           |
| Code Review      | 3    | 15          | true          | 16 calls           |
| Sprint Review    | 7    | 25          | true          | 26 calls           |
| Release Planning | 30   | 50          | true          | 51 calls           |
| Quick Overview   | 7    | 50          | false         | 1 call             |

### API Rate Limiting Tips

1. **Start Small**: Begin with lower `maxCommits` values
2. **Use Author Filtering**: Reduce scope with `author` parameter
3. **Disable Diffs When Appropriate**: Set `includeDiffs: false` for quick overviews
4. **Monitor Usage**: Track your API usage to stay within limits

## Real-World Examples

### Daily Development Review

```typescript
// See what happened yesterday
{
  name: 'getCommitHistory',
  arguments: {
    days: 1,
    maxCommits: 20
  }
}
```

### Bug Investigation

```typescript
// Check recent changes from a specific developer
{
  name: 'getCommitHistory',
  arguments: {
    days: 7,
    author: "developer-who-might-have-introduced-bug",
    maxCommits: 30
  }
}
```

### Release Documentation

```typescript
// Gather all changes for release notes
{
  name: 'getCommitHistory',
  arguments: {
    days: 14,  // Since last release
    maxCommits: 50
  }
}
```

### Performance Monitoring

```typescript
// Quick commit count without diffs
{
  name: 'getCommitHistory',
  arguments: {
    days: 30,
    includeDiffs: false,
    maxCommits: 100
  }
}
```
