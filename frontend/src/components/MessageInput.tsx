import React, { useRef, useEffect } from 'react';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  sendMessage: (message: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  message, 
  setMessage, 
  sendMessage, 
  disabled 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxChars = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      sendMessage(message);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 192; // 12rem or max-h-48
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="card p-0 overflow-hidden">
      {/* Main input area */}
      <div className="flex items-end space-x-2 p-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value.substring(0, maxChars))}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Connecting..." : "Type a message..."}
          disabled={disabled}
          className="flex-1 bg-transparent text-gray-800 placeholder-gray-500 text-base resize-none border-none focus:outline-none focus:ring-0 p-0 m-0 max-h-48"
          rows={1} // Start with 1 row, auto-resize will handle the rest
        />
        <button 
          type="submit" 
          disabled={!message.trim() || disabled}
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full h-10 w-10 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* Send Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-45 ml-0.5 mb-0.5">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      {/* Footer / Helper Text */}
      <div className="flex justify-between items-center px-4 pb-2 text-xs text-gray-400">
        <span>
          <strong>Enter</strong> to send. <strong>Shift+Enter</strong> for new line.
        </span>
        <span className={message.length > maxChars - 50 ? 'text-red-500' : ''}>
          {message.length}/{maxChars}
        </span>
      </div>
    </form>
  );
};

export default MessageInput;