/**
 * Validation schemas for form inputs across the application
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Verification schemas
export const verificationSchema = z.object({
  claim: z.string()
    .min(10, 'Claim must be at least 10 characters')
    .max(1000, 'Claim must not exceed 1000 characters'),
  source: z.string().optional(),
  context: z.string().optional(),
  category: z.string().optional(),
});

// Report schemas
export const reportSchema = z.object({
  type: z.string().min(1, 'Please select a report type'),
  source: z.string().min(1, 'Please specify the source'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  impact: z.string().min(1, 'Please select an impact level'),
  evidence: z.string().optional(),
  anonymous: z.boolean(),
  contact: z.string().optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
});

// User profile schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
});

// Password update schema
export const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Alert subscription schema
export const alertSubscriptionSchema = z.object({
  categories: z.array(z.string()),
  regions: z.array(z.string()).optional(),
  severity: z.array(z.string()),
  channels: z.array(z.string()).min(1, 'Select at least one notification channel'),
});

// Verification action schema
export const verificationActionSchema = z.object({
  claimId: z.number(),
  action: z.enum(['approve', 'reject', 'flag', 'edit']),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  notes: z.string().optional(),
});

// Export types for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerificationInput = z.infer<typeof verificationSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type AlertSubscriptionInput = z.infer<typeof alertSubscriptionSchema>;
export type VerificationActionInput = z.infer<typeof verificationActionSchema>;
