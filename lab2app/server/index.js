require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

//Import routes for modular API structure
const employeesRouter = require('./routes/employeeRoute');
const projectsRouter = require('./routes/projectRoute');
const assignRouter = require('./routes/assignmentRoute');

const app = express();
const PORT = process.env.PORT || 5000;

//Enable CORS for requests from React dev server
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


mongoose.connect(process.env.CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error: ', err));

//Mount routers under api
app.use('/api/employees', employeesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/project_assignments', assignRouter);

//Serve reacts build output in production
const buildPath = path.join(__dirname, '../app/build');
app.use(express.static(buildPath));

//Catch-all handler for client side routing
app.get(/.*/, (req, res) =>
    res.sendFile(path.join(buildPath, 'index.html'))
);

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
