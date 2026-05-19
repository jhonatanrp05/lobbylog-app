import type { Role, User, CreatedCredentials } from "@/lib/types";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
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
import { userFormSchema } from "@/lib/schemas";

type FormSchema = z.infer<typeof userFormSchema>;

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
  const [formError, setFormError] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: { name: "", email: "", role: "RESIDENT" as const, unit: "" },
    resolver: zodResolver(userFormSchema),
  });

  const watchedRole = watch("role");

  useEffect(() => {
    if (!state.isOpen) return;
    setFormError("");
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role === "RECEPTIONIST" ? "RECEPTIONIST" : "RESIDENT",
        unit: user.unit ?? "",
      });
    } else {
      reset({ name: "", email: "", role: "RESIDENT" as const, unit: "" });
    }
  }, [state.isOpen, user]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: FormSchema) => {
      const body: { name: string; email: string; role: Role; unit?: string } = {
        name: values.name,
        email: values.email,
        role: values.role,
        ...(values.role === "RESIDENT" && values.unit ? { unit: values.unit } : {}),
      };

      return user ? updateUserRequest(user.id, body) : createUserRequest(body);
    },
    onSuccess: (data) => {
      if (data.error) {
        setFormError(data.error);

        return;
      }
      state.close();
      Toast.toast.success(
        isEdit ? "User updated successfully." : "User created successfully.",
      );
      onSuccess(isEdit ? undefined : { email: data.email, password: data.password });
    },
    onError: () =>
      setFormError(isEdit ? "Could not update user." : "Could not create user."),
  });

  const onSubmit = (values: FormSchema) => {
    setFormError("");
    mutate(values);
  };

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
              <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 p-1">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <TextField {...field} isInvalid={!!errors.name}>
                        <Label>Name</Label>
                        <Input placeholder="e.g. John Doe" variant="secondary" />
                        <FieldError>{errors.name?.message}</FieldError>
                      </TextField>
                    )}
                  />

                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <TextField {...field} isInvalid={!!errors.email} type="email">
                        <Label>Email</Label>
                        <Input
                          placeholder="e.g. john@example.com"
                          variant="secondary"
                        />
                        <FieldError>{errors.email?.message}</FieldError>
                      </TextField>
                    )}
                  />

                  <Controller
                    control={control}
                    name="role"
                    render={({ field }) => (
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(key as Role)}
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
                    )}
                  />

                  {watchedRole === "RESIDENT" && (
                    <Controller
                      control={control}
                      name="unit"
                      render={({ field }) => (
                        <TextField {...field} isInvalid={!!errors.unit}>
                          <Label>Unit</Label>
                          <Input placeholder="e.g. 4B" variant="secondary" />
                          <FieldError>{errors.unit?.message}</FieldError>
                        </TextField>
                      )}
                    />
                  )}

                  {formError && (
                    <p className="text-sm text-danger">{formError}</p>
                  )}

                  <Button className="w-full" isPending={isPending} type="submit">
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
