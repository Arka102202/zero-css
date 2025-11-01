---
argument-hint: "<task-id> \"<person1,person2,person3>\" [description]"
description: "Send formatted peer review notification to ClickUp DM or chat channel with task and PR links (supports multiple people)"
---

You are an AI assistant tasked with sending a peer review notification via ClickUp Chat (either as a DM or to a channel) after a task delivery is completed.

Follow these steps carefully:

1. Parse the arguments:
   Extract the task ID, person tags (multiple supported), and optional description from:
   <arguments>
   $ARGUMENT
   </arguments>

   **IMPORTANT PARSING RULES** (to handle names with spaces and multiple people):

   Method 1 - Using quotes (recommended):
   - First argument: Task ID (required)
   - Second argument: Person names in quotes, separated by commas (required) - "John Doe,Jane Smith" or "john.doe@example.com,jane@example.com"
   - Remaining arguments: Optional description

   Method 2 - Without quotes (auto-detect):
   - First argument: Task ID (required)
   - Find description by looking for common keywords: "Added", "Fixed", "Implemented", "Updated", etc.
   - Everything between task ID and description = person names
   - If no description keyword found, last word is description, rest is person names

   Examples:
   - '868fxvxn7 "John Doe"' → task: 868fxvxn7, people: [John Doe], description: (task name)
   - '868fxvxn7 "John Doe,Jane Smith"' → task: 868fxvxn7, people: [John Doe, Jane Smith], description: (task name)
   - '868fxvxn7 "John Doe, Jane Smith" Added Socket.IO integration' → task: 868fxvxn7, people: [John Doe, Jane Smith], description: Added Socket.IO integration
   - '868fxvxn7 John Doe,Jane Smith Added Socket.IO' → task: 868fxvxn7, people: [John Doe, Jane Smith], description: Added Socket.IO
   - '868fxvxn7 "john@example.com,jane@example.com" Fixed auth bug' → task: 868fxvxn7, people: [john@example.com, jane@example.com], description: Fixed auth bug
   - '868fxvxn7 jane.doe' → task: 868fxvxn7, people: [jane.doe], description: (task name)

   **Person name format detection**:
   - Multiple people: Separated by commas (,) in the input
   - ClickUp user ID: Numeric ID (e.g., 12345678)
   - Email: Contains @ (e.g., john.doe@example.com)
   - Full name: Multiple words (e.g., John Doe, Jane Smith)

   After parsing, display what was understood:
   ```
   📋 Parsed Arguments:
   - Task ID: {task-id}
   - People: {person1}, {person2}, {person3}
   - Description: {description-or-will-use-task-name}
   ```

2. Fetch the ClickUp task:
   Use the task ID to fetch the task details with the mcp__clickup__get_task tool.

   Extract the following information:
   - Task ID (custom ID if available, otherwise use the provided ID)
   - Task name
   - Task URL (format: https://app.clickup.com/t/{task-id})
   - Task description (extract first line or create a short one-line summary, max 100 characters)

3. Lookup the ClickUp users:
   IMPORTANT: To properly @mention users, you MUST get their ClickUp user IDs.

   Steps:
   a. Split the person names by comma (,) and trim whitespace from each name
   b. Use mcp__clickUp__get_workspace_members to get all workspace members
   c. For EACH person name in the list:
      - Search through the members list to find a match:
        - Match by username (case-insensitive)
        - Match by email (case-insensitive)
        - Match by partial name match in username
      - Extract the user's numeric ID from the matched member object
      - Store the ID in an array of user IDs

   Example member object:
   {
     "id": 81487967,
     "username": "Raj Kumar",
     "email": "raj@example.com",
     "color": "#7b68ee",
     "initials": "RK"
   }

   If any user is not found:
   - List all available usernames to help the user
   - Warn: "⚠️ User '{person-name}' not found. Available users: [list of usernames]"
   - Ask the user to provide the correct name or proceed without that person

4. Get the PR URL and optional Loom URL from task comments:
   Use mcp__clickup__get_task_comments to retrieve task comments.

   **PR URL (required):**
   - Look for a comment containing "PR:" followed by a URL
   - If multiple PR comments exist, use the most recent one
   - If no PR URL is found:
     - Inform the user: "⚠️ No PR link found in task comments. Make sure the PR has been created and linked to the task."
     - Ask if they want to provide the PR URL manually or exit

   **Loom URL (optional):**
   - Check the same task comments for "Loom:" followed by a URL
   - Loom URLs typically match patterns like:
     - https://www.loom.com/share/{video-id}
     - https://loom.com/share/{video-id}
   - Extract the Loom URL if present (this is optional)
   - If no Loom URL found, continue without it (this is normal)

5. Prepare the ClickUp message:
   Format the message using ClickUp's comment_parts structure for proper formatting:

   **IMPORTANT**: Use the following structure for proper @mentions and inline links:

   **For SINGLE person (without Loom)**:
   ```json
   {
     "comment_parts": [
       {
         "text": "Hello ",
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": user_id_here  // ClickUp user ID from step 3
         }
       },
       {
         "text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{pr-url}"
         }
       },
       {
         "text": "\nTask: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{task-url}"
         }
       }
     ]
   }
   ```

   **For SINGLE person (with Loom)**:
   ```json
   {
     "comment_parts": [
       {
         "text": "Hello ",
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": user_id_here
         }
       },
       {
         "text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{pr-url}"
         }
       },
       {
         "text": "\nTask: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{task-url}"
         }
       },
       {
         "text": "\nLoom: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{loom-url}"
         }
       }
     ]
   }
   ```

   **For MULTIPLE people (without Loom)** (use SPACE separator between mentions, NOT comma):
   ```json
   {
     "comment_parts": [
       {
         "text": "Hello ",
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": first_user_id
         }
       },
       {
         "text": " ",  // SPACE separator (NOT comma)
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": second_user_id
         }
       },
       {
         "text": " ",  // SPACE separator
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": third_user_id
         }
       },
       {
         "text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{pr-url}"
         }
       },
       {
         "text": "\nTask: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{task-url}"
         }
       }
     ]
   }
   ```

   **For MULTIPLE people (with Loom)**:
   ```json
   {
     "comment_parts": [
       {
         "text": "Hello ",
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": first_user_id
         }
       },
       {
         "text": " ",
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": second_user_id
         }
       },
       {
         "text": " ",
         "attributes": {}
       },
       {
         "type": "user_mention",
         "user_mention": {
           "id": third_user_id
         }
       },
       {
         "text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{pr-url}"
         }
       },
       {
         "text": "\nTask: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{task-url}"
         }
       },
       {
         "text": "\nLoom: ",
         "attributes": {}
       },
       {
         "type": "link_mention",
         "link_mention": {
           "url": "{loom-url}"
         }
       }
     ]
   }
   ```

   **CRITICAL CHANGES**:
   - Use first-person description: "I have {description}" instead of "{description}"
   - Add polite closing: "Please review and merge this PR"
   - Use `link_mention` type for PR, Task, and optional Loom URLs
   - Task URL should be the full ClickUp URL (e.g., "https://app.clickup.com/t/868fzyrc7")
   - ClickUp will automatically create the preview and color indicator for task URLs
   - **For multiple people**: Use SPACE (" ") as separator between user mentions in the message, NOT comma
   - **Loom link is OPTIONAL**: Only add Loom link if it was found in task comments

   Rules:
   - **CRITICAL**: Use `user_mention` type with the numeric user ID from step 3 for proper @mention
   - The user ID MUST be a number (e.g., 81487967), NOT a string
   - **For multiple people**: Add each user_mention separately with SPACE text separator between them
   - Use `link_mention` type for GitHub PR, ClickUp task, and optional Loom links (inline formatting)
   - Use full URLs for all links (ClickUp auto-detects and adds preview/color indicator)
   - Description format: "I have {short-description}" (first person, past tense)
   - Always add "Please review and merge this PR" after the description
   - **Loom link**: Only include if found in task comments (from step 4)
   - DO NOT proceed without valid user IDs - the @mentions won't work with plain text

   Example API payload (single person, without Loom):
   ```json
   {
     "comment_parts": [
       {"text": "Hello ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 81487967}},
       {"text": "\nI have fixed chat sidebar text selection and sub-report name truncation\nPlease review and merge this PR\nPR: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://github.com/org/repo/pull/123"}},
       {"text": "\nTask: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://app.clickup.com/t/868fxvxn7"}}
     ]
   }
   ```

   Example API payload (single person, with Loom):
   ```json
   {
     "comment_parts": [
       {"text": "Hello ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 81487967}},
       {"text": "\nI have fixed chat sidebar text selection and sub-report name truncation\nPlease review and merge this PR\nPR: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://github.com/org/repo/pull/123"}},
       {"text": "\nTask: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://app.clickup.com/t/868fxvxn7"}},
       {"text": "\nLoom: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://www.loom.com/share/abc123def456"}}
     ]
   }
   ```

   Example API payload (multiple people, without Loom):
   ```json
   {
     "comment_parts": [
       {"text": "Hello ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 81487967}},
       {"text": " ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 82345678}},
       {"text": " ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 83456789}},
       {"text": "\nI have fixed chat sidebar text selection and sub-report name truncation\nPlease review and merge this PR\nPR: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://github.com/org/repo/pull/123"}},
       {"text": "\nTask: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://app.clickup.com/t/868fxvxn7"}}
     ]
   }
   ```

   Example API payload (multiple people, with Loom):
   ```json
   {
     "comment_parts": [
       {"text": "Hello ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 81487967}},
       {"text": " ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 82345678}},
       {"text": " ", "attributes": {}},
       {"type": "user_mention", "user_mention": {"id": 83456789}},
       {"text": "\nI have fixed chat sidebar text selection and sub-report name truncation\nPlease review and merge this PR\nPR: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://github.com/org/repo/pull/123"}},
       {"text": "\nTask: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://app.clickup.com/t/868fxvxn7"}},
       {"text": "\nLoom: ", "attributes": {}},
       {"type": "link_mention", "link_mention": {"url": "https://www.loom.com/share/abc123def456"}}
     ]
   }
   ```

6. Send the message to ClickUp Channel:

   Steps:
   a. Get the workspace ID from the task:
      - Extract team_id from the task object (this is the workspace ID)

   b. Get the channel ID from .mcp.json:
      - Read CLICKUP_PEER_REVIEW_CHANNEL_ID from .mcp.json env section
      - This is the ID of your #peer-review channel

   c. Get the API token from .mcp.json:
      - Read CLICKUP_API_KEY from .mcp.json env section

   d. Send message to the channel using the comment_parts structure:

      **For single person (without Loom):**
      ```bash
      curl -X POST \
        "https://api.clickup.com/api/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/messages" \
        -H "Authorization: {api_key_from_mcp_json}" \
        -H "Content-Type: application/json" \
        -d '{
          "comment_parts": [
            {"text": "Hello ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": user_id}},
            {"text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{pr-url}"}},
            {"text": "\nTask: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{task-url}"}}
          ]
        }'
      ```

      **For single person (with Loom):**
      ```bash
      curl -X POST \
        "https://api.clickup.com/api/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/messages" \
        -H "Authorization: {api_key_from_mcp_json}" \
        -H "Content-Type: application/json" \
        -d '{
          "comment_parts": [
            {"text": "Hello ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": user_id}},
            {"text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{pr-url}"}},
            {"text": "\nTask: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{task-url}"}},
            {"text": "\nLoom: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{loom-url}"}}
          ]
        }'
      ```

      **For multiple people (without Loom):**
      ```bash
      curl -X POST \
        "https://api.clickup.com/api/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/messages" \
        -H "Authorization: {api_key_from_mcp_json}" \
        -H "Content-Type: application/json" \
        -d '{
          "comment_parts": [
            {"text": "Hello ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": first_user_id}},
            {"text": " ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": second_user_id}},
            {"text": " ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": third_user_id}},
            {"text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{pr-url}"}},
            {"text": "\nTask: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{task-url}"}}
          ]
        }'
      ```

      **For multiple people (with Loom):**
      ```bash
      curl -X POST \
        "https://api.clickup.com/api/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/messages" \
        -H "Authorization: {api_key_from_mcp_json}" \
        -H "Content-Type: application/json" \
        -d '{
          "comment_parts": [
            {"text": "Hello ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": first_user_id}},
            {"text": " ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": second_user_id}},
            {"text": " ", "attributes": {}},
            {"type": "user_mention", "user_mention": {"id": third_user_id}},
            {"text": "\nI have {short-description}\nPlease review and merge this PR\nPR: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{pr-url}"}},
            {"text": "\nTask: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{task-url}"}},
            {"text": "\nLoom: ", "attributes": {}},
            {"type": "link_mention", "link_mention": {"url": "{loom-url}"}}
          ]
        }'
      ```

   **Required Configuration in .mcp.json:**
   - CLICKUP_API_KEY - Your ClickUp API token
   - CLICKUP_PEER_REVIEW_CHANNEL_ID - The channel ID where messages will be posted

   Notes:
   - Messages are posted to the configured channel where everyone can see
   - The person will be properly @mentioned using their ClickUp user ID
   - PR, Task, and optional Loom links appear as inline clickable links with preview
   - ClickUp automatically detects task URLs and adds:
     - Hover popover with task preview
     - Task progress color indicator (small colored square)
     - Clickable task name
   - Loom link is optional and only included if found in task comments
   - Handle errors if the API request fails
   - ClickUp uses v3 API endpoints for chat (experimental)

Your final output should be formatted as follows:

<output>
1. ClickUp Task Details:
   - Task ID: {task-id}
   - Task Name: {task-name}
   - Task URL: {task-url}
   - Short Description: {short-one-line-description}

2. User Lookup:
   - People: {person1}, {person2}, {person3}
   - ClickUp User IDs: {user-id-1}, {user-id-2}, {user-id-3}
   - All users found in workspace: [yes/no]

3. Pull Request and Loom:
   - PR URL: {pr-url}
   - PR Found in task comments: [yes/no]
   - Loom URL: {loom-url / Not found}
   - Loom Found in task comments: [yes/no/not-applicable]

4. ClickUp Channel Notification:
   - Workspace ID: {workspace-id}
   - Channel ID: {channel-id}
   - @Mentioned People: {person1} (ID: {user-id-1}), {person2} (ID: {user-id-2}), {person3} (ID: {user-id-3})
   - Description: {short-description}
   - Loom Included: [yes/no]
   - Message Status: [sent/failed]

5. Message Preview:
   ```
   Hello @{person1} @{person2} @{person3}
   I have {short-description}
   Please review and merge this PR
   PR: [inline link]
   Task: [inline link]
   [if-loom] Loom: [inline link]
   ```

6. Summary:
   ✅ Task details fetched from ClickUp
   ✅ User lookup completed for all people
   ✅ PR URL retrieved from task comments
   [if-loom] ✅ Loom URL retrieved from task comments
   ✅ Message posted to ClickUp channel with proper formatting
   ✅ All people @mentioned using ClickUp user IDs with space separators
   ✅ Links formatted as inline links (not raw URLs)
   [if-loom] ✅ Loom video link included in message

   Next Steps:
   - All mentioned people will be notified in the ClickUp channel
   - Wait for peer review feedback
   - Address any review comments
</output>

IMPORTANT NOTES:

- If the ClickUp API token is not configured, provide clear instructions on how to set it up
- If CLICKUP_PEER_REVIEW_CHANNEL_ID is not configured, provide instructions on how to get it
- If the PR URL cannot be found, do not proceed without user confirmation
- **Loom URL is OPTIONAL**: Only include if found in task comments; it's normal if not present
- Handle API errors gracefully and provide clear error messages
- Person names are parsed from comma-separated input but displayed with space separators in the message
- All person names must be looked up to get their ClickUp user IDs for proper @mentions
- Always verify the API request was successful before confirming
- ClickUp Chat API is v3 (experimental) - handle API changes gracefully

ERROR HANDLING:

If neither CLICKUP_API_KEY nor CLICKUP_API_TOKEN is found, provide these instructions:

```
⚠️ ClickUp API Key not configured.

To send ClickUp chat messages, you need a ClickUp API key/token.

═══════════════════════════════════════════════════════════
SETUP INSTRUCTIONS
═══════════════════════════════════════════════════════════

1. Get your ClickUp API Key:
   - Go to https://app.clickup.com/
   - Click your avatar (bottom left)
   - Go to "Settings" → "Apps"
   - Scroll to "API Token" section
   - Click "Generate" or copy existing token
   - Copy the token (starts with "pk_" for personal tokens)

2. Set the environment variable:

   Since you're using CLICKUP_API_KEY in your .env files:

   Option A - For this session only:
   export CLICKUP_API_KEY="pk_your_token_here"

   Option B - Permanent (add to ~/.zshrc or ~/.bashrc):
   echo 'export CLICKUP_API_KEY="pk_your_token_here"' >> ~/.zshrc
   source ~/.zshrc

   Option C - Project-specific (.env file) - RECOMMENDED:
   echo 'CLICKUP_API_KEY="pk_your_token_here"' >> .env

   Note: You can also use CLICKUP_API_TOKEN if you prefer, but CLICKUP_API_KEY
         will be checked first.

3. Verify it's set:
   echo $CLICKUP_API_KEY

4. Get your ClickUp peer review channel ID:

   **How to find your channel ID:**

   a. Open ClickUp in your browser
   b. Go to Chat (left sidebar)
   c. Click on your peer-review channel (or create one if it doesn't exist)
   d. Look at the URL - it will be something like:
      https://app.clickup.com/12345678/v/ch/90909090-1010-1010-1010-101010101010

      The channel ID is the last part: 90909090-1010-1010-1010-101010101010

   e. Copy that channel ID

5. Set the channel ID environment variable:

   Option A - For this session only:
   export CLICKUP_PEER_REVIEW_CHANNEL_ID="your-channel-id-here"

   Option B - Permanent (add to ~/.zshrc or ~/.bashrc):
   echo 'export CLICKUP_PEER_REVIEW_CHANNEL_ID="your-channel-id-here"' >> ~/.zshrc
   source ~/.zshrc

   Option C - Project-specific (.env file) - RECOMMENDED:
   echo 'CLICKUP_PEER_REVIEW_CHANNEL_ID="your-channel-id-here"' >> .env

6. Verify both are set:
   echo $CLICKUP_API_KEY
   echo $CLICKUP_PEER_REVIEW_CHANNEL_ID

7. Usage:

   Single person:
   /pr-review-notify 868fxvxn7 "John Doe" Added new feature

   Multiple people (comma-separated in input, space-separated in message):
   /pr-review-notify 868fxvxn7 "John Doe,Jane Smith,Bob Wilson" Added new feature

   The command will:
   - Fetch the task details from ClickUp
   - Look up all person names to get their ClickUp user IDs
   - Get the PR URL from task comments (required)
   - Check for Loom URL in task comments (optional - automatically included if found)
   - Post a message to your peer-review channel
   - @mention all people in the message (with space separators)
   - Include inline links for PR, Task, and Loom (if available)
   - Everyone in the channel can see the notification
```

Ensure that your final output contains only the information specified in the <output> format above. Do not include any additional explanations or steps in your final output unless there is an error or configuration issue.
