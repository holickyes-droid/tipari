/**
 * CANCEL RESERVATION PAGE
 * Full-page flow for cancelling a reservation
 * Based on SLOT_CANCELLATION_FEATURE_SPEC.md
 */

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Reservation } from '../types/reservation';
import { mockProjects } from '../data/mockProjects';
import { mockInvestors } from '../data/mockInvestors';

interface CancelReservationPageProps {
  reservation: Reservation;
  onBack: () => void;
  onCancelSuccess: () => void;
}

type CancellationReason = '' | 'investor_unavailable' | 'params_not_suitable' | 'found_better' | 'creation_error' | 'other';

export function CancelReservationPage({ reservation, onBack, onCancelSuccess }: CancelReservationPageProps) {
  const [step, setStep] = useState<'confirm' | 'loading' | 'success' | 'error'>('confirm');
  const [selectedReason, setSelectedReason] = useState<CancellationReason>('');
  const [customReasonText, setCustomReasonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Get related data
  const project = mockProjects.find(p => p.id === reservation.projectId);
  const investor = mockInvestors.find(inv => inv.id === reservation.investorId);
  const ticket = project?.tickets.find(t => t.id === reservation.ticketId);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle cancellation confirmation
  const handleConfirmCancellation = async () => {
    setStep('loading');
    setError(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real implementation, this would call:
      // const response = await api.post(`/api/reservations/${reservation.id}/cancel`, {
      //   reason: selectedReason,
      //   reason_text: selectedReason === 'other' ? customReasonText : undefined
      // });
      
      setStep('success');
    } catch (err) {
      setError('Technická chyba při komunikaci se serverem. Zkuste to prosím znovu za několik okamžiků.');
      setStep('error');
    }
  };

  // Retry after error
  const handleRetry = () => {
    setError(null);
    setStep('confirm');
  };

  // Navigate to ticket after success
  const handleGoToTicket = () => {
    // In real app: navigate to ticket detail
    onCancelSuccess();
  };

  // Calculate commission amount
  const commissionAmount = ticket 
    ? ticket.investmentAmount * ticket.commission / 100
    : 0;

  // Calculate available slots after cancellation
  const newAvailableSlots = ticket 
    ? ticket.totalSlots - ticket.reservedSlots + 1
    : 0;

  // Render confirmation step
  if (step === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět na detail
            </button>
            <h1 className="text-2xl font-semibold text-[#040F2A]">
              Zrušení rezervace
            </h1>
            <p className="text-[#6B7280] mt-1">
              Opravdu chcete zrušit tuto rezervaci?
            </p>
          </div>

          {/* Reservation Summary */}
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#040F2A] mb-4">REZERVACE</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-mono font-medium text-[#040F2A]">{reservation.reservationNumber}</span>
              </div>
              <div className="text-sm text-[#6B7280]">
                Tiket: <span className="font-medium text-[#040F2A]">{ticket?.id}</span>
              </div>
              <div className="text-sm text-[#6B7280]">
                Investice: <span className="font-medium text-[#040F2A]">{ticket && formatCurrency(ticket.investmentAmount)}</span> · <span className="font-medium text-[#040F2A]">{project?.yieldPA.toFixed(1)}% p.a.</span>
              </div>
              <div className="text-sm text-[#6B7280]">
                Investor: <span className="font-medium text-[#040F2A]">{investor?.name}</span>
              </div>
              <div className="text-sm text-[#6B7280]">
                Vytvořeno: <span className="font-medium text-[#040F2A]">{new Date(reservation.createdAt).toLocaleDateString('cs-CZ')}</span>
              </div>
            </div>
          </div>

          {/* Consequences List */}
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#040F2A] mb-4">Co se stane po zrušení:</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-[#040F2A]">Slot bude okamžitě uvolněn</div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    Tiket {ticket?.id} bude mít opět {newAvailableSlots} / {ticket?.totalSlots} volných slotů
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-[#040F2A]">SLA časovač bude zastaven</div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    Žádné další SLA upozornění nebudou zasílána
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-[#040F2A]">Provize nebude vyplacena</div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    Očekávaná provize {formatCurrency(commissionAmount)} bude označena jako propadlá
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-[#040F2A]">Můžete vytvořit novou rezervaci</div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    Pokud je tiket stále dostupný, můžete rezervovat znovu
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Reason Selection */}
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-6">
            <label className="block text-sm font-medium text-[#040F2A] mb-3">
              Důvod zrušení (volitelné):
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value as CancellationReason)}
              className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8] focus:border-transparent"
            >
              <option value="">Vyberte důvod...</option>
              <option value="investor_unavailable">Investor již není dostupný</option>
              <option value="params_not_suitable">Parametry tiketu nevyhovují</option>
              <option value="found_better">Nalezen vhodnější tiket</option>
              <option value="creation_error">Chyba při vytváření rezervace</option>
              <option value="other">Jiný důvod (prosím specifikujte)</option>
            </select>

            {selectedReason === 'other' && (
              <textarea
                value={customReasonText}
                onChange={(e) => setCustomReasonText(e.target.value)}
                placeholder="Prosím specifikujte důvod..."
                maxLength={500}
                rows={3}
                className="w-full mt-3 px-3 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8] focus:border-transparent resize-none"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-semibold text-[#6B7280] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ponechat rezervaci
            </button>
            <button
              onClick={handleConfirmCancellation}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#EF4444] rounded-lg hover:bg-[#DC2626] transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Zrušit rezervaci
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render loading step
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-8 text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#215EF8] mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-[#040F2A] mb-2">
            Rušení rezervace...
          </h2>
          <p className="text-sm text-[#6B7280]">
            Probíhá zrušení rezervace {reservation.reservationNumber}...<br />
            Prosím vyčkejte.
          </p>
        </div>
      </div>
    );
  }

  // Render success step
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Success Header */}
          <div className="bg-[#F0FDF4] border-2 border-[#14AE6B] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#14AE6B] flex-shrink-0 mt-0.5" />
              <div>
                <h1 className="text-xl font-semibold text-[#14AE6B] mb-1">
                  REZERVACE ZRUŠENA
                </h1>
                <p className="text-sm text-[#6B7280]">
                  Rezervace {reservation.reservationNumber} byla úspěšně zrušena.
                </p>
              </div>
            </div>
          </div>

          {/* What Happened Summary */}
          <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#040F2A] mb-4">CO SE STALO</h3>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#040F2A]">Slot uvolněn</span>
                  <div className="text-[#6B7280]">Tiket {ticket?.id} má nyní {newAvailableSlots} / {ticket?.totalSlots} volných slotů</div>
                </div>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#040F2A]">SLA časovač zastaven</span>
                  <div className="text-[#6B7280]">Žádné další upozornění nebudou zasílána</div>
                </div>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#040F2A]">Provize propadla</span>
                  <div className="text-[#6B7280]">Provize {formatCurrency(commissionAmount)} označena jako propadlá</div>
                </div>
              </li>
              <li className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-[#040F2A]">Vaše sloty aktualizovány</span>
                  <div className="text-[#6B7280]">Zbývající volné sloty: 7 / 10</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#040F2A] mb-3">Co můžete dělat dále:</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>• Prohlédnout si jiné dostupné tikety na tomto projektu</li>
              <li>• Vytvořit novou rezervaci, pokud je tiket stále dostupný</li>
              <li>• Kontaktovat investora a vysvětlit důvod zrušení</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-semibold text-[#6B7280] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zavřít
            </button>
            <button
              onClick={() => {/* Navigate to project */}}
              className="px-6 py-2.5 text-sm font-semibold text-[#6B7280] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zobrazit projekt
            </button>
            <button
              onClick={handleGoToTicket}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#215EF8] rounded-lg hover:bg-[#1E4FD9] transition-colors"
            >
              Zobrazit tiket {ticket?.id}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render error step
  if (step === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Error Header */}
          <div className="bg-white border-2 border-[#EF4444] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div>
                <h1 className="text-xl font-semibold text-[#EF4444] mb-1">
                  CHYBA PŘI RUŠENÍ
                </h1>
                <p className="text-sm text-[#6B7280] mb-3">
                  Nepodařilo se zrušit rezervaci {reservation.reservationNumber}.
                </p>
                <p className="text-sm text-[#040F2A] font-medium">
                  Důvod: {error}
                </p>
              </div>
            </div>
          </div>

          {/* What to Do */}
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#040F2A] mb-3">Co můžete udělat:</h3>
            <ul className="space-y-2 text-sm text-[#6B7280]">
              <li>• Zkuste to prosím znovu za několik okamžiků</li>
              <li>• Pokud problém přetrvává, kontaktujte podporu</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-semibold text-[#6B7280] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zavřít
            </button>
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#215EF8] rounded-lg hover:bg-[#1E4FD9] transition-colors"
            >
              Zkusit znovu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
