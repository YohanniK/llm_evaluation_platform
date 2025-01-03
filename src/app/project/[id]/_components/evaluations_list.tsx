"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { parseDate } from "@/utils/date_parse";

export default function EvaluationsList() {
  const params = useParams();
  const router = useRouter();

  const evaluations =
    useQuery(api.functions.evaluations.fetchAllEvaluationsByUser, {
      projectId: params.id as Id<"projects">,
    }) || [];

  return (
    <div className="flex flex-col divide-y">
      {evaluations.length === 0 && (
        <EvaluationsEmptyList>
          You have no evaluations created
        </EvaluationsEmptyList>
      )}
      {evaluations.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Datasets</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation, index) => (
              <TableRow
                key={index}
                onClick={() =>
                  router.push(`${params.id}/evaluation/${evaluation._id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <TableCell>{evaluation.name}</TableCell>
                <TableCell>{evaluation.description}</TableCell>
                <TableCell>{evaluation.datasets}</TableCell>
                <TableCell>
                  {evaluation.owner?.username.toUpperCase()}
                </TableCell>
                <TableCell>{parseDate(evaluation._creationTime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      )}
    </div>
  );
}

function EvaluationsEmptyList({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 bg-muted/50 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
