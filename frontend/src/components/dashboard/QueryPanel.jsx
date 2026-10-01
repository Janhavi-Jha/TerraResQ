import React, { useState } from 'react';
import { Send, HelpCircle } from 'lucide-react';

const EXAMPLE_QUERIES = [
  "What changes occurred between these two images?",
  "Identify buildings and roads in this image",
  "Are there any newly constructed structures?",
  "Which areas show vegetation loss?",
  "Detect signs of flooding or water accumulation",
  "Compare urban expansion between the two dates",
];

const QueryPanel = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };
  
  const selectExample = (example) => {
    setQuery(example);
    setShowExamples(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-lg font-medium text-white">
          Ask a question about your imagery
        </label>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-earth-500 hover:text-earth-400 flex items-center space-x-1"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Examples</span>
        </button>
      </div>
      
      {showExamples && (
        <div className="bg-space-800 rounded-lg p-4 border border-space-700 space-y-2">
          <p className="text-sm text-gray-400 mb-3">Click to use:</p>
          {EXAMPLE_QUERIES.map((example, index) => (
            <button
              key={index}
              onClick={() => selectExample(example)}
              className="block w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-space-700 rounded transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., What changes occurred between these two images?"
          className="flex-1 px-4 py-3 bg-space-800 border border-space-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-earth-500 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-earth-600 text-white rounded-lg hover:bg-earth-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};

export default QueryPanel;