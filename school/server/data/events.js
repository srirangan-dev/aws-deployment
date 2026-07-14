        // Single source of truth for admission/scholarship events.
        // Previously this array was hardcoded inside the React component — moved here so:
        //   1. The cron reminder job can read the same data the frontend shows (no drift)
        //   2. daysLeft/status are computed from *today*, not frozen at write-time
        //
        // TODO: once you have >30-40 events, move this into MongoDB (a simple Event
        // model) so non-devs can add events without a redeploy. For now a static file
        // is simplest and fastest to ship.

        const EVENTS = [
        { id: 1, title: 'DU Undergraduate Admissions Open', type: 'Admission', date: '2026-06-01', deadline: '2026-06-30', description: 'Delhi University CSAS portal opens for B.A., B.Sc., B.Com UG admissions.', streams: ['Arts', 'Science', 'Commerce'], link: '#', priority: 'high' },
        { id: 2, title: 'NSP Scholarship Application Window', type: 'Scholarship', date: '2026-07-01', deadline: '2026-09-30', description: 'National Scholarship Portal — apply for PM Scholarship, Merit-cum-Means, and state scholarships.', streams: ['All'], link: '#', priority: 'high' },
        { id: 3, title: 'CUET UG Result Declared', type: 'Exam Result', date: '2026-05-20', deadline: null, description: 'CUET UG 2026 results have been announced. Check your score card.', streams: ['All'], link: '#', priority: 'medium' },
        { id: 4, title: 'Maharashtra CET Counselling Begins', type: 'Counselling', date: '2026-06-15', deadline: '2026-07-15', description: 'Maharashtra State CET Cell starts UG counselling for B.Sc., B.Com., B.A. in government colleges.', streams: ['Science', 'Commerce', 'Arts'], link: '#', priority: 'high' },
        { id: 5, title: 'Rajasthan Govt College Admission Last Date', type: 'Admission', date: '2026-07-20', deadline: '2026-07-20', description: 'Last date for online application to Rajasthan government degree colleges through SSO portal.', streams: ['All'], link: '#', priority: 'medium' },
        { id: 6, title: 'NEET UG Counselling Round 1', type: 'Counselling', date: '2026-08-01', deadline: '2026-08-15', description: 'MCC announces NEET UG 2026 counselling for MBBS/BDS admission in government medical colleges.', streams: ['Science'], link: '#', priority: 'high' },
        { id: 7, title: 'Post-Matric SC/ST Scholarship Deadline', type: 'Scholarship', date: '2026-10-31', deadline: '2026-11-15', description: 'Apply for Post-Matric Scholarship for SC/ST students enrolled in government colleges.', streams: ['All'], link: '#', priority: 'medium' },
        { id: 8, title: 'CUET UG 2026 Registration Opens', type: 'Exam', date: '2026-02-15', deadline: '2026-03-31', description: 'CUET UG 2026 registration closed. Results expected in May 2026.', streams: ['All'], link: '#', priority: 'low' },
        { id: 9, title: 'Central Sector Scheme Scholarship', type: 'Scholarship', date: '2026-08-01', deadline: '2026-09-15', description: 'Merit-based scholarship for undergraduate students from low-income families, administered via NSP.', streams: ['All'], link: '#', priority: 'high' },
        { id: 10, title: 'State Merit Scholarship — Tamil Nadu', type: 'Scholarship', date: '2026-08-10', deadline: '2026-10-05', description: 'Tamil Nadu government merit scholarship for first-generation graduates in government/aided colleges.', streams: ['All'], link: '#', priority: 'medium' },
        ]

        // Adds daysLeft + status computed against the current date (not a stored value)
        function withComputedFields(event, now = new Date()) {
        if (!event.deadline) {
            return { ...event, daysLeft: null, status: 'past' }
        }
        const daysLeft = Math.ceil((new Date(event.deadline) - now) / 86400000)
        return { ...event, daysLeft, status: daysLeft < 0 ? 'past' : 'upcoming' }
        }

        function getAllEvents() {
        const now = new Date()
        return EVENTS.map(e => withComputedFields(e, now))
        }

        module.exports = { EVENTS, getAllEvents, withComputedFields }