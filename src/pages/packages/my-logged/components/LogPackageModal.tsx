import type { Resident } from "@/lib/types";

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

import { createPackageRequest, getResidentsRequest } from "@/services/api";
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

type LogPackageModalProps = {
  state: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    setOpen: (value: boolean) => void;
    toggle: () => void;
  };
  onSuccess: () => void;
};

export function LogPackageModal({ state, onSuccess }: LogPackageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [description, setDescription] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [residents, setResidents] = useState<Resident[]>([]);
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
    if (!state.isOpen) {
      setDescription("");
      setRecipientId("");
      setFormError("");
      removePhoto();
    }
  }, [state.isOpen]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      let photoUrl: string | undefined;

      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile);
      }

      const data = await createPackageRequest({
        description,
        recipientId,
        photoUrl,
      });

      if (data.error) {
        setFormError(data.error);

        return;
      }

      onSuccess();
      state.close();
      Toast.toast.success("Package logged successfully.");
    } catch {
      setFormError("Could not log package.");
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
              <Modal.Heading>Log Package</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
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
                    isRequired
                    name="description"
                    value={description}
                    onChange={setDescription}
                  >
                    <Label>Description</Label>
                    <Input placeholder="e.g. Amazon box" variant="secondary" />
                    <FieldError />
                  </TextField>

                  <Select
                    isRequired
                    selectedKey={recipientId}
                    onSelectionChange={(key) => setRecipientId(key as string)}
                  >
                    <Label>Recipient</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <FieldError />
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
                    Log package
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
