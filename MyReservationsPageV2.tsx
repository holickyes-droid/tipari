/**
 * MÉ REZERVACE - REDESIGN V2.0
 * 
 * Hybrid přístup: Investown struktura + Fingood estetika
 * 
 * INVESTOWN:
 * - Tabs s counters (ne stats pills)
 * - Horizontal list view (information-dense)
 * - Landscape thumbnails
 * - Desktop-optimized layout
 * 
 * FINGOOD:
 * - Minimální barvy (90% gray)
 * - Tenké 1px bordery
 * - Progress bar (ne kroužky!)
 * - Inline warnings (ne boxy!)
 * - Clean typography
 */

import { useState, useMemo } from 'react';
import { 
  Search,
  ChevronDown,
  Clock,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Eye,
  Download,
  Shield,
  Calendar,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { mockReservations } from '../data/mockReservations';
import { mockProjects } from '../data/mockProjects';
import { Reservation } from '../types/reservation';
import { ReservationDetail } from './ReservationDetail';

type SortOption = 'newest' | 'deadline-asc' | 'amount-desc';
type TabFilter = 'all' | 'requiresAction' | 'inProcess' | 'waiting' | 'completed';

export function MyReservationsPageV2() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('deadline-asc');
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  // Calculate stats for tabs
  const stats = useMemo(() => {
    const active = mockReservations.filter(r => 
      !['SUCCESS', 'NO_DEAL', 'EXPIRED'].includes(r.phase)
    );
    
    const requiresAction = active.filter(r => 
      (r.phase === 'WAITING_INVESTOR_SIGNATURE' && 
        new Date(r.createdAt).getTime() < Date.now() - 24 * 60 * 60 * 1000) ||
      r.phase === 'WAITING_MEETING_SELECTION'
    );

    const inProcess = active.filter(r =>
      r.phase === 'WAITING_DEVELOPER_DECISION' ||
      r.phase === 'MEETING_CONFIRMED' ||
      r.phase === 'MEETING_COMPLETED'
    );

    const waiting = mockReservations.filter(r => 
      r.phase === 'WAITING_INVESTOR_SIGNATURE' &&
      new Date(r.createdAt).getTime() >= Date.now() - 24 * 60 * 60 * 1000
    );

    const completed = mockReservations.filter(r => 
      ['SUCCESS', 'NO_DEAL', 'EXPIRED'].includes(r.phase)
    );

    return {
      all: mockReservations.length,
      requiresAction: requiresAction.length,
      inProcess: inProcess.length,
      waiting: waiting.length,
      completed: completed.length
    };
  }, []);

  // Helper functions
  const getProjectName = (projectId: string) => {
    return mockProjects.find(p => p.id === projectId)?.name || 'Neznámý projekt';
  };

  const getTicket = (projectId: string, ticketId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.tickets.find(t => t.id === ticketId);
  };

  const getDeadlineInfo = (reservation: Reservation) => {
    if (!reservation.slaDeadline) return null;

    const deadline = new Date(reservation.slaDeadline);
    const now = new Date();
    const hoursRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));

    if (hoursRemaining < 0) {
      return { text: 'Vypršelo', urgent: true };
    } else if (hoursRemaining < 24) {
      return { text: `${hoursRemaining}h`, urgent: true };
    } else {
      const daysRemaining = Math.floor(hoursRemaining / 24);
      return { text: `${daysRemaining} ${daysRemaining === 1 ? 'den' : 'dny'}`, urgent: false };
    }
  };

  const getProgress = (reservation: Reservation) => {
    const phaseSteps: Record<string, number> = {
      'WAITING_INVESTOR_SIGNATURE': 1,
      'WAITING_MEETING_SELECTION': 2,
      'WAITING_DEVELOPER_DECISION': 3,
      'MEETING_CONFIRMED': 4,
      'MEETING_COMPLETED': 5,
      'SUCCESS': 5,
      'NO_DEAL': 5,
      'EXPIRED': 0
    };
    
    const current = phaseSteps[reservation.phase] || 0;
    return {
      current,
      total: 5,
      percentage: (current / 5) * 100
    };
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      'WAITING_INVESTOR_SIGNATURE': 'Čeká na podpis investora',
      'WAITING_MEETING_SELECTION': 'Domluvit schůzku',
      'WAITING_DEVELOPER_DECISION': 'Čeká na developera',
      'MEETING_CONFIRMED': 'Schůzka potvrzena',
      'MEETING_COMPLETED': 'Schůzka proběhla',
      'SUCCESS': 'Úspěšně dokončeno',
      'NO_DEAL': 'Nedohodnuté',
      'EXPIRED': 'Expirováno'
    };
    return labels[phase] || phase;
  };

  const getNextActorLabel = (nextActor: string) => {
    const labels: Record<string, string> = {
      'INVESTOR': 'Čeká investor',
      'DEVELOPER': 'Čeká developer',
      'ADMIN': 'Čeká admin',
      'NONE': 'Připraveno'
    };
    return labels[nextActor] || nextActor;
  };

  const getRelativeTime = (isoDate: string) => {
    const now = new Date();
    const date = new Date(isoDate);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'dnes';
    if (diffDays === 1) return 'včera';
    if (diffDays < 7) return `před ${diffDays} dny`;
    if (diffDays < 30) return `před ${Math.floor(diffDays / 7)} týdny`;
    return `před ${Math.floor(diffDays / 30)} měsíci`;
  };

  const getRatingBadge = (projectId: string) => {
    // Mock rating based on project (real would come from backend)
    const ratings = ['A', 'A-', 'B+', 'B'];
    return ratings[parseInt(projectId.slice(-1)) % ratings.length];
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('A')) return 'bg-green-100 text-green-800';
    if (rating.startsWith('B')) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-600';
  };

  // Filter and sort reservations
  const filteredReservations = useMemo(() => {
    let filtered = [...mockReservations];

    // Apply tab filter
    if (activeTab === 'requiresAction') {
      filtered = filtered.filter(r => 
        (r.phase === 'WAITING_INVESTOR_SIGNATURE' && 
          new Date(r.createdAt).getTime() < Date.now() - 24 * 60 * 60 * 1000) ||
        r.phase === 'WAITING_MEETING_SELECTION'
      );
    } else if (activeTab === 'inProcess') {
      filtered = filtered.filter(r =>
        r.phase === 'WAITING_DEVELOPER_DECISION' ||
        r.phase === 'MEETING_CONFIRMED' ||
        r.phase === 'MEETING_COMPLETED'
      );
    } else if (activeTab === 'waiting') {
      filtered = filtered.filter(r => 
        r.phase === 'WAITING_INVESTOR_SIGNATURE' &&
        new Date(r.createdAt).getTime() >= Date.now() - 24 * 60 * 60 * 1000
      );
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(r => 
        ['SUCCESS', 'NO_DEAL', 'EXPIRED'].includes(r.phase)
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.investorName.toLowerCase().includes(query) ||
        getProjectName(r.projectId).toLowerCase().includes(query)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'deadline-asc') {
        if (!a.slaDeadline) return 1;
        if (!b.slaDeadline) return -1;
        return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
      } else if (sortBy === 'amount-desc') {
        const amountA = getTicket(a.projectId, a.ticketId)?.investmentAmount || 0;
        const amountB = getTicket(b.projectId, b.ticketId)?.investmentAmount || 0;
        return amountB - amountA;
      }
      return 0;
    });

    return filtered;
  }, [searchQuery, sortBy, activeTab]);

  // Show detail if selected
  if (selectedReservation) {
    return (
      <ReservationDetail
        reservation={selectedReservation}
        onBack={() => setSelectedReservation(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#040F2A] mb-2">
          Mé rezervace
        </h1>
        <p className="text-gray-600">
          Přehled všech rezervací s profesionálním Tipařem workflow
        </p>
      </div>

      {/* Tabs with Counters (Investown pattern) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-[#1e293b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Vše {stats.all}
        </button>
        
        <button
          onClick={() => setActiveTab('requiresAction')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'requiresAction'
              ? 'bg-[#1e293b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Vyžaduje akci {stats.requiresAction}
        </button>

        <button
          onClick={() => setActiveTab('inProcess')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'inProcess'
              ? 'bg-[#1e293b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          V procesu {stats.inProcess}
        </button>

        <button
          onClick={() => setActiveTab('waiting')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'waiting'
              ? 'bg-[#1e293b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Čeká na investora {stats.waiting}
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-[#1e293b] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Dokončeno {stats.completed}
        </button>
      </div>

      {/* Search & Sort Controls (Fingood clean) */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Hledat podle investora nebo projektu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#215EF8] focus:ring-2 focus:ring-[#215EF8]/20"
          />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:border-[#215EF8] cursor-pointer"
          >
            <option value="deadline-asc">Podle deadline</option>
            <option value="newest">Nejnovější</option>
            <option value="amount-desc">Podle částky</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
        </div>

        <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* List View (Investown horizontal cards) */}
      <div className="space-y-3">
        {filteredReservations.length === 0 ? (
          /* Empty State (Investown pattern) */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Žádné rezervace
            </h3>
            <p className="text-sm text-gray-600">
              {searchQuery ? 'Zkuste upravit vyhledávací dotaz' : 'V této kategorii zatím nemáte žádné rezervace'}
            </p>
          </div>
        ) : (
          filteredReservations.map((reservation) => {
            const ticket = getTicket(reservation.projectId, reservation.ticketId);
            const deadlineInfo = getDeadlineInfo(reservation);
            const progress = getProgress(reservation);
            const project = mockProjects.find(p => p.id === reservation.projectId);

            return (
              <div
                key={reservation.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedReservation(reservation)}
              >
                <div className="flex items-start gap-4">
                  
                  {/* Thumbnail (Investown landscape 80x64) */}
                  <div className="w-20 h-16 bg-gradient-to-br from-[#215EF8]/10 to-[#14AE6B]/10 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-2xl">🏢</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    
                    {/* Header Row - Investor · Projekt */}
                    <div className="mb-2">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight mb-0.5">
                        {reservation.investorName} · {getProjectName(reservation.projectId)}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {project?.location || 'Lokace neuvedena'}
                      </p>
                    </div>

                    {/* Investment Amount + Security Badge (ONE LINE) */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {ticket?.investmentAmount?.toLocaleString('cs-CZ') || '0'} Kč
                      </span>
                      {ticket?.securedTypes && ticket.securedTypes.length > 0 && (
                        <>
                          <span className="text-gray-300">·</span>
                          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            <Shield className="w-3 h-3" />
                            <span className="text-xs font-medium">{ticket.securedTypes[0]}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* PROVIZE - BIGGER & PROMINENT */}
                    {reservation.estimatedProvision && (
                      <div className="mb-3 bg-[#14AE6B]/5 border border-[#14AE6B]/20 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#14AE6B]" />
                          <span className="text-xs text-gray-600">Provize:</span>
                          <span className="text-base font-bold text-[#14AE6B]">
                            {reservation.estimatedProvision.toLocaleString('cs-CZ')} Kč
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Meeting Info - SIMPLIFIED (only if MEETING_CONFIRMED) */}
                    {reservation.phase === 'MEETING_CONFIRMED' && reservation.meetingScheduledDate && (
                      <div className="flex items-center gap-2 text-xs mb-2 text-blue-700">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-medium">
                          Schůzka {new Date(reservation.meetingScheduledDate).toLocaleDateString('cs-CZ', { 
                            day: 'numeric', 
                            month: 'long'
                          })}
                        </span>
                      </div>
                    )}

                    {/* Deadline + Progress (ONE LINE) */}
                    <div className="flex items-center gap-4 mb-2">
                      {deadlineInfo && (
                        <div className={`flex items-center gap-1.5 text-xs ${deadlineInfo.urgent ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Deadline {deadlineInfo.text}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs text-gray-500">
                          Krok {progress.current}/{progress.total}
                        </span>
                        <div className="flex-1 max-w-[120px] bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-[#14AE6B] h-1.5 rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Warnings (inline, ne boxy! Fingood pattern) */}
                    {reservation.phase === 'WAITING_INVESTOR_SIGNATURE' && (
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Čeká na podpis smlouvy investorem
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'WAITING_MEETING_SELECTION' && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Potřebujete domluvit schůzku s investorem
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'WAITING_DEVELOPER_DECISION' && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Čeká na rozhodnutí developera
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'MEETING_CONFIRMED' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Schůzka potvrzena, připravte se
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'MEETING_COMPLETED' && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Schůzka proběhla, čeká se na finální rozhodnutí
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'SUCCESS' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Rezervace úspěšně dokončena
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'NO_DEAL' && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Deal se neuskutečnil
                        </span>
                      </div>
                    )}

                    {reservation.phase === 'EXPIRED' && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          Rezervace expirovala
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button (Investown icon button) */}
                  <button 
                    className="w-8 h-8 rounded-full bg-[#14AE6B] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#0f8b54] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReservation(reservation);
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Results Counter */}
      {filteredReservations.length > 0 && (
        <div className="text-center text-sm text-gray-600">
          Zobrazeno {filteredReservations.length} rezervací
        </div>
      )}

    </div>
  );
}