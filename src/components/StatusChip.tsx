import type { PackageStatus } from "@/lib/types";

import { Chip } from "@heroui/react";

export function StatusChip({ status }: { status: PackageStatus }) {
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
