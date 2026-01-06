import { AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';

interface CloseReservationConfirmationProps {
  isOpen: boolean;
  investorName?: string;
  ticketNumber?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CloseReservationConfirmation({
  isOpen,
  investorName,
  ticketNumber,
  onConfirm,
  onCancel,
}: CloseReservationConfirmationProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[100]"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-full max-w-md z-[101] p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#040F2A] mb-2">
              Ukončit rezervaci?
            </h3>
            <p className="text-sm text-[#6B7280]">
              Vaše rozpracovaná rezervace bude automaticky uložena a můžete v ní pokračovat později.
            </p>
          </div>
        </div>

        {investorName && ticketNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#215EF8] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#040F2A]">
                <strong>Rozpracovaná rezervace:</strong> {investorName} • {ticketNumber}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            Zpět na rezervaci
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            Uložit a ukončit
          </Button>
        </div>
      </div>
    </>
  );
}
