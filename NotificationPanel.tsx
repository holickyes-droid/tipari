/**
 * NOTIFICATION PANEL COMPONENT
 * Professional B2B notification system for Tipari.cz
 * Displays reservation, project, payment, and system notifications
 */

import { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  Info,
  Calendar,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import { useNotifications, Notification } from '../contexts/NotificationContext';

type NotificationType = 'all' | 'reservations' | 'projects' | 'payments' | 'system';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationPanel({ isOpen, onClose, onNotificationClick }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<NotificationType>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (iconType: Notification['icon']) => {
    const iconClass = 'w-4 h-4';
    switch (iconType) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-[#14AE6B]`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertCircle className={`${iconClass} text-orange-600`} />;
      case 'payment':
        return <DollarSign className={`${iconClass} text-[#14AE6B]`} />;
      case 'calendar':
        return <Calendar className={`${iconClass} text-[#215EF8]`} />;
      case 'project':
        return <Briefcase className={`${iconClass} text-[#215EF8]`} />;
      case 'sla':
        return <Clock className={`${iconClass} text-[#215EF8]`} />;
      default:
        return <Info className={`${iconClass} text-[#215EF8]`} />;
    }
  };

  // Format timestamp for display
  const formatTimestamp = (notification: Notification): string => {
    // If we have exact timestamp, use it
    if (notification.timestampDate) {
      const now = new Date();
      const diff = now.getTime() - notification.timestampDate.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (hours < 1) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes < 1 ? 'Just now' : `${minutes}m ago`;
      } else if (hours < 24) {
        return `${hours}h ago`;
      } else if (days === 1) {
        return 'Yesterday';
      } else if (days < 7) {
        return `${days} days ago`;
      } else {
        // Show exact date for older notifications
        return notification.timestampDate.toLocaleDateString('cs-CZ', {
          day: 'numeric',
          month: 'short',
          year: notification.timestampDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    }
    
    // Fallback to string timestamp
    return notification.timestamp;
  };

  // Get exact datetime string for permanent notifications
  const getExactTimestamp = (notification: Notification): string | null => {
    if (!notification.isPermanent || !notification.timestampDate) return null;
    
    return notification.timestampDate.toLocaleString('cs-CZ', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    return notification.type === activeTab;
  });

  // Group by day
  const today: Notification[] = [];
  const yesterday: Notification[] = [];
  const earlier: Notification[] = [];

  filteredNotifications.forEach(n => {
    if (n.timestamp.includes('ago')) {
      today.push(n);
    } else if (n.timestamp === 'Yesterday') {
      yesterday.push(n);
    } else {
      earlier.push(n);
    }
  });

  const tabs: { id: NotificationType; label: string }[] = [
    { id: 'all', label: 'Vše' },
    { id: 'reservations', label: 'Rezervace' },
    { id: 'projects', label: 'Projekty' },
    { id: 'payments', label: 'Platby' },
    { id: 'system', label: 'Systém' },
  ];

  const renderNotificationGroup = (title: string, items: Notification[]) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </div>
        {items.map((notification) => {
          const exactTimestamp = getExactTimestamp(notification);
          
          // Priority styling
          const priorityStyle = notification.priority === 'CRITICAL' 
            ? 'border-l-4 border-l-red-500 bg-red-50/30' 
            : notification.priority === 'WARNING'
            ? 'border-l-4 border-l-orange-500 bg-orange-50/30'
            : '';
          
          return (
            <button
              key={notification.id}
              onClick={() => {
                markAsRead(notification.id);
                if (onNotificationClick) {
                  onNotificationClick(notification);
                }
              }}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-gray-50 transition-colors ${
                notification.unread ? 'bg-blue-50/30' : ''
              } ${priorityStyle} ${
                notification.isPermanent ? 'bg-blue-50/10 border-l-4 border-l-blue-400' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                  notification.isPermanent ? 'bg-blue-100' : 'bg-gray-50'
                }`}>
                  {getIcon(notification.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Priority Badge for CRITICAL notifications */}
                  {notification.priority === 'CRITICAL' && (
                    <div className="mb-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 border border-red-200">
                        KRITICKÉ
                      </span>
                    </div>
                  )}
                  
                  {/* System Event Label (for permanent notifications) */}
                  {notification.isPermanent && notification.systemEventLabel && (
                    <div className="mb-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                        {notification.systemEventLabel}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm text-[#040F2A] ${notification.unread ? 'font-semibold' : 'font-medium'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(notification)}
                      </span>
                      {notification.unread && (
                        <div className="w-2 h-2 rounded-full bg-[#215EF8]" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2">
                    {notification.description}
                  </p>
                  
                  <p className="text-xs font-medium text-[#040F2A] mb-1">
                    {notification.context}
                  </p>
                  
                  {/* Exact timestamp for permanent notifications (audit trail) */}
                  {exactTimestamp && (
                    <p className="text-[10px] text-blue-600 font-medium mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Čas systémové akce: {exactTimestamp}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-lg shadow-xl border border-border z-50 max-h-[70vh] flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#040F2A]">Notifikace</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-[#215EF8] text-white text-xs font-semibold rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-[#215EF8] hover:underline font-medium"
            >
              Označit vše jako přečtené
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#215EF8]/10 text-[#215EF8]'
                  : 'text-muted-foreground hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notification List */}
      <div className="overflow-y-auto flex-1">
        {filteredNotifications.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-sm font-medium text-[#040F2A] mb-1">
              Vše je vyřízeno
            </h4>
            <p className="text-xs text-muted-foreground text-center">
              Žádné nové notifikace
            </p>
          </div>
        ) : (
          <>
            {renderNotificationGroup('Dnes', today)}
            {renderNotificationGroup('Včera', yesterday)}
            {renderNotificationGroup('Starší', earlier)}
          </>
        )}
      </div>

      {/* Scroll gradient indicator */}
      {filteredNotifications.length > 5 && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      )}
    </div>
  );
}