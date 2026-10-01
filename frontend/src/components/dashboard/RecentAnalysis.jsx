import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { getHistory } from '../../services/api';
import { formatDate, formatAnalysisType } from '../../utils/formatters';

const RecentAnalysis = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await getHistory(0, 4);
        if (mounted) {
          setItems(data || []);
        }
      } catch (err) {
        if (mounted) {
          setError('Could not load recent analyses');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-400 text-sm animate-pulse">
        Loading recent activity...
      </div>
    );
  }

  if (error || items.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No recent analyses yet. Upload an image above to run your first analysis!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <History className="w-4 h-4 text-earth-400" />
          <span>Recent Analyses</span>
        </h3>
        <Link
          to="/history"
          className="text-xs text-earth-400 hover:text-earth-300 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/results/${item.id}`}
            className="p-3 bg-space-800/80 hover:bg-space-700/80 border border-space-700 rounded-lg flex flex-col justify-between transition-colors group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span className="text-earth-400 font-medium">
                  {formatAnalysisType(item.analysis_type)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-500" />
                  {formatDate(item.created_at)}
                </span>
              </div>
              <p className="text-sm text-white font-medium line-clamp-1 group-hover:text-earth-300 transition-colors">
                {item.query}
              </p>
            </div>
            {item.result?.answer && (
              <p className="text-xs text-gray-400 mt-2 line-clamp-1">
                {item.result.answer}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentAnalysis;
