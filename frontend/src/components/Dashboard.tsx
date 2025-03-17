import React from 'react';
import { BarChart3Icon, BriefcaseIcon, ClockIcon, CheckCircleIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';

const stats = [
  { name: 'Total Applications', value: '35', icon: BriefcaseIcon },
  { name: 'Pending', value: '12', icon: ClockIcon },
  { name: 'Completed', value: '23', icon: CheckCircleIcon },
  { name: 'Success Rate', value: '65%', icon: BarChart3Icon },
  { name: 'Upcoming Interviews', value: '3', icon: CalendarIcon },
  { name: 'This Week\'s Deadlines', value: '5', icon: TrendingUpIcon },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}