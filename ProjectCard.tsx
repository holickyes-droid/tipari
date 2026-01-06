import { Shield, Clock, MapPin, Building2, Star, ChevronLeft, ChevronRight, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Project } from '../types/project';
import { TicketsGrid } from './TicketsGrid';
import { TicketsCarousel } from './TicketsCarousel';
import { TicketStatusIndicator } from './TicketStatusIndicator';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ClientMatchesModal } from './ClientMatchesModal';
import { TicketsModal } from './TicketsModal';
import { MetricTooltip } from './ui/tooltip';
import { METRIC_TOOLTIPS } from '../utils/complianceTooltips';
import { getReservationsByProject } from '../data/mockReservations';
import { getReservationDisplayInfo } from '../utils/reservationHelpers';
import { DraftReservation } from './DraftReservationsPanel';

interface ProjectCardProps {
  project: Project;
  layout?: 'vertical' | 'horizontal';
  expanded?: boolean;
  onExpand?: () => void;
  onViewDetail?: () => void;
  onSaveDraft?: (draft: DraftReservation) => void;
}

export function ProjectCard({ 
  project, 
  layout = 'vertical', 
  expanded = false, 
  onExpand, 
  onViewDetail,
  onSaveDraft
}: ProjectCardProps) {
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [showClientMatchesModal, setShowClientMatchesModal] = useState(false);
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [currentMatchTicket, setCurrentMatchTicket] = useState<any>(null);

  // Get user's reservations in this project
  const userReservations = getReservationsByProject(project.id);
  const hasReservations = userReservations.length > 0;

  // Determine project card state based on reservations and project status
  const getProjectCardState = () => {
    // STATE 9: COMPLETED PROJECT
    if (project.status === 'Finished') {
      return 'completed';
    }

    // STATE 8: FULLY ALLOCATED / NOT AVAILABLE
    if (project.status === 'Fully reserved') {
      return 'fully_allocated';
    }

    // Check if user has any reservations
    if (hasReservations) {
      const latestReservation = userReservations[0]; // Most recent
      const reservationInfo = getReservationDisplayInfo(latestReservation);

      // STATE 6: REJECTED
      if (latestReservation.phase === 'NO_DEAL') {
        return 'rejected';
      }

      // STATE 7: EXPIRED / MISSED OPPORTUNITY
      if (latestReservation.phase === 'EXPIRED') {
        return 'expired';
      }

      // STATE 5: APPROVED / IN PROGRESS
      if (latestReservation.phase === 'MEETING_CONFIRMED' || latestReservation.phase === 'MEETING_COMPLETED') {
        return 'in_progress';
      }

      // STATE 4: ACTIVE RESERVATION – ACTION REQUIRED BY USER
      if (latestReservation.nextActor === 'INVESTOR') {
        return 'action_required';
      }

      // STATE 3: ACTIVE RESERVATION – WAITING FOR DEVELOPER
      if (latestReservation.nextActor === 'DEVELOPER') {
        return 'waiting_developer';
      }

      // Default: has reservation but in early phase
      return 'waiting_developer';
    }

    // No reservations - check availability
    const totalSlots = project.tickets.reduce((sum, ticket) => sum + ticket.occupancy.total, 0);
    const occupiedSlots = project.tickets.reduce((sum, ticket) => sum + ticket.occupancy.current, 0);
    const availableSlots = totalSlots - occupiedSlots;

    // STATE 2: AVAILABLE – LIMITED AVAILABILITY
    if (availableSlots > 0 && availableSlots <= 3) {
      return 'limited_availability';
    }

    // STATE 1: AVAILABLE – NO INTERACTION YET
    return 'available';
  };

  const cardState = getProjectCardState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadgeStyle = () => {
    // State-specific badge styles
    switch (cardState) {
      case 'completed':
        return 'bg-muted text-muted-foreground border-border';
      case 'fully_allocated':
        return 'bg-muted text-muted-foreground border-border';
      case 'rejected':
        return 'bg-muted text-muted-foreground border-border';
      case 'expired':
        return 'bg-muted text-muted-foreground border-border';
      case 'in_progress':
        return 'bg-[#14AE6B]/10 text-[#14AE6B] border-[#14AE6B]/20';
      case 'action_required':
        return 'bg-[#215EF8]/10 text-[#215EF8] border-[#215EF8]/20';
      case 'waiting_developer':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'limited_availability':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'available':
      default:
        return 'bg-[#14AE6B]/10 text-[#14AE6B] border-[#14AE6B]/20';
    }
  };

  const getStatusLabel = () => {
    const totalSlots = project.tickets.reduce((sum, ticket) => sum + ticket.occupancy.total, 0);
    const occupiedSlots = project.tickets.reduce((sum, ticket) => sum + ticket.occupancy.current, 0);
    const availableSlots = totalSlots - occupiedSlots;

    // State-specific labels
    switch (cardState) {
      case 'completed':
        return 'Ukončeno';
      case 'fully_allocated':
        return 'Obsazeno';
      case 'rejected':
        return 'Rezervace zamítnuta';
      case 'expired':
        return 'Příležitost vypršela';
      case 'in_progress':
        return 'Rezervace probíhá';
      case 'action_required':
        return 'Vyžaduje akci';
      case 'waiting_developer':
        return 'Čeká na developera';
      case 'limited_availability':
        return 'Poslední místa';
      case 'available':
      default:
        if (project.status === 'Paused') return 'Pozastaveno';
        return 'Otevřené';
    }
  };

  // Get state-specific helper text to display below badges
  const getStateHelperText = () => {
    if (!hasReservations) return null;
    
    const latestReservation = userReservations[0];
    const reservationInfo = getReservationDisplayInfo(latestReservation);

    switch (cardState) {
      case 'action_required':
        return 'Investor musí potvrdit další krok';
      case 'waiting_developer':
        return 'Čeká se na rozhodnutí developera';
      case 'in_progress':
        return 'Schůzka potvrzena — probíhá jednání';
      case 'rejected':
        return 'Developer rezervaci zamítl';
      case 'expired':
        return 'Lhůta rezervace vypršela';
      default:
        return null;
    }
  };

  const stateHelperText = getStateHelperText();

  const calculateDaysRemaining = () => {
    if (!project.slaDeadline) return null;
    const deadline = new Date(project.slaDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalCommission = () => {
    return project.tickets.reduce((total, ticket) => {
      return total + (ticket.investmentAmount * ticket.commission) / 100;
    }, 0);
  };

  const getDurationRange = () => {
    if (project.tickets.length === 0) return null;
    const durations = project.tickets.map(t => t.duration);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    if (minDuration === maxDuration) {
      return `${minDuration} měs.`;
    }
    return `${minDuration}-${maxDuration} měs.`;
  };

  const countTicketsByState = () => {
    let available = 0;
    let lastSlot = 0;
    let full = 0;

    project.tickets.forEach((ticket) => {
      const remaining = ticket.occupancy.total - ticket.occupancy.current;
      if (remaining === 0) {
        full++;
      } else if (remaining === 1) {
        lastSlot++;
      } else {
        available++;
      }
    });

    return { available, lastSlot, full };
  };

  const handleClientMatchesClick = () => {
    // Get the first ticket with matches for demo
    const ticketWithMatches = project.tickets.find(t => t.recommendedInvestors.length > 0);
    if (ticketWithMatches) {
      setCurrentMatchTicket(ticketWithMatches);
      setShowClientMatchesModal(true);
    }
  };

  const getClientMatches = () => {
    if (!currentMatchTicket || currentMatchTicket.recommendedInvestors.length === 0) return [];
    
    return [
      {
        id: 'INV-001',
        name: 'Petr Novák',
        type: 'Fyzická osoba',
        matchPercentage: 92,
        reservedSlots: 0,
        totalSlots: 3,
      },
      {
        id: 'INV-023',
        name: 'Jana Novotná',
        type: 'Fyzická osoba',
        matchPercentage: 88,
        reservedSlots: 1,
        totalSlots: 2,
      },
      {
        id: 'INV-045',
        name: 'Martin Král',
        type: 'Fyzická osoba',
        matchPercentage: 76,
        reservedSlots: 2,
        totalSlots: 2,
      },
    ];
  };

  const daysRemaining = calculateDaysRemaining();
  const totalCommission = calculateTotalCommission();
  const ticketStats = countTicketsByState();
  const durationRange = getDurationRange();

  // Get card container styling based on state
  const getCardContainerClass = () => {
    const baseClass = "bg-white rounded-lg border border-border overflow-hidden transition-all duration-300";
    const hoverClass = "hover:shadow-2xl hover:border-[#215EF8]/20 hover:-translate-y-0.5";
    
    // De-emphasize completed/closed states
    if (cardState === 'completed' || cardState === 'fully_allocated' || cardState === 'rejected' || cardState === 'expired') {
      return `${baseClass} opacity-75`;
    }
    
    // Highlight action required state
    if (cardState === 'action_required') {
      return `${baseClass} ${hoverClass} ring-1 ring-[#215EF8]/20`;
    }
    
    // Normal interactive states
    return `${baseClass} ${hoverClass}`;
  };

  // Horizontal Layout (Investown-style)
  if (layout === 'horizontal') {
    return (
      <>
        <div className={getCardContainerClass()}>
          <div className="flex flex-col">
            {/* Main Card Content - Fixed Height */}
            <div className="flex flex-col lg:flex-row">
              {/* Project Visual - Left Side */}
              <div className="relative lg:w-[340px] lg:h-[340px] aspect-video lg:aspect-auto bg-muted flex-shrink-0 rounded-tl-lg overflow-hidden transition-shadow duration-300">
                <ImageWithFallback
                  src={project.imageUrl}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                {project.broughtByCurrentUser && (
                  <div className="absolute top-3 right-3">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm border border-amber-200 text-xs text-[#040F2A]">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      Můj projekt
                    </div>
                  </div>
                )}
              </div>

              {/* Content - Right Side */}
              <div className="flex-1 p-6 space-y-4">{/* Project Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[#040F2A] mb-1.5">{project.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{project.location}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{project.developmentStage}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{project.assetClass}</span>
                      </div>
                    </div>
                    
                    {/* Provize - Aligned with Project Name */}
                    <div className="relative text-center bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-xl px-4 py-3 shadow-lg shadow-[#14AE6B]/25 border-2 border-[#14AE6B] overflow-hidden min-w-[160px]">
                      {/* Shine effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                      <div className="relative">
                        <div className="text-[10px] uppercase tracking-wider text-white/90 mb-1 flex items-center justify-center gap-1 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                          Provize až
                        </div>
                        <div className="text-xl font-black text-white drop-shadow-sm">{formatCurrency(totalCommission)} Kč</div>
                      </div>
                    </div>
                  </div>

                  {/* System Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${getStatusBadgeStyle()}`}
                    >
                      {getStatusLabel()}
                    </span>
                    {stateHelperText && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-white text-xs text-[#040F2A]">
                        {stateHelperText}
                      </span>
                    )}
                    {hasReservations && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#215EF8]/20 bg-[#215EF8]/10 text-xs text-[#215EF8] font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        Máte zde {userReservations.length} {userReservations.length === 1 ? 'rezervaci' : userReservations.length < 5 ? 'rezervace' : 'rezervací'}
                      </span>
                    )}
                    {daysRemaining !== null && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-orange-200 bg-orange-50 text-xs text-orange-700 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {daysRemaining > 0 ? `Zbývá ${daysRemaining}` : daysRemaining} {Math.abs(daysRemaining) === 1 ? 'den' : Math.abs(daysRemaining) < 5 ? 'dny' : 'dní'}
                      </span>
                    )}
                    {project.securedByRealEstate && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-white text-xs text-[#040F2A]">
                        <Shield className="w-3.5 h-3.5" />
                        Zajištěno nemovitostí
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Decision Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 py-4 border-y border-border">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1.5 flex items-center justify-center gap-1">
                      Výnos p.a.
                      <MetricTooltip
                        label={METRIC_TOOLTIPS.YIELD.label}
                        definition={METRIC_TOOLTIPS.YIELD.definition}
                        example={METRIC_TOOLTIPS.YIELD.example}
                      />
                    </div>
                    <div className="text-lg font-semibold text-[#14AE6B]">{project.yieldPA.toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1.5 flex items-center justify-center gap-1">
                      Délka
                      <MetricTooltip
                        label={METRIC_TOOLTIPS.DURATION.label}
                        definition={METRIC_TOOLTIPS.DURATION.definition}
                        example={METRIC_TOOLTIPS.DURATION.example}
                      />
                    </div>
                    <div className="text-sm font-medium text-[#040F2A]">{durationRange || '—'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1.5 flex items-center justify-center gap-1">
                      LTV
                      <MetricTooltip
                        label={METRIC_TOOLTIPS.LTV.label}
                        definition={METRIC_TOOLTIPS.LTV.definition}
                        example={METRIC_TOOLTIPS.LTV.example}
                      />
                    </div>
                    <div className="text-sm font-medium text-[#040F2A]">{project.ltv}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1.5">Forma</div>
                    <div className="text-sm font-medium text-[#040F2A]">{project.investmentForm}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1.5">Investice</div>
                    <div className="text-sm font-medium text-[#040F2A]">{formatCurrency(project.totalInvestmentVolume)} Kč</div>
                  </div>
                </div>

                {/* Tickets Info with Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-[#040F2A] font-medium">
                      {project.tickets.length} {project.tickets.length === 1 ? 'tiket' : project.tickets.length < 5 ? 'tikety' : 'tiketů'}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {ticketStats.available > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full bg-[#14AE6B]" />
                          <span className="text-muted-foreground">{ticketStats.available} dostupné</span>
                        </div>
                      )}
                      {ticketStats.lastSlot > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="text-muted-foreground">{ticketStats.lastSlot} poslední</span>
                        </div>
                      )}
                      {ticketStats.full > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                          <span className="text-muted-foreground">{ticketStats.full} obsazené</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm"
                      onClick={() => setShowTicketsModal(true)}
                      className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white font-semibold shadow-md shadow-[#215EF8]/25"
                    >
                      Zobrazit tikety
                    </Button>
                    <button 
                      onClick={onViewDetail}
                      className="w-9 h-9 rounded-full border-2 border-border bg-white hover:bg-gray-50 hover:border-[#215EF8] transition-all duration-200 flex items-center justify-center group"
                      title="Detail projektu"
                    >
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[#215EF8] transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Tickets Section - Accordion Style */}
            {expanded && (
              <div className="border-t border-border bg-gray-50/50 p-6 animate-in slide-in-from-top-2 duration-200">
                <TicketsGrid 
                  tickets={project.tickets} 
                  projectStatus={project.status} 
                  projectName={project.name}
                  projectId={project.id}
                />
              </div>
            )}
          </div>
        </div>

        {/* Client Matches Modal */}
        <ClientMatchesModal
          isOpen={showClientMatchesModal}
          onClose={() => setShowClientMatchesModal(false)}
          ticketNumber={currentMatchTicket?.ticketNumber || ''}
          ticket={currentMatchTicket}
          projectName={project.name}
          matches={getClientMatches()}
          onReserve={(clientId) => {
            console.log('Reserve for client:', clientId);
            setShowClientMatchesModal(false);
          }}
        />

        {/* Tickets Modal */}
        <TicketsModal
          isOpen={showTicketsModal}
          onClose={() => setShowTicketsModal(false)}
          project={project}
          onSaveDraft={onSaveDraft}
        />
      </>
    );
  }

  // Vertical Layout (Original)
  return (
    <>
      <div className={getCardContainerClass().replace('hover:shadow-2xl', 'hover:shadow-md')}>
        <div className="flex flex-col md:flex-row h-full">
          {/* Project Visual - Left Side */}
          <div className="relative md:w-[340px] aspect-video md:aspect-auto bg-muted flex-shrink-0 rounded-tl-lg rounded-bl-lg overflow-hidden md:h-auto">
            <ImageWithFallback
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
            />
            {project.broughtByCurrentUser && (
              <div className="absolute top-3 right-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-sm border border-amber-200 text-xs text-[#040F2A]">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Můj projekt
                </div>
              </div>
            )}
          </div>

          {/* Content - Right Side */}
          <div className="flex-1 flex flex-col">
            {/* Top Section - Project Header */}
            <div className="p-6 pb-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-[#040F2A] mb-1.5">{project.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{project.location}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{project.developmentStage}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{project.assetClass}</span>
                  </div>
                </div>
                
                {/* Provize - Aligned with Project Name */}
                <div className="relative text-center bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-xl px-4 py-3 shadow-lg shadow-[#14AE6B]/25 border-2 border-[#14AE6B] overflow-hidden min-w-[160px]">
                  {/* Shine effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                  <div className="relative">
                    <div className="text-[10px] uppercase tracking-wider text-white/90 mb-1 flex items-center justify-center gap-1 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                      Provize až
                    </div>
                    <div className="text-xl font-black text-white drop-shadow-sm">{formatCurrency(totalCommission)} Kč</div>
                  </div>
                </div>
              </div>

              {/* System Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${getStatusBadgeStyle()}`}
                >
                  {getStatusLabel()}
                </span>
                {stateHelperText && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-white text-xs text-[#040F2A]">
                    {stateHelperText}
                  </span>
                )}
                {hasReservations && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#215EF8]/20 bg-[#215EF8]/10 text-xs text-[#215EF8] font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    Máte zde {userReservations.length} {userReservations.length === 1 ? 'rezervaci' : userReservations.length < 5 ? 'rezervace' : 'rezervací'}
                  </span>
                )}
                {daysRemaining !== null && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-orange-200 bg-orange-50 text-xs text-orange-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {daysRemaining > 0 ? `Zbývá ${daysRemaining}` : daysRemaining} {Math.abs(daysRemaining) === 1 ? 'den' : Math.abs(daysRemaining) < 5 ? 'dny' : 'dní'}
                  </span>
                )}
                {project.securedByRealEstate && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-white text-xs text-[#040F2A]">
                    <Shield className="w-3.5 h-3.5" />
                    Zajištěno nemovitostí
                  </span>
                )}
              </div>
            </div>

            {/* Key Decision Metrics - Aligned with Header */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 px-6 py-4 border-y border-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1.5">Investice</div>
                <div className="text-sm font-medium text-[#040F2A]">{formatCurrency(project.totalInvestmentVolume)} Kč</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1.5">Výnos</div>
                <div className="text-lg font-semibold text-[#14AE6B]">{project.yieldPA.toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1.5">Délka</div>
                <div className="text-sm font-medium text-[#040F2A]">{durationRange || '—'}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1.5">LTV</div>
                <div className="text-sm font-medium text-[#040F2A]">{project.ltv}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1.5">Forma</div>
                <div className="text-sm font-medium text-[#040F2A]">Úvěr</div>
              </div>
              <div className="relative text-center bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-xl px-4 py-3 shadow-lg shadow-[#14AE6B]/25 border-2 border-[#14AE6B] overflow-hidden">
                {/* Shine effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-wider text-white/90 mb-1 flex items-center justify-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-white text-white animate-pulse" />
                    PROVIZE
                  </div>
                  <div className="text-xl font-black text-white drop-shadow-sm">{formatCurrency(totalCommission)} Kč</div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Tickets Info */}
            <div className="p-6 pt-4 flex-1 flex flex-col">{/* Tickets Info with Indicator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-[#040F2A] font-medium">
                    {project.tickets.length} {project.tickets.length === 1 ? 'tiket' : project.tickets.length < 5 ? 'tikety' : 'tiketů'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {ticketStats.available > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-[#14AE6B]" />
                        <span className="text-muted-foreground">{ticketStats.available} dostupné</span>
                      </div>
                    )}
                    {ticketStats.lastSlot > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-muted-foreground">{ticketStats.lastSlot} poslední</span>
                      </div>
                    )}
                    {ticketStats.full > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        <span className="text-muted-foreground">{ticketStats.full} obsazené</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onExpand}
                  >
                    {expanded ? 'Skrýt tikety' : 'Zobrazit tikety'}
                  </Button>
                  <button 
                    onClick={onViewDetail}
                    className="w-9 h-9 rounded-full border-2 border-border bg-white hover:bg-gray-50 hover:border-[#215EF8] transition-all duration-200 flex items-center justify-center group"
                    title="Detail projektu"
                  >
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-[#215EF8] transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Tickets Section - Accordion Style */}
        {expanded && (
          <div className="border-t border-border bg-gray-50/50 p-6 animate-in slide-in-from-top-2 duration-200">
            <TicketsGrid 
              tickets={project.tickets} 
              projectStatus={project.status} 
              projectName={project.name}
              projectId={project.id}
            />
          </div>
        )}
      </div>

      {/* Client Matches Modal */}
      <ClientMatchesModal
        isOpen={showClientMatchesModal}
        onClose={() => setShowClientMatchesModal(false)}
        ticketNumber={currentMatchTicket?.ticketNumber || ''}
        ticket={currentMatchTicket}
        projectName={project.name}
        matches={getClientMatches()}
        onReserve={(clientId) => {
          console.log('Reserve for client:', clientId);
          setShowClientMatchesModal(false);
        }}
      />

      {/* Tickets Modal */}
      <TicketsModal
        isOpen={showTicketsModal}
        onClose={() => setShowTicketsModal(false)}
        project={project}
        onSaveDraft={onSaveDraft}
      />
    </>
  );
}