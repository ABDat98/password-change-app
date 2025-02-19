import { z } from "zod";

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(64, "New password must be less than 64 characters")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
        .regex(/[a-z]/, "New password must contain at least one lowercase letter")
        .regex(/\d/, "New password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "New password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            path: ["confirmPassword"],
            message: "Passwords don't match",
            code: z.ZodIssueCode.custom,
        });
    }
});

export type FormFields = z.infer<typeof passwordSchema>;
