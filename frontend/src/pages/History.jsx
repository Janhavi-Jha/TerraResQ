import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History as HistoryIcon, Search, Filter, RefreshCw, Plus, AlertCircle } from 'lucide-react';
import { getHistory, deleteAnalysis } from '../services/api';
import AnalysisCard from '../components/history/AnalysisCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory(0, 50);
      setItems(data || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    try {
      await deleteAnalysis(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert('Failed to delete analysis: ' + (err.response?.data?.detail || err.message));
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.query?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.result?.answer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.analysis_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="py-10">
      <div className="max-w-[1200px] w-full mx-auto px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F8FAFC] flex items-center gap-3">
              <HistoryIcon className="w-8 h-8 text-[#22C55E]" />
              <span>Analysis Archive</span>
            </h1>
            <p className="text-[#A7B0AA] text-sm mt-1">
              Browse, search, and review all previous satellite imagery queries and findings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchItems}
              disabled={loading}
              className="p-2.5 bg-[#0B1711] hover:bg-[#101A15] border border-[#1A2E22] rounded-lg text-[#A7B0AA] hover:text-[#F8FAFC] transition-colors"
              title="Refresh history"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#22C55E] hover:bg-[#16a34a] text-[#07120D] rounded-lg text-sm font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Analysis</span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-[#0B1711] border border-[#1A2E22] rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#A7B0AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by query terms or findings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#07120D] border border-[#1A2E22] rounded-lg text-sm text-[#F8FAFC] placeholder-[#A7B0AA] focus:outline-hidden focus:border-[#22C55E]"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[#A7B0AA] shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#07120D] border border-[#1A2E22] text-[#F8FAFC] text-sm rounded-lg px-3 py-2 focus:outline-hidden focus:border-[#22C55E] w-full md:w-auto"
            >
              <option value="all">All Analysis Types</option>
              <option value="single_image">Single Image</option>
              <option value="change_detection">Change Detection</option>
              <option value="object_detection">Object Detection</option>
              <option value="vqa">Visual Q&A</option>
              <option value="optical_sar">Optical + SAR</option>
              <option value="segmentation">Segmentation</option>
            </select>
          </div>
        </div>

        {/* Content state */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner message="Loading historical analyses..." />
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchItems} />
        ) : filteredItems.length === 0 ? (
          <div className="bg-[#0B1711] border border-dashed border-[#1A2E22] rounded-2xl p-12 text-center max-w-lg mx-auto">
            <HistoryIcon className="w-12 h-12 text-[#A7B0AA] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">No analyses found</h3>
            <p className="text-[#A7B0AA] text-sm mb-6">
              {searchQuery || selectedType !== 'all'
                ? 'Try adjusting your search terms or filter selection.'
                : 'You have not run any satellite imagery analyses yet.'}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-5 py-2.5 bg-[#22C55E] hover:bg-[#16a34a] text-[#07120D] rounded-lg text-sm font-semibold transition-colors"
            >
              Run First Analysis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((analysis) => (
              <AnalysisCard
                key={analysis.id}
                analysis={analysis}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
