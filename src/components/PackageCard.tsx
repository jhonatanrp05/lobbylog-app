import type { Package, PackageStatus } from "@/lib/types";

import { Chip } from "@heroui/react";

import { CameraIcon } from "@/components/icons";

function StatusChip({ status }: { status: PackageStatus }) {
  const className = "w-full justify-center uppercase tracking-wide";

  if (status === "PENDING") {
    return (
      <Chip className={className} color="warning" size="sm" variant="soft">
        Pending
      </Chip>
    );
  }
  if (status === "DELIVERED") {
    return (
      <Chip className={className} color="accent" size="sm" variant="soft">
        Delivered
      </Chip>
    );
  }

  return (
    <Chip className={className} color="success" size="sm" variant="soft">
      Confirmed
    </Chip>
  );
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

type PackageCardProps = {
  pkg: Package;
  meta?: React.ReactNode;
  action?: React.ReactNode;
};

export type { Package };

export function PackageCard({ pkg, meta, action }: PackageCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border">
      {pkg.photoUrl ? (
        <img
          alt={pkg.description}
          className="h-40 w-full object-cover"
          src={pkg.photoUrl}
        />
      ) : (
        <div className="flex h-40 items-center justify-center bg-muted/20">
          <CameraIcon className="h-10 w-10 text-muted" />
        </div>
      )}

      <div className="flex flex-col gap-3 p-4">
        <p className="font-semibold text-foreground">{pkg.description}</p>

        <div className="overflow-hidden rounded-lg border border-border text-sm">
          <div className="flex items-center justify-between bg-muted/10 px-3 py-2">
            <span className="text-muted">Logged on</span>
            <span className="font-medium text-foreground">
              {formatDate(pkg.createdAt)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border px-3 py-2">
            <span className="text-muted">Delivered on</span>
            <span className="font-medium text-foreground">
              {formatDate(pkg.deliveredAt)}
            </span>
          </div>
        </div>

        {meta}

        <StatusChip status={pkg.status} />

        {action}
      </div>
    </div>
  );
}
