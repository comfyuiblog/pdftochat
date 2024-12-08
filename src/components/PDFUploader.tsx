import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { extractTextFromPDF } from '../utils/pdf';

interface PDFUploaderProps {
  onPDFUpload: (text: string) => void;
}

export function PDFUploader({ onPDFUpload }: PDFUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handlePDFProcessing = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a valid PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      const text = await extractTextFromPDF(file, (progress) => {
        setProgress(Math.min(Math.round(progress), 100));
      });
      
      setSelectedFile(file);
      onPDFUpload(text);
      setProgress(100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF file';
      console.error('PDF Processing Error:', errorMessage);
      setError(errorMessage);
      setSelectedFile(null);
      onPDFUpload('');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      await handlePDFProcessing(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isLoading,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDropRejected: (rejections) => {
      const rejection = rejections[0];
      if (rejection?.errors[0]?.code === 'file-too-large') {
        setError('File is too large. Maximum size is 100MB.');
      } else {
        setError('Invalid file. Please upload a PDF file.');
      }
    }
  });

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
    setProgress(0);
    onPDFUpload('');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          isLoading && 'opacity-50 cursor-not-allowed',
          error && 'border-red-300 bg-red-50'
        )}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="space-y-3">
            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-600">Processing PDF... {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500">
            <AlertCircle className="mx-auto h-12 w-12" />
            <p className="mt-2 text-sm">{error}</p>
            <p className="text-xs mt-1">Try uploading a different PDF file</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive ? 'Drop the PDF here' : 'Drag and drop a PDF here, or click to browse'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Maximum file size: 100MB
            </p>
          </>
        )}
      </div>

      {selectedFile && !error && (
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-green-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">
                {selectedFile.name}
              </span>
              <p className="text-xs text-gray-500">
                PDF processed successfully
              </p>
            </div>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
            type="button"
            aria-label="Remove file"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}