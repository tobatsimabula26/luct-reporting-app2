// server.js - LUCT Reporting System API
const express = require('express');
const cors = require('cors');
const knex = require('knex')(require('./knexfile').development);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'], // React app
}));
app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.send(`
    <h1>LUCT Reporting API</h1>
    <p>Available routes:</p>
    <ul>
      <li>GET /api/reports</li>
      <li>POST /api/reports</li>
      <li>PUT /api/reports/:id/feedback</li>
    </ul>
  `);
});

// GET all reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await knex('reports')
      .select('*')
      .orderBy('created_at', 'desc');

    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

// POST new report (from Lecturer)
app.post('/api/reports', async (req, res) => {
  try {
    const {
      facultyName,
      className,
      weekOfReporting,
      dateOfLecture,
      lecturerName,
      studentsPresent,
      totalRegisteredStudents
    } = req.body;

    // Validate required fields
    if (!facultyName || !className || !weekOfReporting || !dateOfLecture || !lecturerName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (studentsPresent > totalRegisteredStudents) {
      return res.status(400).json({ error: 'Students present cannot exceed total registered students' });
    }

    // Insert into database
    const [id] = await knex('reports').insert(req.body);

    res.status(201).json({
      message: 'Report submitted successfully',
      id,
      ...req.body
    });

  } catch (err) {
    console.error('Error inserting report:', err.message);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// PUT: Update report with PRL feedback
app.put('/api/reports/:id/feedback', async (req, res) => {
  const { id } = req.params;
  const { prlFeedback } = req.body;

  try {
    const count = await knex('reports')
      .where({ id })
      .update({
        prlFeedback: prlFeedback,
        updated_at: knex.fn.now()
      });

    if (count > 0) {
      res.status(200).json({ message: 'Feedback saved successfully' });
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (err) {
    console.error('Error updating feedback:', err.message);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Optional: Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`👉 API available at:`);
  console.log(`   GET  /api/reports`);
  console.log(`   POST /api/reports`);
  console.log(`   PUT  /api/reports/:id/feedback`);
});