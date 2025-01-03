"use node";
import Groq from "groq-sdk";

import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  evaluationId: Id<"evaluations">;
  projectId: Id<"projects">;
  // context?: string;
}

export const chatCompletion = action(
  async (ctx, { messages }: { messages: Message[] }) => {
    if (!messages) {
      throw new Error("Messages cannot be empty");
    }

    // Saving system and user messages
    for (const message of messages) {
      await ctx.runMutation(api.functions.messages.saveMessage, {
        role: message.role,
        content: message.content,
        evaluationId: message.evaluationId,
        projectId: message.projectId,
      });
    }

    // Creating a new chat response for each model
    const messageIds: { [key: string]: Id<"messages"> } = {};
    const models = (await ctx.runQuery(api.functions.models.list)) || [];
    for (const model of models) {
      const messageId = await ctx.runMutation(
        api.functions.messages.saveMessage,
        {
          role: "assistant",
          content: "",
          evaluationId: messages[0].evaluationId,
          projectId: messages[0].projectId,
          modelId: model._id,
        },
      );
      messageIds[model.name] = messageId;
    }

    await Promise.all(
      models.map(async (model) => {
        const stream = await getGroqChatCompletion(messages, model.name);

        for await (const chunk of stream) {
          if (chunk.choices[0].delta.content) {
            await ctx.runMutation(internal.functions.messages.updateMessage, {
              messageId: messageIds[model.name],
              content: chunk.choices[0].delta.content,
            });
          }
        }
      }),
    );

    return { message: "Chat completion successful" };
  },
);

export async function getGroqChatCompletion(
  messages: Message[],
  model: string,
) {
  const fail = async (reason: string) => {
    throw new Error(reason);
  };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return fail("GROQ_API_KEY is not set");
  }

  const groq = new Groq({ apiKey: apiKey });
  try {
    return groq.chat.completions.create({
      messages: [
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
      model: model,
      stream: true,
    });
  } catch (e) {
    console.log(e);
    return fail("Failed to get chat completion");
  }
}