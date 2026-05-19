import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const userFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name is too long"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email format"),
    role: z.enum(["RECEPTIONIST", "RESIDENT"]),
    unit: z.string().optional(),
  })
  .refine((data) => data.role !== "RESIDENT" || !!data.unit?.trim(), {
    message: "Unit is required for residents",
    path: ["unit"],
  });

export const packageFormSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description is too long"),
  recipientId: z.string().min(1, "Please select a recipient"),
});

export type FieldErrors = Record<string, string>;

export function collectErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key === "string" && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors;
}
