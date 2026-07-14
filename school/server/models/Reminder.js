const mongoose = require('mongoose')

const reminderSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true, trim: true },
  eventId:   { type: Number, default: null }, // null = subscribed to ALL high-priority events
  stream:    { type: String, default: 'All' },
  sentFor:   { type: [String], default: [] }, // e.g. ["3-30","3-7"] eventId-daysLeft pairs already emailed, prevents dupes
  remindOn: { type: Date, default: null },
}, { timestamps: true })

reminderSchema.index({ email: 1, eventId: 1 }, { unique: true })

module.exports = mongoose.model('Reminder', reminderSchema)