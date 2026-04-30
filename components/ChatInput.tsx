'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

const ChatInput = ({ onSendMessage, isDisabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      <div className="flex gap-3 items-end">
        <Input
          type="text"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isDisabled}
          className="chat-input-field border rounded-lg px-4 py-2 flex-1 focus-visible:ring-2"
        />
        <button
          onClick={handleSend}
          disabled={isDisabled || !message.trim()}
          className="chat-send-btn p-2 bg-[#212a3b] text-white rounded-lg hover:bg-[#2a3449] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
