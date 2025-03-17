import axios from 'axios';
import { Application } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const applicationsApi = {
  getAll: () => api.get<Application[]>('/applications').then(res => res.data),
  
  create: (application: Omit<Application, 'id'>) => 
    api.post<Application>('/applications', application).then(res => res.data),
  
  update: (id: string, application: Omit<Application, 'id'>) =>
    api.put<Application>(`/applications/${id}`, application).then(res => res.data),
  
  delete: (id: string) => 
    api.delete(`/applications/${id}`),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/token', { email, password }).then(res => {
      localStorage.setItem('token', res.data.access_token);
      return res.data;
    }),
  
  register: (name: string, email: string, password: string) =>
    api.post('/users', { name, email, password }),
  
  logout: () => {
    localStorage.removeItem('token');
  },
};