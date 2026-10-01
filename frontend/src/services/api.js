import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const uploadImages = async (files, analysisId = null) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  if (analysisId) {
    formData.append('analysis_id', analysisId);
  }
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const analyzeImages = async (query, filePaths, analysisType = null) => {
  const response = await api.post('/analyze', {
    query,
    file_paths: filePaths,
    analysis_type: analysisType,
  });
  
  return response.data;
};

export const getAnalysis = async (analysisId) => {
  const response = await api.get(`/analyze/${analysisId}`);
  return response.data;
};

export const getHistory = async (skip = 0, limit = 20) => {
  const response = await api.get('/history', {
    params: { skip, limit },
  });
  return response.data;
};

export const deleteAnalysis = async (analysisId) => {
  const response = await api.delete(`/history/${analysisId}`);
  return response.data;
};

export default api;