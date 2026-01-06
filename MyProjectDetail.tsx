/**
 * MY PROJECT DETAIL COMPONENT
 * Detailed view of a project brought by current introducer
 * Shows all tickets, reservations (from all introducers), and commission tracking
 * Based on Tipari.cz business model where introducer earns commission from their projects
 */

import { ArrowLeft, Building2, TrendingUp, Users, FileText, DollarSign, Activity } from 'lucide-react';
import { Project } from '../types/project';
import { mockReservations } from '../data/mockReservations';
import { mockInvestors } from '../data/mockInvestors';

interface MyProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function MyProjectDetail({ project, onBack }: MyProjectDetailProps) {
  // Get all reservations for this project
  const projectReservations = mockReservations.filter(r => r.projectId === project.id);
  
  // Calculate ticket stats
  const totalTickets = project.tickets.length;
  const reservedTickets = project.tickets.filter(t => 
    projectReservations.some(r => r.ticketId === t.id)
  ).length;
  const availableTickets = totalTickets - reservedTickets;

  // Calculate financial stats
  const totalProjectVolume = project.totalInvestmentVolume;
  const reservedVolume = project.tickets
    .filter(t => projectReservations.some(r => r.ticketId === t.id))
    .reduce((sum, t) => sum + t.investmentAmount, 0);
  const availableVolume = totalProjectVolume - reservedVolume;

  // Calculate commission stats
  const totalPotentialCommission = project.tickets.reduce((sum, t) => 
    sum + (t.investmentAmount * t.commission / 100), 0
  );
  const reservedCommission = project.tickets
    .filter(t => projectReservations.some(r => r.ticketId === t.id))
    .reduce((sum, t) => sum + (t.investmentAmount * t.commission / 100), 0);
  const earnedCommission = projectReservations
    .filter(r => r.phase === 'SUCCESS')
    .reduce((sum, r) => {
      const ticket = project.tickets.find(t => t.id === r.ticketId);
      return sum + (ticket ? (ticket.investmentAmount * ticket.commission / 100) : 0);
    }, 0);

  // Get unique investors on this project
  const uniqueInvestors = new Set(projectReservations.map(r => r.investorId)).size;

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

  // Get investor name
  const getInvestorName = (investorId: string): string => {
    const investor = mockInvestors.find(inv => inv.id === investorId);
    return investor?.name || 'Neznámý investor';
  };

  // Phase label
  const getPhaseLabel = (phase: string): string => {
    const labels: Record<string, string> = {
      'WAITING_INVESTOR_SIGNATURE': 'Čeká na podpis',
      'WAITING_DEVELOPER_DECISION': 'Čeká developer',
      'WAITING_MEETING_SELECTION': 'Výběr termínu',
      'MEETING_CONFIRMED': 'Schůzka potvrzena',
      'MEETING_COMPLETED': 'Schůzka dokončena',
      'SUCCESS': 'Úspěch',
      'NO_DEAL': 'Nedohodnutý',
      'EXPIRED': 'Vypršela',
    };
    return labels[phase] || phase;
  };

  // Phase color
  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'MEETING_CONFIRMED':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'SUCCESS':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'WAITING_INVESTOR_SIGNATURE':
      case 'WAITING_DEVELOPER_DECISION':
      case 'WAITING_MEETING_SELECTION':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      default:
        return 'text-[#6B7280] bg-gray-100';
    }
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      'Open': { label: 'Otevřeno', color: 'text-[#14AE6B] bg-[#14AE6B]/10' },
      'Paused': { label: 'Pozastaveno', color: 'text-[#6B7280] bg-gray-100' },
      'Closed': { label: 'Uzavřeno', color: 'text-[#040F2A] bg-gray-100' },
    };
    const config = statusConfig[status] || { label: status, color: 'text-[#6B7280] bg-gray-100' };
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
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
            {project.name}
          </h1>
          <p className="text-[#6B7280] mt-1">
            Projekt přinesený vaší společností - detail výkonnosti a rezervací
          </p>
        </div>
      </div>

      {/* Project Status Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-6 h-6 text-[#215EF8]" />
              <div>
                <div className="text-sm text-[#6B7280]">Status projektu</div>
                <div className="mt-1">{getStatusBadge(project.status)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Lokace</div>
                <div className="text-sm font-medium text-[#040F2A]">{project.location}</div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Typ projektu</div>
                <div className="text-sm font-medium text-[#040F2A]">{project.type}</div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Výnos p.a.</div>
                <div className="text-sm font-semibold text-[#14AE6B]">{project.yieldPA.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-[#6B7280] mb-1">ID projektu</div>
                <div className="text-sm font-mono text-[#040F2A]">{project.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] rounded-lg p-5 text-white">
          <div className="text-sm opacity-90 mb-2">Celkový objem</div>
          <div className="text-2xl font-semibold mb-1">
            {formatCurrency(totalProjectVolume / 1000000)}M
          </div>
          <div className="text-xs opacity-80">CZK</div>
        </div>

        <div className="bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-lg p-5 text-white">
          <div className="text-sm opacity-90 mb-2">Rezervováno</div>
          <div className="text-2xl font-semibold mb-1">
            {formatCurrency(reservedVolume / 1000000)}M
          </div>
          <div className="text-xs opacity-80">
            {((reservedVolume / totalProjectVolume) * 100).toFixed(0)}% z celku
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="text-sm text-[#6B7280] mb-2">Tikety celkem</div>
          <div className="text-2xl font-semibold text-[#040F2A] mb-1">
            {totalTickets}
          </div>
          <div className="text-xs text-[#6B7280]">
            {availableTickets} volných
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="text-sm text-[#6B7280] mb-2">Investoři</div>
          <div className="text-2xl font-semibold text-[#040F2A] mb-1">
            {uniqueInvestors}
          </div>
          <div className="text-xs text-[#6B7280]">
            {projectReservations.length} rezervací
          </div>
        </div>
      </div>

      {/* Commission Overview */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-[#14AE6B]" />
          <h2 className="font-semibold text-[#040F2A]">Provize z projektu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Celkový potenciál</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {formatCurrency(totalPotentialCommission)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Při úplném zafinancování
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">V rezervacích</div>
            <div className="text-xl font-semibold text-[#215EF8]">
              {formatCurrency(reservedCommission)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Čeká na uzavření obchodů
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Vyděláno</div>
            <div className="text-xl font-semibold text-[#14AE6B]">
              {formatCurrency(earnedCommission)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Z úspěšných obchodů
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets Table */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-[#040F2A]">Tikety projektu</h2>
            </div>
            <span className="text-xs text-[#6B7280]">{totalTickets} celkem</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    ID tiketu
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                    Částka
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                    Provize
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-[#6B7280] uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {project.tickets.map((ticket) => {
                  const isReserved = projectReservations.some(r => r.ticketId === ticket.id);
                  const reservation = projectReservations.find(r => r.ticketId === ticket.id);
                  
                  return (
                    <tr key={ticket.id} className={isReserved ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-3">
                        <div className="text-xs font-mono text-[#040F2A]">{ticket.id}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-xs font-medium text-[#040F2A]">
                          {formatCurrency(ticket.investmentAmount / 1000000)}M
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-xs font-semibold text-[#14AE6B]">
                          {ticket.commission.toFixed(1)}%
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {formatCurrency(ticket.investmentAmount * ticket.commission / 100)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isReserved ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-[#215EF8] bg-[#215EF8]/10">
                            Rezervován
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-[#14AE6B] bg-[#14AE6B]/10">
                            Volný
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-[#040F2A]">Rezervace na projektu</h2>
            </div>
            <span className="text-xs text-[#6B7280]">{projectReservations.length} celkem</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            {projectReservations.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Rezervace
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Investor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Tiket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {projectReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-xs font-mono text-[#040F2A]">
                          {reservation.reservationNumber}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {formatDate(reservation.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-[#040F2A]">
                          {getInvestorName(reservation.investorId)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-mono text-[#040F2A]">
                          {reservation.ticketId}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(reservation.phase)}`}>
                          {getPhaseLabel(reservation.phase)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-[#6B7280]">Zatím žádné rezervace na tomto projektu</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
          <h2 className="font-semibold text-[#040F2A] mb-3">Popis projektu</h2>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {project.description}
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-[#215EF8]/5 border border-[#215EF8]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-[#215EF8] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#040F2A] mb-1">Váš projekt v katalogu</div>
            <div className="text-sm text-[#6B7280]">
              Tento projekt jste přinesli vy. Všichni obchodníci na platformě vidí tento projekt v katalogu jako "externí" 
              a mohou na něj rezervovat tikety pro své investory. Vy dostáváte provizi ze všech úspěšných obchodů bez ohledu na to, 
              kdo investora přivedl.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
