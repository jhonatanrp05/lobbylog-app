import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Button, Chip } from "@heroui/react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { SunIcon, MoonIcon } from "../components/icons";

function getNavLinks(role: string) {
  if (role === "ADMIN") {
    return [
      { label: "All Packages", to: "/packages" },
      { label: "Users", to: "/users" },
    ];
  }

  if (role === "RECEPTIONIST") {
    return [
      { label: "Log Package", to: "/packages/log" },
      { label: "My Logged", to: "/packages/my-logged" },
    ];
  }

  if (role === "RESIDENT") {
    return [{ label: "My Packages", to: "/packages/my" }];
  }

  return [];
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  const logoSrc = isDark ? "/icon-lobbylog-dark.png" : "/icon-lobbylog.png";
  const navLinks = getNavLinks(user?.role ?? "");

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-surface shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <img
              alt="LobbyLog"
              className="h-8 w-8 object-contain"
              src={logoSrc}
            />
            <span className="text-sm font-bold uppercase tracking-widest">
              <span className="text-foreground">LOBBY</span>
              <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                LOG
              </span>
            </span>
          </div>

          <nav className="hidden items-center gap-6 sm:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-sm font-semibold text-accent"
                    : "text-sm text-muted hover:text-foreground"
                }
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              aria-label="Toggle theme"
              size="sm"
              variant="ghost"
              onPress={toggleTheme}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </Button>

            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-sm text-muted">{user?.email}</span>
              <Chip size="sm" variant="soft">
                {user?.role}
              </Chip>
            </div>

            <Button size="sm" variant="outline" onPress={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 sm:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-sm font-semibold text-accent"
                  : "text-sm text-muted hover:text-foreground"
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
