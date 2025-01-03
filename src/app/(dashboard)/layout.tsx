"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { RedirectToSignIn } from "@clerk/nextjs";
import DashboardHeader from "./_components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <Authenticated>
        <DashboardHeader />
        {children}
      </Authenticated>
      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>
    </>
  );
}
