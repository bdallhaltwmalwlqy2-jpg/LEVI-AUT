import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ComingSoon from '@/components/coming-soon'

export default async function ComingSoonPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  return <ComingSoon email={user.email ?? ''} provider={user.app_metadata.provider ?? 'email'} />
}
