const express = require('express');
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const ProjectAssignment = require('../models/ProjectAssignment');
const router = express.Router();

router.post('/', async (req, res) => {
    const { employee_id, project_code, start_date } = req.body;
    if (!employee_id || !project_code || !start_date)
        return res.status(400).json({ error: 'Missing required fields.' });

    const emp = await Employee.findOne({ employee_id });
    const proj = await Project.findOne({ project_code });
    if (!emp || !proj)
        return res.status(404).json({ error: 'Employee or Project not found.' });

    try {
        const assignment = new ProjectAssignment({
            employee_id,
            project_code,
            start_date: new Date(start_date)
        });
        await assignment.save();
        res.status(201).json({ employee_id, project_code, start_date: assignment.start_date });
    } catch (err) {
        if (err.code === 11000)
            return res.status(409).json({ error: 'Assignment already exists.' });

    }
    console.error(err);
    res.status(500).json({ error: 'Server error.', details: err.message });
});

router.get('/', async (req, res) => {
    try {
        const assignments = await ProjectAssignment.find()
            .populate({
                path: 'employee_id',
                model: 'Employee',
                localField: 'employee_id',
                foreignField: 'employee_id'
            })
            .populate({
                path: 'project_code',
                model: 'Project',
                localField: 'project_code',
                foreignField: 'project_code'
            })
            .exec();

        const simplified = assignments.map(a => ({
            _id: a._id,
            employee_id: a.employee_id.employee_id,
            full_name: a.employee_id.full_name,
            project_code: a.project_code.project_code,
            project_name: a.project_code.project_name,
            start_date: a.start_date
        }));

        res.json(simplified);
    } catch (err) {
        res.status(500).json({ error: 'Server error.', details: err.message });
    }
});

module.exports = router;
