require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee');
const Project = require('./models/Project');
const ProjectAssignment = require('./models/ProjectAssignment');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.CONNECTION_STRING).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const buildPath = path.join(__dirname, '../app/build');
app.use(express.static(buildPath));


// POST Add new employee
app.post('/api/employees', async (req, res) => {
    const { employee_id, full_name, email, password } = req.body;
    if (!employee_id || !full_name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    try {
        const hashed = await bcrypt.hash(password, 10);
        const newEmp = new Employee({ employee_id, full_name, email, hashed_password: hashed });
        await newEmp.save();
        res.status(201).json(newEmp);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Employee ID or email already exists.' });
        }
        res.status(500).json({ error: 'Server error.' });
    }
});

// POST Add new project
app.post('/api/projects', async (req, res) => {
    const { project_code, project_name, project_description } = req.body;
    if (!project_code || !project_name) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    try {
        const newProj = new Project({ project_code, project_name, project_description });
        await newProj.save();
        res.status(201).json(newProj);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Project code already exists.' });
        }
        res.status(500).json({ error: 'Server error.' });
    }
});

// POST Assign employee to project
app.post('/api/project_assignments', async (req, res) => {
    const { employee_id, project_code, start_date } = req.body;
    if (!employee_id || !project_code || !start_date) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    const emp = await Employee.findOne({ employee_id });
    const proj = await Project.findOne({ project_code });
    if (!emp || !proj) {
        return res.status(404).json({ error: 'Employee or Project not found.' });
    }
    try {
        const assignment = new ProjectAssignment({ employee_id, project_code, start_date: new Date(start_date) });
        await assignment.save();
        res.status(201).json(assignment);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Assignment already exists.' });
        }
        res.status(500).json({ error: 'Server error.' });
    }
});

// GET List all assignments with populated data
app.get('/api/project_assignments', async (req, res) => {
    try {
        const assignments = await ProjectAssignment.find()
            .populate('employee_id')
            .populate('project_code')
            .exec();
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Catch-all to serve React app
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
