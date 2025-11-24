// Database types matching the Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type UserRole = 'admin' | 'moderator' | 'user' | 'guest'
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertStatus = 'active' | 'resolved' | 'dismissed' | 'investigating'
export type VerificationStatus = 'pending' | 'verified' | 'debunked' | 'misleading' | 'unverified'
export type ClaimType = 'verification' | 'fact_check' | 'analysis'

// Database table types
export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  department: string | null
  phone: string | null
  timezone: string
  language: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AlertSubscription {
  id: string
  user_id: string
  categories: string[]
  regions: string[]
  severity: AlertSeverity[]
  channels: string[]
  enabled: boolean
  created_at: string
  updated_at: string
}

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  status: AlertStatus
  category: string | null
  source: string | null
  assigned_to: string | null
  tags: string[]
  actions: string[]
  related_incidents: number
  metadata: Json
  created_at: string
  updated_at: string
  resolved_at: string | null
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  event_category: string | null
  user_id: string | null
  data: Json
  created_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  details: Json
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface Claim {
  id: string
  claim: string
  source: string | null
  url: string | null
  context: string | null
  category: string | null
  submitted_by: string | null
  status: VerificationStatus
  confidence_score: number | null
  ai_verdict: string | null
  claim_type: ClaimType
  evidence: Json
  fact_check_details: string | null
  verified_by: string | null
  verified_at: string | null
  engagement: number
  reach: number
  location: string | null
  tags: string[]
  metadata: Json
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  category: string | null
  message: string
  status: string
  assigned_to: string | null
  response: string | null
  created_at: string
  updated_at: string
}

export interface FeedItem {
  id: string
  source_id: string | null
  content: string
  platform: string | null
  author: string | null
  url: string | null
  engagement: number
  sentiment: number | null
  risk_level: string | null
  verified: boolean
  location: string | null
  tags: string[]
  metadata: Json
  created_at: string
}

export interface Report {
  id: string
  type: string
  source: string
  url: string | null
  description: string
  impact: string | null
  evidence: string | null
  anonymous: boolean
  contact: string | null
  submitted_by: string | null
  status: string
  assigned_to: string | null
  resolution_notes: string | null
  resolved_at: string | null
  created_at: string
  updated_at: string
}

export interface Source {
  id: string
  name: string
  type: string
  url: string | null
  enabled: boolean
  api_key: string | null
  config: Json
  status: string
  last_check: string | null
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  two_factor_enabled: boolean
  session_timeout: string
  ip_whitelist: boolean
  audit_logging: boolean
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean
  slack_notifications: boolean
  created_at: string
  updated_at: string
}

// Insert types (for creating new records)
export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>
export type AlertSubscriptionInsert = Omit<AlertSubscription, 'id' | 'created_at' | 'updated_at'> & {
  categories?: string[]
  regions?: string[]
  severity?: AlertSeverity[]
  channels?: string[]
}
export type AlertInsert = Omit<Alert, 'id' | 'created_at' | 'updated_at' | 'resolved_at'>
export type AnalyticsEventInsert = Omit<AnalyticsEvent, 'id' | 'created_at'> & {
  user_id?: string | null
}
export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at'>
export type ClaimInsert = Omit<Claim, 'id' | 'created_at' | 'updated_at' | 'verified_at'> & {
  status?: VerificationStatus
  metadata?: Json
  confidence_score?: number | null
  ai_verdict?: string | null
  fact_check_details?: string | null
  verified_by?: string | null
  engagement?: number
  reach?: number
}
export type ContactMessageInsert = Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'> & {
  status?: string
  assigned_to?: string | null
  response?: string | null
}
export type FeedItemInsert = Omit<FeedItem, 'id' | 'created_at'>
export type ReportInsert = Omit<Report, 'id' | 'created_at' | 'updated_at' | 'resolved_at'> & {
  status?: string
  assigned_to?: string | null
  resolution_notes?: string | null
}
export type SourceInsert = Omit<Source, 'id' | 'created_at' | 'updated_at' | 'last_check'> & {
  status?: string
}
export type UserSettingsInsert = Omit<UserSettings, 'id' | 'created_at' | 'updated_at'> & {
  two_factor_enabled?: boolean
  session_timeout?: string
  ip_whitelist?: boolean
  audit_logging?: boolean
  email_notifications?: boolean
  sms_notifications?: boolean
  push_notifications?: boolean
  slack_notifications?: boolean
}

// Update types (for updating existing records)
export type ProfileUpdate = Partial<ProfileInsert>
export type AlertSubscriptionUpdate = Partial<Omit<AlertSubscriptionInsert, 'user_id'>>
export type AlertUpdate = Partial<AlertInsert> & {
  resolved_at?: string | null
}
export type ClaimUpdate = Partial<Omit<ClaimInsert, 'submitted_by'>>
export type ContactMessageUpdate = Partial<Omit<ContactMessageInsert, 'name' | 'email'>>
export type FeedItemUpdate = Partial<FeedItemInsert>
export type ReportUpdate = Partial<Omit<ReportInsert, 'submitted_by'>> & {
  resolved_at?: string | null
}
export type SourceUpdate = Partial<SourceInsert>
export type UserSettingsUpdate = Partial<Omit<UserSettingsInsert, 'user_id'>>

// Database response types (for API responses)
export interface DatabaseResponse<T> {
  data: T | null
  error: string | null
  count: number | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
  page: number
  pageSize: number
}

// Filter types for queries
export interface ClaimsFilter {
  status?: VerificationStatus
  category?: string
  submitted_by?: string
  claim_type?: ClaimType
  tags?: string[]
  location?: string
  date_from?: string
  date_to?: string
}

export interface ReportsFilter {
  status?: string
  type?: string
  submitted_by?: string
  assigned_to?: string
  date_from?: string
  date_to?: string
}

export interface AnalyticsFilter {
  event_type?: string
  event_category?: string
  user_id?: string
  date_from?: string
  date_to?: string
}

export interface AlertsFilter {
  severity?: AlertSeverity
  status?: AlertStatus
  category?: string
  assigned_to?: string
  date_from?: string
  date_to?: string
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      alert_subscriptions: {
        Row: AlertSubscription
        Insert: AlertSubscriptionInsert
        Update: AlertSubscriptionUpdate
      }
      alerts: {
        Row: Alert
        Insert: AlertInsert
        Update: AlertUpdate
      }
      analytics_events: {
        Row: AnalyticsEvent
        Insert: AnalyticsEventInsert
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
      }
      claims: {
        Row: Claim
        Insert: ClaimInsert
        Update: ClaimUpdate
      }
      contact_messages: {
        Row: ContactMessage
        Insert: ContactMessageInsert
        Update: ContactMessageUpdate
      }
      feed_items: {
        Row: FeedItem
        Insert: FeedItemInsert
        Update: FeedItemUpdate
      }
      reports: {
        Row: Report
        Insert: ReportInsert
        Update: ReportUpdate
      }
      sources: {
        Row: Source
        Insert: SourceInsert
        Update: SourceUpdate
      }
      user_settings: {
        Row: UserSettings
        Insert: UserSettingsInsert
        Update: UserSettingsUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      alert_severity: AlertSeverity
      alert_status: AlertStatus
      verification_status: VerificationStatus
      claim_type: ClaimType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

