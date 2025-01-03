import Groq from "groq-sdk";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  expectedResponse?: string;
  evaluationId: Id<"evaluations">;
  projectId: Id<"projects">;
  modelId?: Id<"models">;
  // context?: string;
}

export const evaluateResponse = action(
  async (ctx, { promptId }: { promptId: Id<"prompts"> }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }

    const messages = await ctx.runQuery(
      api.functions.messages.fetchMessagesByPromptId,
      {
        promptId: promptId,
      },
    );

    const userPrompt = messages.find((message) => message.role === "user");
    const assistantResponses = messages.filter(
      (message) => message.role === "assistant",
    ) as Message[];

    if (
      !userPrompt ||
      !userPrompt.expectedResponse ||
      assistantResponses.length === 0
    ) {
      throw new Error("No messages found for the prompt");
    }

    const scores = [];
    for (const response of assistantResponses) {
      const llmResponse = response.content;
      const evaluationStream = await getGroqChatCompletion(
        userPrompt.content,
        userPrompt.expectedResponse,
        llmResponse,
      );

      const evaluationResult = evaluationStream.choices[0]?.message?.content;
      console.debug("evaluationResult", evaluationResult);
      if (!evaluationResult) {
        console.error(
          `Failed to evaluate response for model: ${response.modelId!}`,
        );
        continue;
      }

      try {
        const jsonResponse = getJsonResponse(evaluationResult);
        const parsedScores = JSON.parse(jsonResponse);

        // Save scores to the database
        await ctx.runMutation(api.functions.scorer.saveScore, {
          promptId: promptId,
          modelId: response.modelId!,
          accuracy: parsedScores["accuracy"],
          completeness: parsedScores["completeness"],
          coherence: parsedScores["coherence"],
        });

        scores.push({
          modelId: response.modelId,
          ...parsedScores,
        });
      } catch (error) {
        console.error(
          `Error parsing evaluation result for model: ${response.modelId}`,
          error,
        );
      }
    }
    return scores;
  },
);

export async function getGroqChatCompletion(
  userPrompt: string,
  expectedResponse: string,
  llmResponse: string,
) {
  const fail = async (reason: string) => {
    throw new Error(reason);
  };

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return fail("GROQ_API_KEY is not set");
  }

  const groq = new Groq({ apiKey: apiKey });
  const evaluationPrompt = `
  Evaluate the following response:
  Expected: "${expectedResponse}"
  Actual: "${llmResponse}"

  Provide scores (0-10) for:
    - Accuracy: How well does the response match the expected answer?
    - Completeness: Does the response cover all required aspects?
    - Coherence: Is the response logical and well-structured?

  Written the response in JSON format, with the following keys:
  {
    "accuracy": 0,
    "completeness": 0,
    "coherence": 0
  }
  Don't return anything else except the JSON response.
`;

  try {
    return groq.chat.completions.create({
      messages: [
        { role: "system", content: evaluationPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "mixtral-8x7b-32768",
    });
  } catch (e) {
    console.log(e);
    return fail("Failed to get chat completion");
  }
}

// TODO: Write a function that slices json response from groq and returns it as a string
const getJsonResponse = (response: string) => {
  const jsonStartIndex = response.indexOf("{");
  const jsonEndIndex = response.lastIndexOf("}");
  return response.slice(jsonStartIndex, jsonEndIndex + 1);
};
