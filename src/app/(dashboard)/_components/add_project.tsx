"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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

export function AddProject() {
  const createProject = useMutation(api.functions.projects.create);

  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (projectName.length > 3 && projectDescription.length > 3) {
      createProject({
        name: projectName,
        description: projectDescription,
      });
      setProjectName("");
      setProjectDescription("");

      toast({
        title: "Success",
        description: "Project Created Successfully",
      });

      setIsDialogOpen(false);
    } else if (projectName.length < 3) {
      toast({
        title: "Input Validation Error",
        description: "Project Name must be greater than 3 characters",
      });
    } else if (projectDescription.length < 3) {
      toast({
        title: "Input Validation Error",
        description: "Project Description must be greater than 3 characters",
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <IoMdAdd />
          Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add project</DialogTitle>
          <DialogDescription>Add your project here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Project Name
            </Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.currentTarget.value);
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
              value={projectDescription}
              onChange={(e) => {
                setProjectDescription(e.currentTarget.value);
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
