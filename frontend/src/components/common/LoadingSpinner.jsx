import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className="h-12 w-12 text-earth-500 animate-spin" />
      <p className="mt-4 text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingSpinner;