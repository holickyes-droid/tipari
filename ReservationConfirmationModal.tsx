import { CheckCircle2, Clock, FileText, CreditCard, X } from 'lucide-react';
import { Button } from './ui/button';

interface ReservationConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
  expiresIn: string; // e.g., "7 dní"
  reservationId: string;
}

export function ReservationConfirmationModal({
  isOpen,
  onClose,
  ticketNumber,
  expiresIn,
  reservationId,
}: ReservationConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-[#040F2A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-[#14AE6B]/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#14AE6B]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#040F2A] mb-1">
                  Rezervace potvrzena
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ticket {ticketNumber} • ID: {reservationId}
                </p>
              </div>
            </div>
          </div>

          {/* Expiry info */}
          <div className="px-6 py-4 bg-blue-50/50 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#215EF8]" />
              <span className="text-[#040F2A]">
                Rezervace je aktivní po dobu <strong>{expiresIn}</strong>
              </span>
            </div>
          </div>

          {/* Next step */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Další krok
              </div>
            </div>
            <p className="text-sm text-[#040F2A]">
              Dokončete platbu a podepište investiční dokumentaci do {expiresIn}.
            </p>
          </div>

          {/* Remaining steps */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Zbývající kroky
              </div>
              <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#215EF8] text-white text-xs font-bold">
                2
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Step 1: Payment */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#040F2A]">Platba</div>
                  <div className="text-xs text-muted-foreground">
                    Převod investiční částky
                  </div>
                </div>
              </div>

              {/* Step 2: Documentation */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#040F2A]">Dokumentace</div>
                  <div className="text-xs text-muted-foreground">
                    Podpis smlouvy a příloh
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 bg-muted/20 rounded-b-xl flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Zavřít
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
            >
              Zobrazit rezervace
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
