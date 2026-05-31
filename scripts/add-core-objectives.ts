// Script to add MASTERY FRAMEWORK core objectives to all departments
// Run this once to update lib/brand-structure.ts

const coreObjectives = {
  marketing: {
    title: "Lead Generation",
    description: "Create predictable, qualified demand for Sales",
  },
  sales: {
    title: "Revenue Conversion",
    description: "Convert qualified demand into paying customers with predictable velocity",
  },
  accounts: {
    title: "Financial Integrity",
    description: "Sustain cash flow, ensure compliance, enable informed financial decisions",
  },
  "team-tools": {
    title: "Operational Efficiency",
    description: "Build systems that scale, reduce friction, enable teams to execute consistently",
  },
  execution: {
    title: "Accountability & Cadence",
    description: "Ensure commitments are tracked, bottlenecks removed, execution is visible",
  },
  rd: {
    title: "Innovation & Risk Management",
    description: "Test new bets, validate learnings, mitigate threats before they escalate",
  },
  leadership: {
    title: "Strategy, Management & People",
    description: "Set direction, remove friction, develop leaders, sustain execution",
  },
};

console.log("Core Objectives to add:");
console.log(JSON.stringify(coreObjectives, null, 2));
