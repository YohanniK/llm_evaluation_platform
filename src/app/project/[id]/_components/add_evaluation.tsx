"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdAdd } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function AddEvaluation() {
  const createEvaluation = useMutation(
    api.functions.evaluations.createEvaluation,
  );
  const params = useParams();

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [evaluationName, setEvaluationName] = useState("");
  const [evaluationDescription, setEvaluationDescription] = useState("");

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (evaluationName.length > 3 && evaluationDescription.length > 3) {
      createEvaluation({
        name: evaluationName,
        description: evaluationDescription,
        projectId: params.id as Id<"projects">,
      });
      setEvaluationName("");
      setEvaluationDescription("");

      toast({
        title: "Success",
        description: "Evaluation Created Successfully",
      });

      setIsDialogOpen(false);
    } else if (evaluationName.length < 3) {
      toast({
        title: "Input Validation Error",
        description: "Evaluation Name must be greater than 3 characters",
      });
    } else if (evaluationDescription.length < 3) {
      toast({
        title: "Input Validation Error",
        description: "Evaluation Description must be greater than 3 characters",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <IoMdAdd />
          Evaluation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add evaluation</DialogTitle>
          <DialogDescription>Add your evaluation here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Evaluation Name
            </Label>
            <Input
              id="name"
              value={evaluationName}
              onChange={(e) => {
                setEvaluationName(e.currentTarget.value);
              }}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={evaluationDescription}
              onChange={(e) => {
                setEvaluationDescription(e.currentTarget.value);
              }}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={(e) => handleSubmit(e)}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
