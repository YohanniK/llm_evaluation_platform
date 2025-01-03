import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { asyncMap } from "convex-helpers";

export const fetchAllEvaluationsByUser = authenticatedQuery({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const evaluations = await ctx.db
      .query("evaluations")
      .withIndex("by_project_id_owner_id", (q) =>
        q.eq("projectId", projectId).eq("ownerId", ctx.user._id),
      )
      .collect();

    if (!evaluations) {
      return null;
    }

    return asyncMap(evaluations, async (evaluation) => ({
      ...evaluation,
      owner: await ctx.db.get(evaluation.ownerId),
    }));
  },
});

export const createEvaluation = authenticatedMutation({
  args: {
    name: v.string(),
    description: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, { name, description, projectId }) => {
    await ctx.db.insert("evaluations", {
      name,
      description,
      projectId,
      ownerId: ctx.user._id,
    });
  },
});
