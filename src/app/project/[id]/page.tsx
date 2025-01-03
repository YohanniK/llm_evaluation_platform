"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import EvaluationsList from "./_components/evaluations_list";
import { AddEvaluation } from "./_components/add_evaluation";

export default function ProjectDashboard() {
  const params = useParams();

  const project =
    useQuery(api.functions.projects.fetchProjectById, {
      projectId: params.id as Id<"projects">,
    }) || null;

  return (
    <div className="flex-1 flex flex-col p-4 space-y-3">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">{project?.name}</h3>
        <ProjectSettingDropdownMenu />
      </div>
      <div className="flex flex-row items-center justify-between">
        <p>Evaluations</p>
        <AddEvaluation />
      </div>
      <EvaluationsList />
    </div>
  );
}

function ProjectSettingDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <BsThreeDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
