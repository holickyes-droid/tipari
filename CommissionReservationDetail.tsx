/**
 * COMMISSION RESERVATION DETAIL COMPONENT
 * Detailed view of reservation from commission perspective
 * Shows commission status, payment tracking, and financial breakdown
 * Based on Tipari.cz business model
 */

import { ArrowLeft, DollarSign, CheckCircle2, Clock, TrendingUp, User, FileText, Building2, Calendar } from 'lucide-react';
import { Reservation } from '../types/reservation';
import { mockProjects } from '../data/mockProjects';
import { mockInvestors } from '../data/mockInvestors';
import { mockCommissions } from '../data/mockCommissions';

interface CommissionReservationDetailProps {
  reservation: Reservation;
  onBack: () => void;
}

export function CommissionReservationDetail({ reservation, onBack }: CommissionReservationDetailProps) {
  // Get related data
  const project = mockProjects.find(p => p.id === reservation.projectId);
  const ticket = project?.tickets.find(t => t.id === reservation.ticketId);
  const investor = mockInvestors.find(inv => inv.id === reservation.investorId);
  const commission = mockCommissions.find(c => 
    c.projectId === reservation.projectId && 
    c.ticketId === reservation.ticketId &&
    c.investorId === reservation.investorId
  );

  // Calculate commission values
  const investmentAmount = ticket?.investmentAmount || 0;
  const commissionRate = ticket?.commission || 0;
  const commissionAmount = commission?.amount || (investmentAmount * commissionRate / 100);
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format datetime
  const formatDateTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate days elapsed
  const getDaysElapsed = (fromDate: string): number => {
    const now = new Date();
    const created = new Date(fromDate);
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  // Phase label
  const getPhaseLabel = (phase: string): string => {
    const labels: Record<string, string> = {
      'WAITING_INVESTOR_SIGNATURE': 'Čeká na podpis RA',
      'WAITING_DEVELOPER_DECISION': 'Čeká na rozhodnutí developera',
      'WAITING_MEETING_SELECTION': 'Výběr termínu schůzky',
      'MEETING_CONFIRMED': 'Schůzka potvrzena',
      'MEETING_COMPLETED': 'Schůzka dokončena',
      'SUCCESS': 'Úspěch - zafinancováno',
      'NO_DEAL': 'Nedohodnutý',
      'EXPIRED': 'Vypršela',
    };
    return labels[phase] || phase;
  };

  // Commission status label
  const getCommissionStatusLabel = (status?: string): string => {
    if (!status) return 'Očekáváno';
    const labels: Record<string, string> = {
      'PAID': 'Vyplaceno',
      'EARNED': 'K vyplacení',
      'EXPECTED': 'Očekáváno',
    };
    return labels[status] || status;
  };

  // Commission status color
  const getCommissionStatusColor = (status?: string): string => {
    if (!status) return 'text-[#6B7280] bg-gray-100';
    switch (status) {
      case 'PAID':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'EARNED':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'EXPECTED':
        return 'text-[#6B7280] bg-gray-100';
      default:
        return 'text-[#6B7280] bg-gray-100';
    }
  };

  // Get commission description
  const getCommissionDescription = (): string => {
    if (reservation.phase === 'SUCCESS') {
      return commission?.status === 'PAID' 
        ? 'Provize vyplacena na váš účet'
        : 'Provize vydělaná, čeká na vyplacení';
    } else if (reservation.phase === 'MEETING_CONFIRMED') {
      return 'Aktivní rezervace - provize očekávána po uzavření obchodu';
    } else if (reservation.phase === 'NO_DEAL' || reservation.phase === 'EXPIRED') {
      return 'Rezervace neúspěšná - provize nezískána';
    } else {
      return 'Rezervace v procesu - provize bude aktivována po potvrzení schůzky';
    }
  };

  // Get main status color
  const getMainStatusColor = (): string => {
    if (commission?.status === 'PAID') return 'from-[#14AE6B] to-[#0D7A4A]';
    if (commission?.status === 'EARNED') return 'from-[#215EF8] to-[#1a4bc7]';
    if (reservation.phase === 'MEETING_CONFIRMED') return 'from-[#215EF8] to-[#1a4bc7]';
    return 'from-gray-500 to-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na seznam
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#040F2A]">
            Rezervace {reservation.reservationNumber}
          </h1>
          <p className="text-[#6B7280] mt-1">
            Provizní detail rezervace a platební status
          </p>
        </div>
      </div>

      {/* Commission Status Card */}
      <div className={`bg-gradient-to-br ${getMainStatusColor()} rounded-lg p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {commission?.status === 'PAID' ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : commission?.status === 'EARNED' ? (
              <DollarSign className="w-8 h-8" />
            ) : (
              <Clock className="w-8 h-8" />
            )}
            <div>
              <div className="text-sm opacity-90">Status provize</div>
              <div className="text-2xl font-semibold mt-1">
                {getCommissionStatusLabel(commission?.status)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Částka provize</div>
            <div className="text-2xl font-semibold mt-1">
              {formatCurrency(commissionAmount)}
            </div>
          </div>
        </div>
        <div className="text-sm opacity-90">
          {getCommissionDescription()}
        </div>
      </div>

      {/* Commission Timeline */}
      {commission && (
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#215EF8]" />
            <h2 className="font-semibold text-[#040F2A]">Provizní timeline</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#215EF8] mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#040F2A]">Provize vydělaná</div>
                <div className="text-xs text-[#6B7280] mt-1">
                  {formatDateTime(commission.earnedDate)} • {getDaysElapsed(commission.earnedDate)} dní zpět
                </div>
              </div>
              <div className="text-sm font-semibold text-[#14AE6B]">
                {formatCurrency(commission.amount)}
              </div>
            </div>

            {commission.paidDate && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#14AE6B] mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#040F2A]">Provize vyplacena</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    {formatDateTime(commission.paidDate)} • {getDaysElapsed(commission.paidDate)} dní zpět
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#14AE6B]">
                  ✓ Vyplaceno
                </div>
              </div>
            )}

            {!commission.paidDate && commission.status === 'EARNED' && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6B7280] mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#040F2A]">Čeká na vyplacení</div>
                  <div className="text-xs text-[#6B7280] mt-1">
                    Provize bude vyplacena v nejbližším platebním cyklu
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#215EF8]" />
          <h2 className="font-semibold text-[#040F2A]">Finanční rozpis</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA]">
            <div>
              <div className="text-sm font-medium text-[#040F2A]">Objem investice</div>
              <div className="text-xs text-[#6B7280] mt-1">Celková částka tiketu</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#040F2A]">
                {formatCurrency(investmentAmount)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[#EAEAEA]">
            <div>
              <div className="text-sm font-medium text-[#040F2A]">Provizní sazba</div>
              <div className="text-xs text-[#6B7280] mt-1">% z investice</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#14AE6B]">
                {commissionRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 bg-[#14AE6B]/5 -mx-6 px-6 rounded">
            <div>
              <div className="text-sm font-medium text-[#040F2A]">Vaše provize</div>
              <div className="text-xs text-[#6B7280] mt-1">
                {commissionRate.toFixed(1)}% z {formatCurrency(investmentAmount)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-semibold text-[#14AE6B]">
                {formatCurrency(commissionAmount)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Four Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Info */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-[#215EF8]" />
            <h3 className="font-semibold text-[#040F2A]">Projekt</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Název projektu</div>
              <div className="text-sm font-medium text-[#040F2A]">{project?.name}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Lokace</div>
              <div className="text-sm text-[#040F2A]">{project?.location}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Typ projektu</div>
              <div className="text-sm text-[#040F2A]">{project?.type}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">ID projektu</div>
              <div className="text-xs font-mono text-[#040F2A]">{project?.id}</div>
            </div>
          </div>
        </div>

        {/* Investor Info */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-[#215EF8]" />
            <h3 className="font-semibold text-[#040F2A]">Investor</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Jméno investora</div>
              <div className="text-sm font-medium text-[#040F2A]">{investor?.name}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Email</div>
              <div className="text-sm text-[#040F2A]">{investor?.email}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Telefon</div>
              <div className="text-sm text-[#040F2A]">{investor?.phone}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">ID investora</div>
              <div className="text-xs font-mono text-[#040F2A]">{investor?.id}</div>
            </div>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#215EF8]" />
            <h3 className="font-semibold text-[#040F2A]">Tiket</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#6B7280] mb-1">ID tiketu</div>
              <div className="text-xs font-mono text-[#040F2A]">{ticket?.id}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Číslo tiketu</div>
              <div className="text-sm text-[#040F2A]">{ticket?.ticketNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Výnos p.a.</div>
              <div className="text-sm font-semibold text-[#14AE6B]">{ticket?.yieldPA.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Doba trvání</div>
              <div className="text-sm text-[#040F2A]">{ticket?.duration} měsíců</div>
            </div>
          </div>
        </div>

        {/* Reservation Metadata */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#215EF8]" />
            <h3 className="font-semibold text-[#040F2A]">Metadata rezervace</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Číslo rezervace</div>
              <div className="text-sm font-mono text-[#040F2A]">{reservation.reservationNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Datum vytvoření</div>
              <div className="text-sm text-[#040F2A]">{formatDate(reservation.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Fáze rezervace</div>
              <div className="text-sm text-[#040F2A]">{getPhaseLabel(reservation.phase)}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-1">Čas v procesu</div>
              <div className="text-sm text-[#040F2A]">{getDaysElapsed(reservation.createdAt)} dní</div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Info Panel */}
      <div className={`border rounded-lg p-4 ${
        commission?.status === 'PAID' 
          ? 'bg-[#14AE6B]/5 border-[#14AE6B]/20'
          : commission?.status === 'EARNED'
          ? 'bg-[#215EF8]/5 border-[#215EF8]/20'
          : 'bg-gray-50 border-[#EAEAEA]'
      }`}>
        <div className="flex items-start gap-3">
          <DollarSign className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            commission?.status === 'PAID' 
              ? 'text-[#14AE6B]'
              : commission?.status === 'EARNED'
              ? 'text-[#215EF8]'
              : 'text-[#6B7280]'
          }`} />
          <div>
            <div className="text-sm font-medium text-[#040F2A] mb-1">
              {commission?.status === 'PAID' && 'Provize úspěšně vyplacena'}
              {commission?.status === 'EARNED' && 'Provize k vyplacení'}
              {!commission?.status && 'Provize očekávána'}
            </div>
            <div className="text-sm text-[#6B7280]">
              {commission?.status === 'PAID' && 
                `Provize byla vyplacena ${formatDate(commission.paidDate || '')}. Částka ${formatCurrency(commission.amount)} byla připsána na váš účet.`
              }
              {commission?.status === 'EARNED' && 
                `Provize ${formatCurrency(commission.amount)} čeká na vyplacení. Bude připsána v nejbližším platebním cyklu.`
              }
              {!commission?.status && reservation.phase === 'MEETING_CONFIRMED' &&
                `Provize ${formatCurrency(commissionAmount)} bude aktivována po úspěšném uzavření obchodu (fáze SUCCESS).`
              }
              {!commission?.status && reservation.phase !== 'MEETING_CONFIRMED' &&
                `Provize bude aktivována po potvrzení schůzky (fáze MEETING_CONFIRMED) a vyplacena po uzavření obchodu.`
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
