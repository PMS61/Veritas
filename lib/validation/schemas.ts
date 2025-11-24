/**
 * Validation schemas for form inputs across the application
 * Using Zod for runtime type validation
 * Updated to match Supabase database schema
 */

import { z } from 'zod';

// Enum types matching Supabase schema
export const UserRoleEnum = z.enum(['admin', 'moderator', 'user', 'guest']);
export const AlertSeverityEnum = z.enum(['critical', 'high', 'medium', 'low']);
export const AlertStatusEnum = z.enum(['active', 'resolved', 'dismissed', 'investigating']);
export const VerificationStatusEnum = z.enum(['pending', 'verified', 'debunked', 'misleading', 'unverified']);
export const ClaimTypeEnum = z.enum(['verification', 'fact_check', 'analysis']);

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  role: UserRoleEnum.default('user'),
  department: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Claims verification schemas
export const claimSchema = z.object({
  claim: z.string()
    .min(10, 'Claim must be at least 10 characters')
    .max(2000, 'Claim must not exceed 2000 characters'),
  source: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  context: z.string().optional(),
  category: z.string().optional(),
  claim_type: ClaimTypeEnum.default('verification'),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  evidence: z.array(z.any()).default([]),
});

export const claimUpdateSchema = z.object({
  claim: z.string()
    .min(10, 'Claim must be at least 10 characters')
    .max(2000, 'Claim must not exceed 2000 characters')
    .optional(),
  source: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  context: z.string().optional(),
  category: z.string().optional(),
  claim_type: ClaimTypeEnum.optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  evidence: z.array(z.any()).optional(),
});

export const claimStatusUpdateSchema = z.object({
  status: VerificationStatusEnum,
  ai_verdict: z.string().optional(),
  fact_check_details: z.string().optional(),
  confidence_score: z.number().min(0).max(100).optional(),
});

// Report schemas
export const reportSchema = z.object({
  type: z.string().min(1, 'Please select a report type'),
  source: z.string().min(1, 'Please specify the source'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  impact: z.string().optional(),
  evidence: z.string().optional(),
  anonymous: z.boolean().default(false),
  contact: z.string().optional(),
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  category: z.string().optional(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters'),
});

// User profile schema
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: UserRoleEnum,
  department: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().default('UTC'),
  language: z.string().default('en'),
  avatar_url: z.string().url('Invalid URL').optional().nullable(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  avatar_url: z.string().url('Invalid URL').optional().nullable(),
});

// User settings schema
export const userSettingsSchema = z.object({
  two_factor_enabled: z.boolean().default(false),
  session_timeout: z.string().default('24h'),
  ip_whitelist: z.boolean().default(false),
  audit_logging: z.boolean().default(true),
  email_notifications: z.boolean().default(true),
  sms_notifications: z.boolean().default(false),
  push_notifications: z.boolean().default(true),
  slack_notifications: z.boolean().default(false),
});

// Password update schema
export const passwordUpdateSchema = z.object({
  password: z.string()
    .min(6, 'New password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Alert schemas
export const alertSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: AlertSeverityEnum,
  status: AlertStatusEnum.default('active'),
  category: z.string().optional(),
  source: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  tags: z.array(z.string()).default([]),
  actions: z.array(z.string()).default([]),
  related_incidents: z.number().default(0),
  metadata: z.any().default({}),
});

export const alertUpdateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  severity: AlertSeverityEnum.optional(),
  status: AlertStatusEnum.optional(),
  category: z.string().optional(),
  source: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  actions: z.array(z.string()).optional(),
  related_incidents: z.number().optional(),
  metadata: z.any().optional(),
});

// Alert subscription schema
export const alertSubscriptionSchema = z.object({
  categories: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  severity: z.array(AlertSeverityEnum).default(['critical', 'high']),
  channels: z.array(z.string()).default([]),
  enabled: z.boolean().default(true),
});

// Source schemas
export const sourceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.string().min(1, 'Type is required'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  enabled: z.boolean().default(true),
  api_key: z.string().optional(),
  config: z.any().default({}),
});

export const sourceUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  type: z.string().min(1, 'Type is required').optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  enabled: z.boolean().optional(),
  api_key: z.string().optional(),
  config: z.any().optional(),
});

// Feed item schemas
export const feedItemSchema = z.object({
  source_id: z.string().uuid().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  platform: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  engagement: z.number().default(0),
  sentiment: z.number().min(-1).max(1).optional(),
  risk_level: z.string().optional(),
  verified: z.boolean().default(false),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.any().default({}),
});

export const feedItemUpdateSchema = z.object({
  source_id: z.string().uuid().optional(),
  content: z.string().min(10, 'Content must be at least 10 characters').optional(),
  platform: z.string().optional(),
  author: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  engagement: z.number().optional(),
  sentiment: z.number().min(-1).max(1).optional(),
  risk_level: z.string().optional(),
  verified: z.boolean().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional(),
});

// Analytics event schema
export const analyticsEventSchema = z.object({
  event_type: z.string().min(1, 'Event type is required'),
  event_category: z.string().optional(),
  user_id: z.string().uuid().optional(),
  data: z.any().default({}),
});

// Filter schemas
export const claimsFilterSchema = z.object({
  status: VerificationStatusEnum.optional(),
  category: z.string().optional(),
  submitted_by: z.string().uuid().optional(),
  claim_type: ClaimTypeEnum.optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

export const reportsFilterSchema = z.object({
  status: z.string().optional(),
  type: z.string().optional(),
  submitted_by: z.string().uuid().optional(),
  assigned_to: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

export const alertsFilterSchema = z.object({
  severity: AlertSeverityEnum.optional(),
  status: AlertStatusEnum.optional(),
  category: z.string().optional(),
  assigned_to: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

export const analyticsFilterSchema = z.object({
  event_type: z.string().optional(),
  event_category: z.string().optional(),
  user_id: z.string().uuid().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
});

// Time range schema
export const timeRangeSchema = z.object({
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

// Export types for TypeScript
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type ClaimUpdateInput = z.infer<typeof claimUpdateSchema>;
export type ClaimStatusUpdateInput = z.infer<typeof claimStatusUpdateSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type AlertInput = z.infer<typeof alertSchema>;
export type AlertUpdateInput = z.infer<typeof alertUpdateSchema>;
export type AlertSubscriptionInput = z.infer<typeof alertSubscriptionSchema>;
export type SourceInput = z.infer<typeof sourceSchema>;
export type SourceUpdateInput = z.infer<typeof sourceUpdateSchema>;
export type FeedItemInput = z.infer<typeof feedItemSchema>;
export type FeedItemUpdateInput = z.infer<typeof feedItemUpdateSchema>;
export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
export type ClaimsFilterInput = z.infer<typeof claimsFilterSchema>;
export type ReportsFilterInput = z.infer<typeof reportsFilterSchema>;
export type AlertsFilterInput = z.infer<typeof alertsFilterSchema>;
export type AnalyticsFilterInput = z.infer<typeof analyticsFilterSchema>;
export type TimeRangeInput = z.infer<typeof timeRangeSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

// Export enum types
export type UserRole = z.infer<typeof UserRoleEnum>;
export type AlertSeverity = z.infer<typeof AlertSeverityEnum>;
export type AlertStatus = z.infer<typeof AlertStatusEnum>;
export type VerificationStatus = z.infer<typeof VerificationStatusEnum>;
export type ClaimType = z.infer<typeof ClaimTypeEnum>;
