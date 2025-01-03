"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import Link from "next/link";
import { BiHomeAlt } from "react-icons/bi";
import { api } from "../../../../../convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";

export default function ProjectHeader() {
  const { user } = useUser();
  const params = useParams();
  const projects =
    useQuery(api.functions.projects.fetchAllProjectsByUser) || [];
  const currentProject =
    useQuery(api.functions.projects.fetchProjectById, {
      projectId: params.id as Id<"projects">,
    }) || null;

  return (
    <div className="p-2 flex flex-row justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <p>EVALENS</p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <div className="w-[1px] h-4 bg-black"></div>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {user?.username?.toUpperCase()} / {currentProject?.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[150px] gap-1 p-2">
                {projects.map((project) => (
                  <li key={project._id}>
                    <NavigationMenuLink asChild>
                      <a
                        href={`/project/${project._id}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {project.name}
                      </a>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {params.evalsId !== undefined && (
            <NavigationMenuItem>
              <Link href={`/project/${params.id}`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <BiHomeAlt size={20} />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <UserButton />
    </div>
  );
}
