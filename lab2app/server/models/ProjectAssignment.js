const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        ref: 'Employee',
        required: true
    },
    project_code: {
        type: String,
        ref: 'Project',
        required: true
    },
    start_date: {
        type: Date,
        required: true
    }
});

assignmentSchema.index(
    {
        employee_id: 1, project_code: 1
    }, { unique: true }
);

module.exports = mongoose.model('ProjectAssignment', assignmentSchema);