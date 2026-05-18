import { ThemeProvider } from "./context/ThemeContext";

export function Provider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
