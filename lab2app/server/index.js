require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const employeesRouter = require('./routes/employeeRoute');
const projectsRouter = require('./routes/projectRoute');
const assignRouter = require('./routes/assignmentRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/employees', employeesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/project_assignments', assignRouter);

const buildPath = path.join(__dirname, '../app/build');
app.use(express.static(buildPath));
app.get(/.*/, (req, res) =>
    res.sendFile(path.join(buildPath, 'index.html'))
);

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
