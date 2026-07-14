import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const TYPE_COLORS = {
  'Admission': { color: '#F97316', bg: '#FFF7ED' },
  'Scholarship': { color: '#10B981', bg: '#F0FDF4' },
  'Exam Result': { color: '#3B82F6', bg: '#EFF6FF' },
  'Counselling': { color: '#8B5CF6', bg: '#F5F3FF' },
  'Exam': { color: '#F59E0B', bg: '#FEF3C7' },
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function downloadIcs(event) {
  const date = (event.deadline || event.date).replace(/-/g, '')
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${event.id}@pathfinder`,
    `DTSTART;VALUE=DATE:${date}`,
    `DTEND;VALUE=DATE:${date}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

// Quick-pick offsets relative to the event's deadline, shown as buttons in the modal
function daysBefore(deadline, n) {
  const d = new Date(deadline)
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export default function Timeline() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [streamFilter, setStreamFilter] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user?.stream || 'All'
    } catch {
      return 'All'
    }
  })
  const [email, setEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null')?.email || '' } catch { return '' }
  })
  const [subMsg, setSubMsg] = useState('')

  // Reminder modal state
  const [modalEvent, setModalEvent] = useState(null) // the event object, or 'general' for the bottom banner, or null = closed
  const [modalDate, setModalDate] = useState('')
  const [modalTime, setModalTime] = useState('09:00')
  const [modalEmail, setModalEmail] = useState(email)
  const [submitting, setSubmitting] = useState(false)
  const [modalMsg, setModalMsg] = useState(null) // { type: 'success' | 'error' | 'warning', text }

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then(res => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        return res.json()
      })
      .then(data => setEvents(data.events || []))
      .catch(err => console.error('Failed to load events:', err))
      .finally(() => setLoading(false))
  }, [])

  function openReminderModal(event) {
    setModalEvent(event || 'general')
    setModalEmail(email)
    // Default to 7 days before deadline if the event has one, else empty
    setModalDate(event?.deadline ? daysBefore(event.deadline, 7) : '')
    setModalTime('09:00')
    setModalMsg(null)
  }

  function closeModal() {
    setModalEvent(null)
    setModalDate('')
    setModalTime('09:00')
    setModalMsg(null)
  }

  async function confirmSubscribe() {
    if (!modalEmail) {
      setModalMsg({ type: 'error', text: 'Please enter your email.' })
      return
    }
    setSubmitting(true)
    setModalMsg(null)
    const eventId = modalEvent && modalEvent !== 'general' ? modalEvent.id : null

    // Combine the date + time pickers into a single ISO datetime for the backend.
    const remindOnIso = modalDate
      ? new Date(`${modalDate}T${modalTime || '09:00'}`).toISOString()
      : null

    try {
      const res = await fetch(`${API_URL}/api/reminders/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: modalEmail, eventId, remindOn: remindOnIso }),
      })
      const data = await res.json()

      if (!res.ok || !data.ok) {
        // Server rejected the request outright (bad email, invalid date, event not found, etc.)
        setModalMsg({ type: 'error', text: data.error || 'Something went wrong — try again.' })
        setSubmitting(false)
        return // keep modal open so the user can fix the input
      }

      setEmail(modalEmail)

      // The backend distinguishes a clean success from "saved but confirmation
      // email failed to send" — surface that difference instead of showing the
      // same green success message either way.
      const emailFailed = /confirmation email failed/i.test(data.message || '')
      setSubMsg(data.message || 'Subscribed!')

      // Briefly show the result inside the modal itself before closing, so the
      // user actually sees whether the email went out or not.
      setModalMsg({
        type: emailFailed ? 'warning' : 'success',
        text: data.message || 'Subscribed! We will email you before the deadline.',
      })
      setSubmitting(false)
      setTimeout(() => {
        closeModal()
        setTimeout(() => setSubMsg(''), 4000)
      }, emailFailed ? 3000 : 1400)
    } catch (err) {
      setModalMsg({ type: 'error', text: 'Network error — could not reach the server. Try again.' })
      setSubmitting(false)
    }
  }

  const filtered = events.filter(e =>
    (filter === 'All' || e.type === filter) &&
    (streamFilter === 'All' || e.streams.includes(streamFilter) || e.streams.includes('All'))
  )

  const upcoming = filtered.filter(e => e.status === 'upcoming').sort((a, b) => a.daysLeft - b.daysLeft)
  const past = filtered.filter(e => e.status === 'past')
  const nextTwo = upcoming.slice(0, 2)

  const modalIsGeneral = modalEvent === 'general'
  const modalEventObj = modalEvent && modalEvent !== 'general' ? modalEvent : null
  const todayStr = new Date().toISOString().slice(0, 10)
  const maxDateStr = modalEventObj?.deadline || undefined

  const MODAL_MSG_STYLES = {
    success: { bg: '#F0FDF4', border: '#86EFAC', color: '#15803D', icon: '✅' },
    warning: { bg: '#FFFBEB', border: '#FCD34D', color: '#B45309', icon: '⚠️' },
    error:   { bg: '#FEF2F2', border: '#FCA5A5', color: '#B91C1C', icon: '❌' },
  }

  return (
    <div style={{ paddingTop: 68, background: 'var(--cream)', minHeight: '100vh' }}>
      <div className="page-hero">
        <div className="container">
          <p className="section-label" style={{ color: '#FED7AA' }}>Never Miss a Date</p>
          <h1>Admission & Scholarship Timeline</h1>
          <p>Stay on top of every important date — admissions, counselling, and scholarship windows.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {nextTwo.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7, #FFF7ED)',
            border: '1.5px solid #FCD34D', borderRadius: 16, padding: '18px 22px',
            display: 'flex', gap: 14, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#92400E', marginBottom: 4 }}>
                Upcoming This Month
              </p>
              <p style={{ fontSize: '0.88rem', color: '#B45309' }}>
                {nextTwo.map(e => `${e.title} in ${e.daysLeft} day${e.daysLeft === 1 ? '' : 's'}`).join(' · ')}
              </p>
            </div>
            <button className="btn" onClick={() => openReminderModal('general')} style={{
              marginLeft: 'auto', background: '#F59E0B', color: 'white', fontSize: '0.82rem',
              padding: '8px 18px', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer',
            }}>Set Reminder</button>
          </div>
        )}

        <div style={{
          background: 'white', border: '1px solid #E8E0D5', borderRadius: 16, padding: '16px 20px',
          marginBottom: 32, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
            {['All', 'Admission', 'Scholarship', 'Exam', 'Counselling'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: 50,
                border: filter === f ? 'none' : '1.5px solid #E8E0D5',
                background: filter === f ? '#0F172A' : 'transparent',
                color: filter === f ? 'white' : '#64748B',
                fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>{f}</button>
            ))}
          </div>
          <select value={streamFilter} onChange={e => setStreamFilter(e.target.value)} className="form-select" style={{ minWidth: 140 }}>
            <option value="All">All Streams</option>
            <option value="Science">Science</option>
            <option value="Commerce">Commerce</option>
            <option value="Arts">Arts</option>
            <option value="Vocational">Vocational</option>
          </select>
        </div>

        {loading && <p style={{ color: '#94A3B8', textAlign: 'center', padding: 40 }}>Loading timeline...</p>}

        {!loading && (
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.6rem', color: '#1E293B', marginBottom: 20 }}>
            Upcoming Dates ({upcoming.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {upcoming.map((event) => {
              const tc = TYPE_COLORS[event.type] || { color: '#64748B', bg: '#F8FAFC' }
              const isUrgent = event.daysLeft <= 30
              const urgencyPct = Math.max(0, Math.min(100, 100 - (event.daysLeft / 30) * 100))
              return (
                <div key={event.id} className="card" style={{
                  padding: '22px 24px', borderLeft: `4px solid ${tc.color}`,
                  display: 'flex', gap: 18, alignItems: 'flex-start', flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: 60, textAlign: 'center', background: tc.bg, borderRadius: 12,
                    padding: '10px 8px', flexShrink: 0, border: `1px solid ${tc.color}22`,
                  }}>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'Sora, sans-serif', fontWeight: 700, color: tc.color, textTransform: 'uppercase' }}>
                      {MONTHS[new Date(event.date).getMonth()]}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'Sora, sans-serif', fontWeight: 800, color: tc.color, lineHeight: 1 }}>
                      {new Date(event.date).getDate()}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6, alignItems: 'center' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 50, background: tc.bg, color: tc.color, fontSize: '0.72rem', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>{event.type}</span>
                      {isUrgent && (
                        <span style={{ padding: '3px 10px', borderRadius: 50, background: '#FEE2E2', color: '#DC2626', fontSize: '0.72rem', fontFamily: 'Sora, sans-serif', fontWeight: 700 }}>🔴 Urgent</span>
                      )}
                      {event.streams.map(s => s !== 'All' && (
                        <span key={s} className="tag" style={{ fontSize: '0.72rem' }}>{s}</span>
                      ))}
                    </div>
                    <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.98rem', color: '#1E293B', marginBottom: 6 }}>{event.title}</h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.6, marginBottom: 10 }}>{event.description}</p>
                    <div style={{ height: 5, background: '#F1F5F9', borderRadius: 50, overflow: 'hidden', maxWidth: 260 }}>
                      <div style={{ height: '100%', width: `${urgencyPct}%`, background: isUrgent ? '#DC2626' : tc.color, borderRadius: 50, transition: 'width 0.3s' }} />
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: isUrgent ? '#DC2626' : '#F97316' }}>{event.daysLeft}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}>days left</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openReminderModal(event)} className="btn btn-ghost" style={{ fontSize: '0.76rem', padding: '6px 12px' }}>🔔 Remind me</button>
                      <button onClick={() => downloadIcs(event)} className="btn btn-ghost" style={{ fontSize: '0.76rem', padding: '6px 12px' }}>📅 Add</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        )}

        {!loading && past.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.4rem', color: '#94A3B8', marginBottom: 16 }}>
              Past Events ({past.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {past.map(event => (
                <div key={event.id} style={{
                  background: '#F8F9FA', border: '1px solid #E8E0D5', borderRadius: 14, padding: '16px 20px',
                  display: 'flex', gap: 14, alignItems: 'center', opacity: 0.65,
                }}>
                  <span style={{ padding: '4px 12px', borderRadius: 50, fontSize: '0.72rem', fontFamily: 'Sora, sans-serif', fontWeight: 700, background: '#E2E8F0', color: '#64748B' }}>Closed</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#64748B' }}>{event.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          background: 'linear-gradient(135deg, #0F172A, #1a2f4a)', borderRadius: 22, padding: '40px',
          marginTop: 48, textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🔔</div>
          <h3 style={{ fontFamily: 'DM Serif Display, serif', color: 'white', fontSize: '1.6rem', marginBottom: 12 }}>
            Never Miss a Deadline
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
            Get email reminders for admissions, scholarships, and important exam dates — pick your own date, or let us choose for you.
          </p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              style={{ flex: 1, minWidth: 220, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: 'white' }}
            />
            <button className="btn btn-primary" onClick={() => openReminderModal('general')} style={{ whiteSpace: 'nowrap' }}>
              Subscribe Free
            </button>
          </div>
          {subMsg && <p style={{ color: '#FED7AA', marginTop: 14, fontSize: '0.85rem' }}>{subMsg}</p>}
        </div>
      </div>

      {/* Reminder Modal */}
      {modalEvent && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 20, padding: '32px 30px', maxWidth: 420, width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'modalPop 0.18s ease-out',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: '0.72rem', fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  🔔 Set a Reminder
                </p>
                <h3 style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.3rem', color: '#1E293B', lineHeight: 1.3 }}>
                  {modalIsGeneral ? 'All high-priority deadlines' : modalEventObj.title}
                </h3>
              </div>
              <button
                onClick={closeModal}
                style={{ background: '#F1F5F9', border: 'none', borderRadius: 50, width: 30, height: 30, cursor: 'pointer', fontSize: '1rem', color: '#64748B', flexShrink: 0 }}
              >✕</button>
            </div>

            {modalEventObj?.deadline && (
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: 20 }}>
                Deadline: <strong style={{ color: '#64748B' }}>{modalEventObj.deadline}</strong>
              </p>
            )}

            <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>
              Email address
            </label>
            <input
              type="email"
              value={modalEmail}
              onChange={e => setModalEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
              style={{ width: '100%', marginBottom: 18, boxSizing: 'border-box' }}
            />

            <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'Sora, sans-serif', fontWeight: 600, color: '#64748B', marginBottom: 6 }}>
              Remind me on
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input
                type="date"
                value={modalDate}
                min={todayStr}
                max={maxDateStr}
                onChange={e => setModalDate(e.target.value)}
                className="form-input"
                style={{ flex: 1.4, boxSizing: 'border-box' }}
              />
              <input
                type="time"
                value={modalTime}
                onChange={e => setModalTime(e.target.value)}
                className="form-input"
                style={{ flex: 1, boxSizing: 'border-box' }}
              />
            </div>

            {modalEventObj?.deadline && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                {[30, 7, 3, 1].map(n => (
                  <button
                    key={n}
                    onClick={() => setModalDate(daysBefore(modalEventObj.deadline, n))}
                    style={{
                      padding: '5px 12px', borderRadius: 50, fontSize: '0.74rem',
                      fontFamily: 'Sora, sans-serif', fontWeight: 600, cursor: 'pointer',
                      border: modalDate === daysBefore(modalEventObj.deadline, n) ? 'none' : '1.5px solid #E8E0D5',
                      background: modalDate === daysBefore(modalEventObj.deadline, n) ? '#0F172A' : 'transparent',
                      color: modalDate === daysBefore(modalEventObj.deadline, n) ? 'white' : '#64748B',
                    }}
                  >{n} day{n === 1 ? '' : 's'} before</button>
                ))}
              </div>
            )}

            {modalMsg && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 14px', borderRadius: 12,
                background: MODAL_MSG_STYLES[modalMsg.type].bg,
                border: `1px solid ${MODAL_MSG_STYLES[modalMsg.type].border}`,
                marginBottom: 18,
              }}>
                <span>{MODAL_MSG_STYLES[modalMsg.type].icon}</span>
                <p style={{ fontSize: '0.82rem', color: MODAL_MSG_STYLES[modalMsg.type].color, lineHeight: 1.4 }}>
                  {modalMsg.text}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={closeModal} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
              <button
                onClick={confirmSubscribe}
                disabled={submitting}
                className="btn btn-primary"
                style={{ flex: 1, opacity: submitting ? 0.6 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Sending...' : 'Confirm Reminder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}