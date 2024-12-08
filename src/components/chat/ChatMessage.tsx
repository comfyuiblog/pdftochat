import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../../types';
import { cn } from '../../utils/cn';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-blue-500' : 'bg-gray-500'
      )}>
        {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
      </div>
      <div className={cn(
        'flex-1 px-4 py-2 rounded-lg',
        isUser ? 'bg-blue-100' : 'bg-gray-100'
      )}>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}