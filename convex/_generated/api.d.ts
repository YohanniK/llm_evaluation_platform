/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_evaluations from "../functions/evaluations.js";
import type * as functions_helpers from "../functions/helpers.js";
import type * as functions_messages from "../functions/messages.js";
import type * as functions_models from "../functions/models.js";
import type * as functions_projects from "../functions/projects.js";
import type * as functions_prompts from "../functions/prompts.js";
import type * as functions_scorer from "../functions/scorer.js";
import type * as functions_user from "../functions/user.js";
import type * as http from "../http.js";
import type * as llm_chat from "../llm_chat.js";
import type * as llm_evaluator from "../llm_evaluator.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/evaluations": typeof functions_evaluations;
  "functions/helpers": typeof functions_helpers;
  "functions/messages": typeof functions_messages;
  "functions/models": typeof functions_models;
  "functions/projects": typeof functions_projects;
  "functions/prompts": typeof functions_prompts;
  "functions/scorer": typeof functions_scorer;
  "functions/user": typeof functions_user;
  http: typeof http;
  llm_chat: typeof llm_chat;
  llm_evaluator: typeof llm_evaluator;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
