import { useState, useEffect } from "react";
import { Chip, Spinner, Table } from "@heroui/react";

import { getPackagesRequest } from "../../services/api";

type PackageStatus = "PENDING" | "DELIVERED" | "CONFIRMED";

type Package = {
  id: string;
  description: string;
  status: PackageStatus;
  createdAt: string;
  recipient: { name: string; unit: string | null };
  porter: { name: string };
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
        setPackages(data);
      } catch {
        setError("Could not load packages.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">All Packages</h1>

      {error && <p className="text-sm text-danger">{error}</p>}

      {packages.length === 0 ? (
        <p className="text-muted">No packages registered yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer className="min-w-[600px]">
            <Table.Content aria-label="All packages">
              <Table.Header>
                <Table.Column>Description</Table.Column>
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
