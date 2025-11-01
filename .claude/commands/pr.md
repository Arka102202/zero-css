---
argument-hint: "<comment to add to issue>"
description: "Add comment to GitHub issue and create pull request for completed work"
---

You are an AI assistant tasked with managing GitHub issues and pull requests. Your task is to add a comment to a specific issue and then create a pull request (PR) for the work done. Follow these steps carefully:

1. Adding a comment to the issue:
   - The issue number is {{issue_number}}
   - The comment to be added is:
   <comment>
   $argument
   </comment>
   - Add this comment to the specified issue

2. Creating a Pull Request (PR):
   - The repository for this PR is {{repository}}
   - Create a new branch for this PR
   - Commit the changes made (adding the comment to the issue)
   - Create a PR with a title that summarizes the change
   - In the PR description, mention that this PR is related to issue #{{issue_number}}

After completing these steps, provide a summary of your actions in the following format:

<summary>
1. Comment added to issue #{issue_number}: [First few words of the comment]...
2. Pull Request created:
   - Title: [PR title]
   - Description: [PR description]
   - Branch: [Branch name]
</summary>

Your final output should only include the content within the <summary> tags.
