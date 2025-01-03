"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAction, useQuery } from "convex/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// TODO: Add context
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  expectedResponse?: string;
  evaluationId: Id<"evaluations">;
  projectId: Id<"projects">;
}

interface Score {
  _id: Id<"scorer">;
  _creationTime: number;
  promptId: Id<"prompts">;
  modelId: Id<"models">;
  accuracy: number;
  completeness: number;
  coherence: number;
}

interface EvaluationResult {
  modelId: Id<"models">;
  accuracy: number;
  completeness: number;
  coherence: number;
}

export default function EvaluationDashbaord() {
  const params = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [evaluationResults, setEvaluationResults] = useState<
    EvaluationResult[]
  >([]);

  const sendMessage = useAction(api.llm_chat.chatCompletion);
  const models = useQuery(api.functions.models.list) || [];
  const chatMessageResponses =
    useQuery(api.functions.messages.fetchLastChatConversation, {
      evaluationId: params.evalsId as Id<"evaluations">,
      projectId: params.id as Id<"projects">,
    }) || [];

  const handleSubmit = async () => {
    console.log("Messages", messages);
    if (messages.length === 0) {
      toast({
        title: "Validation Error",
        description: "Messages cannot be empty",
      });
      return;
    } else if (messages.length != 2) {
      const userMessageExists = messages.find(
        (message) => message.role === "user",
      );
      const systemMessageExists = messages.find(
        (message) => message.role === "system",
      );
      if (!userMessageExists || !systemMessageExists) {
        toast({
          title: "Validation Error",
          description: "User and System messages are required",
        });
        return;
      }
    } else {
      for (const message of messages) {
        if (message.content.split(" ").length < 3) {
          toast({
            title: "Validation Error",
            description: `${message.role} message must be at least 3 words`,
          });
          return;
        }
      }
    }

    const { evaluationResults } = await sendMessage({ messages: messages });
    setEvaluationResults(evaluationResults);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Input Section */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <div className="space-y-1">
              <Label htmlFor="system">System</Label>
              <Input
                name="system"
                className="border-black"
                onChange={(e) =>
                  setMessages((prev) => {
                    const otherMessages = prev.filter(
                      (p) => p.role !== "system",
                    );
                    let updatedMessage: Message | undefined = prev.find(
                      (p) => p.role === "system",
                    );
                    if (updatedMessage) {
                      updatedMessage.content = e.target.value;
                    } else {
                      updatedMessage = {
                        role: "system",
                        content: e.target.value,
                        evaluationId: params.evalsId as Id<"evaluations">,
                        projectId: params.id as Id<"projects">,
                      };
                    }
                    return [...otherMessages, updatedMessage];
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="user">User</Label>
              <Input
                name="user"
                className="border-black"
                onChange={(e) =>
                  setMessages((prev) => {
                    const otherMessages = prev.filter((p) => p.role !== "user");
                    let updatedMessage: Message | undefined = prev.find(
                      (p) => p.role === "user",
                    );
                    if (updatedMessage) {
                      updatedMessage.content = e.target.value;
                    } else {
                      updatedMessage = {
                        role: "user",
                        content: e.target.value,
                        evaluationId: params.evalsId as Id<"evaluations">,
                        projectId: params.id as Id<"projects">,
                      };
                    }
                    return [...otherMessages, updatedMessage];
                  })
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="context">Expected Response</Label>
              <Input
                name="context"
                className="border-black"
                onChange={(e) =>
                  setMessages((prev) => {
                    const otherMessages = prev.filter((p) => p.role !== "user");
                    let updatedMessage: Message | undefined = prev.find(
                      (p) => p.role === "user",
                    );
                    if (updatedMessage) {
                      updatedMessage.expectedResponse = e.target.value;
                    } else {
                      updatedMessage = {
                        role: "user",
                        content: "",
                        expectedResponse: e.target.value,
                        evaluationId: params.evalsId as Id<"evaluations">,
                        projectId: params.id as Id<"projects">,
                      };
                    }
                    return [...otherMessages, updatedMessage];
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-row justify-end">
        <Button
          className="bg-black text-white px-4 py-2 rounded-md"
          onClick={(e) => handleSubmit()}
        >
          Send
        </Button>
      </div>
      {/* Response section */}
      <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-start lg:justify-between">
        {models.map((model, index) => (
          <Card
            key={model._id}
            className={`w-full md:w-1/${models?.length || 1} ${index !== models.length - 1 && "mr-2"} ${index !== 0 && "ml-2"}`}
          >
            <CardHeader>
              <CardTitle>
                <div className="p-2 bg-gray-100 text-gray-800 w-fit rounded-lg">
                  {model.name}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2 w-fit md:space-y-0 md:flex-row md:items-center md:justify-end md:space-x-2">
                <div className="bg-gray-100 text-gray-600 py-1 px-2 rounded-md text-sm font-semibold">
                  Accuracy:{" "}
                  {
                    evaluationResults.find(
                      (score) => score.modelId === model._id,
                    )?.accuracy
                  }
                </div>
                <div className="bg-gray-100 text-gray-600 py-1 px-2 rounded-sm text-sm font-semibold">
                  Completeness:{" "}
                  {
                    evaluationResults.find(
                      (score) => score.modelId === model._id,
                    )?.completeness
                  }
                </div>
                <div className="bg-gray-100 text-gray-600 py-1 px-2 rounded-sm text-sm font-semibold">
                  Coherence:{" "}
                  {
                    evaluationResults.find(
                      (score) => score.modelId === model._id,
                    )?.coherence
                  }
                </div>
              </div>
              <div className="space-y-1 bg-gray-100 text-gray-500 font-light p-2">
                {chatMessageResponses
                  .filter((response) => response.modelId === model._id)
                  .map((response, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 text-gray-600 py-1 px-2 rounded-sm text-sm font-semibold"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {response.content}
                      </ReactMarkdown>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
