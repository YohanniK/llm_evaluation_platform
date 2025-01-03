import { v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { authenticatedMutation, authenticatedQuery } from "./helpers";

export const fetchAllProjectsByUser = authenticatedQuery({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", ctx.user._id))
      .order("desc")
      .collect();

    return asyncMap(projects, async (project) => ({
      ...project,
      owner: await ctx.db.get(project.ownerId),
    }));
  },
});

export const create = authenticatedMutation({
  args: {
    name: v.string(),
    description: v.string(),
    experiments: v.optional(v.number()),
    datasets: v.optional(v.number()),
  },
  handler: async (ctx, { name, description, experiments, datasets }) => {
    await ctx.db.insert("projects", {
      name: name,
      description: description,
      experiments: experiments ?? 0,
      datasets: datasets ?? 0,
      ownerId: ctx.user._id,
    });
  },
});

export const fetchProjectById = authenticatedQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    if (project?.ownerId !== ctx.user._id) {
      return null;
    }

    return project;
  },
});
