import { Toast, toastQueue } from "@heroui/react";
import { ThemeProvider } from "./context/ThemeContext";

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toast.Provider placement="bottom end" queue={toastQueue} />
    </ThemeProvider>
  );
}
