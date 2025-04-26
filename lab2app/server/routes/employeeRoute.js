const express = require('express');
const bcrypt = require('bcrypt');
const Employee = require('../models/Employee');
const router = express.Router();


router.post('/', async (req, res) => {
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

module.exports = router;