import { useState, useEffect } from "react";
import { Button, Chip, Skeleton, Table } from "@heroui/react";

import {
  getLoggedPackagesRequest,
  deliverPackageRequest,
} from "../../services/api";

type PackageStatus = "PENDING" | "DELIVERED" | "CONFIRMED";

type Package = {
  id: string;
  description: string;
  status: PackageStatus;
  createdAt: string;
  deliveredAt: string | null;
};

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

function formatDate(dateString: string | null) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString();
}

export default function MyLoggedPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveringId, setDeliveringId] = useState<string | null>(null);

  async function fetchPackages() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getLoggedPackagesRequest();

      setPackages(data);
    } catch {
      setError("Could not load packages.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages();
  }, []);

  async function handleDeliver(packageId: string) {
    setDeliveringId(packageId);
    try {
      await deliverPackageRequest(packageId);
      await fetchPackages();
    } catch {
      setError("Could not mark package as delivered.");
    } finally {
      setDeliveringId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">My Logged Packages</h1>

      {error && <p className="text-sm text-danger">{error}</p>}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 flex-[2] rounded-lg" />
              <Skeleton className="h-10 w-20 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-28 rounded-lg" />
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <p className="text-muted">You have not logged any packages yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer className="overflow-x-auto">
            <Table.Content aria-label="My logged packages" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>Description</Table.Column>
                <Table.Column>Status</Table.Column>
                <Table.Column>Logged on</Table.Column>
                <Table.Column>Delivered on</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {packages.map((pkg) => (
                  <Table.Row key={pkg.id}>
                    <Table.Cell>{pkg.description}</Table.Cell>
                    <Table.Cell>
                      <StatusChip status={pkg.status} />
                    </Table.Cell>
                    <Table.Cell>{formatDate(pkg.createdAt)}</Table.Cell>
                    <Table.Cell>{formatDate(pkg.deliveredAt)}</Table.Cell>
                    <Table.Cell>
                      {pkg.status === "PENDING" && (
                        <Button
                          isPending={deliveringId === pkg.id}
                          size="sm"
                          variant="outline"
                          onPress={() => handleDeliver(pkg.id)}
                        >
                          Mark as delivered
                        </Button>
                      )}
                    </Table.Cell>
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
