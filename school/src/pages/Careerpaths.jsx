import { useState } from 'react'

// NOTE ON THIS VERSION:
// Expanded from the original 4 streams to 8, covering essentially every
// major path a student picks after Class 12 in India: Engineering, Medical
// & Health Sciences, Law, Design & Architecture, Science, Commerce, Arts,
// and Vocational. Data corrections from the previous version are preserved
// (correct exams per degree, campus placements separated from "exams",
// accreditation frameworks separated from qualifying exams, entry vs.
// post-qualification salary noted where the gap is large).

const CAREER_DATA = [
  {
    stream: 'Engineering',
    icon: '⚙️',
    color: '#6366F1',
    bg: '#EEF2FF',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'B.Tech Computer Science / IT',
        duration: '4 Years',
        careers: ['Software Development Engineer', 'Data Scientist', 'ML Engineer', 'DevOps / Cloud Engineer'],
        exams: ['JEE Main/Advanced (entry)', 'GATE (for M.Tech/PSU)', 'GRE (for MS abroad)'],
        nextStep: 'Campus placements: product companies, service companies (TCS, Infosys), or M.Tech/MS',
        salary: '₹4–12 LPA entry (wide range by college tier)',
        scope: 'Very High',
      },
      {
        name: 'B.Tech Mechanical Engineering',
        duration: '4 Years',
        careers: ['Design Engineer', 'Production/Manufacturing Engineer', 'Site Engineer', 'QA Engineer'],
        exams: ['JEE Main/Advanced (entry)', 'GATE', 'ESE/IES (for govt. engineering services)'],
        nextStep: 'PSU recruitment via GATE score, or M.Tech specialization',
        salary: '₹3–6 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.Tech Electrical / Electronics',
        duration: '4 Years',
        careers: ['Field/Maintenance Engineer', 'Embedded Systems Engineer', 'Telecom Engineer', 'VLSI Design Engineer'],
        exams: ['JEE Main/Advanced (entry)', 'GATE', 'ESE/IES'],
        nextStep: 'Core companies, PSUs (via GATE), or M.Tech in VLSI/Embedded Systems',
        salary: '₹3.5–7 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.Tech Civil Engineering',
        duration: '4 Years',
        careers: ['Site Engineer', 'Structural Engineer', 'Project Engineer', 'Government Engineering Services'],
        exams: ['JEE Main/Advanced (entry)', 'GATE', 'SSC JE / State AE-JE exams'],
        nextStep: 'Govt. engineering jobs are a common and stable route via GATE/SSC JE',
        salary: '₹3–6 LPA entry',
        scope: 'High',
      },
    ],
  },
  {
    stream: 'Medical & Health',
    icon: '🩺',
    color: '#EF4444',
    bg: '#FEF2F2',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'MBBS',
        duration: '5.5 Years (incl. internship)',
        careers: ['General Physician', 'Resident Doctor', 'Medical Officer', 'Specialist (post-PG)'],
        exams: ['NEET UG (entry)', 'NEET PG (for MD/MS specialization)'],
        nextStep: 'Most doctors pursue MD/MS after MBBS — general practice alone is a smaller share of outcomes',
        salary: '₹6–10 LPA entry (govt./private) · significantly higher as a specialist post-MD/MS',
        scope: 'Very High',
      },
      {
        name: 'BDS (Dental)',
        duration: '5 Years (incl. internship)',
        careers: ['Dentist', 'Dental Surgeon', 'Clinic Owner (post-experience)'],
        exams: ['NEET UG (entry)', 'NEET MDS (for postgraduate specialization)'],
        nextStep: 'Dental Council registration is mandatory to practice',
        salary: '₹3–6 LPA entry',
        scope: 'Moderate',
      },
      {
        name: 'B.Pharm',
        duration: '4 Years',
        careers: ['Pharmacist', 'QA/QC Executive (Pharma)', 'Medical/Sales Representative', 'Drug Regulatory Associate'],
        exams: ['GPAT (for M.Pharm)', 'State Pharmacy Council registration exam'],
        nextStep: 'M.Pharm or an MBA in Pharma Management both open up better roles',
        salary: '₹2.5–5 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.Sc. Nursing',
        duration: '4 Years',
        careers: ['Staff Nurse', 'ICU/OT Nurse', 'Community Health Nurse'],
        exams: ['NEET UG or state nursing entrance (varies by state)', 'Indian Nursing Council registration'],
        nextStep: 'Strong demand abroad (Gulf, UK, Germany) with additional licensing exams',
        salary: '₹2.5–4.5 LPA entry (domestic)',
        scope: 'Very High',
      },
    ],
  },
  {
    stream: 'Law',
    icon: '⚖️',
    color: '#334155',
    bg: '#F1F5F9',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'BA LLB / BBA LLB (Integrated)',
        duration: '5 Years',
        careers: ['Litigation Lawyer', 'Corporate Legal Associate', 'Legal Advisor', 'Judicial Clerk'],
        exams: ['CLAT / AILET (entry)', 'AIBE (Bar exam, required to practice)'],
        nextStep: 'NLU graduates typically go corporate; others often start in litigation under a senior advocate',
        salary: '₹4–10 LPA entry (top NLUs) · ₹2.5–5 LPA entry (other colleges)',
        scope: 'High',
      },
      {
        name: 'LLB (3-Year, after any Bachelor\u2019s)',
        duration: '3 Years',
        careers: ['Litigation Lawyer', 'Legal Consultant', 'Legal Process Associate'],
        exams: ['University/state LLB entrance tests', 'AIBE (Bar exam)'],
        nextStep: 'Common route for those who decide on law after a first degree',
        salary: '₹2.5–5 LPA entry',
        scope: 'Moderate',
      },
      {
        name: 'Judicial Services (via LLB)',
        duration: 'LLB + exam prep',
        careers: ['Civil Judge', 'Judicial Magistrate'],
        exams: ['State Judicial Services Examination (PCS-J)'],
        nextStep: 'Highly competitive state-level exam taken after completing an LLB',
        salary: 'Government pay scale on selection',
        scope: 'Moderate',
      },
    ],
  },
  {
    stream: 'Design & Architecture',
    icon: '🎨',
    color: '#DB2777',
    bg: '#FDF2F8',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'B.Arch',
        duration: '5 Years',
        careers: ['Architect', 'Urban Designer', 'Interior Architect', 'Project Architect'],
        exams: ['NATA / JEE Main Paper 2 (entry)'],
        nextStep: 'Council of Architecture (COA) registration is mandatory to practice as an architect',
        salary: '₹3–6 LPA entry',
        scope: 'Moderate',
      },
      {
        name: 'B.Des (Bachelor of Design)',
        duration: '4 Years',
        careers: ['UX/UI Designer', 'Product Designer', 'Fashion Designer', 'Graphic/Communication Designer'],
        exams: ['UCEED', 'NID DAT', 'NIFT Entrance (for fashion specialization)'],
        nextStep: 'A strong portfolio matters as much as, sometimes more than, the college name',
        salary: '₹3.5–7 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.F.A (Fine Arts)',
        duration: '4 Years',
        careers: ['Illustrator', 'Animator', 'Art Director (with experience)', 'Freelance Artist'],
        exams: ['College-level portfolio-based entrance tests'],
        nextStep: 'Freelance/gig work is common early on; a strong portfolio and network drive growth',
        salary: '₹2.5–5 LPA entry (highly variable, often project-based)',
        scope: 'Moderate',
      },
    ],
  },
  {
    stream: 'Science',
    icon: '⚗️',
    color: '#3B82F6',
    bg: '#EFF6FF',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'B.Sc. Computer Science / IT',
        duration: '3 Years',
        careers: ['Software Developer', 'Data Analyst', 'Cybersecurity Analyst', 'Cloud Support Engineer'],
        exams: ['GATE CS (for M.Tech/PSU)', 'NIMCET (for MCA)'],
        nextStep: 'Campus placements: TCS NQT, Infosys, Wipro Elite',
        salary: '₹3.5–8 LPA entry',
        scope: 'Very High',
      },
      {
        name: 'B.Sc. Physics / Mathematics',
        duration: '3 Years',
        careers: ['Research Assistant', 'Data Analyst', 'Actuarial Analyst (Trainee)', 'Teacher (with B.Ed.)'],
        exams: ['IIT JAM (for M.Sc.)', 'CSIR-UGC NET', 'GATE'],
        nextStep: 'M.Sc. → PhD, or UPSC/State PSC for civil services',
        salary: '₹3–7 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.Sc. Biology / Microbiology',
        duration: '3 Years',
        careers: ['Lab Technician', 'Biotech Research Associate', 'QA/QC Executive (Pharma)'],
        exams: ['DBT-JRF', 'CSIR-NET (Life Sciences)', 'GPAT (pharmacy route)'],
        nextStep: 'M.Sc. → PhD for research/academic careers',
        salary: '₹2.5–6 LPA entry',
        scope: 'High',
      },
    ],
  },
  {
    stream: 'Commerce',
    icon: '📊',
    color: '#10B981',
    bg: '#F0FDF4',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'B.Com / B.Com Honours',
        duration: '3 Years',
        careers: ['Accounts Executive', 'Tax Consultant', 'Chartered Accountant (post-qualification)', 'Auditor'],
        exams: ['CA Foundation → Intermediate → Final', 'CMA', 'CS Foundation'],
        nextStep: 'CA/CMA/CS qualification typically takes 3–5 additional years',
        salary: '₹3–6 LPA entry · ₹8–20+ LPA as a qualified CA',
        scope: 'Very High',
      },
      {
        name: 'BBA (Bachelor of Business Admin)',
        duration: '3 Years',
        careers: ['Marketing Executive', 'HR Associate', 'Business Analyst', 'Operations Executive'],
        exams: ['CAT', 'MAT', 'XAT', 'CMAT (for MBA)'],
        nextStep: 'MBA significantly improves roles and salary',
        salary: '₹3–6 LPA entry · ₹10–18 LPA post-MBA',
        scope: 'Very High',
      },
      {
        name: 'BA / B.Com Economics',
        duration: '3 Years',
        careers: ['Research Analyst', 'Junior Economist', 'Bank PO', 'Policy Research Associate'],
        exams: ['RBI Grade B', 'IBPS PO', 'UPSC CSE'],
        nextStep: 'Highly competitive exams — most students pair this with an MA Economics or an MBA as a fallback',
        salary: '₹3.5–7 LPA entry',
        scope: 'High',
      },
    ],
  },
  {
    stream: 'Arts',
    icon: '🎭',
    color: '#F97316',
    bg: '#FFF7ED',
    examLabel: 'Key Entrance / Qualifying Exams',
    degrees: [
      {
        name: 'B.A. Political Science / History',
        duration: '3 Years',
        careers: ['Policy Researcher', 'Legislative Assistant', 'Teacher', 'Content/Research Associate'],
        exams: ['UPSC CSE', 'State PSC', 'UGC NET/JRF'],
        nextStep: 'UPSC selection rate is under 1% — most aspirants build a backup career while preparing',
        salary: '₹3–6 LPA entry (govt. pay scale applies separately if selected via UPSC/PSC)',
        scope: 'High',
      },
      {
        name: 'B.A. English / Journalism & Mass Comm.',
        duration: '3 Years',
        careers: ['Content Writer', 'Journalist', 'Copywriter', 'PR Executive'],
        exams: ['IIMC Entrance', 'ACJ Entrance', 'Symbiosis SET'],
        nextStep: 'A strong portfolio/internship often matters more than a postgraduate degree here',
        salary: '₹2.5–6 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.A. Psychology',
        duration: '3 Years',
        careers: ['HR Associate', 'Case Worker', 'Assistant Psychologist (with M.A.)'],
        exams: ['DUET', 'BHU UET', 'TISS NET'],
        nextStep: 'Clinical practice requires an M.Phil in Clinical Psychology and RCI registration',
        salary: '₹2.5–5 LPA entry',
        scope: 'High',
      },
    ],
  },
  {
    stream: 'Vocational',
    icon: '🔧',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    examLabel: 'Certifications / Next Step',
    degrees: [
      {
        name: 'B.Voc. IT / Software Development',
        duration: '3 Years',
        careers: ['Junior Web Developer', 'IT Support Executive', 'QA Tester'],
        exams: ['NSDC skill assessments', 'Lateral entry (credit transfer) into B.Sc./B.Tech'],
        nextStep: 'Best suited to students who want hands-on skills and faster entry into junior tech roles',
        salary: '₹2.5–5 LPA entry',
        scope: 'High',
      },
      {
        name: 'B.Voc. Tourism & Hospitality',
        duration: '3 Years',
        careers: ['Front Office Executive', 'Travel Consultant', 'Airline Ground Staff'],
        exams: ['IIHM eCHAT (for further hotel management study)'],
        nextStep: 'Industry certifications (IATA/UFTAA) add real value for travel-sector roles',
        salary: '₹2.5–5 LPA entry',
        scope: 'Moderate',
      },
      {
        name: 'B.Voc. Healthcare',
        duration: '3 Years',
        careers: ['Hospital Administration Assistant', 'Paramedic', 'Lab Assistant'],
        exams: ['NSQF skill certification exams'],
        nextStep: 'State paramedical council registration is required for clinical roles',
        salary: '₹2.5–4.5 LPA entry',
        scope: 'Moderate',
      },
    ],
  },
]

const SCOPE_COLOR = { 'Very High': '#10B981', 'High': '#F59E0B', 'Moderate': '#F97316' }

export default function CareerPaths() {
  const [activeStream, setActiveStream] = useState(0)
  const [activeDegree, setActiveDegree] = useState(null)

  const stream = CAREER_DATA[activeStream]

  return (
    <div style={{ paddingTop: 68, background: 'var(--cream, #FAF7F2)', minHeight: '100vh' }}>
      <div className="page-hero" style={{ background: '#1E293B', color: 'white', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <p style={{ color: '#FED7AA', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.8rem', textTransform: 'uppercase' }}>Visual Guide</p>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: '2rem', margin: '8px 0' }}>Career Path Explorer</h1>
          <p style={{ color: '#CBD5E1', maxWidth: 560 }}>See exactly where each degree can take you — realistic careers, exams, and salary expectations, across every major stream.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {/* Stream Tabs */}
        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap',
          marginBottom: 40, padding: '6px',
          background: 'white',
          borderRadius: 16, border: '1px solid #E8E0D5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}>
          {CAREER_DATA.map((s, i) => (
            <button key={s.stream} onClick={() => { setActiveStream(i); setActiveDegree(null) }} style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              fontSize: '0.88rem',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
              background: activeStream === i ? s.color : 'transparent',
              color: activeStream === i ? 'white' : '#64748B',
              whiteSpace: 'nowrap',
            }}>
              <span>{s.icon}</span> {s.stream}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: activeDegree !== null ? '1fr 1.2fr' : '1fr', gap: 28 }}>
          {/* Degree List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {stream.degrees.map((deg, i) => (
              <div key={i} onClick={() => setActiveDegree(activeDegree === i ? null : i)}
                style={{
                  cursor: 'pointer',
                  borderColor: activeDegree === i ? stream.color : '#E8E0D5',
                  background: activeDegree === i ? stream.bg : 'white',
                  border: '1px solid',
                  borderRadius: 14,
                  transition: 'all 0.25s',
                  padding: '22px 24px',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontFamily: 'Sora, sans-serif', fontWeight: 700,
                      fontSize: '1rem', color: activeDegree === i ? stream.color : '#1E293B',
                      marginBottom: 6,
                    }}>{deg.name}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>⏱ {deg.duration}</span>
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>💰 {deg.salary}</span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Sora, sans-serif',
                        color: SCOPE_COLOR[deg.scope],
                        background: `${SCOPE_COLOR[deg.scope]}18`,
                        padding: '2px 10px', borderRadius: 50,
                      }}>📈 {deg.scope} Scope</span>
                    </div>
                  </div>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: activeDegree === i ? stream.color : '#F8F4EF',
                    color: activeDegree === i ? 'white' : '#94A3B8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', flexShrink: 0, marginLeft: 12,
                    transition: 'all 0.2s',
                    transform: activeDegree === i ? 'rotate(180deg)' : 'none',
                  }}>▼</span>
                </div>

                {activeDegree === i && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${stream.color}33` }}>
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: '0.78rem', fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Career Options</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {deg.careers.map(c => (
                          <span key={c} style={{
                            padding: '4px 12px', borderRadius: 50,
                            background: stream.bg, color: stream.color,
                            fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: '0.78rem',
                          }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: '0.78rem', fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stream.examLabel}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {deg.exams.map(e => (
                          <span key={e} style={{
                            padding: '4px 12px', borderRadius: 8,
                            background: '#F8F4EF', color: '#475569',
                            fontSize: '0.78rem', border: '1px solid #E8E0D5',
                          }}>{e}</span>
                        ))}
                      </div>
                    </div>
                    {deg.nextStep && (
                      <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', lineHeight: 1.6 }}>
                        💡 {deg.nextStep}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison / Info Panel */}
          {activeDegree === null && (
            <div>
              <div style={{ background: stream.bg, border: `1px solid ${stream.color}33`, borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>{stream.icon}</div>
                <h3 style={{ fontFamily: 'Sora, sans-serif', color: stream.color, fontSize: '1.4rem', marginBottom: 12 }}>
                  {stream.stream} Stream
                </h3>
                <p style={{ color: '#64748B', lineHeight: 1.7, marginBottom: 20, fontSize: '0.92rem' }}>
                  Click on any degree card on the left to see the full career map — careers, exams, and honest salary expectations.
                </p>
                <div style={{ padding: '14px 18px', borderRadius: 12, background: 'white', border: `1px solid ${stream.color}22` }}>
                  <p style={{ fontSize: '0.78rem', fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Quick Stats</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Degrees Listed', value: stream.degrees.length },
                      { label: 'Typical Duration', value: stream.degrees[0].duration },
                      { label: 'Top Exam', value: stream.degrees[0].exams[0] },
                      { label: 'Best For', value: stream.icon + ' ' + stream.stream },
                    ].map(s => (
                      <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: stream.color, fontSize: '1rem' }}>{s.value}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Roadmap visual */}
              <div style={{ marginTop: 20, background: 'white', border: '1px solid #E8E0D5', borderRadius: 14, padding: 24 }}>
                <h4 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
                  🗺️ Typical Journey
                </h4>
                {['Class 12 Pass', 'Degree', 'Entrance / Qualifying Exams', 'Job / Higher Study'].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: i < 3 ? 4 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: stream.color, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                      }}>{i + 1}</div>
                      {i < 3 && <div style={{ width: 2, height: 20, background: `${stream.color}33` }} />}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#334155', paddingBottom: i < 3 ? 16 : 0 }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}