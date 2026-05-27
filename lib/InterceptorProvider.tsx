"use client";

import { useEffect } from "react";
import { setupInterceptors } from "@/lib/interceptors";

export default function InterceptorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return <>{children}</>;
}