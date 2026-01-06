/**
 * COMMISSION PROJECT DETAIL COMPONENT
 * Detailed view of project from commission perspective
 * Shows commission breakdown, payment status, and financial metrics
 * Based on Tipari.cz business model where introducer earns commission from their projects
 */

import { ArrowLeft, DollarSign, TrendingUp, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Project } from '../types/project';
import { mockReservations } from '../data/mockReservations';
import { mockCommissions } from '../data/mockCommissions';
import { mockInvestors } from '../data/mockInvestors';

interface CommissionProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function CommissionProjectDetail({ project, onBack }: CommissionProjectDetailProps) {
  // Get all reservations for this project
  const projectReservations = mockReservations.filter(r => r.projectId === project.id);

  // Get all commissions for this project
  const projectCommissions = mockCommissions.filter(c => c.projectId === project.id);

  // Calculate commission stats
  const paidCommissions = projectCommissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + c.amount, 0);
  
  const earnedCommissions = projectCommissions
    .filter(c => c.status === 'EARNED')
    .reduce((sum, c) => sum + c.amount, 0);
  
  const expectedCommissions = projectReservations
    .filter(r => r.phase === 'MEETING_CONFIRMED')
    .reduce((sum, r) => {
      const ticket = project.tickets.find(t => t.id === r.ticketId);
      return sum + (ticket ? (ticket.investmentAmount * ticket.commission / 100) : 0);
    }, 0);

  const totalPotentialCommission = project.tickets.reduce((sum, t) => 
    sum + (t.investmentAmount * t.commission / 100), 0
  );

  // Calculate ticket stats
  const totalTickets = project.tickets.length;
  const ticketsWithCommission = project.tickets.filter(t => 
    projectCommissions.some(c => c.ticketId === t.id)
  ).length;

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

  // Commission status label
  const getCommissionStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
      'PAID': 'Vyplaceno',
      'EARNED': 'K vyplacení',
      'EXPECTED': 'Očekáváno',
    };
    return labels[status] || status;
  };

  // Commission status color
  const getCommissionStatusColor = (status: string): string => {
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
            Provizní přehled projektu - detailní rozpis a platby
          </p>
        </div>
      </div>

      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-lg p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 opacity-90" />
            <div className="text-sm opacity-90">Vyplaceno</div>
          </div>
          <div className="text-2xl font-semibold mb-1">
            {formatCurrency(paidCommissions)}
          </div>
          <div className="text-xs opacity-80">
            {projectCommissions.filter(c => c.status === 'PAID').length} plateb
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] rounded-lg p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 opacity-90" />
            <div className="text-sm opacity-90">K vyplacení</div>
          </div>
          <div className="text-2xl font-semibold mb-1">
            {formatCurrency(earnedCommissions)}
          </div>
          <div className="text-xs opacity-80">
            Čeká na úhradu
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-[#6B7280]" />
            <div className="text-sm text-[#6B7280]">Očekáváno</div>
          </div>
          <div className="text-2xl font-semibold text-[#040F2A] mb-1">
            {formatCurrency(expectedCommissions)}
          </div>
          <div className="text-xs text-[#6B7280]">
            Z aktivních rezervací
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#6B7280]" />
            <div className="text-sm text-[#6B7280]">Celkový potenciál</div>
          </div>
          <div className="text-2xl font-semibold text-[#040F2A] mb-1">
            {formatCurrency(totalPotentialCommission)}
          </div>
          <div className="text-xs text-[#6B7280]">
            Při úplném zafinancování
          </div>
        </div>
      </div>

      {/* Project Basic Info */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <h2 className="font-semibold text-[#040F2A] mb-4">Základní informace o projektu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Lokace</div>
            <div className="text-sm font-medium text-[#040F2A]">{project.location}</div>
          </div>
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Typ projektu</div>
            <div className="text-sm font-medium text-[#040F2A]">{project.type}</div>
          </div>
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Celkový objem</div>
            <div className="text-sm font-semibold text-[#040F2A]">
              {formatCurrency(project.totalInvestmentVolume / 1000000)}M CZK
            </div>
          </div>
          <div>
            <div className="text-xs text-[#6B7280] mb-1">Průměrná provize</div>
            <div className="text-sm font-semibold text-[#14AE6B]">{project.commission.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Commission Breakdown by Status */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#215EF8]" />
          <h2 className="font-semibold text-[#040F2A]">Rozpis provizí podle statusu</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#14AE6B]/5 rounded-lg border border-[#14AE6B]/20">
            <div>
              <div className="text-sm font-medium text-[#040F2A]">Vyplacené provize</div>
              <div className="text-xs text-[#6B7280] mt-1">
                {projectCommissions.filter(c => c.status === 'PAID').length} transakcí • Hotovost na účtu
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#14AE6B]">
                {formatCurrency(paidCommissions)}
              </div>
              <div className="text-xs text-[#6B7280] mt-1">
                {totalPotentialCommission > 0 ? ((paidCommissions / totalPotentialCommission) * 100).toFixed(1) : 0}% z potenciálu
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#215EF8]/5 rounded-lg border border-[#215EF8]/20">
            <div>
              <div className="text-sm font-medium text-[#040F2A]">K vyplacení</div>
              <div className="text-xs text-[#6B7280] mt-1">
                {projectCommissions.filter(c => c.status === 'EARNED').length} transakcí • Čeká na úhradu
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#215EF8]">
                {formatCurrency(earnedCommissions)}
              </div>
              <div className="text-xs text-[#6B7280] mt-1">
                {totalPotentialCommission > 0 ? ((earnedCommissions / totalPotentialCommission) * 100).toFixed(1) : 0}% z potenciálu
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-[#EAEAEA]">
            <div>
              <div className="text-sm font-medium text-[#040F2A]">Očekávané provize</div>
              <div className="text-xs text-[#6B7280] mt-1">
                {projectReservations.filter(r => r.phase === 'MEETING_CONFIRMED').length} aktivních rezervací
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-[#040F2A]">
                {formatCurrency(expectedCommissions)}
              </div>
              <div className="text-xs text-[#6B7280] mt-1">
                {totalPotentialCommission > 0 ? ((expectedCommissions / totalPotentialCommission) * 100).toFixed(1) : 0}% z potenciálu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Payments Table */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#040F2A]">Historie provizních plateb</h2>
            <span className="text-xs text-[#6B7280]">{projectCommissions.length} celkem</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            {projectCommissions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Tiket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Investor
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                      Částka
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {projectCommissions.map((commission) => (
                    <tr key={commission.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-xs font-mono text-[#040F2A]">
                          {commission.ticketId}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {formatDate(commission.earnedDate)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-[#040F2A]">
                          {getInvestorName(commission.investorId)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="text-xs font-semibold text-[#040F2A]">
                          {formatCurrency(commission.amount)}
                        </div>
                        {commission.paidDate && (
                          <div className="text-xs text-[#6B7280]">
                            {formatDate(commission.paidDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCommissionStatusColor(commission.status)}`}>
                          {getCommissionStatusLabel(commission.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-[#6B7280]">Zatím žádné provizní platby na tomto projektu</p>
              </div>
            )}
          </div>
        </div>

        {/* Tickets with Commission Potential */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#040F2A]">Tikety a provizní potenciál</h2>
            <span className="text-xs text-[#6B7280]">{totalTickets} tiketů</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    ID tiketu
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                    Investice
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
                  const hasCommission = projectCommissions.some(c => c.ticketId === ticket.id);
                  const ticketCommission = projectCommissions.find(c => c.ticketId === ticket.id);
                  const potentialCommission = ticket.investmentAmount * ticket.commission / 100;
                  
                  return (
                    <tr key={ticket.id} className={hasCommission ? 'bg-gray-50' : ''}>
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
                          {formatCurrency(potentialCommission)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {ticketCommission ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCommissionStatusColor(ticketCommission.status)}`}>
                            {getCommissionStatusLabel(ticketCommission.status)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-[#6B7280] bg-gray-100">
                            Dostupné
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
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <h2 className="font-semibold text-[#040F2A] mb-4">Výkonnostní metriky</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Míra zpeněžení</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {totalPotentialCommission > 0 ? ((paidCommissions / totalPotentialCommission) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Vyplaceno z celkového potenciálu
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Tikety s provizí</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {ticketsWithCommission} / {totalTickets}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              {totalTickets > 0 ? ((ticketsWithCommission / totalTickets) * 100).toFixed(0) : 0}% tiketů zafinancováno
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Průměrná provize na tiket</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {formatCurrency(totalPotentialCommission / totalTickets)}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Potenciální výnos na tiket
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-[#14AE6B]/5 border border-[#14AE6B]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <DollarSign className="w-5 h-5 text-[#14AE6B] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#040F2A] mb-1">Váš projekt - provizní model</div>
            <div className="text-sm text-[#6B7280]">
              Tento projekt jste přinesli vy. Dostáváte provizi ze všech tiketů bez ohledu na to, který obchodník investora přivedl. 
              Provize "PAID" = vyplaceno, "EARNED" = čeká na úhradu, "EXPECTED" = aktivní rezervace s potvrzenou schůzkou.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
