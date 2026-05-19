import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, Skeleton, Toast, useOverlayState } from "@heroui/react";
import { MdEdit } from "react-icons/md";

import { PackageFormModal } from "./components/PackageFormModal";

import { PersonIcon } from "@/components/icons";
import {
  getLoggedPackagesRequest,
  deliverPackageRequest,
} from "@/services/api";
import { PackageCard, Package } from "@/components/PackageCard";

export default function MyLoggedPackagesPage() {
  const packageModalState = useOverlayState();
  const [packageToEdit, setPackageToEdit] = useState<Package | null>(null);

  const {
    data: packages = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Package[]>({
    queryKey: ["my-logged-packages"],
    queryFn: async () => {
      const data = await getLoggedPackagesRequest();

      if (!Array.isArray(data)) throw new Error();

      return data;
    },
  });

  const {
    mutate: deliver,
    isPending: isDelivering,
    variables: deliveringId,
  } = useMutation({
    mutationFn: (id: string) => deliverPackageRequest(id),
    onSuccess: () => {
      refetch();
      Toast.toast.success("Package marked as delivered.");
    },
    onError: () => Toast.toast.danger("Could not mark package as delivered."),
  });

  function openCreateDialog() {
    setPackageToEdit(null);
    packageModalState.open();
  }

  function openEditDialog(pkg: Package) {
    setPackageToEdit(pkg);
    packageModalState.open();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          My Logged Packages
        </h1>
        <Button onPress={openCreateDialog}>Log package</Button>
      </div>

      {isError && (
        <p className="text-sm text-danger">Could not load packages.</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-border"
            >
              <Skeleton className="h-40 w-full" />
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-5 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <p className="text-muted">You have not logged any packages yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              action={
                pkg.status === "PENDING" ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full"
                      size="sm"
                      variant="outline"
                      onPress={() => openEditDialog(pkg)}
                    >
                      <MdEdit />
                      Edit
                    </Button>
                    <Button
                      className="w-full"
                      isPending={isDelivering && deliveringId === pkg.id}
                      size="sm"
                      variant="outline"
                      onPress={() => deliver(pkg.id)}
                    >
                      Mark as delivered
                    </Button>
                  </div>
                ) : undefined
              }
              meta={
                pkg.recipient && (
                  <div className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-accent">
                    <PersonIcon className="h-4 w-4 shrink-0" />
                    <span className="font-medium">
                      {pkg.recipient.name}
                      {pkg.recipient.unit ? ` — ${pkg.recipient.unit}` : ""}
                    </span>
                  </div>
                )
              }
              pkg={pkg}
            />
          ))}
        </div>
      )}

      <PackageFormModal
        pkg={packageToEdit}
        state={packageModalState}
        onSuccess={refetch}
      />
    </div>
  );
}
