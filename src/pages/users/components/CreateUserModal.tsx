import type { Role, CreatedCredentials } from "@/lib/types";

import { useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  Toast,
} from "@heroui/react";

import { createUserRequest } from "@/services/api";

type CreateUserModalProps = {
  state: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    setOpen: (isOpen: boolean) => void;
    toggle: () => void;
  };
  onSuccess: (credentials: CreatedCredentials) => void;
};

export function CreateUserModal({ state, onSuccess }: CreateUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("RESIDENT");
  const [unit, setUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
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

      setName("");
      setEmail("");
      setRole("RESIDENT");
      setUnit("");
      state.close();
      Toast.toast.success("User created successfully.");
      onSuccess({ email: data.email, password: data.password });
    } catch {
      setFormError("Could not create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Create User</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
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
  );
}
