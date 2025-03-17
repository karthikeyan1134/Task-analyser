import React from 'react';
import { BriefcaseIcon, CalendarDaysIcon, BellIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BriefcaseIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">JobTrackr</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-indigo-500">
              <CalendarDaysIcon className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-indigo-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-indigo-600"></span>
            </button>
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
}