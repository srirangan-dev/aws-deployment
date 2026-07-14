// utils/mailer.js
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME || 'PathFinder'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
  console.log(`📨 Email sent to: ${to} (id: ${info.messageId})`)
  return info
}

function formatRemindOn(remindOn) {
  if (!remindOn) return null
  return new Date(remindOn).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  })
}

function subscribeConfirmTemplate(event, remindOn) {
  const eventLine = event
    ? `<p>You're subscribed to reminders for <strong>${event.title}</strong> (deadline: ${event.deadline}).</p>`
    : `<p>You're subscribed to reminders for all high-priority admission and scholarship deadlines.</p>`

  const formatted = formatRemindOn(remindOn)
  const remindOnLine = formatted
    ? `<p>We'll email you on <strong>${formatted}</strong> (IST).</p>`
    : `<p>We'll email you 30, 7, 3, and 1 day before the deadline.</p>`

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>🔔 Subscription Confirmed</h2>
      ${eventLine}
      ${remindOnLine}
      <p style="color: #94A3B8; font-size: 0.85rem;">— PathFinder</p>
    </div>
  `
}

function reminderTemplate(event, remindOn) {
  const formatted = formatRemindOn(remindOn)
  const headline = formatted
    ? `⏰ Reminder for ${formatted} (IST)`
    : `⏰ ${event.daysLeft} day${event.daysLeft === 1 ? '' : 's'} left`

  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>${headline}</h2>
      <p><strong>${event.title}</strong></p>
      <p>${event.description}</p>
      <p>Deadline: <strong>${event.deadline}</strong></p>
      <p style="color: #94A3B8; font-size: 0.85rem;">— PathFinder</p>
    </div>
  `
}

module.exports = { sendEmail, subscribeConfirmTemplate, reminderTemplate }