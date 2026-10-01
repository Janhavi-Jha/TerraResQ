export const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.tif', '.tiff'];
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILES = 5;

export const isValidExtension = (fileName) => {
  if (!fileName) return false;
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
};

export const isValidFileSize = (fileSize, maxSize = MAX_FILE_SIZE) => {
  return fileSize > 0 && fileSize <= maxSize;
};

export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!isValidExtension(file.name)) {
    return {
      valid: false,
      error: `Unsupported file format. Supported formats: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  if (!isValidFileSize(file.size)) {
    return {
      valid: false,
      error: `File size exceeds the 100MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  return { valid: true, error: null };
};

export const validateFiles = (files, maxCount = MAX_FILES) => {
  if (!files || files.length === 0) {
    return { valid: false, error: 'Please select at least one file' };
  }

  if (files.length > maxCount) {
    return {
      valid: false,
      error: `Maximum of ${maxCount} files allowed (selected ${files.length})`,
    };
  }

  for (const file of files) {
    const check = validateFile(file);
    if (!check.valid) {
      return check;
    }
  }

  return { valid: true, error: null };
};
