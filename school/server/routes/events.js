const express = require('express')
const router = express.Router()
const { getAllEvents } = require('../data/events')

// GET /api/events  — same data the Timeline page renders, daysLeft computed live
router.get('/', (req, res) => {
  try {
    res.json({ events: getAllEvents() })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router