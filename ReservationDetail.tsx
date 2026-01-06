/**
 * RESERVATION DETAIL - MODERN VIEW
 * 
 * Professional B2B reservation detail for Tipař (introducers)
 * Based on Tipari.cz design system with decision-first UX
 */

import { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download, 
  Mail, 
  Phone, 
  X, 
  MessageSquare, 
  MapPin,
  TrendingUp,
  DollarSign,
  Info,
  Target,
  ExternalLink
} from 'lucide-react';
import { Reservation, ReservationPhase } from '../types/reservation';
import { mockProjects } from '../data/mockProjects';
import { mockInvestors } from '../data/mockInvestors';
import { CancelReservationModal } from './CancelReservationModal';
import { getActivitiesForReservation, getNotesForInvestor, mockInvestorNotes } from '../data/mockCommunication';
import type { CommunicationActivityType } from '../types/communication';
import { CommunicationTimeline } from './CommunicationTimeline';

interface ReservationDetailProps {
  reservation: Reservation;
  onBack: () => void;
  onCancelReservation?: () => void;
}

export function ReservationDetail({ reservation, onBack, onCancelReservation }: ReservationDetailProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Get related data
  const project = mockProjects.find(p => p.id === reservation.projectId);
  const investor = mockInvestors.find(inv => inv.id === reservation.investorId);
  const ticket = project?.tickets.find(t => t.id === reservation.ticketId);

  // SAFETY: Reservation ALWAYS has a project and ticket - these cannot be undefined
  if (!project || !ticket) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold">Kritická chyba: Rezervace bez projektu nebo tiketu</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded">
          Zpět na seznam
        </button>
      </div>
    );
  }

  // Handle cancel click
  const handleCancelClick = () => {
    console.log('Cancel button clicked, opening modal...');
    setShowCancelModal(true);
  };

  // Phase labels
  const getPhaseLabel = (phase: ReservationPhase): string => {
    switch (phase) {
      case 'WAITING_INVESTOR_SIGNATURE': return 'Čeká na podpis investora (RA)';
      case 'WAITING_DEVELOPER_DECISION': return 'Čeká na rozhodnutí developera';
      case 'WAITING_MEETING_SELECTION': return 'Čeká na výběr termínu schůzky';
      case 'MEETING_CONFIRMED': return 'Schůzka potvrzena';
      case 'MEETING_COMPLETED': return 'Schůzka dokončena';
      case 'SUCCESS': return 'Úspěch - obchod uzavřen';
      case 'NO_DEAL': return 'Nedohodnutý obchod';
      case 'EXPIRED': return 'Rezervace vypršela';
      default: return phase;
    }
  };

  // Phase color helper
  const getPhaseColor = (phase: ReservationPhase): string => {
    switch (phase) {
      case 'WAITING_INVESTOR_SIGNATURE':
        return 'text-[#6B7280] bg-gray-100';
      case 'WAITING_DEVELOPER_DECISION':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'WAITING_MEETING_SELECTION':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'MEETING_CONFIRMED':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'MEETING_COMPLETED':
        return 'text-[#040F2A] bg-gray-100';
      case 'SUCCESS':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'NO_DEAL':
        return 'text-[#6B7280] bg-gray-100';
      case 'EXPIRED':
        return 'text-[#6B7280] bg-gray-100';
      default:
        return 'text-[#6B7280] bg-gray-100';
    }
  };

  // Download Reservation Agreement (RA)
  const handleDownloadRA = () => {
    // Generate mock PDF content
    const raContent = `
REFERRAL AGREEMENT (RA)
Rezervační číslo: ${reservation.reservationNumber}
Datum vytvoření: ${formatDate(reservation.createdAt)}

PROJEKT: ${project.name}
Lokace: ${project.location}

INVESTOR: ${investor?.name || reservation.investorName}
Email: ${investor?.email || reservation.investorEmail}
Telefon: ${investor?.phone || 'Bude doplněno'}

TIKET: ${ticket.id}
Investiční částka: ${formatCurrency(ticket.investmentAmount)}
Provize: ${ticket.commission}%

Status: ${getPhaseLabel(reservation.phase)}
Slot ID: ${reservation.slotId}

---
Tipari.cz - B2B Investiční katalogová platforma
    `.trim();

    // Create blob and download
    const blob = new Blob([raContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RA_${reservation.reservationNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Phase timeline - all 6 phases
  const phaseTimeline: { phase: ReservationPhase; label: string; order: number }[] = [
    { phase: 'WAITING_INVESTOR_SIGNATURE', label: '1. Podpis RA', order: 1 },
    { phase: 'WAITING_DEVELOPER_DECISION', label: '2. Rozhodnutí dev.', order: 2 },
    { phase: 'WAITING_MEETING_SELECTION', label: '3. Výběr termínu', order: 3 },
    { phase: 'MEETING_CONFIRMED', label: '4. Schůzka potvrzena', order: 4 },
    { phase: 'MEETING_COMPLETED', label: '5. Schůzka dokončena', order: 5 },
    { phase: 'SUCCESS', label: '6A. Úspěch', order: 6 },
  ];

  // Determine current phase order
  const currentPhaseOrder = phaseTimeline.find(p => p.phase === reservation.phase)?.order || 0;

  // Format date
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate time since creation
  const getTimeSinceCreation = (): string => {
    const now = new Date();
    const created = new Date(reservation.createdAt);
    const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `${Math.floor(diffHours)} hodin`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} dní`;
    }
  };

  // Check if cancellation is allowed
  const canCancelReservation = (): boolean => {
    // Cannot cancel if already in terminal state
    const terminalPhases: ReservationPhase[] = ['SUCCESS', 'NO_DEAL', 'EXPIRED'];
    const canCancel = !terminalPhases.includes(reservation.phase);
    console.log('canCancelReservation check:', {
      phase: reservation.phase,
      canCancel: canCancel,
      terminalPhases: terminalPhases
    });
    return canCancel;
  };

  return (
    <>
      <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na seznam
        </button>
        
        <div className="flex gap-2">
          {investor && (
            <>
              <button 
                onClick={() => window.location.href = `mailto:${investor.email}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1B4FD1] transition-colors"
              >
                <Mail className="w-4 h-4" />
                Napsat email
              </button>
              <button 
                onClick={() => window.location.href = `tel:${investor.phone}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#14AE6B] rounded-lg hover:bg-[#0F8A54] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Zavolat
              </button>
            </>
          )}
          
          <button 
            onClick={handleDownloadRA}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Stáhnout RA
          </button>
          
          {canCancelReservation() && (
            <button
              onClick={handleCancelClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Zrušit rezervaci
            </button>
          )}
        </div>
      </div>

      {/* Page Title - Clean */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {investor?.name || 'Investor'} · {project?.name || 'Projekt'}
          </h1>
          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            reservation.phase === 'SUCCESS' 
              ? 'bg-[#14AE6B]/10 text-[#14AE6B]'
              : reservation.phase === 'EXPIRED' || reservation.phase === 'NO_DEAL'
              ? 'bg-gray-100 text-gray-600'
              : reservation.phase === 'MEETING_CONFIRMED'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {reservation.phase === 'WAITING_INVESTOR_SIGNATURE' && <Clock className="w-4 h-4" />}
            {reservation.phase === 'WAITING_MEETING_SELECTION' && <MessageSquare className="w-4 h-4" />}
            {reservation.phase === 'MEETING_CONFIRMED' && <Calendar className="w-4 h-4" />}
            {reservation.phase === 'MEETING_COMPLETED' && <CheckCircle2 className="w-4 h-4" />}
            {reservation.phase === 'SUCCESS' && <CheckCircle2 className="w-4 h-4" />}
            {(reservation.phase === 'NO_DEAL' || reservation.phase === 'EXPIRED') && <XCircle className="w-4 h-4" />}
            {getPhaseLabel(reservation.phase)}
          </span>
        </div>
        <p className="text-sm text-gray-600 font-mono">{reservation.reservationNumber}</p>
      </div>

      {/* DECISION-FIRST: What to do NOW (TOP PRIORITY) */}
      <div className="bg-white border-2 border-gray-900 rounded-xl p-6">
        {reservation.phase === 'WAITING_INVESTOR_SIGNATURE' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Čekáme na podpis investora</h2>
              <p className="text-sm text-gray-700 mb-4">
                Investor obdržel smlouvu k podpisu. Monitorujte email či telefonní připomenutí podle SLA.
              </p>
              {investor && (
                <button 
                  onClick={() => window.location.href = `mailto:${investor.email}`}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Připomenout emailem
                </button>
              )}
            </div>
          </div>
        )}

        {reservation.phase === 'WAITING_DEVELOPER_DECISION' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Čekáme na rozhodnutí developera</h2>
              <p className="text-sm text-gray-700">
                Developer posuzuje rezervaci. Aktuálně není vyžadována žádná akce z vaší strany.
              </p>
            </div>
          </div>
        )}

        {reservation.phase === 'WAITING_MEETING_SELECTION' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">⚡ Akce vyžadována: Domluvte schůzku</h2>
              <p className="text-sm text-gray-700 mb-4">
                Developer schválil rezervaci. Kontaktujte investora a dohodněte termín schůzky.
              </p>
              {reservation.proposedMeetingDates && reservation.proposedMeetingDates.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-600 font-medium mb-2">Navržené termíny:</div>
                  <div className="flex flex-wrap gap-2">
                    {reservation.proposedMeetingDates.map((date, idx) => (
                      <div key={idx} className="text-xs text-amber-800 bg-amber-50 rounded px-3 py-1.5 border border-amber-200">
                        {formatDate(date)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {investor && (
                  <>
                    <button 
                      onClick={() => window.location.href = `mailto:${investor.email}`}
                      className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Napsat investorovi
                    </button>
                    <button 
                      onClick={() => window.location.href = `tel:${investor.phone}`}
                      className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      Zavolat
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {reservation.phase === 'MEETING_CONFIRMED' && reservation.meetingScheduledDate && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Schůzka potvrzena</h2>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold text-green-700">{formatDate(reservation.meetingScheduledDate)}</span>
              </p>
              {reservation.meetingLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {reservation.meetingLocation}
                </div>
              )}
              <p className="text-xs text-gray-600">
                Slot je zamknutý (LOCKED_CONFIRMED). Připravte se na schůzku a sledujte následné kroky.
              </p>
            </div>
          </div>
        )}

        {reservation.phase === 'MEETING_COMPLETED' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Schůzka dokončena</h2>
              <p className="text-sm text-gray-700">
                Čekáme na rozhodnutí o uzavření obchodu. Admin platformy vyhodnotí výsledek.
              </p>
            </div>
          </div>
        )}

        {reservation.phase === 'SUCCESS' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#14AE6B]/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#14AE6B]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[#14AE6B] mb-1">🎉 Úspěšná rezervace!</h2>
              <p className="text-sm text-gray-700 mb-3">
                Obchod byl úspěšně uzavřen. Provize bude vyplacena dle podmínek smlouvy.
              </p>
              {ticket && (
                <div className="text-base font-bold text-[#14AE6B]">
                  Provize: {formatCurrency(ticket.investmentAmount * ticket.commission / 100)} ({ticket.commission}%)
                </div>
              )}
            </div>
          </div>
        )}

        {reservation.phase === 'NO_DEAL' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Nedohodnutý obchod</h2>
              <p className="text-sm text-gray-700 mb-2">
                Investor se rozhodl proti investici.
              </p>
              {reservation.outcomeNotes && (
                <p className="text-xs text-gray-600 italic">
                  Poznámka: {reservation.outcomeNotes}
                </p>
              )}
            </div>
          </div>
        )}

        {reservation.phase === 'EXPIRED' && (
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-900 mb-1">Rezervace vypršela</h2>
              <p className="text-sm text-gray-700 mb-2">
                SLA bylo překročeno a rezervace byla automaticky ukončena.
              </p>
              {reservation.outcomeNotes && (
                <p className="text-xs text-gray-600 italic">
                  {reservation.outcomeNotes}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Key Stats - Horizontal Inline (Fingood clean) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <div className="text-xs text-gray-500 mb-1">Investice</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(ticket.investmentAmount)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Odhad provize</div>
            <div className="text-2xl font-bold text-[#14AE6B]">
              {formatCurrency(ticket.investmentAmount * ticket.commission / 100)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Výnos p.a.</div>
            <div className="text-2xl font-bold text-gray-900">
              {ticket.yieldPA.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investor Contact Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-gray-900">Investor</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Jméno</div>
              <div className="text-sm font-medium text-gray-900">{investor?.name || reservation.investorName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="text-sm text-gray-900">{investor?.email || reservation.investorEmail}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Telefon</div>
              <div className="text-sm text-gray-900">{investor?.phone || 'Kontakt bude doplněn'}</div>
            </div>
            {investor && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Typ investora</div>
                <div className="text-sm text-gray-700">
                  {investor.type === 'INDIVIDUAL' ? 'Fyzická osoba' : investor.type === 'COMPANY' ? 'Společnost' : 'Investiční fond'}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => window.location.href = `mailto:${investor?.email || reservation.investorEmail}`}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1B4FD1] transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              {(investor?.phone) && (
                <button 
                  onClick={() => window.location.href = `tel:${investor.phone}`}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#14AE6B] rounded-lg hover:bg-[#0F8A54] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Zavolat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Developer Contact Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[#215EF8]" />
            <h2 className="font-semibold text-gray-900">Developer</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Jméno</div>
              <div className="text-sm font-medium text-gray-900">{project.developerName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Společnost</div>
              <div className="text-sm text-gray-900">{project.developerCompany}</div>
            </div>
            {project.developerDescription && (
              <div>
                <div className="text-xs text-gray-500 mb-1">O developerovi</div>
                <div className="text-sm text-gray-700 leading-relaxed">{project.developerDescription}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project & Ticket Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-gray-900">Detail projektu</h2>
            </div>
            <button 
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Zobrazit detail projektu"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#215EF8] transition-colors" />
            </button>
          </div>
          {project ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Název projektu</div>
                <div className="text-sm font-medium text-gray-900">{project.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Lokace</div>
                <div className="text-sm text-gray-900">{project.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Typ projektu</div>
                <div className="text-sm text-gray-900">{project.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Výnos p.a.</div>
                <div className="text-sm font-semibold text-[#14AE6B]">{project.yieldPA.toFixed(1)}%</div>
              </div>
              {ticket?.securedTypes && ticket.securedTypes.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Zajištění</div>
                  <div className="flex flex-wrap gap-1">
                    {ticket.securedTypes.map((type, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Projekt nenalezen</div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-gray-900">Informace o tiketu</h2>
            </div>
            {ticket ? (
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">ID tiketu</div>
                  <div className="text-sm font-mono font-medium text-gray-900">{ticket.id}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Částka investice</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(ticket.investmentAmount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Provize</div>
                  <div className="text-sm font-semibold text-[#14AE6B]">
                    {ticket.commission.toFixed(1)}% ({formatCurrency(ticket.investmentAmount * ticket.commission / 100)})
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">LTV</div>
                  <div className="text-sm text-gray-900">{ticket.ltv}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Doba projektu</div>
                  <div className="text-sm text-gray-900">{ticket.duration} měsíců</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Tiket nenalezen</div>
            )}
          </div>

          {/* Reservation Metadata */}
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-[#040F2A]">Metadata rezervace</h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#6B7280] mb-1">ID rezervace</div>
                <div className="text-sm font-mono text-[#040F2A]">{reservation.id}</div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Číslo rezervace</div>
                <div className="text-sm font-mono font-medium text-[#040F2A]">{reservation.reservationNumber}</div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Vytvořeno</div>
                <div className="text-sm text-[#040F2A]">{formatDate(reservation.createdAt)}</div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Poslední aktualizace</div>
                <div className="text-sm text-[#040F2A]">{formatDate(reservation.updatedAt)}</div>
              </div>
              {reservation.meetingScheduledDate && (
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">Naplánovaná schůzka</div>
                  <div className="text-sm font-medium text-[#14AE6B]">{formatDate(reservation.meetingScheduledDate)}</div>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Current Status Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-[#215EF8]" />
          <h2 className="text-lg font-semibold text-[#040F2A]">Průběh rezervace</h2>
        </div>

        {/* Phase Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200" />
          <div 
            className="absolute top-4 left-0 h-0.5 bg-[#14AE6B] transition-all"
            style={{ width: `${((currentPhaseOrder - 1) / (phaseTimeline.length - 1)) * 100}%` }}
          />
          
          {/* Timeline steps */}
          <div className="relative flex items-start justify-between">
            {phaseTimeline.map((phase, idx) => {
              const isCompleted = phase.order < currentPhaseOrder;
              const isCurrent = phase.phase === reservation.phase;
              const isUpcoming = phase.order > currentPhaseOrder;
              
              return (
                <div key={phase.phase} className="flex flex-col items-center" style={{ width: `${100 / phaseTimeline.length}%` }}>
                  <div 
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold z-10 transition-colors ${
                      isCompleted 
                        ? 'bg-[#14AE6B] border-[#14AE6B] text-white'
                        : isCurrent
                        ? 'bg-[#215EF8] border-[#215EF8] text-white'
                        : 'bg-white border-gray-300 text-[#6B7280]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : phase.order}
                  </div>
                  <div className={`mt-2 text-xs text-center font-medium ${
                    isCurrent ? 'text-[#215EF8]' : isCompleted ? 'text-[#040F2A]' : 'text-[#6B7280]'
                  }`}>
                    {phase.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Communication Timeline & Notes */}
      {investor && (
        <CommunicationTimeline
          reservationId={reservation.id}
          investorId={reservation.investorId}
          investorName={investor.name}
        />
      )}
    </div>

      {/* Cancel Reservation Modal */}
      <CancelReservationModal
        isOpen={showCancelModal}
        reservation={reservation}
        onClose={() => setShowCancelModal(false)}
        onSuccess={() => {
          setShowCancelModal(false);
          onBack();
        }}
      />
    </>
  );
}