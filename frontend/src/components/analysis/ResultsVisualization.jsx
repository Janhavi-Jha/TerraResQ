import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  CheckCircle, 
  Activity, 
  ShieldAlert, 
  Boxes, 
  GitCompare, 
  PieChart as PieIcon, 
  Info 
} from 'lucide-react';
import { formatConfidence, formatPercentage } from '../../utils/formatters';

const CHART_COLORS = ['#22c55e', '#34d399', '#86efac', '#eab308', '#f87171', '#a7b0aa'];

const ResultsVisualization = ({ result, analysisType }) => {
  if (!result) return null;

  const {
    answer,
    confidence,
    detected_objects = [],
    detected_changes = [],
    statistics = {},
    explanation,
    model_used,
  } = result;

  // Prepare object detection chart data if class_counts exist
  const objectData = React.useMemo(() => {
    if (statistics?.class_counts) {
      return Object.entries(statistics.class_counts).map(([name, count]) => ({
        name: name.replace(/_/g, ' '),
        count,
      }));
    }
    if (detected_objects && detected_objects.length > 0) {
      const counts = {};
      detected_objects.forEach((obj) => {
        const key = obj.label || 'Object';
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts).map(([name, count]) => ({
        name,
        count,
      }));
    }
    return [];
  }, [statistics, detected_objects]);

  // Prepare change detection chart data
  const changeData = React.useMemo(() => {
    if (detected_changes && detected_changes.length > 0) {
      const grouped = {};
      detected_changes.forEach((c) => {
        const type = c.change_type || 'General Change';
        grouped[type] = (grouped[type] || 0) + (c.area || 1);
      });
      return Object.entries(grouped).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value: Math.round(value),
      }));
    }
    return [];
  }, [detected_changes]);

  return (
    <div className="space-y-6">
      {/* Primary Answer & Confidence Box */}
      <div className="bg-space-800 border border-space-700 rounded-xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-space-700/80">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-earth-400">
              AI Remote Sensing Synthesis
            </span>
            <h3 className="text-xl font-bold text-white mt-1">Analysis Findings</h3>
          </div>

          {confidence !== undefined && confidence !== null && (
            <div className="flex items-center space-x-3 bg-space-900/80 px-3.5 py-2 rounded-lg border border-space-700">
              <Activity className="w-4 h-4 text-earth-400" />
              <div className="text-xs">
                <span className="text-gray-400 block">Model Confidence</span>
                <span className="text-sm font-bold text-earth-400">
                  {formatConfidence(confidence)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Synthesis Answer */}
        <div className="mt-4 text-gray-200 text-base leading-relaxed whitespace-pre-line bg-space-900/50 p-4 rounded-lg border border-space-700/60">
          {answer}
        </div>

        {/* Model & Runtime attribution */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 pt-3 border-t border-space-700/60">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-earth-400" />
            <span>Architecture: <strong className="text-gray-300 font-mono">{model_used || 'TerraResQ Vision Engine'}</strong></span>
          </div>
          {explanation && (
            <span className="text-gray-400 italic">
              {explanation}
            </span>
          )}
        </div>
      </div>

      {/* Charts & Categorical Breakdown */}
      {(objectData.length > 0 || changeData.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Object Breakdown */}
          {objectData.length > 0 && (
            <div className="bg-space-800 border border-space-700 rounded-xl p-5 shadow-md">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-earth-400" />
                <span>Detected Feature Distribution</span>
              </h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={objectData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#102219', borderColor: '#1a3628', borderRadius: '8px', color: '#f8fafc' }}
                    />
                    <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Change Type Breakdown */}
          {changeData.length > 0 && (
            <div className="bg-space-800 border border-space-700 rounded-xl p-5 shadow-md">
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-emerald-400" />
                <span>Change Area Classification</span>
              </h4>
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={changeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {changeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#102219', borderColor: '#1a3628', borderRadius: '8px', color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Detected Objects Table / Badges */}
      {detected_objects && detected_objects.length > 0 && (
        <div className="bg-space-800 border border-space-700 rounded-xl p-5 shadow-md">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-emerald-400" />
            <span>Detected Elements ({detected_objects.length})</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-space-900/80 text-gray-400 uppercase tracking-wider text-[11px] border-b border-space-700">
                <tr>
                  <th className="px-4 py-2.5">Class / Label</th>
                  <th className="px-4 py-2.5">Confidence</th>
                  <th className="px-4 py-2.5">Bounding Box [x1, y1, x2, y2]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-700/60">
                {detected_objects.map((obj, i) => (
                  <tr key={i} className="hover:bg-space-700/40 transition-colors">
                    <td className="px-4 py-2 font-medium text-white capitalize">{obj.label}</td>
                    <td className="px-4 py-2 text-earth-400">{formatConfidence(obj.confidence)}</td>
                    <td className="px-4 py-2 font-mono text-gray-400">
                      {Array.isArray(obj.bbox) ? obj.bbox.map((v) => Number(v).toFixed(0)).join(', ') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Detected Changes Table */}
      {detected_changes && detected_changes.length > 0 && (
        <div className="bg-space-800 border border-space-700 rounded-xl p-5 shadow-md">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-amber-400" />
            <span>Detected Surface Changes ({detected_changes.length})</span>
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-space-900/80 text-gray-400 uppercase tracking-wider text-[11px] border-b border-space-700">
                <tr>
                  <th className="px-4 py-2.5">Region</th>
                  <th className="px-4 py-2.5">Type</th>
                  <th className="px-4 py-2.5">Description</th>
                  <th className="px-4 py-2.5">Area</th>
                  <th className="px-4 py-2.5">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-700/60">
                {detected_changes.map((change, i) => (
                  <tr key={i} className="hover:bg-space-700/40 transition-colors">
                    <td className="px-4 py-2 font-mono text-earth-400">#{change.region_id ?? i + 1}</td>
                    <td className="px-4 py-2 font-medium text-white capitalize">
                      {change.change_type?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-2 text-gray-300">{change.description}</td>
                    <td className="px-4 py-2 text-gray-400 font-mono">
                      {change.area ? `${change.area} px²` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-earth-400">{formatConfidence(change.confidence)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsVisualization;
