/**
 * OVERVIEW PAGE (Dashboard) - DECISION-FIRST UX
 * 
 * Hierarchy optimized for Tipar decision-making:
 * ZONE 1: Critical Alerts (requires immediate action)
 * ZONE 2: Key Metrics (business state)
 * ZONE 3: Opportunities (what can be done)
 * ZONE 4: Recent Activity (what's happening)
 * 
 * UX Principles:
 * - Decision-first (action > information)
 * - Compliance-first copy (Rezervace ≠ Investice)
 * - Calm enterprise UI (no visual noise)
 * - Clear slot system visibility
 * - Tooltips for complex business terms
 */

import { useState } from 'react';
import { mockProjects } from '../data/mockProjects';
import { mockReservations } from '../data/mockReservations';
import { mockCommissions, calculateCommissionSummary } from '../data/mockCommissions';
import { mockInvestorsEnriched } from '../data/mockInvestors';
import { MOCK_TICKETS } from './TicketsPageNew';
import { CTASection } from './CTASection';
import { 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Eye,
  HelpCircle,
  X
} from 'lucide-react';

// Tooltip Component
function Tooltip({ content }: { content: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors ml-1.5"
      >
        <HelpCircle className="w-3 h-3 text-gray-600" />
      </button>
      {isVisible && (
        <div className="absolute left-0 top-6 w-64 bg-[#040F2A] text-white text-xs rounded-lg p-3 shadow-xl z-50">
          <div className="absolute -top-1 left-2 w-2 h-2 bg-[#040F2A] transform rotate-45"></div>
          {content}
        </div>
      )}
    </div>
  );
}

interface OverviewPageProps {
  onNavigate?: (page: string) => void;
  onOpenAddInvestor?: () => void;
  onOpenDraftsPanel?: () => void;
  onNewProject?: () => void;
  onOpenFAQ?: () => void;
}

export function OverviewPage({ 
  onNavigate, 
  onOpenAddInvestor, 
  onOpenDraftsPanel, 
  onNewProject, 
  onOpenFAQ 
}: OverviewPageProps) {
  // Modal states
  const [showSLAModal, setShowSLAModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  // ========================================
  // DATA CALCULATIONS
  // ========================================

  // User slot info (should come from context/API)
  const userSlots = {
    total: 10,
    free: 6,
    lockedWaiting: 3, // Updated to match new mock data
    lockedConfirmed: 1,
  };

  // Reservations by state
  const reservationsByState = {
    requiresAction: mockReservations.filter(r => 
      r.phase === 'WAITING_INVESTOR_SIGNATURE' || 
      r.phase === 'WAITING_MEETING_SELECTION'
    ).length,
    inProgress: mockReservations.filter(r => 
      r.phase === 'WAITING_DEVELOPER_DECISION' || 
      r.phase === 'MEETING_CONFIRMED' ||
      r.phase === 'MEETING_COMPLETED'
    ).length,
    completed: mockReservations.filter(r => 
      r.phase === 'SUCCESS'
    ).length,
    total: mockReservations.length,
  };

  // SLA warnings (deadlines approaching)
  const slaWarnings = mockReservations.filter(r => {
    if (!r.slaDeadline) return false;
    const hoursRemaining = (new Date(r.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursRemaining > 0 && hoursRemaining <= 48; // Warning if < 48h
  });

  // Commission summary
  const commissionSummary = calculateCommissionSummary();

  // Investor summary
  const investorsByStatus = {
    active: mockInvestorsEnriched.filter(inv => inv.status === 'ACTIVE').length,
    total: mockInvestorsEnriched.length,
  };

  // Performance metrics
  const successfulDeals = mockReservations.filter(r => r.phase === 'SUCCESS').length;
  const completedReservations = mockReservations.filter(r => 
    r.phase === 'SUCCESS' || r.phase === 'NO_DEAL'
  ).length;
  const successRate = completedReservations > 0 
    ? Math.round((successfulDeals / completedReservations) * 100) 
    : 0;

  // New matching tickets (example: tickets that match user's investor preferences)
  const newMatchingTickets = MOCK_TICKETS.filter(t => 
    t.slotsAvailable > 0 && (t.investorMatches || 0) >= 2
  ).slice(0, 5);

  // Ready investors (have capacity and are active)
  const readyInvestors = mockInvestorsEnriched.filter(inv => 
    inv.isActive && inv.portfolioValue > inv.preferredAmount
  ).slice(0, 5);

  // Recent activities
  const recentActivities = [...mockReservations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map(reservation => {
      const project = mockProjects.find(p => p.id === reservation.projectId);
      const ticket = MOCK_TICKETS.find(t => t.id === reservation.ticketId);
      
      let actionLabel = '';
      let actionType: 'success' | 'pending' | 'info' = 'info';
      
      switch (reservation.phase) {
        case 'WAITING_INVESTOR_SIGNATURE':
          actionLabel = 'Čeká na podpis investora';
          actionType = 'pending';
          break;
        case 'WAITING_DEVELOPER_DECISION':
          actionLabel = 'Čeká na rozhodnutí developera';
          actionType = 'pending';
          break;
        case 'WAITING_MEETING_SELECTION':
          actionLabel = 'Výběr termínu schůzky';
          actionType = 'pending';
          break;
        case 'MEETING_CONFIRMED':
          actionLabel = 'Schůzka potvrzena';
          actionType = 'info';
          break;
        case 'MEETING_COMPLETED':
          actionLabel = 'Schůzka dokončena';
          actionType = 'info';
          break;
        case 'SUCCESS':
          actionLabel = 'Úspěšný obchod – provize k vyplacení';
          actionType = 'success';
          break;
        case 'NO_DEAL':
          actionLabel = 'Obchod nedohodnut – slot uvolněn';
          actionType = 'info';
          break;
        default:
          actionLabel = 'Aktualizace rezervace';
          actionType = 'info';
      }

      return {
        id: reservation.id,
        action: actionLabel,
        actionType,
        projectName: project?.name || 'Neznámý projekt',
        ticketId: reservation.ticketId,
        investorName: reservation.investorName,
        date: reservation.createdAt,
      };
    });

  // ========================================
  // FORMATTERS
  // ========================================

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatActivityDate = (dateStr: string): string => {
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

  const formatSLADeadline = (deadline: string): string => {
    const hoursRemaining = (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60);
    
    if (hoursRemaining <= 0) {
      return 'Vypršelo';
    } else if (hoursRemaining < 24) {
      return `${Math.floor(hoursRemaining)}h zbývá`;
    } else {
      const daysRemaining = Math.floor(hoursRemaining / 24);
      return `${daysRemaining}d zbývá`;
    }
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#040F2A] mb-1">Přehled</h1>
        <p className="text-sm text-[#6B7280]">
          Aktuální stav vašich rezervací, slotů a provizí na platformě Tipari.cz
        </p>
      </div>

      {/* CTA SECTION */}
      <CTASection 
        onOpenAddInvestor={onOpenAddInvestor}
        onOpenDraftsPanel={onOpenDraftsPanel}
        onNewProject={onNewProject}
        onOpenFAQ={onOpenFAQ}
      />

      {/* ========================================
          ZONE 1: CRITICAL ALERTS
          ======================================== */}
      
      {/* Slot Counter - Most Critical Info */}
      <div className="bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center text-sm opacity-90 mb-1">
              Dostupné sloty
              <Tooltip content="Slot = právo na 1 paralelní rezervaci. Elite úroveň umožňuje max. 10 rezervací současně. Slot se uvolní po dokončení rezervace." />
            </div>
            <div className="text-4xl font-semibold">{userSlots.free} / {userSlots.total}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Elite úroveň</div>
            <div className="text-xs opacity-75 mt-1">10 paralelních rezervací</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
          <div>
            <div className="text-xs opacity-75 mb-1">Volné</div>
            <div className="text-lg font-semibold">{userSlots.free}</div>
          </div>
          <div>
            <div className="flex items-center text-xs opacity-75 mb-1">
              V procesu
              <Tooltip content="Rezervace čekající na akci od investora nebo developera. Slot je dočasně blokován." />
            </div>
            <div className="text-lg font-semibold">{userSlots.lockedWaiting}</div>
          </div>
          <div>
            <div className="flex items-center text-xs opacity-75 mb-1">
              Potvrzené
              <Tooltip content="Rezervace s potvrzenou schůzkou. Slot zůstává blokován až do finálního výsledku jednání." />
            </div>
            <div className="text-lg font-semibold">{userSlots.lockedConfirmed}</div>
          </div>
        </div>
      </div>

      {/* Critical Actions Row */}
      {(slaWarnings.length > 0 || reservationsByState.requiresAction > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SLA Warnings */}
          {slaWarnings.length > 0 && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center font-semibold text-[#040F2A] mb-1">
                    SLA deadliny blíží se vypršení
                    <Tooltip content="Service Level Agreement = časové limity pro dokončení jednotlivých kroků v procesu rezervace. Dodržování SLA je klíčové pro úspěšnost." />
                  </div>
                  <div className="text-sm text-[#6B7280] mb-3">
                    {slaWarnings.length} {slaWarnings.length === 1 ? 'rezervace vyžaduje' : 'rezervace vyžadují'} akci do 48 hodin
                  </div>
                  <button 
                    onClick={() => setShowSLAModal(true)}
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    Zobrazit deadliny
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pending Actions */}
          {reservationsByState.requiresAction > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#040F2A] mb-1">
                    Akce vyžadující pozornost
                  </div>
                  <div className="text-sm text-[#6B7280] mb-3">
                    {reservationsByState.requiresAction} {reservationsByState.requiresAction === 1 ? 'rezervace čeká' : 'rezervace čekají'} na vaši akci
                  </div>
                  <button 
                    onClick={() => setShowActionsModal(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Zobrazit akce
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================
          ZONE 2: KEY METRICS
          ======================================== */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Reservations */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center text-sm text-[#6B7280] mb-2">
            Rezervace v procesu
            <Tooltip content="Počet aktivních rezervací od vytvoření až po dokončení schůzky. Nezahrnuje finalizované obchody." />
          </div>
          <div className="text-3xl font-semibold text-[#040F2A] mb-1">
            {reservationsByState.inProgress + reservationsByState.requiresAction}
          </div>
          <div className="text-xs text-[#6B7280]">
            {reservationsByState.requiresAction > 0 && (
              <span className="text-orange-600 font-medium">
                {reservationsByState.requiresAction} vyžaduje akci
              </span>
            )}
            {reservationsByState.requiresAction === 0 && (
              <span>Vše probíhá bez problémů</span>
            )}
          </div>
        </div>

        {/* Commission - Earned */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center text-sm text-[#6B7280] mb-2">
            Provize k vyplacení
            <Tooltip content="Provize z úspěšně uzavřených obchodů, které čekají na úhradu od developera. Typicky do 30 dnů od podpisu investiční smlouvy." />
          </div>
          <div className="text-3xl font-semibold text-[#14AE6B] mb-1">
            {formatCurrency(commissionSummary.earned).replace(/\s/g, '\u00A0')}
          </div>
          <div className="text-xs text-[#6B7280]">
            {formatCurrency(commissionSummary.paid)} již vyplaceno
          </div>
        </div>

        {/* Investor Portfolio */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center text-sm text-[#6B7280] mb-2">
            Investoři v portfoliu
            <Tooltip content="Investoři, které jste připojil(a) k platformě. Aktivní = mají probíhající nebo dokončené rezervace." />
          </div>
          <div className="text-3xl font-semibold text-[#040F2A] mb-1">
            {investorsByStatus.active}
          </div>
          <div className="text-xs text-[#6B7280]">
            z {investorsByStatus.total} celkem
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center text-sm text-[#6B7280] mb-2">
            Úspěšnost obchodů
            <Tooltip content="Poměr úspěšně uzavřených investic k celkovému počtu dokončených schůzek. Vyšší % = lepší matching mezi investory a projekty." />
          </div>
          <div className="text-3xl font-semibold text-[#040F2A] mb-1">
            {successRate}%
          </div>
          <div className="text-xs text-[#6B7280]">
            {successfulDeals} z {completedReservations} dokončených
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center text-sm text-[#6B7280] mb-1">
                Očekávané provize
                <Tooltip content="Potenciální provize z aktivních rezervací, které ještě nejsou finalizovány. Předpokládá úspěšné uzavření všech probíhajících jednání." />
              </div>
              <div className="text-xl font-semibold text-[#040F2A]">
                {formatCurrency(commissionSummary.expected)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#215EF8]" />
            </div>
          </div>
          <div className="text-xs text-[#6B7280] mt-2">
            Z aktivních rezervací v procesu
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#6B7280] mb-1">Úspěšné obchody</div>
              <div className="text-xl font-semibold text-[#040F2A]">
                {successfulDeals}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#14AE6B]" />
            </div>
          </div>
          <div className="text-xs text-[#6B7280] mt-2">
            Investice úspěšně facilitovány
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#6B7280] mb-1">Celkem rezervací</div>
              <div className="text-xl font-semibold text-[#040F2A]">
                {reservationsByState.total}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#6B7280]" />
            </div>
          </div>
          <div className="text-xs text-[#6B7280] mt-2">
            {reservationsByState.completed} dokončených
          </div>
        </div>
      </div>

      {/* ========================================
          ZONE 3: OPPORTUNITIES
          ======================================== */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Matching Tickets */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 bg-gray-50">
            <div className="flex items-center">
              <h2 className="font-semibold text-[#040F2A]">Nové matching tikety</h2>
              <Tooltip content="Tikety, které odpovídají investičním preferencím vašich investorů (lokalita, výnos, objem). Vyšší match = vyšší pravděpodobnost úspěchu." />
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Tikety odpovídající preferencím vašich investorů
            </p>
          </div>
          <div className="divide-y divide-[#EAEAEA]">
            {newMatchingTickets.length > 0 ? (
              newMatchingTickets.map((ticket) => (
                <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#040F2A] mb-1 truncate">
                        {ticket.projectName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
                        <span>{ticket.location}</span>
                        <span>•</span>
                        <span className="font-medium text-[#14AE6B]">
                          {ticket.yieldPercent.toFixed(1)}% p.a.
                        </span>
                      </div>
                      {ticket.investorMatches && ticket.investorMatches > 0 && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {ticket.investorMatches} {ticket.investorMatches === 1 ? 'investor match' : 'investoři match'}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-semibold text-[#040F2A]">
                        {formatCurrency(ticket.investmentAmount / 1000000)}M
                      </div>
                      <div className="text-xs text-[#6B7280] mt-1">
                        {ticket.slotsAvailable}/{ticket.slotsTotal} slotů
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-[#6B7280]">
                Žádné nové matching tikety
              </div>
            )}
          </div>
          {newMatchingTickets.length > 0 && (
            <div className="border-t border-[#EAEAEA] px-6 py-3 bg-gray-50">
              <button 
                onClick={() => onNavigate?.('tikety')}
                className="text-sm font-medium text-[#215EF8] hover:text-[#1a4bc7] flex items-center gap-1"
              >
                Zobrazit všechny tikety
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Ready Investors */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 bg-gray-50">
            <div className="flex items-center">
              <h2 className="font-semibold text-[#040F2A]">Investoři připravení investovat</h2>
              <Tooltip content="Aktivní investoři s dostupnou investiční kapacitou, kteří mohou okamžitě reagovat na nové příležitosti." />
            </div>
            <p className="text-xs text-[#6B7280] mt-1">
              Aktivní investoři s dostupnou kapacitou
            </p>
          </div>
          <div className="divide-y divide-[#EAEAEA]">
            {readyInvestors.length > 0 ? (
              readyInvestors.map((investor) => (
                <div key={investor.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#215EF8]/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-[#215EF8]">
                        {investor.initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#040F2A] mb-1">
                        {investor.name}
                      </div>
                      <div className="text-xs text-[#6B7280] mb-1">
                        {investor.typeDisplay}
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-[#6B7280]">
                          Preferovaná výše: {formatCurrency(investor.preferredAmount / 1000000)}M
                        </span>
                        <span className="text-[#14AE6B] font-medium">
                          {investor.preferredYield}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-sm text-[#6B7280]">
                Žádní investoři k dispozici
              </div>
            )}
          </div>
          {readyInvestors.length > 0 && (
            <div className="border-t border-[#EAEAEA] px-6 py-3 bg-gray-50">
              <button 
                onClick={() => onNavigate?.('investori')}
                className="text-sm font-medium text-[#215EF8] hover:text-[#1a4bc7] flex items-center gap-1"
              >
                Zobrazit všechny investory
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          ZONE 4: RECENT ACTIVITY
          ======================================== */}
      
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <div className="border-b border-[#EAEAEA] px-6 py-4 bg-gray-50">
          <h2 className="font-semibold text-[#040F2A]">Poslední aktivity</h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Chronologický přehled vašich rezervací a akcí
          </p>
        </div>
        <div className="divide-y divide-[#EAEAEA]">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.actionType === 'success' ? 'bg-[#14AE6B]' :
                      activity.actionType === 'pending' ? 'bg-orange-500' :
                      'bg-[#6B7280]'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium mb-1 ${
                        activity.actionType === 'success' ? 'text-[#14AE6B]' :
                        activity.actionType === 'pending' ? 'text-orange-600' :
                        'text-[#040F2A]'
                      }`}>
                        {activity.action}
                      </div>
                      <div className="text-sm text-[#6B7280] mb-1">
                        {activity.projectName}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <span>Tiket: {activity.ticketId}</span>
                        <span>•</span>
                        <span>Investor: {activity.investorName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[#6B7280] whitespace-nowrap">
                    {formatActivityDate(activity.date)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-sm text-[#6B7280]">
              Žádné aktivity k zobrazení
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          MODALS
          ======================================== */}

      {/* SLA Deadlines Modal */}
      {showSLAModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-[#040F2A]">SLA Deadliny blížící se vypršení</h2>
              <button 
                onClick={() => setShowSLAModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {slaWarnings.map((reservation) => {
                const project = mockProjects.find(p => p.id === reservation.projectId);
                return (
                  <div key={reservation.id} className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-[#040F2A]">{reservation.reservationNumber}</div>
                        <div className="text-sm text-[#6B7280]">{project?.name}</div>
                      </div>
                      <div className="text-sm font-medium text-orange-600">
                        {reservation.slaDeadline && formatSLADeadline(reservation.slaDeadline)}
                      </div>
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Investor: {reservation.investorName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pending Actions Modal */}
      {showActionsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-[#040F2A]">Akce vyžadující pozornost</h2>
              <button 
                onClick={() => setShowActionsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {mockReservations
                .filter(r => r.phase === 'WAITING_INVESTOR_SIGNATURE' || r.phase === 'WAITING_MEETING_SELECTION')
                .map((reservation) => {
                  const project = mockProjects.find(p => p.id === reservation.projectId);
                  return (
                    <div key={reservation.id} className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-[#040F2A]">{reservation.reservationNumber}</div>
                          <div className="text-sm text-[#6B7280]">{project?.name}</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {reservation.phase === 'WAITING_INVESTOR_SIGNATURE' ? 'Čeká na podpis' : 'Výběr termínu'}
                        </div>
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        Investor: {reservation.investorName}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
