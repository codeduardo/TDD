import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { ReactNode } from "react";

export const queryClient = new QueryClient();

export const renderWithProviders = (children: ReactNode) =>
  render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
