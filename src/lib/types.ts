// Auth / Users
export type Role = "ADMIN" | "RECEPTIONIST" | "RESIDENT";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  unit: string | null;
};

export type CreatedCredentials = {
  email: string;
  password: string;
};

export type Resident = {
  id: string;
  name: string;
  unit: string | null;
};

// Packages
export type PackageStatus = "PENDING" | "DELIVERED" | "CONFIRMED";

export type Package = {
  id: string;
  description: string;
  status: PackageStatus;
  createdAt: string;
  deliveredAt: string | null;
  photoUrl: string | null;
  recipientId: string;
  recipient?: { name: string; unit: string | null };
  porter?: { name: string };
};

export type AdminPackage = {
  id: string;
  description: string;
  status: PackageStatus;
  createdAt: string;
  deliveredAt: string | null;
  recipientId: string;
  photoUrl: string | null;
  recipient: { name: string; unit: string | null };
  porter: { name: string };
};
