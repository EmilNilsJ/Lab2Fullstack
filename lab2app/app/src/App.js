import './App.css';
import React  from 'react';
import ProjectAssignments from './components/ProjectAssignments';

function App() {
  return (
    <div className="App">
      <h1 className="text-2xl mb-4">Latest Project Assignments</h1>
      <ProjectAssignments />
    </div>
  );
}

export default App;
