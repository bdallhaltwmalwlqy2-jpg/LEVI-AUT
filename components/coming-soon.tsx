'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Clock3, LogOut, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ComingSoon({ email, provider }: { email: string; provider: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const logout = async () => { setLoading(true); await createClient().auth.signOut(); router.replace('/') }
  return <main className="coming-soon-shell"><div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="noise" /><header className="topbar"><Link className="wordmark" href="/"><span className="brand-mark"><span>L</span><i /></span><span>LEVI<span className="wordmark-accent">—</span>AUT</span></Link><button className="logout-button" onClick={logout} disabled={loading}>{loading ? '...' : <><LogOut size={15} /> Log out</>}</button></header><section className="coming-soon-content"><div className="coming-soon-card"><div className="coming-icon"><Sparkles size={23} /></div><div className="eyebrow">PRIVATE PREVIEW / ACCESS CONFIRMED</div><h1>We&apos;re building<br /><em>something exceptional.</em></h1><p>Your account is ready. The LEVI-AUT command center is being shaped with intention and will be available here soon.</p><div className="progress-track"><span /></div><div className="coming-meta"><span><Clock3 size={14} /> In active development</span><span><span className="live-dot" /> {email}</span></div><div className="account-chip"><span className="avatar">{email.charAt(0).toUpperCase()}</span><span><small>AUTHENTICATED VIA</small><strong>{provider}</strong></span><ArrowUpRight size={16} /></div></div></section><footer className="footer"><span>© 2025 LEVI-AUT SYSTEMS</span><span>YOUR ACCESS IS RESERVED</span></footer></main>
}
