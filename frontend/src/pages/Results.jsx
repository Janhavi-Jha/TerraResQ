import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Clock, 
  Cpu, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import { getAnalysis } from '../services/api';
import ResultsVisualization from '../components/analysis/ResultsVisualization';
import ImageComparison from '../components/analysis/ImageComparison';
import ImagePreview from '../components/analysis/ImagePreview';
import MapView from '../components/analysis/MapView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate, formatDuration, formatAnalysisType } from '../utils/formatters';

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalysis(id);
      setAnalysis(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load analysis results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnalysisData();
    }
  }, [id]);

  const handleExportJson = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terraresq-analysis-${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Retrieving analysis report & model outputs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] w-full mx-auto px-6 py-16">
        <ErrorMessage message={error} onRetry={fetchAnalysisData} />
        <div className="mt-6 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-[#22C55E] hover:text-[#34D399] font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const isChangeDetection = analysis.analysis_type === 'change_detection';

  return (
    <div className="py-10">
      <div className="max-w-[1200px] w-full mx-auto px-6 space-y-8">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-sm text-[#A7B0AA] hover:text-[#F8FAFC] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportJson}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B1711] hover:bg-[#101A15] text-sm font-medium text-[#F8FAFC] border border-[#1A2E22] transition-colors"
              >
                <Download className="w-4 h-4 text-[#22C55E]" />
                <span>Export JSON</span>
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#22C55E] hover:bg-[#16a34a] text-sm font-semibold text-[#07120D] transition-colors shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Analysis</span>
              </Link>
            </div>
          </div>

          <div className="bg-[#0B1711] border border-[#1A2E22] rounded-2xl p-6 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#101A15] text-[#34D399] border border-[#1A2E22]">
                {formatAnalysisType(analysis.analysis_type)}
              </span>
              <span className="text-xs text-[#A7B0AA] font-mono">
                ID: #{analysis.id}
              </span>
              <span className="inline-flex items-center text-xs px-2.5 py-0.5 rounded-full bg-[#07120D] text-[#22C55E] border border-[#1A2E22]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {analysis.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-4">
              "{analysis.query}"
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#A7B0AA] pt-3 border-t border-[#1A2E22]">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-[#A7B0AA]" />
                <span>{formatDate(analysis.created_at)}</span>
              </div>
              {analysis.processing_time && (
                <div className="flex items-center space-x-1.5 text-[#22C55E]">
                  <Cpu className="w-4 h-4" />
                  <span>Processing Time: {formatDuration(analysis.processing_time)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Imagery & Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Visual Panels (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {isChangeDetection ? (
              <ImageComparison
                beforeLabel="Temporal Image T1 (Reference)"
                afterLabel="Temporal Image T2 (Target)"
              />
            ) : (
              <ImagePreview
                alt={analysis.query}
                metadata={{
                  filename: `analysis_${analysis.id}_image.png`,
                  width: 1024,
                  height: 1024,
                  bands: 3,
                  is_geotiff: true,
                  crs: 'EPSG:4326',
                }}
              />
            )}

            {/* Interactive Map View */}
            <MapView
              title="Remote Sensing Spatial Footprint"
              bounds={[77.1025, 28.5244, 77.3025, 28.7044]}
            />
          </div>

          {/* Results Analysis & Metrics (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ResultsVisualization
              result={analysis.result}
              analysisType={analysis.analysis_type}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
