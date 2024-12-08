import React from 'react';
import { PDFUploader } from './PDFUploader';
import { cn } from '../../utils/cn';

interface PDFViewerProps {
  pdfText: string | null;
  onPDFUpload: (text: string) => void;
}

export function PDFViewer({ pdfText, onPDFUpload }: PDFViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-8rem)]">
      {!pdfText ? (
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold">What do you want to learn today?</h2>
            <p className="text-gray-600">Upload a PDF to start learning</p>
            <PDFUploader onPDFUpload={onPDFUpload} />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <div className={cn(
              "prose prose-sm max-w-none",
              "prose-headings:font-semibold prose-headings:text-gray-900",
              "prose-p:text-gray-700 prose-p:leading-relaxed"
            )}>
              <pre className="whitespace-pre-wrap font-sans">{pdfText}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}