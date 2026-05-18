import type { User, CreatedCredentials } from "@/lib/types";

import { useState, useEffect } from "react";
import { Button, Skeleton, Table, Toast, useOverlayState } from "@heroui/react";

import { RoleChip } from "./components/RoleChip";
import { CredentialsBanner } from "./components/CredentialsBanner";
import { CreateUserModal } from "./components/CreateUserModal";

import { ConfirmModal } from "@/components/ConfirmModal";
import { getUsersRequest, deleteUserRequest } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const createModalState = useOverlayState();
  const deleteModalState = useOverlayState();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [createdCredentials, setCreatedCredentials] =
    useState<CreatedCredentials | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  async function fetchUsers() {
    try {
      const data = await getUsersRequest();

      if (!Array.isArray(data)) {
        setError("Could not load users.");

        return;
      }
      setUsers(data);
    } catch {
      setError("Could not load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function openDeleteDialog(user: User) {
    setUserToDelete(user);
    deleteModalState.open();
  }

  async function handleDelete() {
    if (!userToDelete) return;
    try {
      await deleteUserRequest(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      deleteModalState.close();
      setUserToDelete(null);
      Toast.toast.success("User deleted successfully.");
    } catch {
      Toast.toast.danger("Could not delete user.");
      deleteModalState.close();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <Button onPress={createModalState.open}>Create user</Button>
      </div>

      {createdCredentials && (
        <CredentialsBanner
          credentials={createdCredentials}
          onDismiss={() => setCreatedCredentials(null)}
        />
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

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
                      <Button
                        isDisabled={user.id === currentUser?.id}
                        size="sm"
                        variant="danger-soft"
                        onPress={() => openDeleteDialog(user)}
                      >
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

      <CreateUserModal
        state={createModalState}
        onSuccess={(credentials) => {
          setCreatedCredentials(credentials);
          fetchUsers();
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
        onConfirm={handleDelete}
      />
    </div>
  );
}
