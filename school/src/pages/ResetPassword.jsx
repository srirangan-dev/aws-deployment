import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { API_URL } from '../config'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')
  const email = params.get('email')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [busy, setBusy]         = useState(false)

  useEffect(() => {
    if (!token || !email) setError('Invalid or expired reset link.')
  }, [token, email])

  const handleReset = async () => {
    if (!password) { setError('Please enter a new password.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }

    setBusy(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password })
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Reset failed.'); return }
      setSuccess('Password reset successfully!')
      setTimeout(() => navigate('/login'), 2000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FBF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ background: 'white', borderRadius: 28, padding: '44px 40px', boxShadow: '0 8px 48px rgba(0,0,0,0.10)', border: '1.5px solid #F1EDE8' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: 'linear-gradient(135deg, #F97316, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 14px', boxShadow: '0 4px 14px #F9731644' }}>🔐</div>
            <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1E293B', margin: '0 0 8px' }}>Set New Password</h1>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>Choose a strong password for your account</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#334155', marginBottom: 7 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>🔒</span>
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  style={{ width: '100%', padding: '13px 44px 13px 42px', borderRadius: 12, border: '1.5px solid #E8E0D5', fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E8E0D5'} />
                <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#334155', marginBottom: 7 }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>🔒</span>
                <input type={showPass ? 'text' : 'password'} placeholder="Repeat password" value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError('') }}
                  onKeyDown={e => e.key === 'Enter' && handleReset()}
                  style={{ width: '100%', padding: '13px 14px 13px 42px', borderRadius: 12, border: '1.5px solid #E8E0D5', fontFamily: 'Sora, sans-serif', fontSize: '0.9rem', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#F97316'}
                  onBlur={e => e.target.style.borderColor = '#E8E0D5'} />
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.84rem', fontFamily: 'Sora, sans-serif' }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '10px 14px', borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#16A34A', fontSize: '0.84rem', fontFamily: 'Sora, sans-serif' }}>
                ✅ {success} Redirecting to login…
              </div>
            )}

            <button onClick={handleReset} disabled={busy || !!success || !token}
              style={{ width: '100%', padding: '14px 0', borderRadius: 13, border: 'none', background: busy || success || !token ? '#FED7AA' : 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1rem', cursor: busy || success || !token ? 'not-allowed' : 'pointer', boxShadow: '0 4px 18px #F9731640' }}>
              {busy ? '⏳ Resetting…' : '🔐 Reset Password'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748B', marginTop: 20, fontFamily: 'Sora, sans-serif' }}>
            <Link to="/login" style={{ color: '#F97316', fontWeight: 700, textDecoration: 'none' }}>← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}