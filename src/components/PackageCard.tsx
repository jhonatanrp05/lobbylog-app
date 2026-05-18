import type { Package } from "@/lib/types";

import { CameraIcon } from "@/components/icons";
import { StatusChip } from "@/components/StatusChip";
import { formatDate } from "@/lib/utils";

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
