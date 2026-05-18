import { useState, useEffect } from "react";
import {
  Button,
  Chip,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  Skeleton,
  Table,
  TextField,
  Toast,
  useOverlayState,
} from "@heroui/react";

import {
  getUsersRequest,
  createUserRequest,
  deleteUserRequest,
} from "../../services/api";

type Role = "ADMIN" | "RECEPTIONIST" | "RESIDENT";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  unit: string | null;
};

type CreatedCredentials = {
  email: string;
  password: string;
};

function RoleChip({ role }: { role: Role }) {
  if (role === "ADMIN") {
    return <Chip color="danger" size="sm" variant="soft">Admin</Chip>;
  }
  if (role === "RECEPTIONIST") {
    return <Chip color="accent" size="sm" variant="soft">Receptionist</Chip>;
  }
  return <Chip color="success" size="sm" variant="soft">Resident</Chip>;
}

export default function UsersPage() {
  const createModalState = useOverlayState();
  const deleteDialogState = useOverlayState();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("RESIDENT");
  const [unit, setUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [createdCredentials, setCreatedCredentials] =
    useState<CreatedCredentials | null>(null);

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (!createdCredentials) return;

    const text = `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.password}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setCreatedCredentials(null);
    setIsSubmitting(true);

    try {
      const body: { name: string; email: string; role: Role; unit?: string } = {
        name,
        email,
        role,
      };

      if (role === "RESIDENT" && unit) {
        body.unit = unit;
      }

      const data = await createUserRequest(body);

      if (data.error) {
        setFormError(data.error);
        return;
      }

      setCreatedCredentials({ email: data.email, password: data.password });
      setName("");
      setEmail("");
      setRole("RESIDENT");
      setUnit("");
      fetchUsers();
      createModalState.close();
      Toast.toast.success("User created successfully.");
    } catch {
      setFormError("Could not create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openDeleteDialog(user: User) {
    setUserToDelete(user);
    deleteDialogState.open();
  }

  async function handleDelete() {
    if (!userToDelete) return;

    try {
      await deleteUserRequest(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      deleteDialogState.close();
      setUserToDelete(null);
      Toast.toast.success("User deleted successfully.");
    } catch {
      Toast.toast.danger("Could not delete user.");
      deleteDialogState.close();
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <Button onPress={createModalState.open}>Create user</Button>
      </div>

      {createdCredentials && (
        <div className="rounded-lg border border-success bg-success/10 p-4 text-sm">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-success">User created!</p>
            <button
              aria-label="Dismiss"
              className="text-muted hover:text-foreground"
              onClick={() => setCreatedCredentials(null)}
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-foreground">
            Email:{" "}
            <span className="font-mono">{createdCredentials.email}</span>
          </p>
          <p className="text-foreground">
            Password:{" "}
            <span className="font-mono">{createdCredentials.password}</span>
          </p>
          <p className="mt-1 text-muted">
            The password won't be shown again.
          </p>
          <Button
            className="mt-3"
            size="sm"
            variant="outline"
            onPress={handleCopy}
          >
            {copied ? "Copied!" : "Copy credentials"}
          </Button>
        </div>
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

      <Modal state={createModalState}>
        <Modal.Backdrop isDismissable>
          <Modal.Container>
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Create User</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleCreate}>
                  <div className="flex flex-col gap-5">
                    <TextField
                      isRequired
                      name="name"
                      value={name}
                      onChange={setName}
                    >
                      <Label>Name</Label>
                      <Input placeholder="e.g. John Doe" variant="secondary" />
                      <FieldError />
                    </TextField>

                    <TextField
                      isRequired
                      name="email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                    >
                      <Label>Email</Label>
                      <Input
                        placeholder="e.g. john@example.com"
                        variant="secondary"
                      />
                      <FieldError />
                    </TextField>

                    <Select
                      isRequired
                      selectedKey={role}
                      onSelectionChange={(key) => setRole(key as Role)}
                    >
                      <Label>Role</Label>
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <FieldError />
                      <Select.Popover>
                        <ListBox>
                          <ListBox.Item id="ADMIN">Admin</ListBox.Item>
                          <ListBox.Item id="RECEPTIONIST">
                            Receptionist
                          </ListBox.Item>
                          <ListBox.Item id="RESIDENT">Resident</ListBox.Item>
                        </ListBox>
                      </Select.Popover>
                    </Select>

                    {role === "RESIDENT" && (
                      <TextField name="unit" value={unit} onChange={setUnit}>
                        <Label>Unit (optional)</Label>
                        <Input placeholder="e.g. 4B" variant="secondary" />
                        <FieldError />
                      </TextField>
                    )}

                    {formError && (
                      <p className="text-sm text-danger">{formError}</p>
                    )}

                    <Button
                      className="w-full"
                      isPending={isSubmitting}
                      type="submit"
                    >
                      Create user
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal state={deleteDialogState}>
        <Modal.Backdrop>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.Header>
                <Modal.Heading>Delete user</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-foreground">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{userToDelete?.name}</span>?
                  This action cannot be undone.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={deleteDialogState.close}>
                  Cancel
                </Button>
                <Button variant="danger" onPress={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
