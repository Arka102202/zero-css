# MCP Server Enhancement Requests

This document tracks enhancement requests for MCP servers used in this project.

---

## ClickUp MCP Server

### Enhancement #1: Rich Text Comment Support

**Current Limitation:**
The `mcp__clickup__create_task_comment` tool only supports plain text comments via the `commentText` parameter.

**Current Tool Signature:**
```
mcp__clickup__create_task_comment(
  taskId: string,
  commentText: string,
  listName?: string,
  notifyAll?: boolean,
  assignee?: number
)
```

**Needed Enhancement:**
Add support for rich text comments with link mentions, task mentions, and user tags.

**Proposed Tool Signature:**
```
mcp__clickup__create_task_comment(
  taskId: string,
  commentText?: string,              // Plain text (existing)
  richComment?: array,                // NEW: Rich text format
  listName?: string,
  notifyAll?: boolean,
  assignee?: number
)
```

**Rich Comment Format:**
The `richComment` parameter should accept an array of comment parts:

```json
[
    {
        "text": "PR: ",
        "attributes": {}
    },
    {
        "type": "link_mention",
        "link_mention": {
            "url": "https://github.com/owner/repo/pull/123"
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
            "block-id": "block-uuid"
        }
    },
    {
        "text": "Loom: ",
        "attributes": {}
    },
    {
        "type": "link_mention",
        "link_mention": {
            "url": "https://www.loom.com/share/video-id"
        },
        "text": ""
    }
]
```

**Supported Rich Comment Types:**
- `link_mention` - Clickable links with preview
- `task_mention` - References to other ClickUp tasks
- `user_tag` - User mentions that trigger notifications
- Text with attributes (block-id for formatting)

**API Endpoint:**
```
POST https://api.clickup.com/api/v2/task/{task_id}/comment
```

**Request Body:**
```json
{
  "comment_text": [
    // Array of comment parts as shown above
  ]
}
```

**Use Case:**
When delivering code reviews via `/code-review-and-deliver` command, we need to post comments with clickable PR links and Loom video links to ClickUp tasks. Currently, we have to fall back to direct API calls because the MCP server doesn't support this format.

**Workaround (Current):**
Using direct curl commands to post rich text comments:
```bash
curl -X POST "https://api.clickup.com/api/v2/task/{taskId}/comment" \
  -H "Authorization: {apiKey}" \
  -H "Content-Type: application/json" \
  -d '{"comment_text": [...]}'
```

**Priority:** High
**Impact:** Improves user experience with clickable links instead of plain text URLs

---

## Notes

- This enhancement would eliminate the need for direct API calls in automation workflows
- Would make the MCP server feature-complete for comment creation
- Similar enhancement might be beneficial for channel messages as well
