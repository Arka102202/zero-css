---
argument-hint: "<description of changes made>"
description: "Create comprehensive change report with security, scalability, and resiliency analysis"
---

You are tasked with documenting the changes made for a specific bug or issue. Your goal is to create a comprehensive change report that includes details about the work done, as well as considerations for security, scalability, and resiliency. Follow these steps to complete the task:

1. Review the following information:

<changes_made>
$argument
</changes_made>

<security_considerations>
{{security_considerations}}
</security_considerations>

<scalability_considerations>
{{scalability_considerations}}
</scalability_considerations>

<resiliency_considerations>
{{resiliency_considerations}}
</resiliency_considerations>

2. Create a detailed change report by following these guidelines:

a. Start with an introduction that briefly describes the bug or issue being addressed.

b. Document the changes made, providing a clear and concise explanation of each modification. Use bullet points or numbered lists for clarity.

c. Analyze the security considerations:
   - Identify any security-related changes or improvements.
   - Explain how these changes enhance the overall security of the system.
   - Highlight any potential security risks that were mitigated.

d. Examine the scalability considerations:
   - Describe how the changes impact the system's ability to handle increased load or growth.
   - Mention any optimizations made to improve performance at scale.
   - Identify any potential scalability challenges that may arise from these changes.

e. Assess the resiliency considerations:
   - Explain how the changes contribute to the system's ability to recover from failures or errors.
   - Highlight any improvements in fault tolerance or error handling.
   - Identify any potential risks to system stability and how they are addressed.

f. Conclude the report with a summary of the overall impact of these changes on the system.

3. Format your report using Markdown syntax. Use appropriate headers, lists, and emphasis where necessary to improve readability.

4. Your final output should only include the content of the change report, formatted in Markdown. Do not include any explanations or meta-commentary about the task itself.

5. The report should be comprehensive yet concise, focusing on the most important aspects of the changes and their implications for security, scalability, and resiliency.

Remember, the final output should be a well-structured Markdown document that can be saved as {{bug_ID}}.md. Ensure that all relevant information is included in the report without any extraneous content.
