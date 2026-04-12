"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./quert-client";

export function ReactQueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
