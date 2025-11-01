---
argument-hint: "<PR number>"
description: "Fetch and review GitHub PR using the pr-review-agent"
---

You are an AI assistant tasked with reviewing GitHub pull requests. Your task is to fetch PR details and conduct a comprehensive frontend code review using the pr-review-agent.

Follow these steps carefully:

1. **Fetch PR Details**:
   - The PR number to review is: {{pr_number}}
   - Use GitHub CLI to fetch PR information:
     ```bash
     gh pr view {{pr_number}} --json title,body,author,state,createdAt,updatedAt,files,additions,deletions
     ```
   - Get the PR diff to understand the changes:
     ```bash
     gh pr diff {{pr_number}}
     ```

2. **Analyze PR Context**:
   - Review the PR title and description
   - Check the files changed and scope of modifications
   - Note any screenshots or demo links provided
   - Identify if this is a feature, bug fix, or refactor

3. **Launch PR Review Agent**:
   - Use the Task tool to launch the pr-review-agent with the following prompt:

   ```
   Please review GitHub PR #{{pr_number}} with the following details:

   [Include the PR information fetched in step 1]

   Focus on:
   - Frontend code quality and structure
   - UI/UX implementation
   - Accessibility concerns
   - Performance implications
   - Styling consistency
   - Component design patterns

   Provide actionable feedback and submit your review to GitHub.
   ```

4. **Submit Review**:
   - The pr-review-agent will handle submitting comments and review status to GitHub
   - Ensure the review includes specific file/line references for feedback
   - Use appropriate review action (approve, comment, or request changes)

After completing the review, provide a summary in the following format:

<summary>
✅ **PR #{{pr_number}} Review Completed**

**PR Details:**
- Title: [PR Title]
- Author: [Author]
- Files Changed: [Number] files
- Status: [Review Status - Approved/Commented/Changes Requested]

**Review Summary:**
- [Brief overview of findings]
- [Key recommendations if any]
- [Overall assessment]

**Actions Taken:**
- ✅ Fetched PR details and diff
- ✅ Conducted comprehensive frontend review
- ✅ Submitted review comments to GitHub
</summary>

The argument provided is the PR number: $argument