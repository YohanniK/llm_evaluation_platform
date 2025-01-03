import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./helpers";

export const saveScore = authenticatedMutation({
  args: {
    promptId: v.id("prompts"),
    modelId: v.id("models"),
    accuracy: v.number(),
    completeness: v.number(),
    coherence: v.number(),
  },
  handler: async (
    ctx,
    { promptId, modelId, accuracy, completeness, coherence },
  ) => {
    await ctx.db.insert("scorer", {
      promptId,
      modelId,
      accuracy,
      completeness,
      coherence,
    });
  },
});

export const listScores = authenticatedQuery({
  args: {
    promptId: v.id("prompts"),
  },
  handler: async (ctx, { promptId }) => {
    return await ctx.db
      .query("scorer")
      .withIndex("by_prompt_id", (q) => q.eq("promptId", promptId))
      .collect();
  },
});
