import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database/types'
import { createClient } from '@supabase/supabase-js'

export const supabase = createServerComponentClient<Database>({ cookies })

export async function createServiceRoleClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Server-side auth helpers
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return { data, error }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await getUserRole(userId)
  return data?.role === 'admin'
}

export async function isModerator(userId: string): Promise<boolean> {
  const { data } = await getUserRole(userId)
  return data?.role === 'moderator' || data?.role === 'admin'
}