/**
 * CANCEL RESERVATION MODAL
 * Modal dialog for cancelling a reservation from detail view
 * Based on Tipari.cz decision-first UX and compliance-first copy
 */

import { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Reservation } from '../types/reservation';
import { mockProjects } from '../data/mockProjects';
import { mockInvestors } from '../data/mockInvestors';

interface CancelReservationModalProps {
  isOpen: boolean;
  reservation: Reservation;
  onClose: () => void;
  onSuccess: () => void;
}

type CancellationReason = '' | 'investor_unavailable' | 'params_not_suitable' | 'found_better' | 'creation_error' | 'other';
type ModalStep = 'confirm' | 'loading' | 'success' | 'error';

export function CancelReservationModal({ isOpen, reservation, onClose, onSuccess }: CancelReservationModalProps) {
  const [step, setStep] = useState<ModalStep>('confirm');
  const [selectedReason, setSelectedReason] = useState<CancellationReason>('');
  const [customReasonText, setCustomReasonText] = useState('');
  const [confirmChecked, setConfirmChecked] = useState(false);
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

  // Calculate commission amount
  const commissionAmount = ticket 
    ? ticket.investmentAmount * ticket.commission / 100
    : 0;

  // Handle cancellation
  const handleConfirmCancellation = async () => {
    if (!confirmChecked) return;

    setStep('loading');
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In real implementation:
      // await api.post(`/api/reservations/${reservation.id}/cancel`, {
      //   reason: selectedReason,
      //   reason_text: selectedReason === 'other' ? customReasonText : undefined
      // });
      
      setStep('success');
    } catch (err) {
      setError('Technická chyba při komunikaci se serverem. Zkuste to prosím znovu.');
      setStep('error');
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setStep('confirm');
  };

  // Handle close and reset
  const handleClose = () => {
    setStep('confirm');
    setSelectedReason('');
    setCustomReasonText('');
    setConfirmChecked(false);
    setError(null);
    onClose();
  };

  // Handle success and close
  const handleSuccessClose = () => {
    handleClose();
    onSuccess();
  };

  if (!isOpen) return null;

  console.log('CancelReservationModal rendering, isOpen:', isOpen, 'step:', step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* CONFIRM STEP */}
        {step === 'confirm' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA]">
              <div>
                <h2 className="text-lg font-semibold text-[#040F2A]">Zrušení rezervace</h2>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  Opravdu chcete zrušit rezervaci {reservation.reservationNumber}?
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Warning Box */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-[#040F2A] mb-1">
                      Důležité upozornění
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      Toto je nevratná operace. Po zrušení nebude možné rezervaci obnovit.
                    </div>
                  </div>
                </div>
              </div>

              {/* Reservation Summary */}
              <div className="bg-gray-50 border border-[#EAEAEA] rounded-lg p-4">
                <div className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">
                  Rezervace
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Projekt:</span>
                    <span className="font-medium text-[#040F2A]">{project?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Investor:</span>
                    <span className="font-medium text-[#040F2A]">{investor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Tiket:</span>
                    <span className="font-medium font-mono text-[#040F2A]">{ticket?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Investice:</span>
                    <span className="font-medium text-[#040F2A]">
                      {ticket && formatCurrency(ticket.investmentAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div>
                <div className="text-sm font-medium text-[#040F2A] mb-3">
                  Co se stane po zrušení:
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">
                      Slot bude <span className="font-medium text-[#040F2A]">okamžitě uvolněn</span>
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">
                      SLA časovač bude <span className="font-medium text-[#040F2A]">zastaven</span>
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">
                      Provize <span className="font-medium text-[#040F2A]">{formatCurrency(commissionAmount)}</span> propadne
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B7280]">
                      Můžete vytvořit <span className="font-medium text-[#040F2A]">novou rezervaci</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-sm font-medium text-[#040F2A] mb-2">
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
                    className="w-full mt-2 px-3 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8] focus:border-transparent resize-none"
                  />
                )}
              </div>

              {/* Confirmation Checkbox */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 border border-[#EAEAEA] rounded-lg">
                <input
                  type="checkbox"
                  id="confirm-cancel"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#215EF8] border-[#EAEAEA] rounded focus:ring-2 focus:ring-[#215EF8]"
                />
                <label htmlFor="confirm-cancel" className="text-sm text-[#040F2A] cursor-pointer">
                  Potvrzuji, že rozumím důsledkům zrušení rezervace a chci pokračovat
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EAEAEA] bg-gray-50">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ponechat rezervaci
              </button>
              <button
                onClick={handleConfirmCancellation}
                disabled={!confirmChecked}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors flex items-center gap-2 ${
                  confirmChecked
                    ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <X className="w-4 h-4" />
                Zrušit rezervaci
              </button>
            </div>
          </>
        )}

        {/* LOADING STEP */}
        {step === 'loading' && (
          <div className="px-6 py-16 text-center">
            <Loader2 className="w-12 h-12 text-[#215EF8] animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#040F2A] mb-2">
              Rušení rezervace...
            </h3>
            <p className="text-sm text-[#6B7280]">
              Probíhá zrušení rezervace {reservation.reservationNumber}
            </p>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === 'success' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA] bg-[#F0FDF4]">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#14AE6B] rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#14AE6B]">Rezervace zrušena</h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">
                    Operace byla úspěšně dokončena
                  </p>
                </div>
              </div>
              <button
                onClick={handleSuccessClose}
                className="p-2 text-[#6B7280] hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded-lg p-4">
                <div className="text-sm font-medium text-[#040F2A] mb-3">
                  Co se stalo:
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[#040F2A]">Slot uvolněn</span>
                      <div className="text-[#6B7280]">Tiket {ticket?.id} má nyní volné sloty</div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[#040F2A]">SLA časovač zastaven</span>
                      <div className="text-[#6B7280]">Žádné další upozornění</div>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[#040F2A]">Provize propadla</span>
                      <div className="text-[#6B7280]">{formatCurrency(commissionAmount)} označeno jako propadlé</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-[#EAEAEA] rounded-lg p-4">
                <div className="text-sm font-medium text-[#040F2A] mb-2">
                  Co můžete dělat dále:
                </div>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Prohlédnout si jiné dostupné tikety</li>
                  <li>• Vytvořit novou rezervaci</li>
                  <li>• Kontaktovat investora</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EAEAEA] bg-gray-50">
              <button
                onClick={handleSuccessClose}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
              >
                Zavřít
              </button>
            </div>
          </>
        )}

        {/* ERROR STEP */}
        {step === 'error' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEAEA] bg-red-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#EF4444] rounded-full">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[#EF4444]">Chyba při rušení</h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">
                    Operaci se nepodařilo dokončit
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-[#6B7280] hover:bg-white/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-sm font-medium text-[#040F2A] mb-2">
                  Důvod chyby:
                </div>
                <p className="text-sm text-[#6B7280]">
                  {error}
                </p>
              </div>

              <div className="bg-gray-50 border border-[#EAEAEA] rounded-lg p-4">
                <div className="text-sm font-medium text-[#040F2A] mb-2">
                  Co můžete udělat:
                </div>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Zkuste to prosím znovu za několik okamžiků</li>
                  <li>• Zkontrolujte připojení k internetu</li>
                  <li>• Pokud problém přetrvává, kontaktujte podporu</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#EAEAEA] bg-gray-50">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Zavřít
              </button>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
              >
                Zkusit znovu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}