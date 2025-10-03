// seed-reports.js - Full flow: Clear → Insert Lecturer Reports → Add PRL Feedback
const knex = require('knex')(require('./knexfile').development);

(async () => {
  try {
    console.log('🌱 Seeding lecturer reports and PRL feedback...\n');

    // === STEP 0: Clear all existing reports ===
    await knex('reports').del();
    console.log('🧹 Cleared all existing reports from the database.\n');

    // === STEP 1: Insert Fresh Lecturer Reports ===
    const reports = [
      {
        facultyName: 'ICT',
        className: 'DIT Year 2 A',
        weekOfReporting: 3,
        dateOfLecture: '2025-04-05',
        courseName: 'Web Development',
        courseCode: 'DIWA2110',
        lecturerName: 'George Fitzgerald',
        studentsPresent: 25,
        totalRegisteredStudents: 30,
        venue: 'Lab 3',
        scheduledTime: '10:00:00',
        topicTaught: 'Node.js APIs',
        learningOutcomes: 'Understand RESTful routing and Express endpoints',
        recommendations: 'More hands-on practice needed in backend development'
      },
      {
        facultyName: 'ICT',
        className: 'Bsc BIT Year 3 B',
        weekOfReporting: 3,
        dateOfLecture: '2025-04-06',
        courseName: 'Database Systems',
        courseCode: 'DBAS2110',
        lecturerName: 'Mpho Khoza',
        studentsPresent: 28,
        totalRegisteredStudents: 32,
        venue: 'Classroom 5',
        scheduledTime: '14:00:00',
        topicTaught: 'SQL Joins and Subqueries',
        learningOutcomes: 'Write complex queries using JOINs and subqueries',
        recommendations: 'Students need more time on advanced SQL topics'
      },
      {
        facultyName: 'ICT',
        className: 'DIT Year 1 C',
        weekOfReporting: 3,
        dateOfLecture: '2025-04-07',
        courseName: 'Programming Fundamentals',
        courseCode: 'PROG1110',
        lecturerName: 'Lebo Ndlovu',
        studentsPresent: 29,
        totalRegisteredStudents: 35,
        venue: 'Lab 1',
        scheduledTime: '08:00:00',
        topicTaught: 'Loops and Conditionals',
        learningOutcomes: 'Use for, while loops and if-else statements in C#',
        recommendations: 'Some students are struggling with logic — suggest extra tutorials'
      }
    ];

    for (const report of reports) {
      await knex('reports').insert(report);
    }

    console.log(`✅ Successfully inserted ${reports.length} fresh lecturer reports!\n`);

    // === STEP 2: Simulate PRL Adding Feedback ===
    console.log('📝 Adding PRL feedback to Report ID: 1...\n');

    const prlFeedback = `
Great session on Node.js! The students were engaged and followed along well.
Suggestion: Include a live coding demo next time to reinforce API concepts.
Also consider uploading lecture materials to the portal for revision.`.trim();

    await knex('reports')
      .where({ id: 1 })
      .update({ prlFeedback });

    console.log('✅ PRL feedback added to Report ID: 1\n');

    // === STEP 3: Fetch and Display All Reports (with feedback) ===
    const allReports = await knex('reports').select('*');
    
    console.log('📋 Final Reports in Database:\n');
    allReports.forEach((r, index) => {
      console.log(`${index + 1}. Week ${r.weekOfReporting} | Class: ${r.className}`);
      console.log(`   🧑‍🏫 Lecturer: ${r.lecturerName}`);
      console.log(`   📚 Topic: ${r.topicTaught}`);
      console.log(`   👥 Attendance: ${r.studentsPresent}/${r.totalRegisteredStudents}`);
      console.log(`   💬 Recommendations: ${r.recommendations}`);
      if (r.prlFeedback) {
        console.log(`   🟡 PRL Feedback: ${r.prlFeedback}`);
      }
      console.log('');
    });

    // === STEP 4: Close Connection ===
    await knex.destroy();
    console.log('👋 Database connection closed.');

  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    await knex?.destroy();
    process.exit(1);
  }
})();