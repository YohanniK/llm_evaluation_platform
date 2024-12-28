"use client";

import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Home() {
  return (
    <>
      <Authenticated>
        <div>Hello, world!</div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
