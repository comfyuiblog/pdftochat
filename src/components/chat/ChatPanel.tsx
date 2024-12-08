import React from 'react';
import { Message } from '../../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function ChatPanel({ messages, isLoading, onSendMessage, disabled }: ChatPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>Welcome to the chat! Ask me anything about the uploaded content.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      <div className="p-4 border-t border-gray-200">
        <ChatInput
          onSendMessage={onSendMessage}
          disabled={disabled || isLoading}
          placeholder={
            disabled ? "Please upload a PDF first" :
            isLoading ? "Thinking..." :
            "Ask anything..."
          }
        />
      </div>
    </div>
  );
}