const express = require('express')
const router = express.Router()
const Reminder = require('../models/Reminder')
const { EVENTS } = require('../data/events')
const { sendEmail, subscribeConfirmTemplate } = require('../utils/mailer')

// POST /api/reminders/subscribe
// body: { email, eventId?, remindOn? }  -- omit eventId to subscribe to ALL high-priority events
// remindOn is optional: a specific date+time (ISO string) to be reminded on,
// in addition to / instead of the default 30/7/3/1-day windows.
router.post('/subscribe', async (req, res) => {
  try {
    const { email, eventId, remindOn } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    const normalizedId = eventId === undefined || eventId === null ? null : Number(eventId)
    const event = normalizedId ? EVENTS.find(e => e.id === normalizedId) : null
    if (normalizedId && !event) return res.status(404).json({ error: 'Event not found' })

    let normalizedRemindOn = null
    if (remindOn) {
      const parsed = new Date(remindOn)
      if (isNaN(parsed.getTime())) return res.status(400).json({ error: 'Invalid remindOn date/time' })
      normalizedRemindOn = parsed
    }

    const existing = await Reminder.findOne({ email: email.toLowerCase(), eventId: normalizedId })
    if (existing) return res.json({ ok: true, message: 'You are already subscribed for this.' })

    await Reminder.create({
      email: email.toLowerCase(),
      eventId: normalizedId,
      stream: event?.streams?.[0] || 'All',
      remindOn: normalizedRemindOn,
    })

    // Fire-and-forget: don't let a slow/failing SMTP connection block the response.
    // The subscription (the important part) is already saved above.
    sendEmail({
      to: email,
      subject: '🔔 Reminder subscription confirmed — PathFinder',
      html: subscribeConfirmTemplate(event, normalizedRemindOn),
    }).catch(err => console.error('Confirmation email failed:', err.message))

    res.json({ ok: true, message: 'Subscribed! We will email you before the deadline.' })
  } catch (err) {
    console.error('Subscribe error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/reminders/unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, eventId } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })
    const normalizedId = eventId === undefined || eventId === null ? null : Number(eventId)
    await Reminder.deleteOne({ email: email.toLowerCase(), eventId: normalizedId })
    res.json({ ok: true, message: 'Unsubscribed.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router