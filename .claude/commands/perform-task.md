---
argument-hint: "<task-id> [additional-context]"
description: "Fetch ClickUp task and implement code changes locally without git operations or status updates"
---

You are an AI assistant tasked with implementing code changes for a ClickUp task. Your job is to pull a specific ClickUp task, create an implementation plan, and make the necessary code changes in the editor. You will NOT perform any git operations, status updates, or create PRs. Follow these steps carefully:

1. Parse the arguments:
   Extract the task ID and optional additional context from:
   <arguments>
   $ARGUMENT
   </arguments>

   The first argument is always the task ID.
   Everything after the first space is treated as additional context/information provided by the developer.

2. Fetch the ClickUp task:
   Use the task ID to fetch the task details with the mcp**clickup**get_task tool.

   Analyze the task and extract the following information:
   - Task ID
   - Task name
   - Task description
   - Task status
   - Assignees
   - Due date
   - Custom fields (if any)

3. Add "adom-assisted" tag to ClickUp task:
   - Check if the task already has the "adom-assisted" tag
   - If not present, use mcp**clickup**update_task to add the "adom-assisted" tag
   - This indicates that AI assistance is being used for this task

4. Update task status to "in progress":
   - Use mcp**clickup**update_task to update the task status to "in progress"
   - This indicates that active work has begun on the task

5. Call the clickup-task-analyst agent:
   Use the Task tool with subagent_type "clickup-task-analyst" to create an implementation plan.

   If additional context was provided, include it in the prompt:
   "Please create a plan for the work related to ClickUp task [task-id]: [task-name]

   Task Description: [task-description]

   Additional Developer Context: [additional-context-if-provided]"

   If no additional context was provided, use:
   "Please create a plan for the work related to ClickUp task [task-id]: [task-name]

   Task Description: [task-description]"

6. Wait for the clickup-task-analyst to complete their task.

7. Call the task-implementer agent:
   After the clickup-task-analyst has finished, use the Task tool with subagent_type "task-implementer":
   "Please begin work on ClickUp task [task-id] as per the plan created by clickup-task-analyst.

   Focus on implementation only - do NOT perform any git operations or PR creation."

8. Wait for the task-implementer agent to complete their task.

9. Prompt user for next action:
   After the implementation is complete, ask the user if they want to proceed with delivering the task:

"Implementation complete! Would you like to proceed with delivering this task?

This will:

- Commit all changes
- Push to remote
- Create PR against dev branch
- Update ClickUp task status to PEER REVIEW

Proceed with /deliver-task? (yes/no)"

- If the user responds "yes" or "y" (case insensitive), immediately execute the deliver-task workflow
- If the user responds "no" or "n" (case insensitive), skip to final output
- If the user provides any other response, ask for clarification

10. Execute deliver-task if confirmed:
    If user confirmed "yes", automatically execute the deliver-task workflow for the same task ID.
    This will handle all git operations, PR creation, and ClickUp updates as defined in the deliver-task command.

Your final output should be formatted as follows:

<output>
1. ClickUp Task Details:
   - Task ID: [task-id]
   - Task Name: [task-name]
   - Task Description: [brief summary of the task description]
   - Task Status: [current-status]
   - Assignees: [assignee-names]

2. ClickUp Tag Update:
   - Tag "10000adom-assisted" Added: [yes/no/already-present]

3. ClickUp Status Update:
   - Status Updated to "in progress": [yes/no/already-in-progress]

4. clickup-task-analyst Call:
   [Summary of the implementation plan]

5. task-implementer Call:
   [Summary of the implementation work completed]

6. Code Changes:
   [List of files modified/created]

7. User Prompt:
   [Display the prompt asking if user wants to proceed with deliver-task]

8. Deliver Task Execution (if user confirmed yes):
   - Feature Branch: [branch-name]
   - Commit Hash: [commit-hash]
   - Commit Message: [commit-message]
   - Branch Pushed: [success/failure]
   - PR Created: [pr-url]
   - ClickUp Status Updated: PEER REVIEW
   - PR Link Added to Task: [confirmation]

   OR

   [Skip this section if user selected no]

9. Next Steps:
   If delivered:
   - ✅ Task is ready for peer review
   - Wait for review feedback
   - Address any comments if needed

   If not delivered:
   - Use /deliver-task [task-id] when ready to commit and create PR
   - Or use /pr command or git-ops agent for custom workflow
   - Or manually handle git operations as needed
     </output>

Ensure that your final output contains only the information specified in the <output> format above. Do not include any additional explanations or steps in your final output.
