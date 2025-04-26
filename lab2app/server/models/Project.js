const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    project_code: { type: String, unique: true, required: true },
    project_name: { type: String, required: true },
    project_description: { type: String }
});

module.exports = mongoose.model('Project', projectSchema);