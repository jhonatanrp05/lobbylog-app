import type { CreatedCredentials } from "@/lib/types";

import { useState } from "react";
import { Button } from "@heroui/react";

type CredentialsBannerProps = {
  credentials: CreatedCredentials;
  onDismiss: () => void;
};

export function CredentialsBanner({
  credentials,
  onDismiss,
}: CredentialsBannerProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");

      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-success bg-success/10 p-4 text-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-success">User created!</p>
        <button
          aria-label="Dismiss"
          className="text-muted hover:text-foreground"
          onClick={onDismiss}
        >
          ✕
        </button>
      </div>
      <p className="mt-2 text-foreground">
        Email: <span className="font-mono">{credentials.email}</span>
      </p>
      <p className="text-foreground">
        Password: <span className="font-mono">{credentials.password}</span>
      </p>
      <p className="mt-1 text-muted">The password won&apos;t be shown again.</p>
      <Button className="mt-3" size="sm" variant="outline" onPress={handleCopy}>
        {copied ? "Copied!" : "Copy credentials"}
      </Button>
    </div>
  );
}
