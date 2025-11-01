---
argument-hint: "<task-id> [description/loom-url]"
description: "Commit changes, create PR, and update ClickUp task status to PEER REVIEW (supports optional Loom video links)"
---

You are an AI assistant tasked with finalizing a completed ClickUp task by handling git operations and updating task status. This command should be used AFTER the code implementation is complete (e.g., after running /perform-task).

**IMPORTANT SAFEGUARDS TO PREVENT MIXED COMMITS:**

- Always check if current branch has commits for OTHER tasks before proceeding
- Warn user and offer to create clean branch if mixed commits are detected
- Show all files that will be committed before staging
- Always include task ID in branch name for tracking
- Verify branch is based on latest dev code

Follow these steps carefully:

1. Parse the arguments:
   Extract the task ID, optional commit message, and optional Loom video link from:
   <arguments>
   $ARGUMENT
   </arguments>

   The first argument is always the task ID.
   Everything after the first space is treated as a custom commit message (optional).

   **Loom Link Detection**:
   - Check if the description contains a Loom video URL
   - Loom URLs typically match patterns like:
     - https://www.loom.com/share/{video-id}
     - https://loom.com/share/{video-id}
   - Extract the Loom URL if present
   - Remove the Loom URL from the description text (it will be added separately)

2. Fetch the ClickUp task:
   Use the task ID to fetch the task details with the mcp**clickup**get_task tool.

   Analyze the task and extract the following information:
   - Task ID
   - Task name
   - Task description
   - Current task status

3. Check current git status:
   - Determine the current branch name
   - Check if there are any uncommitted changes
   - Verify we're not on dev or main branch (those should never be committed to directly)

4. **IMPORTANT: Verify branch cleanliness and prevent mixed commits:**

   a. Check for existing commits not in dev:
   - Run: `git log dev..HEAD --oneline`
   - If there are commits:
     - List all commits found
     - Check if ANY commit is for a DIFFERENT task ID (not matching current task)
     - **If mixed commits found:**
       - ⚠️ **STOP and warn user:**
         "WARNING: Current branch contains commits for other tasks:
         [list commits with different task IDs]

         This will cause unrelated files to be included in the PR.

         RECOMMENDED ACTION: Create a fresh clean branch from dev.

         Do you want me to:
         1. Create a clean branch from dev with ONLY uncommitted changes
         2. Continue with current branch (will include ALL commits - NOT RECOMMENDED)

         Please confirm before proceeding."

       - WAIT for user confirmation
       - If user chooses option 1: Create clean branch (see step 4b)
       - If user chooses option 2: Continue but warn again about consequences

     - **If all commits are for the SAME task ID:**
       - Continue safely (branch is clean)

   - If no commits (branch is same as dev):
     - Branch is clean, continue

   b. Verify or create task-specific branch:
   - Check if current branch name contains the task ID
   - If NOT on a task-specific branch OR user requested clean branch:
     - First, pull latest code from dev branch:
       - Checkout dev branch: `git checkout dev`
       - Pull latest changes: `git pull origin dev`
       - This ensures the new branch is based on the most recent code
     - Determine task type from task name:
       - If task name starts with "[FE]" or contains "fix", "bug", or "issue": use "fix/" prefix
       - Otherwise: use "feature/" prefix
     - Generate branch name: "[prefix]/[brief-description]-[task-id]"
       - MUST include task ID at the end for tracking
       - Use task name to generate brief description (lowercase, hyphenated, max 4-5 words)
       - Example: "feature/integrate-socket-io-868fxvxn7" or "fix/login-button-error-868abc123"
     - Create and checkout the new branch from dev
     - Inform user: "Created clean branch from dev: [branch-name]"
   - If already on a branch containing the task ID AND branch is clean:
     - Continue with existing branch
     - Inform user: "Using existing clean task branch: [branch-name]"
   - If on dev or main branch:
     - ERROR: Cannot commit directly to dev/main. Create task-specific branch first.

5. **Review and confirm files before staging:**
   - Run: `git status --short` to see all modified files
   - Display the list of files to the user:
     "The following files will be committed:
     [list all modified files]

     Total: [X] files"

   - If the number of files seems excessive (>10 files) or includes unrelated files:
     - ⚠️ WARN: "This seems like a lot of files. Please verify these are all related to task [task-id]"

6. Stage and commit changes:
   - Stage all modified files (git add)
   - Create a commit message with the NEW format:
     Format: "Feat/Fix/[task-id]: [short-description]"

     Rules:
     - Use "Feat" if task is a new feature (default)
     - Use "Fix" if task name contains "fix", "bug", or "issue"
     - Task ID comes immediately after Feat/Fix prefix
     - Short description should be task name without prefixes like [FE], [BE], etc. (max 50 chars)

     Examples:
     - "Feat/868fxvxn7: Integrate Socket.IO context"
     - "Fix/868abc123: Login button alignment issue"

     Full commit message body:
     - Line 1: "Feat/Fix/[task-id]: [short-description]"
     - Line 2: Empty line
     - Line 3+: Bullet points of key changes
     - Last lines:
       "Resolves ClickUp task: [task-id]

       🤖 Generated with [Claude Code](https://claude.com/claude-code)

       Co-Authored-By: Claude <noreply@anthropic.com>"

   - Commit the changes

7. Push branch to remote:
   - Push the current branch to origin
   - Set upstream if this is the first push

8. Create Pull Request:
   - Use the `gh` CLI tool to create a PR
   - Base branch: dev (NOT main)
   - PR title: Use the SAME format as commit message first line
     Format: "Feat/Fix/[task-id]: [short-description]"
     Examples:
     - "Feat/868fxvxn7: Integrate Socket.IO context"
     - "Fix/868abc123: Login button alignment issue"
   - PR description should include:
     - Brief description of changes
     - Reference to ClickUp task with URL: "Closes ClickUp task: [task-id] - [task-url]"
     - Task URL format: https://app.clickup.com/t/[task-id]
     - Any relevant implementation notes
     - End with Claude Code attribution
   - Capture the PR URL from the output

9. Update ClickUp task status and tags:
   - Use mcp**clickup**update_task to update the task status to "PEER REVIEW"
   - This indicates the task is ready for code review
   - Check if the task has the "adom-assisted" tag
   - If not present, add the "adom-assisted" tag to indicate AI assistance was used

10. Link PR (and optional Loom) to ClickUp task:

- Use mcp**clickup**create_task_comment to add a comment with the PR link and optional Loom video
- **IMPORTANT**: Use raw URLs (not markdown format) for better ClickUp compatibility
- Comment format depends on whether Loom link was provided:

**Without Loom video:**

```
[Description of what you have done]

PR: [PR-URL]
```

**With Loom video:**

```
[Description of what you have done]

PR: [PR-URL]
Loom: [Loom-URL]
```

- Description: Use the custom commit message if provided, otherwise use task name
- PR link: Use raw URL format (e.g., https://github.com/org/repo/pull/123)
- Loom link: Use raw URL format (e.g., https://www.loom.com/share/abc123def456)
- ClickUp will automatically make these URLs clickable

Examples:

Without Loom:

```
Integrated Socket.IO context for real-time updates

PR: https://github.com/org/repo/pull/123
```

With Loom:

```
Fixed authentication flow and added loading states

PR: https://github.com/org/repo/pull/456
Loom: https://www.loom.com/share/abc123def456
```

Your final output should be formatted as follows:

<output>
1. ClickUp Task Details:
   - Task ID: [task-id]
   - Task Name: [task-name]
   - Initial Status: [original-status]

2. Parsed Arguments:
   - Description: [description-if-provided]
   - Loom Video: [loom-url-if-provided / Not provided]

3. Git Operations:
   - Current Branch: [current-branch-name]
   - Feature Branch: [feature-branch-name]
   - Files Staged: [list-of-modified-files]
   - Commit Hash: [commit-hash]
   - Commit Message: [commit-message]

4. Remote Operations:
   - Branch Pushed: [branch-name]
   - Push Status: [success/failure]

5. Pull Request:
   - PR Title: [pr-title]
   - PR URL: [pr-url]
   - Base Branch: dev
   - Status: [created/failed]

6. ClickUp Updates:
   - Task Status Updated: PEER REVIEW
   - Tag "adom-assisted" Added: [yes/no/already-present]
   - Task Comment Added:

     ```
     [description]

     PR: [PR-URL]
     [if-loom] Loom: [Loom-URL]
     ```

7. Summary:
   ✅ Code committed successfully
   ✅ Branch pushed to remote
   ✅ PR created against dev branch
   ✅ ClickUp task updated to PEER REVIEW
   ✅ "adom-assisted" tag added to task
   ✅ PR link added to ClickUp task
   [if-loom] ✅ Loom video link added to ClickUp task

   Next Steps:
   - Wait for peer review
   - Address any review comments
   - Merge PR once approved
     </output>

IMPORTANT NOTES:

- If there are no uncommitted changes, inform the user and exit gracefully
- If the git push fails, do not proceed with PR creation or ClickUp updates
- If PR creation fails, still attempt to update ClickUp with a note about the failure
- Always verify the base branch is "dev" not "main"
- Handle errors gracefully and provide clear error messages

**Usage Examples:**

Basic usage (no description):

```
/deliver-task 868fxvxn7
```

With custom description:

```
/deliver-task 868fxvxn7 Fixed authentication flow and added loading states
```

With Loom video link in description:

```
/deliver-task 868fxvxn7 Fixed authentication flow and added loading states https://www.loom.com/share/abc123def456
```

The command will automatically:

1. Detect the Loom URL pattern in the description
2. Extract the Loom URL
3. Add it separately in the ClickUp comment as a raw URL
4. Remove the raw URL from the description text
5. ClickUp will automatically make the URLs clickable

**Loom Link Patterns Supported:**

- https://www.loom.com/share/{video-id}
- https://loom.com/share/{video-id}
- http://www.loom.com/share/{video-id}
- http://loom.com/share/{video-id}

Ensure that your final output contains only the information specified in the <output> format above. Do not include any additional explanations or steps in your final output.
