/**
 * COMMUNICATION TIMELINE COMPONENT
 * Historie komunikace a poznámky k rezervaci a investorovi
 */

import { useState } from 'react';
import { MessageSquare, Plus, Send, PhoneCall, FileTextIcon, StickyNote, Mail, CheckCircle2, Calendar, User, AlertCircle } from 'lucide-react';
import { getActivitiesForReservation, getNotesForInvestor } from '../data/mockCommunication';
import type { CommunicationActivityType } from '../types/communication';

interface CommunicationTimelineProps {
  reservationId: string;
  investorId: string;
  investorName: string;
}

export function CommunicationTimeline({ reservationId, investorId, investorName }: CommunicationTimelineProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'notes'>('timeline');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  // Get data
  const activities = getActivitiesForReservation(reservationId);
  const investorNotes = getNotesForInvestor(investorId);

  // Get icon and color for activity type
  const getActivityIcon = (type: CommunicationActivityType) => {
    switch (type) {
      case 'TICKET_OFFERED':
        return { icon: Send, color: 'text-[#215EF8]', bg: 'bg-[#215EF8]/10' };
      case 'CONTRACT_SENT':
        return { icon: FileTextIcon, color: 'text-[#215EF8]', bg: 'bg-[#215EF8]/10' };
      case 'CONTRACT_SIGNED':
        return { icon: CheckCircle2, color: 'text-[#14AE6B]', bg: 'bg-[#14AE6B]/10' };
      case 'EMAIL_SENT':
        return { icon: Mail, color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'PHONE_CALL':
        return { icon: PhoneCall, color: 'text-[#215EF8]', bg: 'bg-[#215EF8]/10' };
      case 'MEETING_SCHEDULED':
        return { icon: Calendar, color: 'text-[#14AE6B]', bg: 'bg-[#14AE6B]/10' };
      case 'MEETING_COMPLETED':
        return { icon: CheckCircle2, color: 'text-[#14AE6B]', bg: 'bg-[#14AE6B]/10' };
      case 'NOTE_ADDED':
        return { icon: StickyNote, color: 'text-amber-600', bg: 'bg-amber-50' };
      case 'DOCUMENT_SENT':
        return { icon: FileTextIcon, color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'FOLLOW_UP':
        return { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' };
      case 'STATUS_CHANGED':
        return { icon: CheckCircle2, color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'SLA_EXPIRED':
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-100' };
      default:
        return { icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  // Format date relative
  const formatDateRelative = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return 'Před chvílí';
    } else if (diffHours < 24) {
      return `Před ${Math.floor(diffHours)}h`;
    } else if (diffHours < 48) {
      return 'Včera';
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `Před ${diffDays} dny`;
    }
  };

  // Handle adding new note
  const handleAddNote = () => {
    if (!newNoteContent.trim()) return;
    
    // In real app, save to backend
    console.log('Adding note:', newNoteContent);
    setNewNoteContent('');
    setShowAddNote(false);
  };

  return (
    <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
      {/* Header with Tabs */}
      <div className="border-b border-[#EAEAEA]">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-[#040F2A] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#215EF8]" />
                Komunikační historie
              </h2>
              <p className="text-sm text-[#6B7280] mt-1">
                Sledování všech interakcí a poznámek k investorovi {investorName}
              </p>
            </div>
            <button
              onClick={() => setShowAddNote(!showAddNote)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1B4FD1] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Přidat poznámku
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-[#215EF8] text-[#215EF8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#040F2A]'
              }`}
            >
              Timeline ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'notes'
                  ? 'border-[#215EF8] text-[#215EF8]'
                  : 'border-transparent text-[#6B7280] hover:text-[#040F2A]'
              }`}
            >
              Poznámky ({investorNotes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div className="bg-blue-50 border-b border-[#215EF8]/20 px-6 py-4">
          <div className="space-y-3">
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Napište poznámku k investorovi nebo k této rezervaci..."
              className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#215EF8] focus:border-transparent"
              rows={3}
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNoteContent('');
                }}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zrušit
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1B4FD1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Uložit poznámku
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-4 max-h-[600px] overflow-y-auto">
        {activeTab === 'timeline' ? (
          /* TIMELINE VIEW */
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity, index) => {
                const iconData = getActivityIcon(activity.activityType);
                const Icon = iconData.icon;

                return (
                  <div key={activity.id} className="relative">
                    {/* Timeline connector line */}
                    {index < activities.length - 1 && (
                      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconData.bg} flex items-center justify-center z-10`}>
                        <Icon className={`w-5 h-5 ${iconData.color}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-sm font-semibold text-[#040F2A]">
                                {activity.title}
                              </h4>
                              <p className="text-xs text-[#6B7280] mt-0.5">
                                {activity.createdByName} • {formatDateRelative(activity.createdAt)}
                              </p>
                            </div>
                            {activity.channel && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-white border border-gray-200 rounded text-gray-600">
                                {activity.channel}
                              </span>
                            )}
                          </div>

                          {activity.description && (
                            <p className="text-sm text-gray-700 mb-2">
                              {activity.description}
                            </p>
                          )}

                          {activity.emailSubject && (
                            <div className="text-xs text-gray-600 mt-2">
                              <span className="font-medium">Předmět:</span> {activity.emailSubject}
                            </div>
                          )}

                          {activity.documentName && (
                            <div className="mt-2 flex items-center gap-2 text-xs">
                              <FileTextIcon className="w-3.5 h-3.5 text-gray-500" />
                              <span className="text-gray-700 font-medium">{activity.documentName}</span>
                            </div>
                          )}

                          {activity.notes && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-600 italic">
                                <span className="font-medium not-italic">Interní poznámka:</span> {activity.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Zatím žádná komunikační historie</p>
              </div>
            )}
          </div>
        ) : (
          /* NOTES VIEW */
          <div className="space-y-3">
            {investorNotes.length > 0 ? (
              investorNotes.map((note) => (
                <div key={note.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <StickyNote className="w-4 h-4 text-amber-600" />
                      {note.isImportant && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded">
                          Důležité
                        </span>
                      )}
                      {note.category && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-white border border-amber-300 rounded text-amber-800">
                          {note.category}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-amber-700">
                      {formatDateRelative(note.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-800 mb-2">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between">
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {note.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-amber-700">
                      {note.createdByName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <StickyNote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Zatím žádné poznámky</p>
                <button
                  onClick={() => setShowAddNote(true)}
                  className="mt-4 px-4 py-2 text-sm font-medium text-[#215EF8] hover:text-[#1B4FD1] transition-colors"
                >
                  Přidat první poznámku
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}