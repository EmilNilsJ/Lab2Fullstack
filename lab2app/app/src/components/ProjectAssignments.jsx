import React, { useState, useEffect, useCallback } from 'react';

const columns = [
  { key: 'employee_id', label: 'Employee ID' },
  { key: 'full_name', label: 'Employee Name' },
  { key: 'project_name', label: 'Project Name' },
  { key: 'start_date', label: 'Start Date' }
];

export default function ProjectAssignments() {
  const [data, setData] = useState([]);
  const [sortKey, setSortKey] = useState('start_date');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/project_assignments');
      if (!res.ok) throw new Error('Network response was not ok');
      const assignments = await res.json();
      setData(assignments);

    } catch (err) {
      console.error('Error fetching assignments:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const sorted = [...data].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (sortKey === 'start_date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  }).slice(0, 5);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              onClick={() => handleSort(col.key)}
              className="cursor-pointer border-b-2 p-2 text-left"
            >
              {col.label}
              {sortKey === col.key && (
                <span>{sortOrder === 'asc' ? ' ▲' : ' ▼'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map(item => (
          <tr key={item._id} className="hover:bg-gray-100">
            <td className="p-2">{item.employee_id}</td>
            <td className="p-2">{item.full_name}</td>
            <td className="p-2">{item.project_name}</td>
            <td className="p-2">{new Date(item.start_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
