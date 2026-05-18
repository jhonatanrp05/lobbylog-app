import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";

import { getResidentsRequest, createPackageRequest } from "../../services/api";

const CLOUDINARY_CLOUD_NAME = "dhfsdpny9";
const CLOUDINARY_UPLOAD_PRESET = "lobbylog";

type Resident = {
  id: string;
  name: string;
  unit: string | null;
};

async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  const data = await res.json();

  return data.secure_url;
}

export default function LogPackagePage() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState<Resident[]>([]);
  const [description, setDescription] = useState("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResidents() {
      try {
        const data = await getResidentsRequest();

        setResidents(data);
      } catch {
        setError("Could not load residents.");
      }
    }
    fetchResidents();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      let photoUrl: string | undefined;

      if (photoFile) {
        photoUrl = await uploadImageToCloudinary(photoFile);
      }

      const body: {
        description: string;
        recipientId: string;
        photoUrl?: string;
      } = {
        description,
        recipientId,
      };

      if (photoUrl) {
        body.photoUrl = photoUrl;
      }

      await createPackageRequest(body);
      navigate("/packages/my-logged");
    } catch {
      setError("Could not create package.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Log Package</h1>

      <Form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <TextField
            isRequired
            name="description"
            value={description}
            onChange={setDescription}
          >
            <Label>Description</Label>
            <Input placeholder="e.g. Amazon — headphones" variant="secondary" />
            <FieldError />
          </TextField>

          <Select
            isRequired
            selectedKey={recipientId}
            onSelectionChange={(key) => setRecipientId(key as string)}
          >
            <Label>Recipient</Label>
            <Select.Trigger>
              <Select.Value>{!recipientId && "Select a resident"}</Select.Value>
              <Select.Indicator />
            </Select.Trigger>
            <FieldError />
            <Select.Popover>
              <ListBox>
                {residents.map((resident) => (
                  <ListBox.Item key={resident.id} id={resident.id}>
                    {resident.name}
                    {resident.unit ? ` — Unit ${resident.unit}` : ""}
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium text-foreground">
              Photo (optional)
            </Label>
            <input
              accept="image/*"
              className="block w-full cursor-pointer rounded-lg border border-border bg-field px-3 py-2 text-sm text-foreground file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-default file:px-3 file:py-1 file:text-sm file:text-foreground"
              type="file"
              onChange={handleFileChange}
            />
            {photoPreview && (
              <img
                alt="Preview"
                className="mt-2 h-40 w-full rounded-lg object-cover"
                src={photoPreview}
              />
            )}
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button className="w-full" isPending={isSubmitting} type="submit">
            Log package
          </Button>
        </div>
      </Form>
    </div>
  );
}
