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

    if (existing) {
      // Re-subscribing with a (possibly new) custom time. Previously this just
      // returned early and silently discarded the new remindOn — meaning if the
      // old record already had "custom" in sentFor, the reminder could NEVER
      // fire again. Instead: update remindOn and clear the "custom" sent-flag
      // so the scheduler will pick it up and send again for the new time.
      // Keep window-based tags (e.g. "3-30") so daily 30/7/3/1-day reminders
      // already sent aren't re-sent.
      const remindOnChanged =
        normalizedRemindOn && (!existing.remindOn || existing.remindOn.getTime() !== normalizedRemindOn.getTime())

      if (remindOnChanged) {
        existing.remindOn = normalizedRemindOn
        existing.sentFor = existing.sentFor.filter(tag => tag !== 'custom')
        await existing.save()
        return res.json({ ok: true, message: 'Reminder time updated! We will email you at the new time.' })
      }

      return res.json({ ok: true, message: 'You are already subscribed for this.' })
    }

    await Reminder.create({
      email: email.toLowerCase(),
      eventId: normalizedId,
      stream: event?.streams?.[0] || 'All',
      remindOn: normalizedRemindOn,
    })

    // FIX: this used to be fire-and-forget (sendEmail(...).catch(...) with the
    // res.json sent immediately after, not waiting for the result). That meant
    // a failed SMTP send (bad auth, rate limit, etc.) was only ever logged on
    // the server — the user always saw "Subscribed! We will email you..." even
    // when no email went out at all. Now we await it and tell the user the
    // truth if it fails. The subscription itself is already saved above either
    // way, so we don't roll that back on an email failure.
    try {
      await sendEmail({
        to: email,
        subject: '🔔 Reminder subscription confirmed — PathFinder',
        html: subscribeConfirmTemplate(event, normalizedRemindOn),
      })
    } catch (err) {
      console.error('Confirmation email failed:', err.message)
      return res.json({
        ok: true,
        message: 'Subscribed! (Note: the confirmation email failed to send — your reminder is still saved.)',
      })
    }

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