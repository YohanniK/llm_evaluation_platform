import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    image: v.string(),
    clerkId: v.string(),
    projectIds: v.optional(v.array(v.id("projects"))),
  }).index("by_clerk_id", ["clerkId"]),
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    experiments: v.optional(v.number()),
    datasets: v.optional(v.number()),
    ownerId: v.id("users"),
  }).index("by_owner_id", ["ownerId"]),
  evaluations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"),
    ownerId: v.id("users"),
  }).index("by_project_id_owner_id", ["projectId", "ownerId"]),
  messages: defineTable({
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    expectedResponse: v.optional(v.string()),
    context: v.optional(v.string()),
    evaluationId: v.id("evaluations"),
    projectId: v.id("projects"),
    ownerId: v.id("users"),
    modelId: v.optional(v.id("models")),
  }).index("by_evaluation_id_project_id_owner_id", [
    "evaluationId",
    "projectId",
    "ownerId",
  ]),
  scorer: defineTable({
    messageId: v.id("messages"),
    modelId: v.id("models"),
    accuracy: v.optional(v.number()),
    completeness: v.optional(v.number()),
    coherence: v.optional(v.number()),
  }).index("by_message_id_model_id", ["messageId", "modelId"]),
  models: defineTable({
    name: v.string(),
    description: v.string(),
  }),
});
