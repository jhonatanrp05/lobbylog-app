import type { PackageStatus, AdminPackage as Package } from "@/lib/types";

import { useState, useEffect } from "react";
import { Chip, Skeleton, Table } from "@heroui/react";

import { getPackagesRequest } from "@/services/api";

function StatusChip({ status }: { status: PackageStatus }) {
  if (status === "PENDING") {
    return (
      <Chip color="warning" size="sm" variant="soft">
        Pending
      </Chip>
    );
  }
  if (status === "DELIVERED") {
    return (
      <Chip color="accent" size="sm" variant="soft">
        Delivered
      </Chip>
    );
  }

  return (
    <Chip color="success" size="sm" variant="soft">
      Confirmed
    </Chip>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

export default function AllPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPackages() {
      try {
        const data = await getPackagesRequest();

        if (!Array.isArray(data)) {
          setError("Could not load packages.");

          return;
        }

        setPackages(data);
      } catch {
        setError("Could not load packages.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackages();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">All Packages</h1>

      {error && <p className="text-sm text-danger">{error}</p>}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 flex-[2] rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <p className="text-muted">No packages registered yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer className="overflow-x-auto">
            <Table.Content aria-label="All packages" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>Description</Table.Column>
                <Table.Column>Recipient</Table.Column>
                <Table.Column>Unit</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Logged by</Table.Column>
                <Table.Column>Logged on</Table.Column>
              </Table.Header>
              <Table.Body>
                {packages.map((pkg) => (
                  <Table.Row key={pkg.id}>
                    <Table.Cell>{pkg.description}</Table.Cell>
                    <Table.Cell>{pkg.recipient.name}</Table.Cell>
                    <Table.Cell>{pkg.recipient.unit ?? "—"}</Table.Cell>
                    <Table.Cell>
                      <StatusChip status={pkg.status} />
                    </Table.Cell>
                    <Table.Cell>{pkg.porter.name}</Table.Cell>
                    <Table.Cell>{formatDate(pkg.createdAt)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  );
}
