import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadPanel from '../components/dashboard/UploadPanel';
import QueryPanel from '../components/dashboard/QueryPanel';
import AnalysisTypeSelector from '../components/dashboard/AnalysisTypeSelector';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RecentAnalysis from '../components/dashboard/RecentAnalysis';
import { uploadImages, analyzeImages } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [analysisType, setAnalysisType] = useState('custom');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleAnalyze = async (query) => {
    if (files.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Upload files
      const uploadResult = await uploadImages(files);
      const filePaths = uploadResult.files.map(f => f.file_path);
      
      // Perform analysis
      const analysisResult = await analyzeImages(
        query,
        filePaths,
        analysisType === 'custom' ? null : analysisType
      );
      
      // Navigate to results
      navigate(`/results/${analysisResult.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="py-10">
      <div className="max-w-[1200px] w-full mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-2">Analysis Dashboard</h1>
          <p className="text-[#A7B0AA] text-base">
            Upload satellite imagery and analyze it using natural language
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-[#0B1711] rounded-xl p-6 border border-[#1A2E22] shadow-xs">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">
              1. Upload Images
            </h2>
            <UploadPanel
              onFilesSelected={setFiles}
              maxFiles={2}
            />
          </div>
          
          {/* Analysis Type */}
          <div className="bg-[#0B1711] rounded-xl p-6 border border-[#1A2E22] shadow-xs">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">
              2. Select Analysis Type
            </h2>
            <AnalysisTypeSelector
              selected={analysisType}
              onChange={setAnalysisType}
              numImages={files.length}
            />
          </div>
          
          {/* Query */}
          <div className="bg-[#0B1711] rounded-xl p-6 border border-[#1A2E22] shadow-xs">
            <h2 className="text-xl font-semibold text-[#F8FAFC] mb-4">
              3. Ask Your Question
            </h2>
            <QueryPanel
              onSubmit={handleAnalyze}
              isLoading={isLoading}
            />
          </div>

          {/* Recent Analyses Activity */}
          <div className="bg-[#0B1711] rounded-xl p-6 border border-[#1A2E22] shadow-xs">
            <RecentAnalysis />
          </div>
          
          {/* Loading/Error States */}
          {isLoading && (
            <div className="bg-[#0B1711] rounded-xl p-6 border border-[#1A2E22]">
              <LoadingSpinner message="Analyzing your imagery... This may take a few moments." />
            </div>
          )}
          
          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;