import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    error: 'bg-red-500 text-white'
  };

  return (
    <div className={`fixed top-4 right-4 ${typeStyles[type]} px-6 py-4 rounded-lg shadow-lg animate-slide-up max-w-sm z-50`}>
      <div className="flex items-center justify-between">
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification;