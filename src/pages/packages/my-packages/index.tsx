import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Skeleton, Toast } from "@heroui/react";

import { TagIcon } from "@/components/icons";
import { getMyPackagesRequest, confirmPackageRequest } from "@/services/api";
import { PackageCard, Package } from "@/components/PackageCard";

export default function MyPackagesPage() {
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading, isError } = useQuery<Package[]>({
    queryKey: ["my-packages"],
    queryFn: async () => {
      const data = await getMyPackagesRequest();

      if (!Array.isArray(data)) throw new Error();

      return data;
    },
  });

  const {
    mutate: confirm,
    isPending: isConfirming,
    variables: confirmingId,
  } = useMutation({
    mutationFn: (id: string) => confirmPackageRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-packages"] });
    },
    onError: () => Toast.toast.danger("Could not confirm package."),
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">My Packages</h1>

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
        <p className="text-muted">You have no packages yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              action={
                pkg.status === "DELIVERED" ? (
                  <Button
                    className="w-full"
                    isPending={isConfirming && confirmingId === pkg.id}
                    size="sm"
                    variant="outline"
                    onPress={() => confirm(pkg.id)}
                  >
                    Confirm reception
                  </Button>
                ) : undefined
              }
              meta={
                pkg.porter && (
                  <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
                    <TagIcon className="h-4 w-4 shrink-0" />
                    <span className="font-medium">
                      Logged by {pkg.porter.name}
                    </span>
                  </div>
                )
              }
              pkg={pkg}
            />
          ))}
        </div>
      )}
    </div>
  );
}
