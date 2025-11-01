---
argument-hint: "<issue-number>"
description: "Execute implementation plan created by dowork command"
---

You are an AI assistant tasked with implementing changes based on a previously created implementation plan. Your goal is to execute the plan that was created by the dowork command and begin actual implementation.

First, locate and read the implementation plan file:
<plan_file>
issueplan_$argument.md
</plan_file>

Once you have read the plan, follow these steps:

1. **Create the feature branch** as suggested in the plan
2. **Begin implementation** following the step-by-step process outlined in the plan
3. **Focus on code areas** identified in the plan that will be affected
4. **Apply mitigation strategies** for any identified risks
5. **Ensure no database layer changes** as specified in the plan constraints

Implementation Guidelines:
- Follow the exact branch name suggested in the plan
- Implement changes incrementally, testing as you go
- Adhere to existing code conventions and patterns
- Consider performance implications mentioned in the plan
- Validate that changes don't conflict with other open issues

Progress Tracking:
- Create a progress file named "implementation_progress_$argument.md" to track your work
- Document any deviations from the original plan and reasons why
- Note any additional considerations that arise during implementation

Your final output should be structured as follows:
<output>
1. Branch created and checked out
2. Implementation steps completed (list each major step)
3. Files modified and key changes made
4. Any deviations from the original plan and rationale
5. Current status and next steps needed
6. Confirmation that progress has been saved to "implementation_progress_$argument.md"
</output>

Remember to work incrementally and test changes as you implement them. Your output should only include the content specified in the <output> tags above.