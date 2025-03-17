import React, { useState } from 'react';
import { Application } from '../types';
import { CalendarIcon, BuildingIcon, TagIcon, MapPinIcon, BanknoteIcon, PlusIcon, SearchIcon } from 'lucide-react';
import ApplicationForm from './ApplicationForm';

const applications: Application[] = [
  {
    id: '1',
    company: 'TechCorp',
    position: 'Software Engineer',
    deadline: '2024-03-25',
    status: 'pending',
    source: 'placement',
    techStack: ['React', 'Node.js', 'TypeScript'],
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
  },
  {
    id: '2',
    company: 'InnovateSoft',
    position: 'Frontend Developer',
    deadline: '2024-03-28',
    status: 'submitted',
    source: 'outsourced',
    techStack: ['Vue.js', 'JavaScript', 'CSS'],
    location: 'Remote',
    salary: '$90,000 - $120,000',
  },
];

export default function ApplicationList() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Application['status']>();

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = !filter || app.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const handleNewApplication = (application: Omit<Application, 'id'>) => {
    // In a real app, this would make an API call
    console.log('New application:', application);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Applications</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Application
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filter || ''}
          onChange={(e) => setFilter(e.target.value as Application['status'] || undefined)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredApplications.map((app) => (
            <li key={app.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BuildingIcon className="h-5 w-5 text-gray-400" />
                    <p className="ml-2 text-sm font-medium text-indigo-600">
                      {app.company}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm text-gray-500">{app.location}</p>
                    </div>
                    <div className="flex items-center">
                      <BanknoteIcon className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm text-gray-500">{app.salary}</p>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <p className="ml-2 text-sm text-gray-500">
                        Due {new Date(app.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900">
                    {app.position}
                  </p>
                  <div className="mt-2 flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-400" />
                    <div className="ml-2 flex space-x-2">
                      {app.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : app.status === 'submitted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <ApplicationForm
          onSubmit={handleNewApplication}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}