import { useState, useEffect } from "react";
import { Button, Skeleton, Toast, useOverlayState } from "@heroui/react";
import { MdEdit } from "react-icons/md";

import { PersonIcon } from "@/components/icons";
import {
  getLoggedPackagesRequest,
  deliverPackageRequest,
} from "@/services/api";
import { PackageCard, Package } from "@/components/PackageCard";

import { PackageFormModal } from "./components/PackageFormModal";

export default function MyLoggedPackagesPage() {
  const packageModalState = useOverlayState();

  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deliveringId, setDeliveringId] = useState<string | null>(null);
  const [packageToEdit, setPackageToEdit] = useState<Package | null>(null);

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

  function openCreateDialog() {
    setPackageToEdit(null);
    packageModalState.open();
  }

  function openEditDialog(pkg: Package) {
    setPackageToEdit(pkg);
    packageModalState.open();
  }

  async function handleDeliver(packageId: string) {
    setDeliveringId(packageId);
    try {
      await deliverPackageRequest(packageId);
      await fetchPackages();
      Toast.toast.success("Package marked as delivered.");
    } catch {
      Toast.toast.danger("Could not mark package as delivered.");
    } finally {
      setDeliveringId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          My Logged Packages
        </h1>
        <Button onPress={openCreateDialog}>Log package</Button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

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
                      isPending={deliveringId === pkg.id}
                      size="sm"
                      variant="outline"
                      onPress={() => handleDeliver(pkg.id)}
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
        onSuccess={fetchPackages}
      />
    </div>
  );
}
