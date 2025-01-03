"use client";

import { AddProject } from "./_components/add_project";
import { ProjectsList } from "./_components/projects_list";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col p-4 space-y-3">
      <div className="flex flex-row items-center justify-between">
        <p className="text-xl font-bold">Projects</p>
        <div>
          <AddProject />
        </div>
      </div>
      <ProjectsList />
    </div>
  );
}
