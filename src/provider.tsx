import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast, toastQueue } from "@heroui/react";

import { ThemeProvider } from "./context/ThemeContext";

const queryClient = new QueryClient();

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Toast.Provider placement="bottom end" queue={toastQueue} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
