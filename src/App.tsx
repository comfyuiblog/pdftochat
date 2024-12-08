import React, { useState, useEffect } from 'react';
import { ChatMessage } from './components/chat/ChatMessage';
import { ChatInput } from './components/chat/ChatInput';
import { ModelSelector } from './components/ModelSelector';
import { PDFUploader } from './components/pdf/PDFUploader';
import { Message, ChatState, OllamaModel } from './types';
import { getInstalledModels } from './services/models';
import { chatWithOllama } from './services/chat';

function App() {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedModel: '',
    pdfText: null,
  });
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const models = await getInstalledModels();
        setAvailableModels(models);
        if (models.length > 0) {
          setState(prev => ({ ...prev, selectedModel: models[0].name }));
        } else {
          setError('No Ollama models found. Please ensure Ollama is running and has models installed.');
        }
      } catch (err) {
        setError('Failed to connect to Ollama. Please ensure the service is running.');
      }
    }
    fetchModels();
  }, []);

  const handleModelSelect = (model: string) => {
    setState(prev => ({ ...prev, selectedModel: model }));
  };

  const handlePDFUpload = (text: string) => {
    setState(prev => ({ ...prev, pdfText: text }));
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const prompt = state.pdfText 
        ? `Context from PDF:\n${state.pdfText}\n\nUser question: ${content}`
        : content;

      const response = await chatWithOllama(state.selectedModel, prompt);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          role: 'assistant',
          content: `Error: ${errorMessage}. Please try again.`
        }],
        isLoading: false,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>
          <PDFUploader onPDFUpload={handlePDFUpload} />
          {state.pdfText && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">PDF Content Preview</h3>
              <div className="max-h-[200px] overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {state.pdfText.slice(0, 500)}
                  {state.pdfText.length > 500 && '...'}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat with AI</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Model:</span>
                <ModelSelector
                  models={availableModels.map(m => m.name)}
                  selectedModel={state.selectedModel}
                  onModelSelect={handleModelSelect}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {state.messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {state.messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start a conversation!</p>
                  {state.pdfText && (
                    <p className="text-sm mt-2">PDF context is loaded and ready.</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200">
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={state.isLoading || !state.selectedModel}
                placeholder={
                  !state.selectedModel ? "Please select a model first" :
                  state.isLoading ? "Waiting for response..." :
                  "Type your message..."
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;