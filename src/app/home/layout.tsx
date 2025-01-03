"use client";

import { useRouter } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import HomeHeader from "./_components/header";
import { useEffect } from "react";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <>
      <Unauthenticated>
        <HomeHeader />
        {children}
      </Unauthenticated>
      <Authenticated>
        {(() => {
          useEffect(() => {
            router.push("/");
          }, [router]);
          return null;
        })()}
      </Authenticated>
    </>
  );
}
