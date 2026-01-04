import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', // Conecta ao seu Backend
});

// Interceptor Profissional: Adiciona o Token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@DineX:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});