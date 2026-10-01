import { useState, useCallback } from 'react';
import { uploadImages, analyzeImages, getAnalysis, getHistory, deleteAnalysis } from '../services/api';

export const useAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);

  const executeAnalysis = useCallback(async (files, query, analysisType = null) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Upload images
      const uploadRes = await uploadImages(files);
      const filePaths = uploadRes.files.map((f) => f.file_path);

      // 2. Run analysis
      const analysisRes = await analyzeImages(
        query,
        filePaths,
        analysisType === 'custom' ? null : analysisType
      );
      setCurrentAnalysis(analysisRes);
      return analysisRes;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Analysis failed. Please try again.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAnalysisById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnalysis(id);
      setCurrentAnalysis(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to fetch analysis details.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (skip = 0, limit = 50) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory(skip, limit);
      setHistory(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to fetch analysis history.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeAnalysis = useCallback(async (id) => {
    try {
      await deleteAnalysis(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to delete analysis.';
      setError(msg);
      throw new Error(msg);
    }
  }, [currentAnalysis]);

  return {
    isLoading,
    error,
    currentAnalysis,
    history,
    executeAnalysis,
    fetchAnalysisById,
    fetchHistory,
    removeAnalysis,
    setError,
  };
};

export default useAnalysis;
