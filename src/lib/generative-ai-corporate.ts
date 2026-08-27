/** Generative AI Corporate Training — brochure content (single source of truth). */

export const GENERATIVE_AI_CORPORATE_PRICE = {
  amount: 2500,
  display: "RM 2,500",
  sstNote: "exc. SST",
} as const;

export const GENERATIVE_AI_CORPORATE_META = {
  title: "Generative AI for Workplace Productivity & Business Automation — Nexperts Academy",
  description:
    "2-day hands-on corporate Generative AI programme for HR, Finance, Sales, Marketing, Operations and Management. RM 2,500 per pax, HRD Corp claimable. No coding required.",
  path: "/generative-ai-corporate",
  brochurePdf: "/Generative_AI_Corporate_Training_Brochure.pdf",
} as const;

export const GENERATIVE_AI_DEPARTMENTS = [
  "HR",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
  "Management",
] as const;

export const MONDAY_SCENARIOS = [
  {
    before: "45 minutes drafting an important email",
    after: "Create a strong first draft and refine tone and accuracy",
  },
  {
    before: "Reading a 30-page report",
    after: "Extract decisions, risks, questions and action points",
  },
  {
    before: "Starting a presentation from a blank slide",
    after: "Develop the storyline, structure and talking points",
  },
  {
    before: "Manually organising meeting notes",
    after: "Generate actions, owners, deadlines and follow-ups",
  },
  {
    before: "Struggling with spreadsheet formulas",
    after: "Develop, explain and troubleshoot formulas with AI assistance",
  },
  {
    before: "Starting an SOP from scratch",
    after: "Build a structured first draft for human review",
  },
  {
    before: "Repeating similar customer responses",
    after: "Develop reusable response frameworks without sounding robotic",
  },
  {
    before: "Hours of initial research",
    after: "Research, compare and synthesise information faster",
  },
  {
    before: "Random prompting with inconsistent results",
    after: "Use professional, reusable prompt frameworks",
  },
  {
    before: "Repeating the same process every week",
    after: "Identify opportunities for AI-assisted workflows",
  },
] as const;

export const LEARNING_JOURNEY = [
  {
    step: "01",
    title: "Understand AI",
    body: "Generative AI and LLMs in plain business language; capabilities, limitations, hallucinations and human judgement.",
  },
  {
    step: "02",
    title: "Prompt Professionally",
    body: "Context, objective, audience, examples, constraints, output formats, iteration and reusable prompt structures.",
  },
  {
    step: "03",
    title: "Work Faster",
    body: "Emails, reports, proposals, presentations, meetings, summaries, research, SOPs and business documentation.",
  },
  {
    step: "04",
    title: "Apply AI by Department",
    body: "Practical applications for HR, Finance, Sales, Marketing, Operations, Administration, Customer Service and Management.",
  },
  {
    step: "05",
    title: "Work With Data",
    body: "Interpret tables, support spreadsheet work, develop formulas, identify patterns and translate information into business insight.",
  },
  {
    step: "06",
    title: "Design AI-Assisted Workflows",
    body: "Identify repetitive work and map: Input → AI Assistance → Human Review → Output.",
  },
  {
    step: "07",
    title: "Use AI Responsibly",
    body: "Confidential information, personal and customer data, intellectual property, bias, hallucinations, verification and organisational governance.",
  },
  {
    step: "08",
    title: "Build Your AI Toolkit",
    body: "Participants create role-specific reusable prompts, practical use cases and an AI-assisted workflow to take back to work.",
  },
] as const;

export const PARTICIPANT_DELIVERABLES = [
  "Personal AI prompt library",
  "Department-specific AI use cases",
  "Reusable workplace prompt frameworks",
  "One AI-assisted workflow",
  "Responsible-AI verification checklist",
  "Practical techniques usable immediately",
] as const;

export const CUSTOMISATION_DEPARTMENTS = [
  "HR",
  "Finance",
  "Sales & Marketing",
  "Management",
  "Operations",
  "Customer Service",
  "Technical Teams",
] as const;
