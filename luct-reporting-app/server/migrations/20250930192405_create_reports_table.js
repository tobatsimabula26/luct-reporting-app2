// migrations/xxxxx_create_reports_table.js
exports.up = function(knex) {
  return knex.schema.createTable('reports', table => {
    table.increments('id').primary();
    table.string('facultyName').notNullable();
    table.string('className').notNullable();
    table.integer('weekOfReporting').notNullable();
    table.date('dateOfLecture').notNullable();
    table.string('courseName');
    table.string('courseCode');
    table.string('lecturerName').notNullable();
    table.integer('studentsPresent').notNullable();
    table.integer('totalRegisteredStudents').notNullable();
    table.string('venue');
    table.time('scheduledTime');
    table.string('topicTaught');
    table.text('learningOutcomes');
    table.text('recommendations');
    table.text('prlFeedback'); // For PRL to add feedback
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reports');
};