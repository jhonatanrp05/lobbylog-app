import { useState, useEffect } from "react";
import { Button, Chip, Skeleton, Table } from "@heroui/react";

import { getMyPackagesRequest, confirmPackageRequest } from "../../services/api";

type PackageStatus = "PENDING" | "DELIVERED" | "CONFIRMED";

type Package = {
  id: string;
  description: string;
  status: PackageStatus;
  createdAt: string;
  deliveredAt: string | null;
  confirmedAt: string | null;
};

function StatusChip({ status }: { status: PackageStatus }) {
  if (status === "PENDING") {
    return <Chip color="warning" size="sm" variant="soft">Pending</Chip>;
  }
  if (status === "DELIVERED") {
    return <Chip color="accent" size="sm" variant="soft">Delivered</Chip>;
  }
  return <Chip color="success" size="sm" variant="soft">Confirmed</Chip>;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString();
}

export default function MyPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function fetchPackages() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getMyPackagesRequest();
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

  async function handleConfirm(packageId: string) {
    setConfirmingId(packageId);
    try {
      await confirmPackageRequest(packageId);
      await fetchPackages();
    } catch {
      setError("Could not confirm package.");
    } finally {
      setConfirmingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">My Packages</h1>

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
        <p className="text-muted">You have no packages yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer className="overflow-x-auto">
            <Table.Content aria-label="My packages" className="min-w-[600px]">
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
                      {pkg.status === "DELIVERED" && (
                        <Button
                          isPending={confirmingId === pkg.id}
                          size="sm"
                          variant="outline"
                          onPress={() => handleConfirm(pkg.id)}
                        >
                          Confirm reception
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
