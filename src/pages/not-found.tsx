import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <p className="text-6xl font-bold text-muted">404</p>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-muted">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button variant="outline" onPress={() => navigate(-1)}>
        Go back
      </Button>
    </div>
  );
}
