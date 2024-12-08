import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';

// Set the worker source to the local file
GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const CHUNK_SIZE = 1024 * 1024; // 1MB chunks for processing

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('PDF file size exceeds 200MB limit');
  }

  try {
    // Read file in chunks to handle large files
    const arrayBuffer = await readFileInChunks(file, onProgress);
    const pdf = await getDocument(new Uint8Array(arrayBuffer)).promise;
    
    if (pdf.numPages === 0) {
      throw new Error('The PDF file appears to be empty');
    }

    const totalPages = pdf.numPages;
    const texts: string[] = [];
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        texts.push(pageText);

        // Update progress based on pages processed
        if (onProgress) {
          onProgress((pageNum / totalPages) * 100);
        }

        // Clean up page resources
        await page.cleanup();
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        texts.push(`[Error extracting text from page ${pageNum}]`);
      }
    }

    const result = texts.join('\n\n').trim();
    if (!result) {
      throw new Error('No readable text found in the PDF');
    }

    return result;
  } catch (error) {
    console.error('PDF processing error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
    throw new Error('Failed to process PDF');
  }
}

async function readFileInChunks(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ArrayBuffer> {
  const chunks: ArrayBuffer[] = [];
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let loadedChunks = 0;

  for (let start = 0; start < file.size; start += CHUNK_SIZE) {
    const chunk = file.slice(start, start + CHUNK_SIZE);
    const buffer = await chunk.arrayBuffer();
    chunks.push(buffer);
    loadedChunks++;

    if (onProgress) {
      onProgress((loadedChunks / totalChunks) * 50); // First 50% of progress
    }
  }

  // Combine chunks
  const totalLength = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }

  return result.buffer;
}