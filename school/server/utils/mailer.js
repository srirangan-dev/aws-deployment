const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error('❌ Mailer error:', error.message)
  } else {
    console.log('✅ Mailer ready')
  }
})

async function sendEmail({ to, subject, html }) {
  const sender = `${process.env.EMAIL_FROM_NAME || 'PathFinder'} <${process.env.EMAIL_USER}>`
  console.log(`📨 Sending email to: ${to} via ${sender}`)

  const info = await transporter.sendMail({
    from: sender,
    to,
    subject,
    html,
  })

  console.log('✅ Email sent:', info.messageId)
  return info
}

function otpTemplate(otp, name = '') {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
      <h2 style="color:#1E293B">Verify your email${name ? `, ${name}` : ''}</h2>
      <p style="color:#64748B">Your verification code is:</p>
      <div style="font-size:32px;font-weight:bold;letter-spacing:6px;padding:16px 0;color:#F97316">${otp}</div>
      <p style="color:#64748B">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
  `
}

function welcomeTemplate(name = '') {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
      <h2 style="color:#1E293B">Welcome${name ? `, ${name}` : ''}! 🎉</h2>
      <p style="color:#64748B">Your PathFinder account has been created successfully.</p>
      <p style="color:#64748B">We're glad to have you on board. Start exploring your career path today!</p>
    </div>
  `
}

function resetPasswordTemplate(resetLink, name = '') {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px">
      <h2 style="color:#1E293B">Reset your password${name ? `, ${name}` : ''}</h2>
      <p style="color:#64748B">Click the button below to reset your password. This link expires in 30 minutes.</p>
      <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#F97316;color:#fff;text-decoration:none;border-radius:8px;margin-top:8px;font-weight:bold">
        Reset Password
      </a>
      <p style="margin-top:16px;font-size:13px;color:#94A3B8">
        If the button doesn't work, copy this link:<br/>
        <a href="${resetLink}" style="color:#F97316">${resetLink}</a>
      </p>
      <p style="font-size:13px;color:#94A3B8">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `
}

module.exports = { sendEmail, otpTemplate, welcomeTemplate, resetPasswordTemplate }