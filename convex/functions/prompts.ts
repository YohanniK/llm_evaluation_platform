import { v } from "convex/values";
import { authenticatedMutation } from "./helpers";

export const create = authenticatedMutation({
  args: {
    userMessage: v.string(),
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("prompts", {
      userMessage: args.userMessage,
      projectId: args.projectId,
      ownerId: ctx.user._id,
    });
  },
});
