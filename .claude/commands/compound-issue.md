---
argument-hint: "<task-id>"
description: "Complete workflow: fetch ClickUp task, create branch, implement, test, and create PR"
---

You are an AI assistant tasked with managing a complete development workflow from ClickUp task to GitHub PR. Your job is to pull a specific ClickUp task, create a new feature branch, implement the changes, test them, and create a PR. Follow these steps carefully:

1. Fetch the ClickUp task:
   Use the following ClickUp task ID to fetch the task details:
   <clickup_task_id>
   $ARGUMENT
   </clickup_task_id>

   Use the mcp**clickup**get_task tool to retrieve the task details.

   Analyze the task and extract the following information:
   - Task ID
   - Task name
   - Task description
   - Task status
   - Assignees
   - Due date
   - Custom fields (if any)

2. Update ClickUp task status to "in progress":
   Use mcp**clickup**update_task to update the task status to "in progress" before starting work.

3. Create a feature branch:
   Based on the task information, create a new Git branch with a descriptive name from the dev branch.
   Format: "feature/[task-id]-[brief-description]"
   Ensure the branch is created from dev, not main.

4. Call the clickup-task-analyst agent:
   Use the Task tool with subagent_type "clickup-task-analyst" to create an implementation plan:
   "Please create a plan for the work related to ClickUp task [task-id]: [task-name]

   Task Description: [task-description]"

5. Wait for the clickup-task-analyst to complete their task.

6. Call the task-implementer agent:
   After the clickup-task-analyst has finished, use the Task tool with subagent_type "task-implementer":
   "Please begin work on ClickUp task [task-id] as per the plan created by clickup-task-analyst"

7. Wait for the task-implementer agent to complete their task.

8. Call the git-ops agent:
   Once the implementation is finished, use the Task tool with subagent_type "git-ops":
   "Please handle git operations for ClickUp task [task-id].

   - Create/checkout a feature branch with format: feature/[task-id]-[brief-description]
   - Stage and commit all changes with a comprehensive commit message
   - Push the branch to remote
   - Create a PR using the `gh` cli tool

   IMPORTANT: Create the PR against the dev branch, not main.

   Reference ClickUp task [task-id] in the PR description."

9. Update ClickUp task status to "PEER REVIEW":
   After the PR is created, use mcp**clickup**update_task to update the task status to "PEER REVIEW".

10. Link PR to ClickUp task:
    After the PR is created, add a comment to the ClickUp task with the PR link using mcp**clickup**create_task_comment.

Your final output should be formatted as follows:

<output>
1. ClickUp Task Details:
   - Task ID: [task-id]
   - Task Name: [task-name]
   - Task Description: [brief summary of the task description]
   - Initial Task Status: [original-status]
   - Assignees: [assignee-names]

2. Task Status Update (Start):
   - Status set to: in progress

3. Feature Branch:
   - Branch Name: [branch-name]
   - Created from: dev

4. clickup-task-analyst Call:
   [Summary of the implementation plan]

5. task-implementer Call:
   [Summary of the implementation work]

6. git-ops Call:
   - Branch created: [branch-name]
   - Commit hash: [commit-hash]
   - PR Link: [link-to-pr]
   - PR Base Branch: dev

7. Task Status Update (After PR):
   - Status set to: PEER-Review

8. ClickUp Comment:
   [confirmation that PR link was added to task]
   </output>

Ensure that your final output contains only the information specified in the <output> format above. Do not include any additional explanations or steps in your final output.
