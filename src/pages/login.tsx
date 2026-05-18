import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { loginRequest } from "../services/api";
import { SunIcon, MoonIcon } from "../components/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverError, setServerError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const logoSrc = isDark ? "/icon-lobbylog-dark.png" : "/icon-lobbylog.png";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    setIsPending(true);

    try {
      const data = await loginRequest(email, password);

      if (data.user) {
        login(data.user);
        navigate("/dashboard");
      } else {
        setServerError(data.error || "Invalid credentials");
      }
    } catch {
      setServerError("Could not connect to the server");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-sky-950 dark:via-blue-950 dark:to-teal-950">
      <header className="flex items-center justify-between px-4 py-3 sm:px-8 sm:py-5">
        <div className="flex items-center gap-2">
          <img
            alt="LobbyLog"
            className="h-8 w-8 object-contain sm:h-14 sm:w-14"
            src={logoSrc}
          />
          <span className="text-xs font-bold uppercase tracking-widest sm:text-sm">
            <span className="text-foreground">LOBBY</span>
            <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
              LOG
            </span>
          </span>
        </div>

        <Button
          aria-label="Toggle theme"
          size="sm"
          variant="outline"
          onPress={toggleTheme}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </Button>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <Card
          className={`w-full max-w-md shadow-2xl backdrop-blur-md ${isDark ? "border-white/10 bg-black/40" : "border-black/10 bg-white/70"}`}
        >
          <Card.Header className="flex flex-col items-center gap-3 pb-0 pt-6 sm:gap-4 sm:pt-8">
            <img
              alt="LobbyLog"
              className="h-20 w-20 object-contain sm:h-28 sm:w-28"
              src={logoSrc}
            />
            <div className="text-center">
              <Card.Title className="text-2xl font-bold uppercase tracking-widest sm:text-3xl">
                <span className="text-foreground">LOBBY</span>
                <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                  LOG
                </span>
              </Card.Title>
              <Card.Description className="mt-1">
                Enter your credentials to continue
              </Card.Description>
            </div>
          </Card.Header>

          <Form onSubmit={handleSubmit}>
            <Card.Content className="pt-6 sm:pt-8">
              <div className="flex flex-col gap-5 sm:gap-6">
                <TextField
                  isRequired
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                >
                  <Label>Email</Label>
                  <Input
                    autoComplete="email"
                    placeholder="name@example.com"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>

                <TextField
                  isRequired
                  name="password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                >
                  <Label>Password</Label>
                  <Input
                    autoComplete="current-password"
                    placeholder="Your password"
                    variant="secondary"
                  />
                  <FieldError />
                </TextField>

                {serverError && (
                  <p className="text-center text-sm text-danger">
                    {serverError}
                  </p>
                )}
              </div>
            </Card.Content>

            <Card.Footer className="flex mt-6 flex-col gap-2 pb-6 pt-3 sm:pb-8 sm:pt-4">
              <Button className="w-full" isPending={isPending} type="submit">
                Sign in
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    </div>
  );
}
