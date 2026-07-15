// src/pages/Community.jsx
const MENTORS = [
  { id: 1, name: 'Priya Raman',    role: 'NIT Trichy · 3rd Year, ECE',       expertise: ['Science', 'JEE'],              phone: '+91 98765 43210', email: 'priya.mentor@gmail.com',    whatsapp: '919876543210' },
  { id: 2, name: 'Suresh Kumar',   role: 'CA Intermediate',                  expertise: ['Commerce', 'CA'],               phone: '+91 91234 56789', email: 'suresh.mentor@gmail.com',   whatsapp: '919123456789' },
  { id: 3, name: 'Meera Iyer',     role: 'School Counsellor, Chennai',       expertise: ['Arts', 'CUET', 'Career Guidance'], phone: '+91 90000 11122', email: 'meera.counsellor@gmail.com', whatsapp: '919000011122' },
  { id: 4, name: 'Dr. Ashok Nair', role: 'Physics Teacher, 15+ yrs',         expertise: ['Science', 'NEET', 'JEE'],       phone: '+91 90111 22334', email: 'ashok.teacher@gmail.com',   whatsapp: '919011122334' },
  { id: 5, name: 'Farah Sheikh',   role: 'Career Counsellor & Psychologist', expertise: ['Career Guidance', 'Mental Health'], phone: '+91 90222 33445', email: 'farah.counsellor@gmail.com', whatsapp: '919022233445' },
  { id: 6, name: 'Karthik Menon',  role: 'IIT Madras · Alumnus, Data Science', expertise: ['Science', 'Engineering'],     phone: '+91 90333 44556', email: 'karthik.mentor@gmail.com',  whatsapp: '919033344556' },
  { id: 7, name: 'Lakshmi Pillai', role: 'Commerce Faculty, 10+ yrs',        expertise: ['Commerce', 'CA', 'CS'],         phone: '+91 90444 55667', email: 'lakshmi.teacher@gmail.com', whatsapp: '919044455667' },
]

const RESOURCES = [
  {
    id: 1,
    stream: 'Science',
    title: 'Choosing Between JEE, NEET & Pure Sciences',
    tip: "Don't pick a target exam just because it's popular. Spend a weekend solving one full JEE paper and one NEET paper — your comfort and score gap will tell you more than any counsellor can.",
    action: "Try mock papers from NTA's official site before committing to a coaching track.",
  },
  {
    id: 2,
    stream: 'Commerce',
    title: 'CA vs CS vs CMA vs B.Com — What Actually Differs',
    tip: 'CA is the deepest and longest route but opens the most doors in finance and audit. CS suits people who like law and compliance. CMA is closer to cost & management accounting. B.Com alone is fine if you plan to do an MBA later.',
    action: 'Talk to someone one or two years ahead of you in each track before choosing — their day-to-day reality matters more than rankings.',
  },
  {
    id: 3,
    stream: 'Arts',
    title: 'Life Beyond "Arts = Fewer Options"',
    tip: 'Psychology, journalism, design, law, civil services, and content careers all start from an Arts background. CUET has made moving between colleges and courses much easier than it used to be.',
    action: "Shortlist 3 subjects you enjoy reading about even outside class — that's usually a strong signal for your major.",
  },
  {
    id: 4,
    stream: 'General',
    title: 'How to Actually Decide (Not Just Collect Opinions)',
    tip: "List your top 3 options. For each, write one line on: what a normal week looks like, what the entrance exam is like, and what the first job after looks like. Most confusion disappears once it's on paper.",
    action: "Revisit this list every few months — it's fine for it to change as you learn more.",
  },
  {
    id: 5,
    stream: 'General',
    title: 'Managing Exam Stress Without Losing Momentum',
    tip: 'Short, consistent study blocks beat long irregular ones. Sleep and one physical activity a day protect your memory and mood more than an extra hour of last-minute revision.',
    action: 'If stress feels unmanageable, reach out to a school counsellor early — not just during exam season.',
  },
]

const streamColors = {
  Science: '#3B82F6',
  Commerce: '#10B981',
  Arts: '#A855F7',
  General: '#F97316',
}

function MentorCard({ m }) {
  const initials = m.name.split(' ').map(w => w[0]).join('').toUpperCase()
  return (
    <div style={{ background: 'white', border: '1px solid #E8E0D5', borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, flexShrink: 0,
          background: 'linear-gradient(135deg, #F97316, #F59E0B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '0.95rem', color: 'white',
        }}>{initials}</div>
        <div>
          <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{m.name}</div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: '#94A3B8' }}>{m.role}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {m.expertise.map(tag => (
          <span key={tag} style={{
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(15,23,42,0.05)', color: '#334155', fontFamily: 'DM Sans, sans-serif',
          }}>{tag}</span>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#334155' }}>📞 {m.phone}</div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis' }}>✉️ {m.email}</div>
      </div>

      <a href={`mailto:${m.email}`} style={{
        textAlign: 'center', textDecoration: 'none', padding: '9px 0', borderRadius: 10, marginTop: 4,
        background: 'linear-gradient(135deg, #F97316, #F59E0B)', color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.8rem',
      }}>✉️ Email</a>
    </div>
  )
}

export default function Community() {
  return (
    <div style={{ background: '#FFFBF5', minHeight: '100vh', padding: '110px 24px 60px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ marginBottom: 32 }}>
          <div style={badgeStyle}>💬 Community & Mentorship</div>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: '2.3rem', color: '#0F172A', margin: '0 0 8px' }}>
            Talk to a Career Guide
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748B', fontSize: '1rem', margin: 0, maxWidth: 600 }}>
            Reach out to seniors, teachers, and counsellors directly by phone or email, and explore practical guidance to help you choose your path.
          </p>
        </div>

        {/* Career Guides */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#0F172A', margin: '0 0 14px' }}>
            Career Guides
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {MENTORS.map(m => <MentorCard key={m.id} m={m} />)}
          </div>
        </div>

        {/* Resources for Students */}
        <h2 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#0F172A', margin: '0 0 14px' }}>
          Resources for Students
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {RESOURCES.map(r => (
            <div key={r.id} style={{ background: 'white', border: '1px solid #E8E0D5', borderRadius: 16, padding: 20 }}>
              <div style={{ marginBottom: 10 }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                  background: `${streamColors[r.stream]}14`, color: streamColors[r.stream], fontFamily: 'DM Sans, sans-serif',
                }}>{r.stream}</span>
              </div>
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', margin: '0 0 10px' }}>{r.title}</h3>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#475569', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.6 }}>{r.tip}</p>
              <div style={{
                background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 10, padding: '10px 14px',
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: '0.9rem' }}>💡</span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5, fontWeight: 600 }}>{r.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const badgeStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', fontWeight: 700,
  color: '#F97316', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
  borderRadius: 20, padding: '4px 12px', marginBottom: 14, fontFamily: 'DM Sans, sans-serif',
  letterSpacing: '0.04em', textTransform: 'uppercase',
}