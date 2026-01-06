/**
 * DUPLICATE INVESTOR WARNING MODAL
 * 
 * Zobrazuje varování když obchodník chce zaslat smlouvu investorovi,
 * který už dostal smlouvu od jiného obchodníka.
 * 
 * Compliance-first: Předchází konfuzím a duplicitním nabídkám
 */

import { AlertTriangle, X, User, Calendar, FileText, Building2 } from 'lucide-react';

interface ExistingReservation {
  reservationNumber: string;
  tiparName: string;
  tiparId: string;
  projectName: string;
  ticketId: string;
  sentAt: string;
  phase: string;
  investorName: string;
}

interface DuplicateInvestorWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway: () => void;
  investorName: string;
  existingReservations: ExistingReservation[];
}

export function DuplicateInvestorWarning({
  isOpen,
  onClose,
  onProceedAnyway,
  investorName,
  existingReservations
}: DuplicateInvestorWarningProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeSince = (dateStr: string): string => {
    const now = new Date();
    const sent = new Date(dateStr);
    const diffHours = (now.getTime() - sent.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return `Před ${Math.floor(diffHours)} hodinami`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `Před ${diffDays} dny`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-orange-50 border-b-2 border-orange-200 px-6 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#040F2A]">
                  Možná duplicitní nabídka
                </h2>
                <p className="text-sm text-orange-800 mt-1">
                  Tento investor už byl osloven jiným obchodníkem
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-orange-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-orange-900" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {/* Investor Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-[#215EF8]" />
              <span className="text-sm font-semibold text-[#040F2A]">Investor</span>
            </div>
            <p className="text-base font-medium text-[#040F2A]">{investorName}</p>
          </div>

          {/* Warning Message */}
          <div className="mb-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              Tento investor již obdržel rezervační smlouvu (RA) od{' '}
              <span className="font-semibold">
                {existingReservations.length === 1 
                  ? 'jiného obchodníka' 
                  : `${existingReservations.length} dalších obchodníků`}
              </span>
              . Pokračování může vést k:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-600 mt-0.5">•</span>
                <span><strong>Konfuzi investora</strong> – investor neví, koho má kontaktovat</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-600 mt-0.5">•</span>
                <span><strong>Interní konkurenci</strong> – více obchodníků bojuje o stejného investora</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-600 mt-0.5">•</span>
                <span><strong>Compliance riziku</strong> – duplicitní komunikace může porušovat standardy</span>
              </li>
            </ul>
          </div>

          {/* Existing Reservations */}
          <div>
            <h3 className="text-sm font-semibold text-[#040F2A] mb-3">
              Existující rezervace ({existingReservations.length})
            </h3>
            <div className="space-y-3">
              {existingReservations.map((reservation) => (
                <div 
                  key={reservation.reservationNumber}
                  className="bg-white border-2 border-orange-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs font-mono text-gray-500 mb-1">
                        {reservation.reservationNumber}
                      </div>
                      <div className="font-semibold text-[#040F2A]">
                        {reservation.tiparName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Odesláno</div>
                      <div className="text-xs font-medium text-orange-600">
                        {getTimeSince(reservation.sentAt)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <Building2 className="w-3 h-3" />
                        <span>Projekt</span>
                      </div>
                      <div className="text-sm text-[#040F2A] font-medium">
                        {reservation.projectName}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                        <FileText className="w-3 h-3" />
                        <span>Tiket</span>
                      </div>
                      <div className="text-sm text-[#040F2A] font-mono">
                        {reservation.ticketId}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900">{reservation.phase}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="text-gray-600">Datum odeslání:</span>
                      <span className="text-gray-900">{formatDate(reservation.sentAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm font-semibold text-[#040F2A] mb-2">
              💡 Doporučení
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Doporučujeme koordinaci s kolegou, který investora už kontaktoval. 
              Můžete mu napsat nebo kontaktovat administrátora platformy pro vyřešení situace.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-[#040F2A] bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zrušit rezervaci
            </button>
            <button
              onClick={() => {
                onProceedAnyway();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Pokračovat přesto
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3">
            Pokračováním berete na vědomí riziko duplicitní komunikace
          </p>
        </div>
      </div>
    </div>
  );
}
