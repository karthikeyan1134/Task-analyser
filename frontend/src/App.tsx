import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ApplicationList from './components/ApplicationList';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <Dashboard />
        <ApplicationList />
      </main>
    </div>
  );
}

export default App;