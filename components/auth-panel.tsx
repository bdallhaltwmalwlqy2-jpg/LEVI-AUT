'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Eye, EyeOff, GitBranch, Globe2, KeyRound, Loader2, Mail, MessageSquare, Moon, Phone, ShieldCheck, Sun, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Language = 'en' | 'ar'
type AuthMode = 'login' | 'signup' | 'magic' | 'reset' | 'phone'
type OAuthProvider = 'google' | 'github' | 'discord' | 'azure' | 'apple' | 'facebook' | 'gitlab' | 'twitter' | 'twitch' | 'spotify' | 'linkedin'

const copy = {
  en: {
    eyebrow: 'AUTONOMY, REFINED', title: 'Welcome back.', signupTitle: 'Create your account.', description: 'Your intelligent operations layer is ready when you are.', signupDescription: 'Start your private command center in less than a minute.', email: 'Email address', phone: 'Phone number', otp: 'Verification code', password: 'Password', confirmPassword: 'Confirm password', emailPlaceholder: 'you@company.com', phonePlaceholder: '+1 555 000 0000', passwordPlaceholder: 'Enter your password', otpPlaceholder: 'Enter 6-digit code', remember: 'Remember me', forgot: 'Forgot password?', login: 'Sign in', signup: 'Create account', create: 'Create account', or: 'OR CONTINUE WITH', magic: 'Send magic link', magicHint: 'No password needed. We will email you a secure sign-in link.', phoneLogin: 'Use phone OTP', phoneHint: 'We will send a one-time code by SMS.', verify: 'Verify code', resend: 'Send another code', back: 'Back to password login', newAccount: 'New to LEVI-AUT?', existingAccount: 'Already have an account?', signUpLink: 'Create your account', loginLink: 'Sign in', secure: 'Secure by Supabase Auth', protected: 'Your data stays yours', invalid: 'Please enter valid credentials.', generic: 'Something went wrong. Please try again.', sent: 'Check your inbox for a secure sign-in link.', resetSent: 'Password reset instructions are on their way.', resetTitle: 'Reset your password', resetHint: 'Enter your email and we will send a secure reset link.', reset: 'Send reset link', passwordShort: 'Password must be at least 6 characters.', passwordsMismatch: 'Passwords do not match.', emailRequired: 'Email is required.', phoneRequired: 'Phone number is required.', otpRequired: 'Enter the verification code.', passwordRequired: 'Password is required.', registered: 'Account created. Check your email to verify it, then continue.', codeSent: 'Verification code sent.', oauthUnavailable: 'OAuth buttons appear only after their providers are enabled in Supabase.',
  },
  ar: {
    eyebrow: 'استقلالية مصقولة', title: 'مرحبًا بعودتك.', signupTitle: 'أنشئ حسابك.', description: 'طبقة عملياتك الذكية جاهزة عندما تكون مستعدًا.', signupDescription: 'ابدأ مركز قيادتك الخاص خلال أقل من دقيقة.', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', otp: 'رمز التحقق', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور', emailPlaceholder: 'you@company.com', phonePlaceholder: '+966 50 000 0000', passwordPlaceholder: 'أدخل كلمة المرور', otpPlaceholder: 'أدخل الرمز المكوّن من 6 أرقام', remember: 'تذكرني', forgot: 'نسيت كلمة المرور؟', login: 'تسجيل الدخول', signup: 'إنشاء الحساب', create: 'إنشاء حساب', or: 'أو المتابعة باستخدام', magic: 'إرسال رابط سحري', magicHint: 'بدون كلمة مرور. سنرسل لك رابط دخول آمنًا عبر البريد.', phoneLogin: 'الدخول برمز الهاتف', phoneHint: 'سنرسل رمزًا لمرة واحدة عبر SMS.', verify: 'تحقق من الرمز', resend: 'إرسال رمز آخر', back: 'العودة لتسجيل الدخول', newAccount: 'جديد على LEVI-AUT؟', existingAccount: 'لديك حساب بالفعل؟', signUpLink: 'أنشئ حسابك', loginLink: 'تسجيل الدخول', secure: 'محمي بواسطة Supabase Auth', protected: 'بياناتك ملكك دائمًا', invalid: 'أدخل بيانات دخول صالحة.', generic: 'حدث خطأ ما.', sent: 'تحقق من بريدك للحصول على رابط الدخول الآمن.', resetSent: 'تم إرسال تعليمات إعادة تعيين كلمة المرور.', resetTitle: 'إعادة تعيين كلمة المرور', resetHint: 'أدخل بريدك وسنرسل رابطًا آمنًا لإعادة التعيين.', reset: 'إرسال رابط التعيين', passwordShort: 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.', passwordsMismatch: 'كلمتا المرور غير متطابقتين.', emailRequired: 'البريد الإلكتروني مطلوب.', phoneRequired: 'رقم الهاتف مطلوب.', otpRequired: 'أدخل رمز التحقق.', passwordRequired: 'كلمة المرور مطلوبة.', registered: 'تم إنشاء الحساب. تحقق من بريدك ثم تابع.', codeSent: 'تم إرسال رمز التحقق.', oauthUnavailable: 'تظهر أزرار OAuth فقط بعد تفعيل مزوّديها في Supabase.',
  },
} as const

const providerMeta: Record<OAuthProvider, { label: string; icon: React.ElementType }> = {
  google: { label: 'Google', icon: Globe2 }, github: { label: 'GitHub', icon: GitBranch }, discord: { label: 'Discord', icon: MessageIcon }, azure: { label: 'Microsoft', icon: MicrosoftIcon }, apple: { label: 'Apple', icon: AppleIcon }, facebook: { label: 'Facebook', icon: FacebookIcon }, gitlab: { label: 'GitLab', icon: GitlabIcon }, twitter: { label: 'X', icon: X }, twitch: { label: 'Twitch', icon: TwitchIcon }, spotify: { label: 'Spotify', icon: SpotifyIcon }, linkedin: { label: 'LinkedIn', icon: LinkedinIcon },
}

function MessageIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.4 8.4 0 0 1-3.6-.8L4 20l1.3-3.2A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z"/><path d="M8 12h.01M12 12h.01M16 12h.01" strokeLinecap="round"/></svg> }
function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z"/></svg> }
function AppleIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M16.7 12.8c0-2.2 1.8-3.3 1.9-3.4a4.1 4.1 0 0 0-3.2-1.7c-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8a4.5 4.5 0 0 0-3.8 2.3c-1.6 2.8-.4 7 1.1 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.6-3.7ZM14.5 6.3c.6-.8 1-1.8.9-2.8-.9 0-2 .6-2.7 1.3-.6.6-1.1 1.7-.9 2.7 1 .1 2-.5 2.7-1.2Z"/></svg> }
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.5-4 4.1V10H8v3h2.3v8h3.1Z"/></svg> }
function GitlabIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="m12 21 3-8H9l3 8Zm0 0-8.6-8L5 5l1.6-8 4 8h6l4-8 1.6 8L12 21Z"/></svg> }
function TwitchIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><path d="M5 3h15v11l-4 4h-4l-2 2H7v-4H5V3Z"/><path d="M10 8v4M15 8v4"/></svg> }
function SpotifyIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}><circle cx="12" cy="12" r="8.7"/><path d="M7.5 10.2c3.3-1 6.4-.7 9.1.5M8.2 13c2.5-.7 5.2-.5 7.5.5M9.2 15.6c1.8-.4 3.6-.2 5.2.4" strokeLinecap="round"/></svg> }
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M5.2 8.5H2.4V21h2.8V8.5ZM3.8 3a1.7 1.7 0 1 0 0 3.4A1.7 1.7 0 0 0 3.8 3ZM21 13.8c0-3.8-2-5.6-4.7-5.6-2.1 0-3 1.2-3.5 2v-1.7H10V21h2.8v-6.2c0-1.6.3-3.1 2.2-3.1 1.9 0 1.9 1.8 1.9 3.2V21H21v-7.2Z"/></svg> }
function Logo() { return <div className="brand-mark" aria-hidden="true"><span>L</span><i /></div> }

export default function AuthPanel() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>('en')
  const [isDark, setIsDark] = useState(true)
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const providers = useMemo(() => {
    const raw = process.env.NEXT_PUBLIC_ENABLED_OAUTH_PROVIDERS?.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean) ?? []
    return raw.filter((p): p is OAuthProvider => p in providerMeta)
  }, [])
  const t = copy[language]
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) router.replace('/coming-soon') })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (session?.user) router.replace('/coming-soon') })
    return () => listener.subscription.unsubscribe()
  }, [router, supabase])

  const complete = () => router.push('/coming-soon')
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage(null)
    if (mode === 'phone') {
      if (!phone) return setMessage({ type: 'error', text: t.phoneRequired })
      setLoading(true)
      const result = otpSent ? await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' }) : await supabase.auth.signInWithOtp({ phone })
      setLoading(false)
      if (result.error) return setMessage({ type: 'error', text: result.error.message })
      if (otpSent) complete(); else { setOtpSent(true); setMessage({ type: 'success', text: t.codeSent }) }
      return
    }
    if (!email) return setMessage({ type: 'error', text: t.emailRequired })
    if ((mode === 'login' || mode === 'signup') && !password) return setMessage({ type: 'error', text: t.passwordRequired })
    if ((mode === 'login' || mode === 'signup') && password.length < 6) return setMessage({ type: 'error', text: t.passwordShort })
    if (mode === 'signup' && password !== confirmPassword) return setMessage({ type: 'error', text: t.passwordsMismatch })
    setLoading(true)
    const origin = window.location.origin
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${origin}/auth/callback?next=/coming-soon` } })
      : mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === 'magic'
          ? await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/auth/callback?next=/coming-soon` } })
          : await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback?next=/coming-soon` })
    setLoading(false)
    if (result.error) return setMessage({ type: 'error', text: result.error.message.toLowerCase().includes('invalid') ? t.invalid : result.error.message })
    if (mode === 'signup' && 'data' in result && (result.data as { session?: unknown }).session) return complete()
    setMessage({ type: 'success', text: mode === 'signup' ? t.registered : mode === 'magic' ? t.sent : mode === 'reset' ? t.resetSent : 'Authenticated.' })
    if (mode === 'login') complete()
  }

  const oauth = async (provider: OAuthProvider) => {
    setMessage(null); setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({ provider: provider as never, options: { redirectTo: `${window.location.origin}/auth/callback?next=/coming-soon` } })
    setLoading(false); if (error) setMessage({ type: 'error', text: error.message })
  }

  const title = mode === 'signup' ? t.signupTitle : mode === 'reset' ? t.resetTitle : mode === 'phone' ? t.phoneLogin : t.title
  const description = mode === 'signup' ? t.signupDescription : mode === 'reset' ? t.resetHint : mode === 'magic' ? t.magicHint : mode === 'phone' ? t.phoneHint : t.description
  const primaryLabel = mode === 'signup' ? t.signup : mode === 'reset' ? t.reset : mode === 'phone' ? (otpSent ? t.verify : t.phoneLogin) : mode === 'magic' ? t.magic : t.login

  return <main className={`auth-shell ${isDark ? '' : 'light-mode'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="noise" />
    <header className="topbar"><a className="wordmark" href="#" aria-label="LEVI-AUT home"><Logo /><span>LEVI<span className="wordmark-accent">—</span>AUT</span></a><div className="top-actions"><button className="icon-button" onClick={() => setIsDark(!isDark)} aria-label="Toggle theme">{isDark ? <Sun size={16} /> : <Moon size={16} />}</button><button className="language-button" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}><Globe2 size={15} /> {language === 'en' ? 'العربية' : 'English'}</button></div></header>
    <section className="auth-layout"><aside className="story-panel"><div className="eyebrow"><span className="pulse-dot" /> {t.eyebrow}</div><h1>Build the future.<br /><em>Operate it</em> beautifully.</h1><p className="story-copy">LEVI-AUT gives ambitious teams a clear, intelligent layer for work that moves itself forward.</p><div className="signal-card"><div className="signal-top"><span>LIVE SYSTEM SIGNAL</span><span className="signal-status">● nominal</span></div><div className="signal-line"><span className="signal-wave" /><strong>99.98%</strong><small>operational clarity</small></div><div className="signal-footer"><span>All systems aligned</span><span>07:42:18 UTC</span></div></div><div className="trust-row"><ShieldCheck size={15} /><span>{t.secure}</span><span className="trust-separator" /><span>{t.protected}</span></div></aside>
      <section className="login-column"><div className="login-card"><div className="card-orbit" /><div className="card-heading"><div className="mobile-logo"><Logo /></div><div className="eyebrow">{mode === 'signup' ? 'CREATE YOUR ACCESS' : mode === 'reset' ? 'ACCOUNT RECOVERY' : mode === 'phone' ? 'PHONE VERIFICATION' : 'ACCESS YOUR COMMAND CENTER'}</div><h2>{title}</h2><p>{description}</p></div>
        <form onSubmit={submit} className="auth-form">{mode === 'phone' ? <label>{t.phone}<div className="input-wrap"><Phone size={17} /><input type="tel" autoComplete="tel" placeholder={t.phonePlaceholder} value={phone} onChange={(e) => setPhone(e.target.value)} disabled={otpSent} /></div></label> : <label>{t.email}<div className="input-wrap"><Mail size={17} /><input type="email" autoComplete="email" placeholder={t.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} /></div></label>}{mode === 'phone' && otpSent && <label>{t.otp}<div className="input-wrap"><MessageSquare size={17} /><input inputMode="numeric" autoComplete="one-time-code" placeholder={t.otpPlaceholder} value={otp} onChange={(e) => setOtp(e.target.value)} /></div></label>}{(mode === 'login' || mode === 'signup') && <label>{t.password}<div className="input-wrap"><KeyRound size={17} /><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder={t.passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="input-action" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>}{mode === 'signup' && <label>{t.confirmPassword}<div className="input-wrap"><KeyRound size={17} /><input type="password" autoComplete="new-password" placeholder={t.passwordPlaceholder} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div></label>}{mode === 'login' && <div className="form-meta"><label className="check-label"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span className="custom-check"><Check size={12} /></span>{t.remember}</label><button type="button" className="text-button" onClick={() => { setMode('reset'); setMessage(null) }}>{t.forgot}</button></div>}<button className="primary-button" disabled={loading} type="submit">{loading ? <Loader2 className="spin" size={17} /> : <>{primaryLabel}<ArrowRight size={17} /></>}</button></form>
        {message && <div className={`status-message ${message.type}`} role="status">{message.type === 'success' ? <Check size={15} /> : <X size={15} />}{message.text}</div>}
        {mode === 'login' && <div className="auth-shortcuts"><button type="button" onClick={() => { setMode('magic'); setMessage(null) }}><Mail size={14} /> {t.magic}</button><button type="button" onClick={() => { setMode('phone'); setMessage(null); setOtpSent(false) }}><Phone size={14} /> {t.phoneLogin}</button></div>}
        {(mode === 'login' || mode === 'signup') && <><div className="divider"><span>{t.or}</span></div>{providers.length > 0 ? <div className="social-grid">{providers.map((provider) => { const Icon = providerMeta[provider].icon; return <button key={provider} className="social-button" type="button" onClick={() => oauth(provider)} disabled={loading}><Icon size={17} /><span>{providerMeta[provider].label}</span></button> })}</div> : <div className="provider-note"><ShieldCheck size={16} /><span>{t.oauthUnavailable}</span></div>}</>}
        {mode === 'phone' && otpSent && <button type="button" className="back-button" onClick={() => { setOtpSent(false); setOtp('') }}>{t.resend}</button>}{mode === 'reset' && <button type="button" className="back-button" onClick={() => setMode('login')}>{t.back}</button>}{mode === 'magic' && <button type="button" className="back-button" onClick={() => setMode('login')}>{t.back}</button>}
        <div className="mode-switch">{mode === 'signup' ? <><span>{t.existingAccount}</span><button type="button" onClick={() => setMode('login')}>{t.loginLink}</button></> : <><span>{t.newAccount}</span><button type="button" onClick={() => setMode('signup')}>{t.signUpLink}</button></>}</div>
      </div><p className="legal-note">By continuing, you agree to LEVI-AUT&apos;s <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p></section></section><footer className="footer"><span>© 2025 LEVI-AUT SYSTEMS</span><span>v0.2 / PRIVATE PREVIEW</span></footer></main>
}
