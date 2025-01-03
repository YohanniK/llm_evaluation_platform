"use client";

import { RedirectToSignIn } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import ProjectHeader from "./_components/header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <Authenticated>
        <ProjectHeader />
        {children}
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  );
}
