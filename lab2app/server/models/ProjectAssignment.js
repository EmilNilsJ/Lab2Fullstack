const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    employee_id: { type: String, ref: 'Employee', required: true },
    project_code: { type: String, ref: 'Project', required: true },
    start_date: { type: Date, required: true }
});

module.exports = mongoose.model('ProjectAssignment', projectSchema);