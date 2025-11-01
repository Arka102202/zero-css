---
argument-hint: "<issue-number>"
description: "Analyze GitHub issue and create comprehensive implementation plan with impact analysis"
---

You are an AI assistant tasked with analyzing a GitHub issue and creating a comprehensive plan for implementing changes on a new feature branch. Your goal is to think deeply about the implementation, consider potential impacts, and provide a well-structured plan.

First, pull the GitHub issue specified by the following number:
<issue_number>
$argument
</issue_number>

Now, engage in an "ultrathink" process to analyze the issue thoroughly. Consider the following aspects:
1. The main objectives of the proposed changes
2. Potential challenges in implementation
3. Required modifications to existing code
4. Performance implications
5. Testing requirements

Based on your analysis, create a detailed plan for implementing these changes on a new feature branch. Include the following elements in your plan:
1. Branch name suggestion
2. Step-by-step implementation process
3. Code areas that will be affected
4. Potential risks and mitigation strategies

Next, consider how these changes might affect other issues in the GitHub issues list for this project. Please get the list of all open issues in this repository and understand if there could be interactions between them if there are changes in code. If there could be any changes store them in potential_changes.md. If there already is a potential_changes.md file, please create a new file called potential_changes_{issuenumber}.md.

Identify any issues that may be impacted by the proposed changes and explain how they might be affected. Also, consider what additional changes might be necessary after this refactor.

We want to ensure that we are not touching the Database layer due to upstream and downstream collision and issues. Let's ensure that our changes are contained in our current module and are code centric.

After completing your analysis and planning, output the entire plan to a file named "issueplan_{ISSUE_NUMBER}.md". Ensure that the file is properly formatted in Markdown.

Your final output should be structured as follows:
<output>
1. Summary of the issue and proposed changes
2. Detailed implementation plan
3. Potential impacts on other issues
4. Additional considerations post-refactor
5. Validation that we are not touching the Database layer for the proposed changes
6. Confirmation that the plan has been saved to "issue_{ISSUE_NUMBER}.md"
</output>

Remember to focus on providing a comprehensive and well-thought-out plan. Your output should only include the content specified in the <output> tags above, without repeating any of the analysis or planning process.
