---
argument-hint: "<task-ids> --loom=<url> [--time=<minutes>] [--timestamp=<dd/mm/yyyy-hh:mm-hh:mm>] [--base-branch=<branch>]"
description: "Perform comprehensive code review on changed files, implement fixes, create PR, and update ClickUp tasks"
---

You are an AI assistant tasked with performing a comprehensive code review on changed files, implementing approved fixes, and delivering the changes via PR with full ClickUp integration. This command handles multiple ClickUp tasks simultaneously.

**ARGUMENT PARSING:**

Parse arguments from:
<arguments>
$ARGUMENT
</arguments>

Supported argument formats:
1. Space-separated task IDs (first N arguments without flags)
2. `--loom=<url>` - Loom video URL (REQUIRED)
3. `--time=<minutes>` - Time spent in minutes (OPTIONAL)
4. `--timestamp=<dd/mm/yyyy-hh:mm-hh:mm>` - Time tracking timestamp (OPTIONAL)
5. `--base-branch=<branch>` - Base branch for PR, default: master (OPTIONAL)

**Examples:**
```
/code-review-and-deliver 86d0ubdn3 --loom=https://loom.com/share/abc123
/code-review-and-deliver 86d0ubdn3 86d0ubdn4 --loom=https://loom.com/share/abc123 --time=120
/code-review-and-deliver 86d0ubdn3 --loom=https://loom.com/share/abc123 --timestamp=15/01/2025-10:00-12:00 --base-branch=dev
```

---

## WORKFLOW STEPS

### 0. LOAD CLICKUP CREDENTIALS

**Load credentials from secure config file:**
```bash
cat .claude/config/clickup-secrets.json
```

Parse the JSON to extract:
- `apiKey` - ClickUp API key for direct API calls
- `channelId` - ClickUp channel ID for notifications
- `defaultUser` - User details object containing:
  - `id` - User ID
  - `email` - User email
  - `username` - Display name
  - `color` - User color hex
  - `initials` - User initials
  - `timezone` - User timezone

**Error handling:**
- If file doesn't exist: Exit with error "ClickUp credentials not found. Please create .claude/config/clickup-secrets.json from the example file."
- If JSON is invalid: Exit with parsing error
- If required fields missing: Exit with validation error

**Store these values for use in later steps** (API calls, channel notifications, etc.)

### 1. PARSE AND VALIDATE ARGUMENTS

Extract:
- All task IDs (everything before first `--` flag)
- Loom URL (required, fail if not provided)
- Time tracking minutes (optional)
- Timestamp (optional)
- Base branch (optional, default: master)

Display parsed arguments to user for confirmation.

### 2. FETCH ALL CLICKUP TASKS

For each task ID:
- Use `mcp__clickup__get_task` to fetch task details
- Extract: task ID, name, description, status, assignees
- Store all task information

Display all fetched tasks in a summary table:
```
📋 Tasks to Review:
┌─────────────┬──────────────────────────────┬────────────┐
│ Task ID     │ Task Name                    │ Status     │
├─────────────┼──────────────────────────────┼────────────┤
│ 86d0ubdn3   │ Add configuration system     │ In Progress│
│ 86d0ubdn4   │ Fix memory leak in observer  │ To Do      │
└─────────────┴──────────────────────────────┴────────────┘
```

### 3. IDENTIFY CHANGED FILES

**Run git status to get list of modified files:**
```bash
git status --short
```

Parse output to get list of changed files. Display:
```
📂 Changed Files to Review:
• config.js (new file)
• main.js (modified)
• addDynamicClass.js (modified)
• .claude/CLAUDE.md (modified)

Total: 4 files
```

**IMPORTANT**: Code review will ONLY be performed on these changed files, not the entire codebase.

### 4. COMPREHENSIVE CODE REVIEW (CHANGED FILES ONLY)

Perform automated code review on ONLY the changed files, checking for:

**A. Console.log Statements**
- Search changed files for `console.log(` statements
- Exclude: `console.warn`, `console.error`, `console.info`, `console.dir`, `console.table`
- List file paths and line numbers

**B. Memory Leaks**
- Event listeners without cleanup
- Timers (setTimeout, setInterval) without clearTimeout/clearInterval
- DOM references not cleared
- MutationObserver instances without disconnect
- Global variables accumulating data
- Circular references

**C. Logic Optimization Opportunities**
- Redundant computations
- Unnecessary loops or iterations
- Inefficient data structures
- Repeated DOM queries
- Missing memoization opportunities
- Redundant conditional checks

**D. Potential CodeQL Issues**
- Unsafe use of innerHTML/outerHTML
- Missing input validation/sanitization
- Prototype pollution risks
- XSS vulnerabilities
- CORS misconfigurations
- Hardcoded secrets or tokens
- Missing error handling
- Resource leaks

### 5. PRESENT REVIEW FINDINGS

Display findings in numbered, grouped format:

```
🔍 CODE REVIEW RESULTS (Changed Files Only)
═══════════════════════════════════════════════════════════

📊 SUMMARY:
• Console.log statements: 12 found
• Memory leak risks: 3 found
• Optimization opportunities: 8 found
• CodeQL potential issues: 2 found

───────────────────────────────────────────────────────────

🟡 1. CONSOLE.LOG STATEMENTS (12 total)
───────────────────────────────────────────────────────────

  [1.1] main.js:69 - console.log('ZERO CSS: Loaded configuration...')
  [1.2] main.js:88 - console.log('ZERO CSS: Development environment...')
  [1.3] main.js:93 - console.log('ZERO CSS: Production environment...')
  [1.4] main.js:130 - console.log('ZERO CSS: Processing selector class...')
  [1.5] main.js:137 - console.log('ZERO CSS: Processing class...')
  [1.6] main.js:145 - console.log('ZERO CSS: Total classes processed...')
  [1.7] main.js:165 - console.log('ZERO CSS: Starting observation on...')
  [1.8] main.js:182 - console.log('ZERO CSS: Stopped observation')
  [1.9] addDynamicClass.js:33 - console.log(`ZERO CSS: Generating class...`)
  [1.10] addDynamicClass.js:196 - console.log(`ZERO CSS: No handler found...`)
  [1.11] config.js:217 - console.log('ZERO CSS: Configuration updated...')
  [1.12] config.js:348 - console.log(`ZERO CSS: Applied "${presetName}" preset`)

🔴 2. MEMORY LEAK RISKS (3 total)
───────────────────────────────────────────────────────────

  [2.1] main.js:155 - MutationObserver created but no cleanup in stopObserving()
       Issue: Observer is disconnected but not dereferenced
       Risk: Medium - Can accumulate in long-running SPAs
       Fix: Set observer to null after disconnect

  [2.2] main.js:8 - Set 'classNames' grows indefinitely
       Issue: No cleanup mechanism for old/unused class names
       Risk: Low - Grows slowly but unbounded
       Fix: Add size limit or periodic cleanup

  [2.3] main.js:170 - Toggle class mutation triggers observer
       Issue: Self-triggering mutation can cause issues
       Risk: Low - Controlled but unnecessary
       Fix: Remove self-mutation or ignore in observer

🟢 3. OPTIMIZATION OPPORTUNITIES (8 total)
───────────────────────────────────────────────────────────

  [3.1] main.js:24 - Redundant classList.forEach in getAllClassNames()
       Current: Iterates classList then recurses children
       Optimization: Use TreeWalker API for better performance
       Benefit: ~20-30% faster for large DOMs

  [3.2] main.js:124-142 - Iterating Set with manual index tracking
       Current: Uses forEach with manual idx++ counter
       Optimization: Use Array.from().slice() or Set iterator
       Benefit: Cleaner code, avoid index drift

  [3.3] addDynamicClass.js:28 - className.split("-") called once
       Current: Single split operation
       Optimization: None needed - already optimized
       Benefit: N/A

  [3.4] addDynamicClass.js:37-192 - Long if-else chain for routing
       Current: Sequential regex tests
       Optimization: Use Map lookup or switch with fallthrough
       Benefit: O(1) vs O(n) lookup time

  [3.5] config.js:203 - Object.keys().forEach() double iteration
       Current: Gets keys then iterates
       Optimization: Use Object.entries() directly
       Benefit: Single iteration, cleaner code

  [3.6] config.js:173-180 - Validator lookup in hot path
       Current: Looks up validator on every config change
       Optimization: Cache validator or use WeakMap
       Benefit: Marginal - not a bottleneck

  [3.7] main.js:127 - Regex test executed on every class
       Current: /^__/.test(className) per class
       Optimization: Check first two chars: className[0]+className[1]==='__'
       Benefit: ~5x faster than regex

  [3.8] main.js:114 - Recursive getAllClassNames creates many frames
       Current: Depth-first recursion
       Optimization: Use iterative approach with stack
       Benefit: Avoid stack overflow on deeply nested DOM

🔴 4. CODEQL POTENTIAL ISSUES (2 total)
───────────────────────────────────────────────────────────

  [4.1] config.js:95-104 - Unsafe sanitization config options
       Issue: sanitizeSelectors and sanitizeValues can be disabled
       Risk: High - Allows CSS injection if user-controlled input
       Fix: Remove ability to disable or add warning docs
       CodeQL: CWE-79 (XSS), CWE-74 (Injection)

  [4.2] main.js:39 - Script tag attribute parsing trusts input
       Issue: Parses data attributes without validation
       Risk: Low-Medium - Only affects same-origin scripts
       Fix: Add whitelist of allowed config keys
       CodeQL: CWE-915 (Improperly Controlled Modification)

═══════════════════════════════════════════════════════════
```

### 6. USER SELECTION OF FIXES

Prompt user:
```
Please select which issues to fix using their numbers.
You can specify:
- Individual items: 1.1, 1.2, 2.1
- Entire groups: 1, 2
- Ranges: 1.1-1.5
- Combinations: 1, 2.1, 3.4-3.7

Enter your selection (or 'all' for everything):
```

Parse user input and create fix list. Display confirmation:
```
✅ Selected fixes:
• All console.log statements (12 items)
• Memory leak: MutationObserver cleanup (1 item)
• Optimization: if-else to Map routing (1 item)

Total: 14 fixes to implement
```

### 7. IMPLEMENT APPROVED FIXES

For each selected fix:
- Read the relevant file
- Apply the fix using Edit tool
- Add inline comment explaining the change if complex
- Track all modified files

**IMPORTANT**:
- Only implement fixes that were explicitly approved
- Do not change logic or behavior beyond the specific fix
- Preserve existing code style and formatting
- Test regex patterns before applying

Display progress:
```
🔧 Implementing fixes...

[1/14] Removing console.log at main.js:69 ✓
[2/14] Removing console.log at main.js:88 ✓
[3/14] Removing console.log at main.js:93 ✓
...
[14/14] Adding MutationObserver cleanup ✓

✅ All fixes implemented successfully
```

### 8. SUGGEST BRANCH NAMES

Generate 5 contextual branch names based on tasks and fixes:

```
🌿 Suggested branch names:

1. fix/code-review-cleanup-86d0ubdn3-86d0ubdn4
2. refactor/remove-console-logs-and-optimize
3. fix/memory-leaks-and-logging-cleanup
4. chore/code-quality-improvements-multi-task
5. fix/review-fixes-configuration-observer

Enter the number (1-5) or provide a custom branch name:
```

Wait for user selection.

### 9. SUGGEST COMMIT MESSAGES

Generate 5 commit message options following the project's convention:

```
📝 Suggested commit messages:

1. Fix/86d0ubdn3: Code review fixes - remove logs, fix memory leaks

2. Refactor: Remove console.logs and optimize observer cleanup

3. Fix/multi: Address code review findings across configuration system
   - Remove 12 console.log statements
   - Fix MutationObserver memory leak
   - Optimize class name routing logic

4. Chore: Code quality improvements from review
   - Clean up debug logging
   - Prevent observer memory leaks
   - Optimize performance bottlenecks

5. Fix/86d0ubdn3-86d0ubdn4: Implement code review recommendations

Enter the number (1-5) or provide a custom commit message:
```

Wait for user selection or custom message.

### 10. GIT OPERATIONS

**A. Check Current Status**
- Run `git status` to see current branch and changes
- Verify not on master/main branch directly

**B. Create Branch**
- Create new branch with selected name
- Checkout the branch

**C. Stage and Commit**
- Stage all modified files: `git add .`
- Show files to be committed
- Commit with selected message format:
  ```
  [First line from selected message]

  Fixes implemented:
  • [List key fixes]
  • [Group similar fixes]

  Resolves ClickUp tasks: [task-id-1], [task-id-2]

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

**D. Push to Remote**
- Push branch to origin: `git push -u origin [branch-name]`
- Capture any errors

### 11. CREATE PULL REQUEST

Create PR using `gh pr create`:

**PR Title**: Use commit message first line

**PR Body** (SIMPLIFIED FORMAT):
```markdown
## Task

1. https://app.clickup.com/t/[task-id-1]
2. https://app.clickup.com/t/[task-id-2]
3. https://app.clickup.com/t/[task-id-3]

## Loom

[loom-url]
```

**IMPORTANT**:
- Only include Task section with numbered ClickUp URLs
- Only include Loom section with the video URL
- No additional descriptions, summaries, or sections
- Each task URL on a new numbered line
- Simple, clean format

**Base Branch**: Use provided base branch or default to `master`

Capture PR URL from output.

### 12. UPDATE CLICKUP TASKS

For each task ID:

**A. Add Comment with PR and Loom Links**

Use `mcp__clickup__create_task_comment` with the following structure:

```json
{
    "comment": [
        {
            "text": "PR: ",
            "attributes": {}
        },
        {
            "type": "link_mention",
            "link_mention": {
                "url": "https://github.com/Arka102202/zero-css/pull/8"
            },
            "text": ""
        },
        {
            "text": " ",
            "attributes": {}
        },
        {
            "text": "\n",
            "attributes": {
                "block-id": "block-7ffb7f56-b37e-431f-a977-e12a74549952"
            }
        },
        {
            "text": "Loom: ",
            "attributes": {}
        },
        {
            "type": "link_mention",
            "link_mention": {
                "url": "https://www.loom.com/share/1b1e31c22751462788551ff3859bd967"
            },
            "text": ""
        },
        {
            "text": " ",
            "attributes": {}
        }
    ],
    "send_reply_to_channel": false,
    "attachment": []
}
```

**IMPORTANT**:
- Replace PR URL with actual PR URL
- Replace Loom URL with provided Loom URL
- Use unique block-id for newline (generate random UUID)
- Keep structure exactly as shown

**B. Add Time Tracking (if provided)**

If `--time` or `--timestamp` was provided:
- Use `mcp__clickup__add_time_entry` for each task
- If timestamp provided: parse start/end times and calculate duration
- If only minutes provided: use current time as end, calculate start
- Add description: "Code review and fixes implementation"

**C. Update Task Status**

- Update status to "PEER REVIEW" using `mcp__clickup__update_task`
- Add tag "adom-assisted" if not present

### 13. SEND CHANNEL NOTIFICATION

**Use credentials loaded from Step 0:**
- Channel ID: Use `channelId` from secrets file
- API Key: Use `apiKey` from secrets file
- User details: Use `defaultUser` object from secrets file

Send message to ClickUp channel using:
`POST https://api.clickup.com/api/v2/chat/{channelId}/message`

Headers:
```
Authorization: {apiKey}
Content-Type: application/json
```

Message structure:
```json
[
    {
        "text": "Hello ",
        "attributes": {}
    },
    {
        "type": "tag",
        "user": {
            "id": {defaultUser.id},
            "color": "{defaultUser.color}",
            "email": "{defaultUser.email}",
            "initials": "{defaultUser.initials}",
            "username": "{defaultUser.username}",
            "timezone": "{defaultUser.timezone}",
            "profileInfo": {
                "status": {}
            },
            "isDeactivated": false
        },
        "text": "@{defaultUser.username}"
    },
    {
        "text": " ",
        "attributes": {}
    },
    {
        "text": "\n",
        "attributes": {
            "block-id": "block-f9ee3acc-025a-475e-b72d-a52974b97354"
        }
    },
    {
        "text": "I have completed a comprehensive code review and implemented the approved fixes.",
        "attributes": {}
    },
    {
        "text": "\n",
        "attributes": {
            "block-id": "block-c89f16e1-a9cc-4e4b-bb99-5d58225f8765"
        }
    },
    {
        "text": "Could you please review my PR and merge it?",
        "attributes": {}
    },
    {
        "text": "\n",
        "attributes": {
            "block-id": "block-da4f1b99-4c0a-463e-8d5b-177ba4b5e0ed"
        }
    },
    {
        "text": "\n",
        "attributes": {
            "block-id": "block-17ac1015-e8ea-41cc-a169-c0e4609be980"
        }
    },
    {
        "text": "PR: ",
        "attributes": {}
    },
    {
        "type": "link_mention",
        "link_mention": {
            "width": "19",
            "url": "https://github.com/Arka102202/zero-css/pull/8"
        },
        "text": ""
    },
    {
        "text": " ",
        "attributes": {}
    },
    {
        "text": "\n",
        "attributes": {
            "block-id": "block-3b003720-a3d4-4abb-8491-3b1f7477f096"
        }
    },
    {
        "text": "Task: ",
        "attributes": {}
    },
    {
        "type": "task_mention",
        "task_mention": {
            "task_id": "86d0ubdn3"
        },
        "text": "86d0ubdn3"
    },
    {
        "text": "\n",
        "attributes": {
            "block-id": "block-4ee8a99f-2c60-48c3-b39e-da6e862f7a2b"
        }
    },
    {
        "text": "Loom: ",
        "attributes": {}
    },
    {
        "type": "link_mention",
        "link_mention": {
            "width": "67.57142857142857",
            "url": "https://www.loom.com/share/1b1e31c22751462788551ff3859bd967"
        },
        "text": ""
    },
    {
        "text": " ",
        "attributes": {}
    }
]
```

**IMPORTANT Message Customization**:
- User details: Populated from `defaultUser` in secrets file
- Line 2 (block-f9ee...): Change message to describe the work done
- Line 3 (block-c89f...): Keep review request or customize
- PR URL: Update with actual PR URL
- Task mentions: Add multiple task_mention blocks if multiple tasks (one per task)
- Loom URL: Update with provided Loom URL
- Generate unique block-id values (UUIDs) for each newline
- All {placeholder} values should be replaced with actual values from secrets file

---

## FINAL OUTPUT FORMAT

```
<output>
═══════════════════════════════════════════════════════════
🔍 CODE REVIEW AND DELIVERY COMPLETE
═══════════════════════════════════════════════════════════

0. 🔐 CREDENTIALS LOADED
───────────────────────────────────────────────────────────
   • Source: .claude/config/clickup-secrets.json
   • API Key: Loaded ✓
   • Channel ID: Loaded ✓
   • User details: Loaded ✓

1. 📋 TASKS REVIEWED
───────────────────────────────────────────────────────────
   • Task 1: [task-id] - [task-name]
   • Task 2: [task-id] - [task-name]
   Total: [N] tasks

2. 📂 CHANGED FILES REVIEWED
───────────────────────────────────────────────────────────
   [List of changed files]
   Total: [N] files

3. 🔍 REVIEW FINDINGS
───────────────────────────────────────────────────────────
   • Console.log statements: [N] found
   • Memory leak risks: [N] found
   • Optimization opportunities: [N] found
   • CodeQL potential issues: [N] found
   Total issues: [N]

4. ✅ FIXES IMPLEMENTED
───────────────────────────────────────────────────────────
   User selected: [N] fixes

   [List of implemented fixes grouped by category]

   Files modified: [N]
   [List files]

5. 🌿 GIT OPERATIONS
───────────────────────────────────────────────────────────
   • Branch created: [branch-name]
   • Files staged: [N] files
   • Commit hash: [hash]
   • Commit message: [first line]
   • Push status: ✓ Success

6. 🔗 PULL REQUEST
───────────────────────────────────────────────────────────
   • PR #[number]: [pr-url]
   • Title: [pr-title]
   • Base branch: [master/dev/custom]
   • Body format: Task URLs + Loom URL only
   • Status: ✓ Created

7. 📝 CLICKUP UPDATES
───────────────────────────────────────────────────────────
   For each task:

   Task [task-id]:
   • Status updated: PEER REVIEW ✓
   • Tag "adom-assisted" added: [yes/no/already-present]
   • PR link comment added: ✓
   • Loom link comment added: ✓
   [if time tracking]
   • Time tracked: [N] minutes ✓
   • Timestamp: [timestamp] ✓

8. 💬 CHANNEL NOTIFICATION
───────────────────────────────────────────────────────────
   • Channel: [channelId from secrets]
   • Message sent: ✓
   • Tagged: @[username from secrets]
   • PR link included: ✓
   • Task mentions: [N] tasks
   • Loom link included: ✓

═══════════════════════════════════════════════════════════

✅ SUMMARY
───────────────────────────────────────────────────────────
• Code review completed on [N] changed files
• [N] fixes implemented across [N] files
• Branch pushed and PR created
• [N] ClickUp tasks updated to PEER REVIEW
• Team notified via channel

🎯 NEXT STEPS
───────────────────────────────────────────────────────────
1. Wait for peer review on PR #[number]
2. Address any review comments if needed
3. Merge PR once approved
4. ClickUp tasks will auto-close on merge

═══════════════════════════════════════════════════════════
</output>
```

---

## ERROR HANDLING

- If credentials file not found: Exit with error "ClickUp credentials not found. Please create .claude/config/clickup-secrets.json from clickup-secrets.example.json"
- If credentials JSON invalid: Exit with parsing error and file location
- If Loom URL not provided: Exit with error message
- If no task IDs provided: Exit with error message
- If no changed files found: Exit with message
- If ClickUp task fetch fails: Skip that task, continue with others
- If git push fails: Do not create PR or update ClickUp
- If PR creation fails: Still update ClickUp with note about manual PR needed
- If ClickUp update fails: Log error but continue (non-blocking)
- If channel message fails: Log error but continue (non-blocking)

## IMPORTANT NOTES

- **Load credentials from .claude/config/clickup-secrets.json at the start**
- **ONLY review changed files, not entire codebase**
- Always show review findings to user before implementing any fixes
- Never implement fixes that weren't explicitly approved
- Keep original code style and formatting
- Generate unique block-id values for ClickUp messages (use UUID format)
- Use exact JSON structure for ClickUp comments and channel messages
- **Replace all {placeholder} values with actual values from secrets file**
- **PR body must be simple: only Task URLs and Loom URL**
- Verify all URLs before sending to ClickUp
- Handle multiple tasks gracefully (loop through each)
- Time tracking is optional - only add if provided
- Never log or display full API keys (mask them)

Ensure that your final output contains only the information specified in the <output> format above. Do not include any additional explanations or steps in your final output.
