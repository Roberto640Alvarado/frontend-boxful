"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { whoami } from "@/services/authService";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    whoami()
      .then(() => router.replace("/home"))
      .catch(() => router.replace("/login"));
  }, [router]);

  return null;
}