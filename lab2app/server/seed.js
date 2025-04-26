require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Employee = require('./models/Employee');
const Project = require('./models/Project');
const ProjectAssignment = require('./models/ProjectAssignment');


async function seed() {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log('Connected to MongoDB Atlas');

    await Promise.all([
        Employee.deleteMany({}),
        Project.deleteMany({}),
        ProjectAssignment.deleteMany({})
    ]);

    const rawEmployees = [
        { employee_id: 'E001', full_name: 'Alice Johnson', email: 'alice@example.com', password: 'pass123' },
        { employee_id: 'E002', full_name: 'Bob Smith', email: 'bob@example.com', password: 'pass123' },
        { employee_id: 'E003', full_name: 'Carol Davis', email: 'carol@example.com', password: 'pass123' },
        { employee_id: 'E004', full_name: 'David Brown', email: 'david@example.com', password: 'pass123' },
        { employee_id: 'E005', full_name: 'Eve Wilson', email: 'eve@example.com', password: 'pass123' }
    ];

    const employees = await Promise.all(
        rawEmployees.map(async ({ password, ...emp }) => {
            const hashed = await bcrypt.hash(password, 10);
            return Employee.create({ ...emp, hashed_password: hashed });
        })
    );

    const projects = await Project.create([
        { project_code: 'P100', project_name: 'Project Apollo', project_description: 'Landing humans on the moon.' },
        { project_code: 'P101', project_name: 'Project Zephyr', project_description: 'High-speed wind tunnels.' },
        { project_code: 'P102', project_name: 'Project Orion', project_description: 'Deep-space exploration.' },
        { project_code: 'P103', project_name: 'Project Phoenix', project_description: 'Rebirth of legacy systems.' },
        { project_code: 'P104', project_name: 'Project Atlas', project_description: 'Global mapping platform.' }
    ]);

    const assignments = employees.map((emp, idx) => ({
        employee_id: emp.employee_id,
        project_code: projects[idx].project_code,
        start_date: new Date()
    }));
    await ProjectAssignment.create(assignments);

    console.log('Seed data completed');
    await mongoose.disconnect();
    console.log('Disconnected');
}

seed().catch(err => console.error(err));