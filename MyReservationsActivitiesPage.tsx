/**
 * MÉ REZERVACE - MODERN CARD VIEW
 * 
 * Professional B2B reservation management for Tipař (introducers)
 * Based on Tipari.cz Listed Projects page design system
 */

import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Building2,
  FileText,
  Eye,
  MessageCircle,
  Info,
  DollarSign
} from 'lucide-react';
import { mockReservations } from '../data/mockReservations';
import { mockProjects } from '../data/mockProjects';
import { Reservation } from '../types/reservation';
import { ReservationDetail } from './ReservationDetail';
import { CancelReservationPage } from './CancelReservationPage';

type ViewMode = 'list' | 'detail' | 'cancel';
type StatusFilter = 'all' | 'action-required' | 'waiting' | 'completed';
type SortOption = 'newest' | 'oldest' | 'urgent-first';

interface MyReservationsActivitiesPageProps {
  onNavigateToTickets?: () => void;
}

export function MyReservationsActivitiesPage({ onNavigateToTickets }: MyReservationsActivitiesPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  const getProjectName = (projectId: string): string => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || 'Projekt';
  };

  const getPhaseLabel = (phase: Reservation['phase']): string => {
    const labels: Record<Reservation['phase'], string> = {
      WAITING_INVESTOR_SIGNATURE: 'Čeká na podpis investora',
      WAITING_MEETING_SELECTION: 'Čeká na domluvu schůzky',
      WAITING_DEVELOPER_DECISION: 'Čeká na rozhodnutí developera',
      MEETING_CONFIRMED: 'Schůzka potvrzena',
      MEETING_COMPLETED: 'Schůzka dokončena',
      SUCCESS: 'Úspěšné',
      NO_DEAL: 'Nedohodnuto',
      EXPIRED: 'Vypršelo',
    };
    return labels[phase];
  };

  const getStatusBadge = (phase: Reservation['phase']) => {
    const config = {
      WAITING_INVESTOR_SIGNATURE: {
        label: 'Čeká na investora',
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Clock
      },
      WAITING_MEETING_SELECTION: {
        label: 'Domluva schůzky',
        className: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: MessageCircle
      },
      WAITING_DEVELOPER_DECISION: {
        label: 'Čeká na developera',
        className: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Clock
      },
      MEETING_CONFIRMED: {
        label: 'Schůzka potvrzena',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: Calendar
      },
      MEETING_COMPLETED: {
        label: 'Schůzka dokončena',
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle2
      },
      SUCCESS: {
        label: 'Úspěšné',
        className: 'bg-[#14AE6B]/10 text-[#14AE6B] border-[#14AE6B]/30',
        icon: CheckCircle2
      },
      NO_DEAL: {
        label: 'Nedohodnuto',
        className: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: XCircle
      },
      EXPIRED: {
        label: 'Vypršelo',
        className: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle
      },
    };

    const { label, className, icon: Icon } = config[phase];
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm ${className}`}>
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  const getSLAStatus = (reservation: Reservation): { label: string; color: string; urgent: boolean } | null => {
    if (!reservation.slaDeadline) return null;
    
    const now = new Date();
    const deadline = new Date(reservation.slaDeadline);
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursRemaining < 0) {
      return { label: 'Vypršelo', color: 'bg-red-50 border-red-200 text-red-900', urgent: true };
    }
    if (hoursRemaining < 24) {
      return { label: `${Math.round(hoursRemaining)}h zbývá`, color: 'bg-orange-50 border-orange-200 text-orange-900', urgent: true };
    }
    return null;
  };

  const canTakeAction = (reservation: Reservation): boolean => {
    if (reservation.phase === 'WAITING_INVESTOR_SIGNATURE') {
      const now = new Date();
      const created = new Date(reservation.createdAt);
      const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
      return hoursElapsed >= 24;
    }
    if (reservation.phase === 'WAITING_MEETING_SELECTION') return true;
    return false;
  };

  const getActionLabel = (reservation: Reservation): string => {
    if (reservation.phase === 'WAITING_INVESTOR_SIGNATURE') return 'Připomenout investora';
    if (reservation.phase === 'WAITING_MEETING_SELECTION') return 'Domluvit schůzku';
    return 'Zobrazit detail';
  };

  // ========================================
  // DATA GROUPING & STATS
  // ========================================

  const stats = useMemo(() => {
    const actionRequired = mockReservations.filter(r => canTakeAction(r));
    const waiting = mockReservations.filter(r => 
      !canTakeAction(r) && 
      r.phase !== 'SUCCESS' && 
      r.phase !== 'NO_DEAL' && 
      r.phase !== 'EXPIRED'
    );
    const completed = mockReservations.filter(r => 
      r.phase === 'SUCCESS' || r.phase === 'NO_DEAL' || r.phase === 'EXPIRED'
    );
    const success = mockReservations.filter(r => r.phase === 'SUCCESS');

    return {
      total: mockReservations.length,
      actionRequired: actionRequired.length,
      waiting: waiting.length,
      success: success.length,
    };
  }, []);

  // Filtering and sorting
  const filteredAndSortedReservations = useMemo(() => {
    let filtered = mockReservations;

    // Apply status filter
    if (statusFilter === 'action-required') {
      filtered = filtered.filter(r => canTakeAction(r));
    } else if (statusFilter === 'waiting') {
      filtered = filtered.filter(r => 
        !canTakeAction(r) && 
        r.phase !== 'SUCCESS' && 
        r.phase !== 'NO_DEAL' && 
        r.phase !== 'EXPIRED'
      );
    } else if (statusFilter === 'completed') {
      filtered = filtered.filter(r => 
        r.phase === 'SUCCESS' || r.phase === 'NO_DEAL' || r.phase === 'EXPIRED'
      );
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(r => {
        const projectName = getProjectName(r.projectId).toLowerCase();
        const investorName = (r.investorName || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return projectName.includes(query) || investorName.includes(query);
      });
    }

    // Apply sorting
    const sorted = [...filtered];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'urgent-first') {
      sorted.sort((a, b) => {
        const aRequiresAction = canTakeAction(a);
        const bRequiresAction = canTakeAction(b);
        
        if (aRequiresAction && !bRequiresAction) return -1;
        if (!aRequiresAction && bRequiresAction) return 1;

        // Both require action - sort by SLA
        if (!a.slaDeadline) return 1;
        if (!b.slaDeadline) return -1;
        return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
      });
    }

    return sorted;
  }, [searchQuery, statusFilter, sortBy]);

  // ========================================
  // EVENT HANDLERS
  // ========================================

  const handleViewDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedReservation(null);
  };

  const handleCancelReservation = () => {
    setViewMode('cancel');
  };

  const handleCancelSuccess = () => {
    setViewMode('list');
    setSelectedReservation(null);
  };

  // ========================================
  // CONDITIONAL RENDERS
  // ========================================

  if (viewMode === 'detail' && selectedReservation) {
    return (
      <ReservationDetail
        reservation={selectedReservation}
        onBack={handleBackToList}
        onCancelReservation={handleCancelReservation}
      />
    );
  }

  if (viewMode === 'cancel' && selectedReservation) {
    return (
      <CancelReservationPage
        reservation={selectedReservation}
        onBack={() => setViewMode('detail')}
        onCancelSuccess={handleCancelSuccess}
      />
    );
  }

  // ========================================
  // MAIN RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Mé rezervace</h1>
          <p className="text-muted-foreground">Přehled všech rezervací a jejich stavů</p>
        </div>
        
        {onNavigateToTickets && (
          <button
            onClick={onNavigateToTickets}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center gap-2"
          >
            + Nová rezervace
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Celkem</span>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-[#040F2A] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  Všechny aktivní rezervace ve všech fázích
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#040F2A]"></div>
                </div>
              </div>
            </div>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-[#040F2A]">{stats.total}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700">Vyžaduje akci</span>
              <div className="group relative">
                <Info className="w-4 h-4 text-blue-500 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-[#040F2A] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  Rezervace čekající na vaši akci (připomenutí, schůzka)
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#040F2A]"></div>
                </div>
              </div>
            </div>
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.actionRequired}</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-700">Čeká na ostatní</span>
              <div className="group relative">
                <Info className="w-4 h-4 text-amber-500 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-[#040F2A] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  Čeká na investora nebo developera (žádná akce potřebná)
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#040F2A]"></div>
                </div>
              </div>
            </div>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900">{stats.waiting}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-700">Úspěšné</span>
              <div className="group relative">
                <Info className="w-4 h-4 text-green-500 cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-[#040F2A] text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  Rezervace úspěšně završené investicí
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#040F2A]"></div>
                </div>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.success}</p>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Hledat podle investora nebo projektu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-[#040F2A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-10 pr-8 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] appearance-none cursor-pointer"
            >
              <option value="all">Všechny statusy</option>
              <option value="action-required">Vyžaduje akci</option>
              <option value="waiting">Čeká na ostatní</option>
              <option value="completed">Ukončené</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-10 pr-8 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] appearance-none cursor-pointer"
            >
              <option value="newest">Nejnovější</option>
              <option value="oldest">Nejstarší</option>
              <option value="urgent-first">Urgentní první</option>
            </select>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-[#EAEAEA] flex items-center gap-2 text-sm">
            <span className="text-[#6B7280]">
              Zobrazeno {filteredAndSortedReservations.length} z {stats.total} rezervací
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-[#215EF8] hover:underline"
            >
              Zrušit filtry
            </button>
          </div>
        )}
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredAndSortedReservations.length === 0 ? (
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-12 text-center">
            <p className="text-[#6B7280] mb-4">Žádné rezervace nenalezeny</p>
            {onNavigateToTickets && (
              <button
                onClick={onNavigateToTickets}
                className="px-4 py-2 text-sm font-medium text-[#215EF8] hover:text-[#1a4bc7] transition-colors"
              >
                + Vytvořit novou rezervaci
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedReservations.map(reservation => {
            const projectName = getProjectName(reservation.projectId);
            const slaStatus = getSLAStatus(reservation);
            const requiresAction = canTakeAction(reservation);
            const actionLabel = getActionLabel(reservation);
            
            // Get ticket data for investment amount
            const project = mockProjects.find(p => p.id === reservation.projectId);
            const ticket = project?.tickets.find(t => t.id === reservation.ticketId);

            return (
              <div 
                key={reservation.id} 
                className={`bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-all ${
                  requiresAction ? 'border-[#215EF8] ring-2 ring-[#215EF8]/10' : 'border-[#EAEAEA]'
                }`}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-[#040F2A]">
                          {reservation.investorName || 'Investor'}
                        </h3>
                        {getStatusBadge(reservation.phase)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4" />
                          {projectName}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-4 h-4" />
                          Ticket {reservation.ticketId}
                        </div>
                        {reservation.investorEmail && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {reservation.investorEmail}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Alert for urgent action */}
                  {requiresAction && slaStatus && (
                    <div className={`mb-4 rounded-lg p-4 border ${slaStatus.color}`}>
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          slaStatus.urgent ? 'text-red-600' : 'text-orange-600'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-semibold mb-1">
                            {slaStatus.urgent ? 'Urgentní akce vyžadována' : 'Brzy vyžaduje akci'}
                          </p>
                          <p className="text-sm">
                            {reservation.phase === 'WAITING_INVESTOR_SIGNATURE' 
                              ? `Investor ještě nepodepsal smlouvu. SLA: ${slaStatus.label}`
                              : `Potřebné domluvit schůzku. SLA: ${slaStatus.label}`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280] font-medium">Vytvořeno</span>
                      </div>
                      <p className="text-sm font-semibold text-[#040F2A]">
                        {new Date(reservation.createdAt).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700 font-medium">Investice</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-900">
                        {ticket ? new Intl.NumberFormat('cs-CZ', { 
                          style: 'currency', 
                          currency: 'CZK', 
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0 
                        }).format(ticket.investmentAmount) : 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-xs text-[#6B7280] font-medium">Fáze</span>
                      </div>
                      <p className="text-sm font-semibold text-[#040F2A] truncate">
                        {getPhaseLabel(reservation.phase)}
                      </p>
                    </div>

                    {slaStatus && (
                      <div className={`rounded-lg p-3 border ${slaStatus.color}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">SLA</span>
                        </div>
                        <p className="text-sm font-semibold">{slaStatus.label}</p>
                      </div>
                    )}

                    {!slaStatus && requiresAction && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-blue-700 font-medium">Akce</span>
                        </div>
                        <p className="text-sm font-semibold text-blue-900">Vyžaduje akci</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-[#EAEAEA]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>ID: {reservation.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(reservation)}
                        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                          requiresAction
                            ? 'bg-[#215EF8] text-white hover:bg-[#1a4bc7]'
                            : 'bg-white border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-100'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        {actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}