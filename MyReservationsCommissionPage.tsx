/**
 * MY RESERVATIONS COMMISSION PAGE
 * Detailed commission view by individual reservations
 * Based on Tipari.cz commission system
 */

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { mockCommissions, calculateCommissionSummary, CommissionStatus } from '../data/mockCommissions';
import { mockReservations } from '../data/mockReservations';
import { Reservation } from '../types/reservation';
import { CommissionReservationDetail } from './CommissionReservationDetail';

export function MyReservationsCommissionPage() {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // If detail view is open, show it
  if (selectedReservation) {
    return (
      <CommissionReservationDetail 
        reservation={selectedReservation} 
        onBack={() => setSelectedReservation(null)}
      />
    );
  }

  // Sort commissions by status priority and date
  const sortedCommissions = [...mockCommissions].sort((a, b) => {
    // Priority: PENDING_PAYMENT > EXPECTED > PAID > LOST
    const statusPriority: Record<CommissionStatus, number> = {
      'PENDING_PAYMENT': 1,
      'EXPECTED': 2,
      'EARNED': 3,
      'PAID': 4,
      'LOST': 5,
    };
    
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Within same status, sort by date (most recent first)
    const dateA = a.earnedDate || a.expectedDate || a.paidDate || '';
    const dateB = b.earnedDate || b.expectedDate || b.paidDate || '';
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });

  // Calculate stats
  const summary = calculateCommissionSummary();
  const expectedCount = mockCommissions.filter(c => c.status === 'EXPECTED').length;
  const earnedCount = mockCommissions.filter(c => c.status === 'PENDING_PAYMENT' || c.status === 'EARNED').length;
  const paidCount = mockCommissions.filter(c => c.status === 'PAID').length;
  const lostCount = mockCommissions.filter(c => c.status === 'LOST').length;

  // Status label helper
  const getStatusLabel = (status: CommissionStatus): string => {
    switch (status) {
      case 'EXPECTED': return 'Očekáváno';
      case 'EARNED': return 'Dosaženo';
      case 'PENDING_PAYMENT': return 'K vyplacení';
      case 'PAID': return 'Vyplaceno';
      case 'LOST': return 'Propadlo';
      default: return status;
    }
  };

  // Status color helper
  const getStatusColor = (status: CommissionStatus): string => {
    switch (status) {
      case 'EXPECTED':
        return 'text-[#040F2A] bg-gray-100';
      case 'EARNED':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'PENDING_PAYMENT':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'PAID':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'LOST':
        return 'text-[#6B7280] bg-gray-100';
      default:
        return 'text-[#6B7280] bg-gray-100';
    }
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

  // Format date
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('cs-CZ');
  };

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Provize podle rezervací</h1>
          <p className="text-[#6B7280]">Detailní přehled provizí pro jednotlivé rezervace a obchody</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            Faktury
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export provizí
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Vyplaceno</div>
          <div className="text-2xl font-semibold text-[#14AE6B]">{formatCurrency(summary.paid)}</div>
          <div className="text-xs text-[#6B7280] mt-1">{paidCount} obchodů</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">K vyplacení</div>
          <div className="text-2xl font-semibold text-[#215EF8]">{formatCurrency(summary.earned)}</div>
          <div className="text-xs text-[#6B7280] mt-1">{earnedCount} obchodů</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Očekáváno</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{formatCurrency(summary.expected)}</div>
          <div className="text-xs text-[#6B7280] mt-1">{expectedCount} rezervací</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Celkem potenciál</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{formatCurrency(summary.total)}</div>
          <div className="text-xs text-[#6B7280] mt-1">Všechny rezervace</div>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#040F2A]">Detailní přehled provizí</h2>
          <p className="text-xs text-[#6B7280]">Klikněte na řádek pro detail rezervace</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#EAEAEA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Rezervace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Projekt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Tiket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Částka provize
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Sazba
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Doklad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#EAEAEA]">
              {sortedCommissions.map((commission) => {
                const statusColor = getStatusColor(commission.status);
                const relevantDate = commission.paidDate || commission.earnedDate || commission.expectedDate;
                const reservation = mockReservations.find(r => r.id === commission.reservationId);
                
                return (
                  <tr 
                    key={commission.id} 
                    onClick={() => reservation && setSelectedReservation(reservation)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-[#040F2A]">{commission.reservationNumber}</div>
                      <div className="text-xs text-[#6B7280]">ID: {commission.reservationId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#040F2A] max-w-[200px] truncate">
                        {commission.projectName}
                      </div>
                      <div className="text-xs text-[#6B7280]">ID: {commission.projectId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-[#040F2A]">{commission.ticketId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {commission.amount > 0 ? (
                        <div>
                          <div className="text-sm font-semibold text-[#040F2A]">
                            {formatCurrency(commission.amount)}
                          </div>
                          {commission.investmentAmount && (
                            <div className="text-xs text-[#6B7280]">
                              z {formatCurrency(commission.investmentAmount)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-[#6B7280]">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#040F2A]">{commission.commissionRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusColor}`}>
                        {getStatusLabel(commission.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6B7280]">{formatDate(relevantDate)}</div>
                      {commission.status === 'PAID' && commission.paidDate && (
                        <div className="text-xs text-[#14AE6B]">Zaplaceno</div>
                      )}
                      {commission.status === 'PENDING_PAYMENT' && (
                        <div className="text-xs text-[#215EF8]">Čeká na platbu</div>
                      )}
                      {commission.status === 'EXPECTED' && (
                        <div className="text-xs text-[#6B7280]">Očekáváno</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {commission.invoiceNumber ? (
                        <div className="text-sm font-mono text-[#040F2A]">{commission.invoiceNumber}</div>
                      ) : (
                        <div className="text-sm text-[#6B7280]">—</div>
                      )}
                      {commission.paymentReference && (
                        <div className="text-xs text-[#6B7280]">{commission.paymentReference}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedCommissions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">Zatím nemáte žádné provize</p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-gray-50 border border-[#EAEAEA] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[#040F2A] mb-2">Poznámky ke provizím</h3>
        <ul className="text-sm text-[#6B7280] space-y-1">
          <li>• <strong>Očekáváno:</strong> Rezervace probíhá, provize bude dosažena po úspěšném dokončení (fáze SUCCESS)</li>
          <li>• <strong>K vyplacení:</strong> Obchod úspěšně dokončen, čeká se na vystavení faktury a úhradu</li>
          <li>• <strong>Vyplaceno:</strong> Provize byla uhrazena na váš účet</li>
          <li>• <strong>Propadlo:</strong> Rezervace skončila bez dohody (NO_DEAL nebo EXPIRED)</li>
        </ul>
      </div>
    </div>
  );
}