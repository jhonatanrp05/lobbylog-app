import type { Resident, Package } from "@/lib/types";
import type { FieldErrors } from "@/lib/schemas";

import { useState, useEffect, useRef } from "react";
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

import {
  createPackageRequest,
  updatePackageRequest,
  getResidentsRequest,
} from "@/services/api";
import { packageFormSchema, collectErrors } from "@/lib/schemas";
import { CameraIcon } from "@/components/icons";

const CLOUDINARY_CLOUD_NAME = import.meta.env
  .VITE_CLOUDINARY_CLOUD_NAME as string;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET as string;

async function uploadPhoto(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  const data = await res.json();

  return data.secure_url as string;
}

type PackageFormModalProps = {
  state: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    setOpen: (value: boolean) => void;
    toggle: () => void;
  };
  pkg?: Package | null;
  onSuccess: () => void;
};

export function PackageFormModal({
  state,
  pkg,
  onSuccess,
}: PackageFormModalProps) {
  const isEdit = !!pkg;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function fetchResidents() {
      try {
        const data = await getResidentsRequest();

        if (Array.isArray(data)) setResidents(data);
      } catch {
        // non-critical
      }
    }
    fetchResidents();
  }, []);

  useEffect(() => {
    if (state.isOpen) {
      if (pkg) {
        setDescription(pkg.description);
        setRecipientId(pkg.recipientId);
        setExistingPhotoUrl(pkg.photoUrl);
        setPhotoPreview(pkg.photoUrl);
        setPhotoFile(null);
      }
      setErrors({});
      setFormError("");
    } else {
      setDescription("");
      setRecipientId("");
      setExistingPhotoUrl(null);
      setErrors({});
      setFormError("");
      removePhoto();
    }
  }, [state.isOpen, pkg]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setExistingPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const result = packageFormSchema.safeParse({ description, recipientId });

    if (!result.success) {
      setErrors(collectErrors(result.error));

      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      let photoUrl: string | null = existingPhotoUrl;

      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
      }

      const data = pkg
        ? await updatePackageRequest(pkg.id, {
            description,
            recipientId,
            photoUrl,
          })
        : await createPackageRequest({
            description,
            recipientId,
            photoUrl: photoUrl ?? undefined,
          });

      if (data.error) {
        setFormError(data.error);

        return;
      }

      onSuccess();
      state.close();
      Toast.toast.success(
        isEdit
          ? "Package updated successfully."
          : "Package logged successfully.",
      );
    } catch {
      setFormError(
        isEdit ? "Could not update package." : "Could not log package.",
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
              <Modal.Heading>
                {isEdit ? "Edit Package" : "Log Package"}
              </Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <Form validationBehavior="aria" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-foreground">
                      Photo (optional)
                    </span>
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      type="file"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          alt="Preview"
                          className="h-48 w-full object-cover"
                          src={photoPreview}
                        />
                        <button
                          className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                          type="button"
                          onClick={removePhoto}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M6 18L18 6M6 6l12 12"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/10 text-muted hover:border-foreground hover:text-foreground"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <CameraIcon className="h-8 w-8" />
                        <span className="text-sm">Tap to add photo</span>
                      </button>
                    )}
                    {photoPreview && (
                      <button
                        className="text-left text-sm text-muted hover:text-foreground"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change photo
                      </button>
                    )}
                  </div>

                  <TextField
                    isInvalid={!!errors.description}
                    name="description"
                    value={description}
                    onChange={setDescription}
                  >
                    <Label>Description</Label>
                    <Input placeholder="e.g. Amazon box" variant="secondary" />
                    <FieldError>{errors.description}</FieldError>
                  </TextField>

                  <Select
                    isInvalid={!!errors.recipientId}
                    selectedKey={recipientId}
                    onSelectionChange={(key) => setRecipientId(key as string)}
                  >
                    <Label>Recipient</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <FieldError>{errors.recipientId}</FieldError>
                    <Select.Popover>
                      <ListBox>
                        {residents.map((r) => (
                          <ListBox.Item key={r.id} id={r.id}>
                            {r.name}
                            {r.unit ? ` — ${r.unit}` : ""}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  {formError && (
                    <p className="text-sm text-danger">{formError}</p>
                  )}

                  <Button
                    className="w-full"
                    isPending={isSubmitting}
                    type="submit"
                  >
                    {isEdit ? "Save changes" : "Log package"}
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
