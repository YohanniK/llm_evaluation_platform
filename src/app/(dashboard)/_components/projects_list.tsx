"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { parseDate } from "@/utils/date_parse";

const useProjects = () => {
  const projects = useQuery(api.functions.projects.fetchAllProjectsByUser);
  if (!projects) {
    return [];
  }

  return projects;
};

export function ProjectsList() {
  const router = useRouter();
  const projects = useProjects();

  return (
    <div className="flex flex-col divide-y">
      {projects.length == 0 && (
        <ProjectsListEmpty>You haven't created any project.</ProjectsListEmpty>
      )}
      {projects.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Experiments</TableHead>
              <TableHead>Datasets</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={index}
                onClick={() => router.push(`project/${project._id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.experiments}</TableCell>
                <TableCell>{project.datasets}</TableCell>
                <TableCell>{project.owner?.username.toUpperCase()}</TableCell>
                <TableCell>{parseDate(project._creationTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      )}
    </div>
  );
}

function ProjectsListEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
