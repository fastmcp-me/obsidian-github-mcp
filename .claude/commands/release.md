You are an AI engineer tasked with creating a new version release for the project. Your goal is to analyze recent changes, bump the version, update the changelog, create a git tag, and publish a GitHub release. Follow these steps carefully:

1. Analyze recent changes since the last version:
   <release_type>
   $ARGUMENTS
   </release_type>

2. Review the current version in package.json and recent commits to understand what type of release this should be (patch, minor, or major) based on semantic versioning principles.

3. Create a comprehensive release plan including:
   <release_plan>
   Current Version: [Current version from package.json]
   New Version: [Proposed new version]
   Release Type: [patch/minor/major]
   Key Changes: [List of major changes since last version]
   </release_plan>

4. For version bumping and release creation:
   a. Update the version number in package.json
   c. Update CHANGELOG.md with comprehensive release notes including:

   - New features (### Added)
   - Improvements (### Improved)
   - Bug fixes (### Fixed)
   - Breaking changes if applicable (### Breaking Changes)

   **Note**: The changelog is user-facing and should focus on user benefits rather than technical implementation details. Write from the user's perspective, highlighting what they can do or experience differently. You may omit technical implementation details that don't directly impact the user experience.
   d. Commit all changes with a descriptive release commit message
   e. Create an annotated git tag for the version
   f. Push the commit and tags to the remote repository

5. Create a GitHub release:
   a. Use the git tag as the release version
   b. Generate comprehensive release notes from the changelog
   c. Include highlights of major features and improvements
   d. Use appropriate emoji and formatting for better readability
   e. Publish the release on GitHub

6. Verify the release:
   a. Confirm the version is updated in all relevant locations
   b. Verify the git tag was created and pushed successfully
   c. Check that the GitHub release is published and visible
   d. Ensure the changelog follows proper formatting and completeness

Your final output should include:

1. The release plan with version analysis
2. A summary of all files updated
3. The commit message used
4. The git tag created
5. A link to the published GitHub release

Format your final output as follows:
<release_output>
<release_plan>
[Your comprehensive release plan]
</release_plan>

<files_updated>
[List of files that were updated during the release process]
</files_updated>

<version_changes>
[Summary of version number changes made]
</version_changes>

<commit_details>
Commit Message: [The release commit message]
Git Tag: [The git tag created]
</commit_details>

<github_release>
Release URL: [Link to the published GitHub release]
Release Title: [The GitHub release title]
</github_release>

<verification_checklist>

- [ ] package.json version updated
- [ ] CHANGELOG.md updated with comprehensive notes
- [ ] Release commit created and pushed
- [ ] Git tag created and pushed
- [ ] GitHub release published
- [ ] All changes verified and functional
      </verification_checklist>
      </release_output>

Remember to follow semantic versioning principles:

- **Patch (x.x.X)**: Bug fixes and small improvements
- **Minor (x.X.x)**: New features that don't break existing functionality
- **Major (X.x.x)**: Breaking changes or major architectural updates

Wait for user confirmation before proceeding with each major step of the release process.
