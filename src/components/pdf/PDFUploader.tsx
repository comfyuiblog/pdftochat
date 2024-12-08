import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs`;

interface PDFUploaderProps {
  onPDFUpload: (text: string) => void;
}

export function PDFUploader({ onPDFUpload }: PDFUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractTextFromPDF = async (file: File) => {
    try {
      setIsLoading(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText.trim();
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      throw new Error('Failed to extract text from PDF');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        setSelectedFile(file);
        const text = await extractTextFromPDF(file);
        onPDFUpload(text);
      } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Failed to process PDF file. Please try again.');
      }
    }
  }, [onPDFUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    setSelectedFile(null);
    onPDFUpload('');
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isLoading ? 'Processing PDF...' :
           isDragActive ? 'Drop the PDF here' :
           'Drag and drop a PDF here, or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF files
        </p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              {selectedFile.name}
            </span>
          </div>
          <button
            onClick={removeFile}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}