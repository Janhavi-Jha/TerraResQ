import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, Clock, Cpu, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { formatDate, formatDuration, formatAnalysisType, truncateText } from '../../utils/formatters';

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-[#22C55E] bg-[#07120D] border-[#1A2E22]',
    label: 'Completed',
  },
  processing: {
    icon: Loader,
    color: 'text-amber-400 bg-[#07120D] border-amber-800 animate-spin',
    label: 'Processing',
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-400 bg-[#07120D] border-red-800',
    label: 'Failed',
  },
  pending: {
    icon: Clock,
    color: 'text-[#A7B0AA] bg-[#07120D] border-[#1A2E22]',
    label: 'Pending',
  },
};

const AnalysisCard = ({ analysis, onDelete }) => {
  const statusInfo = statusConfig[analysis.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-[#0B1711] border border-[#1A2E22] hover:border-[#22C55E]/50 rounded-xl p-5 transition-all shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#101A15] text-[#34D399] border border-[#1A2E22]">
            {formatAnalysisType(analysis.analysis_type)}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center text-xs px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
              <StatusIcon className="w-3.5 h-3.5 mr-1" />
              {statusInfo.label}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(analysis.id)}
                className="text-[#A7B0AA] hover:text-red-400 p-1 rounded hover:bg-[#101A15] transition-colors"
                title="Delete analysis"
                aria-label="Delete analysis"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2 line-clamp-2">
          {analysis.query}
        </h3>

        {analysis.result?.answer && (
          <p className="text-sm text-[#A7B0AA] mb-4 bg-[#07120D] p-3 rounded-lg border border-[#1A2E22] line-clamp-3">
            {truncateText(analysis.result.answer, 180)}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-[#1A2E22] flex items-center justify-between text-xs text-[#A7B0AA]">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-[#A7B0AA]" />
            {formatDate(analysis.created_at)}
          </span>
          {analysis.processing_time && (
            <span className="flex items-center text-[#22C55E]">
              <Cpu className="w-3.5 h-3.5 mr-1" />
              {formatDuration(analysis.processing_time)}
            </span>
          )}
        </div>

        <Link
          to={`/results/${analysis.id}`}
          className="inline-flex items-center text-[#22C55E] hover:text-[#34D399] font-medium group transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AnalysisCard;
