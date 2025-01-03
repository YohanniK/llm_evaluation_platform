import { v } from "convex/values";
import { authenticatedMutation, authenticatedQuery } from "./helpers";
import { internalMutation } from "../_generated/server";

export const fetchAllMessagesByEvaluationIdProjectIdAndUserId =
  authenticatedQuery({
    args: {
      evaluationId: v.id("evaluations"),
      projectId: v.id("projects"),
    },
    handler: async (ctx, { evaluationId, projectId }) => {
      return await ctx.db
        .query("messages")
        .withIndex("by_evaluation_id_project_id_owner_id", (q) =>
          q
            .eq("evaluationId", evaluationId)
            .eq("projectId", projectId)
            .eq("ownerId", ctx.user._id),
        )
        .collect();
    },
  });

export const saveMessage = authenticatedMutation({
  args: {
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    expectedResponse: v.optional(v.string()),
    context: v.optional(v.string()),
    promptId: v.id("prompts"),
    evaluationId: v.id("evaluations"),
    projectId: v.id("projects"),
    modelId: v.optional(v.id("models")),
  },
  handler: async (
    ctx,
    {
      role,
      content,
      expectedResponse,
      context,
      promptId,
      evaluationId,
      projectId,
      modelId,
    },
  ) => {
    return await ctx.db.insert("messages", {
      role,
      content,
      expectedResponse,
      context,
      promptId,
      evaluationId,
      projectId,
      ownerId: ctx.user._id,
      modelId: modelId,
    });
  },
});

export const fetchLastChatConversation = authenticatedQuery({
  args: {
    evaluationId: v.id("evaluations"),
    projectId: v.id("projects"),
  },
  handler: async (ctx, { evaluationId, projectId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_evaluation_id_project_id_owner_id", (q) =>
        q
          .eq("evaluationId", evaluationId)
          .eq("projectId", projectId)
          .eq("ownerId", ctx.user._id),
      )
      .filter((q) => q.eq(q.field("role"), "assistant"))
      .order("desc")
      .take(3);
  },
});

export const updateMessage = internalMutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, { messageId, content }) => {
    const currentMessage = await ctx.db.get(messageId);

    if (!currentMessage || typeof currentMessage.content !== "string") {
      throw new Error(
        `Message with ID ${messageId} does not exist or is invalid.`,
      );
    }

    const updatedContent = currentMessage.content + content;
    return await ctx.db.patch(messageId, { content: updatedContent });
  },
});

export const fetchMessagesByPromptId = authenticatedQuery({
  args: {
    promptId: v.id("prompts"),
  },
  handler: async (ctx, { promptId }) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("ownerId"), ctx.user._id))
      .filter((q) => q.eq(q.field("promptId"), promptId))
      .collect();
  },
});
