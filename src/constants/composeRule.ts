export const ComposeRule = {
  RULE_1:
    "Rule 1 - When select GPU Accelerator Card, only High Density Server would be available. And the memory must be greater than 524,288MB.",
  RULE_2:
    "Rule 2 - Mainframe can only build with Power CPU, memory size limitation is applied on Rule 4. And Power CPU can build other Server Models except High Density.",
  RULE_3:
    "Rule 3 - Memory size greater or equal to 131,072MB can be both 4U and Tower Server. And Memory size less than 131,072MB can only be Tower Server.",
  RULE_4:
    'Rule 4 - Any Model must not have a lower than 2,048MB memory. Lower than that would be "No Options".',
  RULE_5:
    'Rule 5 - If there is no Server Model match the input, need to show "No Options".',
} as const;
