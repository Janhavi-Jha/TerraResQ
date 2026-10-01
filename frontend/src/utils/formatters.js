export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '0%';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(num)) return '0%';
  return `${num.toFixed(1)}%`;
};

export const formatConfidence = (confidence) => {
  if (confidence === null || confidence === undefined) return 'N/A';
  const val = confidence <= 1 ? confidence * 100 : confidence;
  return `${Math.round(val)}%`;
};

export const formatDuration = (seconds) => {
  if (seconds === null || seconds === undefined) return 'N/A';
  if (seconds < 1) return `${Math.round(seconds * 1000)}ms`;
  return `${Number(seconds).toFixed(2)}s`;
};

export const formatAnalysisType = (type) => {
  if (!type) return 'Analysis';
  const map = {
    single_image: 'Single Image Analysis',
    optical_sar: 'Optical + SAR Fusion',
    change_detection: 'Change Detection',
    object_detection: 'Object Detection',
    vqa: 'Visual Question Answering',
    segmentation: 'Segmentation',
    custom: 'Custom Analysis',
  };
  return map[type] || type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
