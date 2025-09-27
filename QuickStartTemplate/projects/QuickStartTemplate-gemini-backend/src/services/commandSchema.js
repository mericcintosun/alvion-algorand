// JSON Schema (Gemini "structured output") — minimal çekirdek
export const CommandSchema = {
  type: "object",
  properties: {
    intent: {
      type: "string",
    },
    riskLimitPct: {
      type: "number",
      nullable: true,
    },
    amount: {
      type: "string",
      nullable: true,
    },
    fromAsset: {
      type: "string",
      nullable: true,
    },
    toAsset: {
      type: "string",
      nullable: true,
    },
    targetAllocation: {
      type: "array",
      items: {
        type: "object",
        properties: {
          asset: { type: "string" },
          pct: { type: "number" },
        },
        required: ["asset", "pct"],
      },
      nullable: true,
    },
    notes: {
      type: "string",
      nullable: true,
    },
  },
  required: ["intent"],
};

export const PlanSchema = {
  type: "object",
  properties: {
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          op: {
            type: "string",
            description: "Operation type: QUOTE, STAKE, UNSTAKE, SWAP, SET_POLICY, or PREVIEW",
          },
          params: {
            type: "object",
          },
        },
        required: ["op", "params"],
      },
    },
  },
  required: ["steps"],
};
