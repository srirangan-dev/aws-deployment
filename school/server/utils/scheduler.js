const cron = require('node-cron')
const Reminder = require('../models/Reminder')
const { getAllEvents } = require('../data/events')
const { sendEmail, reminderTemplate } = require('./mailer')

const REMINDER_WINDOWS = [30, 7, 3, 1]

async function checkAndSendReminders() {
  const events = getAllEvents()

  for (const event of events) {
    if (event.status !== 'upcoming' || event.daysLeft == null) continue
    if (!REMINDER_WINDOWS.includes(event.daysLeft)) continue

    const tag = `${event.id}-${event.daysLeft}`
    const subscribers = await Reminder.find({
      $or: [{ eventId: event.id }, { eventId: null }],
      sentFor: { $ne: tag },
    })

    for (const sub of subscribers) {
      if (sub.eventId === null && event.priority !== 'high') continue

      const streamMatches =
        sub.stream === 'All' || event.streams.includes('All') || event.streams.includes(sub.stream)
      if (!streamMatches) continue

      try {
        await sendEmail({
          to: sub.email,
          subject: `⏰ ${event.daysLeft} day${event.daysLeft === 1 ? '' : 's'} left — ${event.title}`,
          html: reminderTemplate(event),
        })
        sub.sentFor.push(tag)
        await sub.save()
      } catch (err) {
        console.error(`Reminder email failed for ${sub.email}:`, err.message)
      }
    }
  }
}

// Send reminders for subscribers who picked a specific custom date + time.
// Runs on a tighter cadence (every 15 min) than the daily window check above,
// since a person picking "3:45 PM" expects the email close to that time, not at 9am.
async function checkCustomDateReminders() {
  const events = getAllEvents()
  const eventById = new Map(events.map(e => [e.id, e]))
  const now = new Date()

  // remindOn has arrived (<= now) and hasn't been sent yet.
  // Each subscriber has exactly one remindOn, so a single 'custom' tag is enough
  // to guarantee it only ever fires once.
  const subscribers = await Reminder.find({
    remindOn: { $ne: null, $lte: now },
    sentFor: { $ne: 'custom' },
  })

  for (const sub of subscribers) {
    const event = sub.eventId ? eventById.get(sub.eventId) : null
    if (!event) continue

    try {
      await sendEmail({
        to: sub.email,
        subject: `⏰ Reminder — ${event.title}`,
        html: reminderTemplate(event, sub.remindOn),
      })
      sub.sentFor.push('custom')
      await sub.save()
    } catch (err) {
      console.error(`Custom reminder email failed for ${sub.email}:`, err.message)
    }
  }
}

function startScheduler() {
  // Daily window-based reminders (30/7/3/1 days out) — still 9am is fine for these.
  cron.schedule('0 9 * * *', () => {
    console.log('📅 Running daily reminder check...')
    checkAndSendReminders().catch(err => console.error('Scheduler error:', err.message))
  })

  // Custom date+time reminders — checked every 15 minutes so the email goes out
  // close to the time the person actually picked.
  cron.schedule('*/15 * * * *', () => {
    checkCustomDateReminders().catch(err => console.error('Custom reminder error:', err.message))
  })

  console.log('📅 Reminder scheduler started (daily window check at 9am, custom-time check every 15 min)')
}

module.exports = { startScheduler, checkAndSendReminders, checkCustomDateReminders }