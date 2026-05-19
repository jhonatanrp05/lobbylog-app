import type { User, CreatedCredentials } from "@/lib/types";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, Skeleton, Table, Toast, useOverlayState } from "@heroui/react";
import { MdEdit, MdDeleteOutline } from "react-icons/md";

import { RoleChip } from "./components/RoleChip";
import { CredentialsBanner } from "./components/CredentialsBanner";
import { UserFormModal } from "./components/UserFormModal";

import { ConfirmModal } from "@/components/ConfirmModal";
import { getUsersRequest, deleteUserRequest } from "@/services/api";

export default function UsersPage() {
  const userModalState = useOverlayState();
  const deleteModalState = useOverlayState();

  const [createdCredentials, setCreatedCredentials] =
    useState<CreatedCredentials | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const data = await getUsersRequest();

      if (!Array.isArray(data)) throw new Error();

      return data;
    },
  });

  const { mutate: deleteUser } = useMutation({
    mutationFn: (id: string) => deleteUserRequest(id),
    onSuccess: () => {
      refetch();
      deleteModalState.close();
      setUserToDelete(null);
      Toast.toast.success("User deleted successfully.");
    },
    onError: () => {
      Toast.toast.danger("Could not delete user.");
      deleteModalState.close();
    },
  });

  function openCreateDialog() {
    setUserToEdit(null);
    userModalState.open();
  }

  function openEditDialog(user: User) {
    setUserToEdit(user);
    userModalState.open();
  }

  function openDeleteDialog(user: User) {
    setUserToDelete(user);
    deleteModalState.open();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <Button onPress={openCreateDialog}>Create user</Button>
      </div>

      {createdCredentials && (
        <CredentialsBanner
          credentials={createdCredentials}
          onDismiss={() => setCreatedCredentials(null)}
        />
      )}

      {isError && <p className="text-sm text-danger">Could not load users.</p>}

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-[2] rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-12 rounded-lg" />
              <Skeleton className="h-10 w-16 rounded-lg" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-muted">No users yet.</p>
      ) : (
        <Table>
          <Table.ScrollContainer className="overflow-x-auto">
            <Table.Content aria-label="All users" className="min-w-[600px]">
              <Table.Header>
                <Table.Column isRowHeader>Name</Table.Column>
                <Table.Column>Email</Table.Column>
                <Table.Column>Role</Table.Column>
                <Table.Column>Unit</Table.Column>
                <Table.Column>Actions</Table.Column>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user.id}>
                    <Table.Cell>{user.name}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>
                      <RoleChip role={user.role} />
                    </Table.Cell>
                    <Table.Cell>{user.unit ?? "—"}</Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button
                          isDisabled={user.role === "ADMIN"}
                          size="sm"
                          variant="outline"
                          onPress={() => openEditDialog(user)}
                        >
                          <MdEdit />
                        </Button>
                        <Button
                          isDisabled={user.role === "ADMIN"}
                          size="sm"
                          variant="danger-soft"
                          onPress={() => openDeleteDialog(user)}
                        >
                          <MdDeleteOutline />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}

      <UserFormModal
        state={userModalState}
        user={userToEdit}
        onSuccess={(credentials) => {
          if (credentials) setCreatedCredentials(credentials);
          refetch();
        }}
      />

      <ConfirmModal
        message={
          <>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{userToDelete?.name}</span>? This
            action cannot be undone.
          </>
        }
        state={deleteModalState}
        title="Delete user"
        onConfirm={() => userToDelete && deleteUser(userToDelete.id)}
      />
    </div>
  );
}
