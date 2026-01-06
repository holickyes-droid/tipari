import { X, FileText, Clock, Trash2, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Ticket } from '../types/project';

export interface DraftReservation {
  id: string;
  ticket: Ticket;
  projectName: string;
  investorName?: string;
  currentStep: string;
  signatureMethod?: 'electronic' | 'physical';
  customEmail?: string;
  savedAt: Date;
}

interface DraftReservationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftReservation[];
  onContinueDraft: (draft: DraftReservation) => void;
  onDeleteDraft: (draftId: string) => void;
}

export function DraftReservationsPanel({
  isOpen,
  onClose,
  drafts,
  onContinueDraft,
  onDeleteDraft,
}: DraftReservationsPanelProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Právě teď';
    if (minutes < 60) return `Před ${minutes} min`;
    if (hours < 24) return `Před ${hours} h`;
    return `Před ${days} dny`;
  };

  const getStepName = (step: string) => {
    const steps: Record<string, string> = {
      'investor-selection': 'Výběr investora',
      'summary': 'Shrnutí',
      'signature-method': 'Výběr podpisu',
      'waiting-electronic': 'Čeká na podpis',
      'waiting-physical-upload': 'Čeká na nahrání',
      'electronic-signed': 'Investor podepsal',
      'upload-document': 'Nahrání dokumentu',
      'document-uploaded': 'Dokument nahrán',
      'physical-confirmed': 'Fyzický podpis potvrzen',
      'reservation-pending': 'Čeká na developera',
    };
    return steps[step] || step;
  };

  const getStepPhaseInfo = (step: string, signatureMethod?: 'electronic' | 'physical') => {
    const phaseInfo: Record<string, { phase: string; nextAction: string; progress: number }> = {
      'investor-selection': {
        phase: 'Krok 1/5: Výběr investora',
        nextAction: 'Vyberte investora a pokračujte na shrnutí',
        progress: 20,
      },
      'summary': {
        phase: 'Krok 2/5: Kontrola detailů',
        nextAction: 'Zkontrolujte údaje a vyberte způsob podpisu',
        progress: 40,
      },
      'signature-method': {
        phase: 'Krok 3/5: Výběr způsobu podpisu',
        nextAction: 'Zvolte elektronický nebo fyzický podpis',
        progress: 60,
      },
      'waiting-electronic': {
        phase: 'Krok 4/5: Čeká se na podpis investora',
        nextAction: 'Investor obdrží smlouvu k elektronickému podpisu',
        progress: 80,
      },
      'waiting-physical-upload': {
        phase: 'Krok 4/5: Připravena smlouva k tisku',
        nextAction: 'Stáhněte, vytiskněte a podepište smlouvu',
        progress: 80,
      },
      'upload-document': {
        phase: 'Krok 4/5: Nahrání podepsané smlouvy',
        nextAction: 'Nahrajte sken podepsaného dokumentu',
        progress: 80,
      },
      'document-uploaded': {
        phase: 'Krok 5/5: Dokument čeká na kontrolu',
        nextAction: 'Potvrďte nahraný dokument',
        progress: 90,
      },
      'physical-confirmed': {
        phase: 'Krok 5/5: Fyzický podpis potvrzen',
        nextAction: 'Rezervace čeká na schválení developerem',
        progress: 95,
      },
      'electronic-signed': {
        phase: 'Krok 5/5: Investor podepsal smlouvu',
        nextAction: 'Rezervace čeká na schválení developerem',
        progress: 95,
      },
      'reservation-pending': {
        phase: 'Krok 5/5: Čeká se na developera',
        nextAction: 'Developer posoudí vaši rezervaci',
        progress: 100,
      },
    };
    return phaseInfo[step] || { phase: 'Neznámá fáze', nextAction: 'Pokračujte v rezervaci', progress: 0 };
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#040F2A] to-[#0A1A3F]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#215EF8]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#215EF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Rozpracované rezervace</h2>
              <p className="text-sm text-gray-400">
                {drafts.length === 0 
                  ? 'Žádné uložené rezervace' 
                  : `${drafts.length} ${drafts.length === 1 ? 'uložená rezervace' : drafts.length < 5 ? 'uložené rezervace' : 'uložených rezervací'}`
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {drafts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Žádné rozpracované rezervace
              </h3>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                Když budete vytvářet rezervaci a zavřete ji před dokončením, automaticky se uloží zde pro pozdější dokončení.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => {
                const phaseInfo = getStepPhaseInfo(draft.currentStep, draft.signatureMethod);
                return (
                  <div
                    key={draft.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#215EF8]/50 hover:shadow-lg transition-all group relative overflow-hidden"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#215EF8]/0 via-[#215EF8]/0 to-[#215EF8]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="relative">
                      {/* Header with delete button */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4 text-[#215EF8]" />
                            <h3 className="font-semibold text-gray-900">
                              {draft.projectName}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500">
                            Tiket {draft.ticket.ticketNumber}
                          </p>
                        </div>
                        <button
                          onClick={() => onDeleteDraft(draft.id)}
                          className="text-gray-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50"
                          title="Smazat koncept"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-[#215EF8]">
                            {phaseInfo.phase}
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {phaseInfo.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#215EF8] to-[#14AE6B] transition-all duration-500"
                            style={{ width: `${phaseInfo.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {phaseInfo.nextAction}
                        </p>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Investor</p>
                          <p className="text-sm font-medium text-gray-900">
                            {draft.investorName || (
                              <span className="text-gray-400 italic">Nevybrán</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Investiční částka</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(draft.ticket.investmentAmount)} Kč
                          </p>
                        </div>
                        {draft.signatureMethod && (
                          <>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Způsob podpisu</p>
                              <p className="text-sm font-medium text-gray-900">
                                {draft.signatureMethod === 'electronic' ? 'Elektronický' : 'Fyzický'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Uloženo</p>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDate(draft.savedAt)}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        {!draft.signatureMethod && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Uloženo</p>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(draft.savedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action button */}
                      <Button
                        onClick={() => onContinueDraft(draft)}
                        className="w-full bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] hover:shadow-lg hover:shadow-[#215EF8]/25 text-white font-medium py-3 transition-all group/btn"
                      >
                        <span>Pokračovat v rezervaci</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        {drafts.length > 0 && (
          <div className="px-8 py-4 border-t border-gray-100 bg-amber-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Automatické smazání po 7 dnech
                </p>
                <p className="text-xs text-amber-700">
                  Rozpracované rezervace se automaticky smažou po 7 dnech od posledního uložení. Dokončete je včas, abyste o ně nepřišli.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}