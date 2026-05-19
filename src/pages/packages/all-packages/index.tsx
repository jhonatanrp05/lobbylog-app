import type { AdminPackage } from "@/lib/types";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdDeleteOutline } from "react-icons/md";
import { Button, Skeleton, Table, Toast, useOverlayState } from "@heroui/react";

import { ConfirmModal } from "@/components/ConfirmModal";
import { StatusChip } from "@/components/StatusChip";
import { formatDate } from "@/lib/utils";
import { getPackagesRequest, deletePackageRequest } from "@/services/api";

export default function AllPackagesPage() {
  const queryClient = useQueryClient();
  const deleteModalState = useOverlayState();
  const [packageToDelete, setPackageToDelete] = useState<AdminPackage | null>(null);

  const { data: packages = [], isLoading, isError } = useQuery<AdminPackage[]>({
    queryKey: ["packages"],
    queryFn: async () => {
      const data = await getPackagesRequest();

      if (!Array.isArray(data)) throw new Error();

      return data;
    },
  });

  const { mutate: deletePackage } = useMutation({
    mutationFn: (id: string) => deletePackageRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      deleteModalState.close();
      setPackageToDelete(null);
      Toast.toast.success("Package deleted successfully.");
    },
    onError: () => {
      Toast.toast.danger("Could not delete package.");
      deleteModalState.close();
    },
  });

  function openDeleteDialog(pkg: AdminPackage) {
    setPackageToDelete(pkg);
    deleteModalState.open();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">All Packages</h1>

      {isError && (
        <p className="text-sm text-danger">Could not load packages.</p>
      )}

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
                <Table.Column>Actions</Table.Column>
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
                    <Table.Cell>
                      <Button
                        size="sm"
                        variant="danger-soft"
                        onPress={() => openDeleteDialog(pkg)}
                      >
                        <MdDeleteOutline />
                        Delete
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}

      <ConfirmModal
        message={
          <>
            Are you sure you want to delete the package{" "}
            <span className="font-semibold">
              {packageToDelete?.description}
            </span>
            ? This action cannot be undone.
          </>
        }
        state={deleteModalState}
        title="Delete package"
        onConfirm={() => packageToDelete && deletePackage(packageToDelete.id)}
      />
    </div>
  );
}
