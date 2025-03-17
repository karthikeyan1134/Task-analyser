export interface Application {
  id: string;
  company: string;
  position: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'completed';
  source: 'placement' | 'outsourced' | 'personal';
  techStack: string[];
  notes?: string;
  resumeLink?: string;
  coverLetterLink?: string;
  salary?: string;
  location?: string;
  interviewDate?: string;
  contactPerson?: string;
  contactEmail?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    emailNotifications: boolean;
    calendarSync: boolean;
    theme: 'light' | 'dark';
  };
}

export interface DashboardStats {
  totalApplications: number;
  pending: number;
  completed: number;
  successRate: number;
  upcomingInterviews: number;
  deadlinesThisWeek: number;
}