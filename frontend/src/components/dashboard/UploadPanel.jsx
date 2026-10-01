import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileImage, CheckCircle } from 'lucide-react';

const UploadPanel = ({ onFilesSelected, maxFiles = 2 }) => {
  const [files, setFiles] = useState([]);
  
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    
    setFiles(prev => {
      const updated = [...prev, ...newFiles].slice(0, maxFiles);
      onFilesSelected(updated.map(f => f.file));
      return updated;
    });
  }, [maxFiles, onFilesSelected]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/tiff': ['.tif', '.tiff'],
    },
    maxFiles,
  });
  
  const removeFile = (index) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesSelected(updated.map(f => f.file));
      return updated;
    });
  };
  
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-earth-500 bg-earth-500/10'
            : 'border-space-700 hover:border-earth-500/50 bg-space-800/30'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">
          {isDragActive ? 'Drop images here...' : 'Drag & drop satellite images'}
        </p>
        <p className="text-sm text-gray-500">
          or click to browse (PNG, JPG, TIFF, GeoTIFF)
        </p>
        <p className="text-xs text-gray-600 mt-2">
          Maximum {maxFiles} file(s), 100MB each
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-space-800 rounded-lg p-4 border border-space-700"
            >
              <div className="flex items-center space-x-3 flex-1">
                <FileImage className="h-8 w-8 text-earth-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-4 p-1 hover:bg-space-700 rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadPanel;