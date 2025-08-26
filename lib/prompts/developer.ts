export const DEVELOPER_PROMPT = `FORMAT STRICTNESS:
1) Produce the natural reply first.
2) Then produce a <json> ... </json> block containing valid CoachPlan JSON (no markdown, no trailing commas).

JSON Requirements:
- All strings must be properly escaped
- No trailing commas
- No comments
- Valid JSON syntax only
- Must conform to CoachPlan schema exactly

Example format:
[Natural reply here, 2-6 paragraphs]

<json>
{
  "reply": "Your natural reply text",
  "actions": [
    {
      "title": "Task title",
      "description": "Optional description",
      "tag": "misc",
      "priority": "M"
    }
  ],
  "habitNudges": [
    {
      "habitName": "Morning meditation",
      "suggestion": "Consider a 5-minute session today"
    }
  ]
}
</json>`; 