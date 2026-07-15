// src/pages/Scholarships.jsx
import { useState, useMemo } from 'react'

const SCHOLARSHIPS = [
  { id: 1, name: 'National Means-cum-Merit Scholarship', provider: 'Govt of India', amount: '₹12,000/yr', stream: 'All', state: 'All India', income: 'Below ₹3.5L', deadline: '2026-08-31', link: 'https://scholarships.gov.in' },
  { id: 2, name: 'Post-Matric Scholarship (SC/ST)', provider: 'Ministry of Social Justice', amount: 'Full tuition', stream: 'All', state: 'All India', income: 'Below ₹2.5L', deadline: '2026-09-15', link: 'https://scholarships.gov.in' },
  { id: 3, name: 'Tamil Nadu State Scholarship', provider: 'TN Govt', amount: '₹10,000/yr', stream: 'All', state: 'Tamil Nadu', income: 'Below ₹2L', deadline: '2026-09-30', link: 'https://tn.gov.in' },
  { id: 4, name: 'INSPIRE Scholarship', provider: 'DST, Govt of India', amount: '₹80,000/yr', stream: 'Science', state: 'All India', income: 'Any', deadline: '2026-08-10', link: 'https://online-inspire.gov.in' },
  { id: 5, name: 'CA Foundation Fee Waiver', provider: 'ICAI', amount: 'Up to 100%', stream: 'Commerce', state: 'All India', income: 'Below ₹3L', deadline: '2026-10-01', link: 'https://icai.org' },
  { id: 6, name: 'Kishore Vaigyanik Protsahan Yojana', provider: 'DST', amount: '₹7,000/mo', stream: 'Science', state: 'All India', income: 'Any', deadline: '2026-08-20', link: 'https://kvpy.iisc.ernet.in' },
  { id: 7, name: 'Minority Community Scholarship', provider: 'Ministry of Minority Affairs', amount: '₹15,000/yr', stream: 'All', state: 'All India', income: 'Below ₹2L', deadline: '2026-09-05', link: 'https://scholarships.gov.in' },
  { id: 8, name: 'Girl Child Education Scheme', provider: 'State Govt', amount: '₹8,000/yr', stream: 'All', state: 'Tamil Nadu', income: 'Below ₹2.5L', deadline: '2026-09-25', link: '#' },
]

const STREAMS = ['All', 'Science', 'Commerce', 'Arts']
const STATES = ['All India', 'Tamil Nadu']

function daysLeft(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function Scholarships() {
  const [stream, setStream] = useState('All')
  const [state, setState] = useState('All India')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return SCHOLARSHIPS.filter(s => {
      const matchStream = stream === 'All' || s.stream === 'All' || s.stream === stream
      const matchState = state === 'All India' || s.state === 'All India' || s.state === state
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.provider.toLowerCase().includes(search.toLowerCase())
      return matchStream && matchState && matchSearch
    }).sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline))
  }, [stream, state, search])

  return (
    <div style={{ background: '#FFFBF5', minHeight: '100vh', padding: '110px 24px 60px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: '0.75rem', fontWeight: 700, color: '#F97316',
            background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 14,
            fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>💰 Funding Finder</div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#0F172A', margin: '0 0 8px' }}>
            Scholarships & Financial Aid
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B', fontSize: '1rem', margin: 0 }}>
            Real scholarships, filtered for your stream, state and income bracket.
          </p>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24,
          background: 'white', border: '1px solid #E8E0D5', borderRadius: 16, padding: 16,
        }}>
          <input
            placeholder="Search scholarships..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: '1 1 200px', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #E2E8F0', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', outline: 'none',
            }}
          />
          <select value={stream} onChange={e => setStream(e.target.value)} style={selectStyle}>
            {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={state} onChange={e => setState(e.target.value)} style={selectStyle}>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(s => {
            const left = daysLeft(s.deadline)
            const urgent = left <= 14
            return (
              <div key={s.id} style={{
                background: 'white', border: '1px solid #E8E0D5', borderRadius: 16,
                padding: 20, display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', gap: 16, flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.02rem', color: '#0F172A', margin: 0 }}>{s.name}</h3>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                      background: urgent ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                      color: urgent ? '#EF4444' : '#22C55E', fontFamily: 'DM Sans, sans-serif',
                    }}>{left > 0 ? `${left} days left` : 'Closing soon'}</span>
                  </div>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: '#94A3B8', margin: '0 0 8px' }}>
                    {s.provider} · {s.stream} · {s.state} · Income: {s.income}
                  </p>
                  <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#F97316', fontSize: '0.95rem' }}>{s.amount}</span>
                </div>
                <a href={s.link} target="_blank" rel="noreferrer" style={{
                  textDecoration: 'none', padding: '10px 20px', borderRadius: 50,
                  background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white',
                  fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap',
                }}>Apply →</a>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: '#94A3B8', fontFamily: 'DM Sans, sans-serif', padding: 40 }}>
              No scholarships match your filters. Try widening the search.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

const selectStyle = {
  padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0',
  fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', background: 'white', outline: 'none',
}