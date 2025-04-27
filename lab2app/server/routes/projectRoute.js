const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

//POST create new project
router.post('/', async (req, res) => {
    const { project_code, project_name, project_description } = req.body;
    if (!project_code || !project_name)
        return res.status(400).json({ error: 'Missing required fields.' });

    try {
        const newProj = new Project({ project_code, project_name, project_description });
        await newProj.save();
        res.status(201).json({
            project_code: newProj.project_code,
            project_name: newProj.project_name,
            project_description: newProj.project_description
        });
    } catch (err) {
        if (err.code === 11000)
            return res.status(409).json({ error: 'Project code already exists.' });
        res.status(500).json({ error: 'Server error.', details: err.message });
    }
});

module.exports = router;
