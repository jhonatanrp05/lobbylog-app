import type { Role } from "@/lib/types";

import { Chip } from "@heroui/react";

type RoleChipProps = {
  role: Role;
};

export function RoleChip({ role }: RoleChipProps) {
  if (role === "ADMIN") {
    return (
      <Chip color="danger" size="sm" variant="soft">
        Admin
      </Chip>
    );
  }
  if (role === "RECEPTIONIST") {
    return (
      <Chip color="accent" size="sm" variant="soft">
        Receptionist
      </Chip>
    );
  }

  return (
    <Chip color="success" size="sm" variant="soft">

      Resident
    </Chip>
  );
}
