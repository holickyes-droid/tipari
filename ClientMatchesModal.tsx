import { Users, X, TrendingUp, Clock, DollarSign, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Ticket } from '../types/project';

interface ClientMatch {
  id: string;
  name: string;
  type: string;
  matchPercentage: number;
  reservedSlots: number;
  totalSlots: number;
}

interface ClientMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumber: string;
  ticket: Ticket | null;
  projectName: string;
  matches: ClientMatch[];
  onReserve: (clientId: string) => void;
}

export function ClientMatchesModal({
  isOpen,
  onClose,
  ticketNumber,
  ticket,
  projectName,
  matches,
  onReserve,
}: ClientMatchesModalProps) {
  if (!isOpen || !ticket) return null;

  const hasMatches = matches && matches.length > 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 bg-slate-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-[#215EF8]" />
                <h2 className="text-xl font-semibold text-[#040F2A]">
                  Shody investorů s tiketem
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono font-medium text-[#040F2A]">{ticketNumber}</span>
                <span>•</span>
                <span className="truncate max-w-md">{projectName}</span>
              </div>
            </div>
            {hasMatches && (
              <div className="ml-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#215EF8]/10 border border-[#215EF8]/20">
                  <Users className="w-4 h-4 text-[#215EF8]" />
                  <span className="text-sm font-medium text-[#215EF8]">
                    {matches.length} {matches.length === 1 ? 'shoda' : matches.length < 5 ? 'shody' : 'shod'}
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="ml-3 text-muted-foreground hover:text-[#040F2A] transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Ticket Info Section */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-[#215EF8]/5 to-[#14AE6B]/5">
          <div className="grid grid-cols-4 gap-4">
            {/* Výše investice */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Výše investice</span>
              </div>
              <div className="text-lg font-semibold text-[#040F2A]">
                {formatCurrency(ticket.investmentAmount)} Kč
              </div>
            </div>

            {/* Výnos p.a. */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Výnos p.a.</span>
              </div>
              <div className="text-lg font-semibold text-[#14AE6B]">
                {ticket.yieldPA.toFixed(1)}%
              </div>
            </div>

            {/* Doba trvání */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Doba trvání</span>
              </div>
              <div className="text-lg font-semibold text-[#040F2A]">
                {ticket.duration} měs.
              </div>
            </div>

            {/* LTV */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>LTV</span>
              </div>
              <div className="text-lg font-semibold text-[#040F2A]">
                {ticket.ltv ? `${ticket.ltv}%` : '—'}
              </div>
            </div>
          </div>

          {/* Zajištění info */}
          {ticket.secured && ticket.securedTypes && ticket.securedTypes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/50">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-[#14AE6B]" />
                <span>Zajištěno:</span>
                <span className="font-medium text-[#040F2A]">
                  {ticket.securedTypes[0]}
                  {ticket.securedTypes.length > 1 && ` +${ticket.securedTypes.length - 1} další`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {hasMatches ? (
            <div className="space-y-3">
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-xs text-blue-900">
                  <span className="font-medium">Inteligentní matching:</span> Následující investoři odpovídají parametrům tohoto tiketu na základě jejich investičních preferencí, portfolia a rizikového profilu.
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b border-border">
                <div className="col-span-5 text-xs font-medium text-muted-foreground">Investor</div>
                <div className="col-span-2 text-xs font-medium text-muted-foreground text-center">
                  Shoda
                </div>
                <div className="col-span-2 text-xs font-medium text-muted-foreground text-center">
                  Portfolio
                </div>
                <div className="col-span-3 text-xs font-medium text-muted-foreground text-right">
                  Akce
                </div>
              </div>

              {/* Table Rows */}
              {matches.map((match) => {
                const slotsAvailable = match.totalSlots - match.reservedSlots;
                const isDisabled = slotsAvailable === 0;

                return (
                  <div
                    key={match.id}
                    className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg border ${
                      isDisabled
                        ? 'bg-muted/30 border-border opacity-60'
                        : 'bg-white border-border hover:border-[#215EF8]/30 hover:shadow-sm transition-all'
                    }`}
                  >
                    {/* Client Info */}
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#215EF8]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-[#215EF8]">
                            {match.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[#040F2A]">{match.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{match.type}</div>
                        </div>
                      </div>
                    </div>

                    {/* Match Percentage */}
                    <div className="col-span-2 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-lg font-medium text-[#14AE6B]">
                          {match.matchPercentage}%
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-[#14AE6B] rounded-full"
                            style={{ width: `${match.matchPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Slots Info */}
                    <div className="col-span-2 text-center">
                      <div className="text-sm font-medium text-[#040F2A]">
                        {match.reservedSlots} / {match.totalSlots}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {slotsAvailable} {slotsAvailable === 1 ? 'volný' : slotsAvailable < 5 ? 'volné' : 'volných'}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-3 flex items-center justify-end">
                      <Button
                        size="sm"
                        disabled={isDisabled}
                        onClick={() => onReserve(match.id)}
                        className={
                          isDisabled
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-[#215EF8] hover:bg-[#1a4bc7] text-white'
                        }
                      >
                        {isDisabled ? 'Plné portfolio' : 'Rezervovat pro klienta'}
                      </Button>
                    </div>
                  </div>
                );
              })
            }
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-[#040F2A] mb-2">
                Žádné shody s investory
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                Pro tento tiket nemáš žádné klienty, kteří by odpovídali investičním parametrům. 
                Zkus přidat nové klienty nebo upravit jejich preference.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-lg">
                <div className="text-xs text-amber-900">
                  <span className="font-medium">Tip:</span> Můžeš projekt nabídnout všem klientům ručně nebo upravit jejich investiční profily pro lepší matching.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {hasMatches ? (
                <>Matching systém aktualizován: <span className="font-medium">Dnes 14:32</span></>
              ) : (
                <>Žádné odpovídající klienty v databázi</>
              )}
            </div>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Zavřít
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
