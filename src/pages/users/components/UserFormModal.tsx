import type { Role, User, CreatedCredentials } from "@/lib/types";
import type { FieldErrors } from "@/lib/schemas";

import { useState, useEffect } from "react";
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

import { createUserRequest, updateUserRequest } from "@/services/api";
import { userFormSchema, collectErrors } from "@/lib/schemas";

type UserFormModalProps = {
  state: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    setOpen: (isOpen: boolean) => void;
    toggle: () => void;
  };
  user?: User | null;
  onSuccess: (credentials?: CreatedCredentials) => void;
};

export function UserFormModal({ state, user, onSuccess }: UserFormModalProps) {
  const isEdit = !!user;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("RESIDENT");
  const [unit, setUnit] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!state.isOpen) return;
    setErrors({});
    setFormError("");
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role === "RECEPTIONIST" ? "RECEPTIONIST" : "RESIDENT");
      setUnit(user.unit ?? "");
    } else {
      setName("");
      setEmail("");
      setRole("RESIDENT");
      setUnit("");
    }
  }, [state.isOpen, user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const result = userFormSchema.safeParse({ name, email, role, unit });

    if (!result.success) {
      setErrors(collectErrors(result.error));

      return;
    }
    setErrors({});
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

      if (user) {
        const data = await updateUserRequest(user.id, body);

        if (data.error) {
          setFormError(data.error);

          return;
        }
        state.close();
        Toast.toast.success("User updated successfully.");
        onSuccess();
      } else {
        const data = await createUserRequest(body);

        if (data.error) {
          setFormError(data.error);

          return;
        }
        state.close();
        Toast.toast.success("User created successfully.");
        onSuccess({ email: data.email, password: data.password });
      }
    } catch {
      setFormError(
        isEdit ? "Could not update user." : "Could not create user.",
      );
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
              <Modal.Heading>{isEdit ? "Edit User" : "Create User"}</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <Form validationBehavior="aria" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5 p-1">
                  <TextField
                    isInvalid={!!errors.name}
                    name="name"
                    value={name}
                    onChange={setName}
                  >
                    <Label>Name</Label>
                    <Input placeholder="e.g. John Doe" variant="secondary" />
                    <FieldError>{errors.name}</FieldError>
                  </TextField>

                  <TextField
                    isInvalid={!!errors.email}
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
                    <FieldError>{errors.email}</FieldError>
                  </TextField>

                  <Select
                    selectedKey={role}
                    onSelectionChange={(key) => setRole(key as Role)}
                  >
                    <Label>Role</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
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
                    <TextField
                      isInvalid={!!errors.unit}
                      name="unit"
                      value={unit}
                      onChange={setUnit}
                    >
                      <Label>Unit</Label>
                      <Input placeholder="e.g. 4B" variant="secondary" />
                      <FieldError>{errors.unit}</FieldError>
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
                    {isEdit ? "Save changes" : "Create user"}
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
