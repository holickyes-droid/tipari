import { useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  Info,
  Building2,
  FileText,
  Users,
  AlertCircle,
  Trash2
} from 'lucide-react';

type ProjectStatus = 'draft' | 'pending' | 'in-negotiation' | 'approved' | 'active' | 'rejected';

interface ListedProject {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  ticketsCount: number;
  totalVolume: number;
  reservationsCount?: number;
  developerName: string;
}

interface CancelProjectPageProps {
  project: ListedProject;
  onBack: () => void;
  onCancelSuccess: () => void;
}

export function CancelProjectPage({ project, onBack, onCancelSuccess }: CancelProjectPageProps) {
  const [step, setStep] = useState<'confirmation' | 'reason' | 'processing' | 'success'>('confirmation');
  const [cancelReason, setCancelReason] = useState('');
  const [selectedReasonType, setSelectedReasonType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [understandConsequences, setUnderstandConsequences] = useState(false);

  const canCancel = project.status !== 'active' || (project.reservationsCount || 0) === 0;
  
  const getCancelWarningLevel = () => {
    if (project.status === 'active' && project.reservationsCount && project.reservationsCount > 0) {
      return 'critical';
    }
    if (project.status === 'in-negotiation' || project.status === 'approved') {
      return 'high';
    }
    if (project.status === 'pending') {
      return 'medium';
    }
    return 'low';
  };

  const getActionText = () => {
    if (project.status === 'draft' || project.status === 'rejected') {
      return 'Smazat projekt';
    }
    return 'Zrušit zalistování';
  };

  const reasonOptions = [
    { value: 'developer-withdrew', label: 'Developer stáhl projekt' },
    { value: 'better-terms', label: 'Lepší podmínky u jiného subjektu' },
    { value: 'project-cancelled', label: 'Projekt byl zrušen' },
    { value: 'documentation-issues', label: 'Problém s dokumentací' },
    { value: 'timing', label: 'Nevhodné načasování' },
    { value: 'other', label: 'Jiný důvod' },
  ];

  const handleCancel = async () => {
    if (!understandConsequences) return;
    
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
    }, 2000);
  };

  const handleComplete = () => {
    onCancelSuccess();
  };

  // Step 1: Confirmation with warnings
  if (step === 'confirmation') {
    const warningLevel = getCancelWarningLevel();
    
    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#040F2A]">
                {getActionText()}
              </h1>
              <p className="text-[#6B7280] mt-1">
                Potvrďte zrušení projektu a seznamte se s důsledky
              </p>
            </div>
          </div>

          {/* Project Summary */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-[#6B7280]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#040F2A] mb-1">{project.name}</h3>
                <p className="text-sm text-[#6B7280] mb-3">{project.location}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#6B7280]">{project.ticketsCount} tiketů</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-[#6B7280]">{project.developerName}</span>
                  </div>
                  {project.reservationsCount !== undefined && project.reservationsCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#14AE6B]" />
                      <span className="text-[#14AE6B] font-medium">{project.reservationsCount} aktivních rezervací</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning Section - Critical */}
          {!canCancel && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    Projekt nelze zrušit
                  </h3>
                  <p className="text-sm text-red-800 mb-4">
                    Tento projekt má aktivní rezervace. Nejprve musíte vyřešit všechny aktivní rezervace před zrušením projektu.
                  </p>
                  <div className="bg-red-100 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-red-900">Co musíte udělat:</p>
                    <ul className="text-sm text-red-800 space-y-1 ml-4 list-disc">
                      <li>Kontaktujte Tipary s aktivními rezervacemi</li>
                      <li>Vyčkejte na dokončení nebo zrušení rezervací</li>
                      <li>Teprve poté můžete projekt zrušit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Section - High */}
          {canCancel && warningLevel === 'high' && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    Důležité upozornění
                  </h3>
                  <p className="text-sm text-amber-800 mb-4">
                    {project.status === 'in-negotiation' 
                      ? 'Projekt je v pokročilé fázi jednání s developerem. Zrušení může mít negativní dopad na vaši reputaci a budoucí spolupráci.'
                      : 'Projekt byl již schválen a čeká na finalizaci. Zrušení v této fázi může být komplikované.'}
                  </p>
                  <div className="bg-amber-100 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-amber-900">Doporučení:</p>
                    <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
                      <li>Zvažte kontaktování supportu před zrušením</li>
                      <li>Ujistěte se, že developer je informován</li>
                      <li>Zdokumentujte důvod zrušení</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Consequences Section */}
          {canCancel && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-blue-900 mb-3">
                    Co se stane po zrušení projektu?
                  </h3>
                  <div className="space-y-3 text-sm text-blue-800">
                    {project.status === 'draft' || project.status === 'rejected' ? (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Projekt bude trvale odstraněn ze systému</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Všechna data o projektu budou smazána</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Tuto akci nelze vrátit zpět</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Projekt bude okamžitě odstraněn z platformy</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Tikety přestanou být viditelné pro ostatní Tipary</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Developer a administrátoři budou informováni</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Historie projektu zůstane archivována pro právní účely</span>
                        </div>
                        {project.status === 'pending' && (
                          <div className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Proces schvalování bude zastaven</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Checkbox */}
          {canCancel && (
            <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understandConsequences}
                  onChange={(e) => setUnderstandConsequences(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-[#EAEAEA] text-[#215EF8] focus:ring-2 focus:ring-[#215EF8]/20"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#040F2A] mb-1">
                    Potvrzuji, že rozumím důsledkům zrušení
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Seznámil(a) jsem se se všemi informacemi výše a chci pokračovat v procesu zrušení projektu.
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={onBack}
              className="px-6 py-3 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zrušit a vrátit se
            </button>
            
            {canCancel && (
              <button
                onClick={() => setStep('reason')}
                disabled={!understandConsequences}
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  understandConsequences
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Pokračovat k důvodu zrušení
                <AlertTriangle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Reason for cancellation
  if (step === 'reason') {
    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep('confirmation')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#040F2A]">
                Důvod zrušení
              </h1>
              <p className="text-[#6B7280] mt-1">
                Pomůže nám to zlepšit naše služby a procesy
              </p>
            </div>
          </div>

          {/* Reason Selection */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#040F2A] mb-4">
              Vyberte důvod zrušení projektu
            </h3>
            
            <div className="space-y-2 mb-6">
              {reasonOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedReasonType === option.value
                      ? 'border-[#215EF8] bg-[#215EF8]/5'
                      : 'border-[#EAEAEA] hover:border-[#215EF8]/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={option.value}
                    checked={selectedReasonType === option.value}
                    onChange={(e) => setSelectedReasonType(e.target.value)}
                    className="w-5 h-5 text-[#215EF8] focus:ring-2 focus:ring-[#215EF8]/20"
                  />
                  <span className="text-sm font-medium text-[#040F2A]">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-sm font-semibold text-[#040F2A] mb-2">
                Doplňující informace (volitelné)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Zde můžete uvést další podrobnosti o důvodu zrušení..."
                rows={4}
                className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] resize-none"
              />
              <p className="text-xs text-[#6B7280] mt-2">
                Tyto informace pomohou našemu týmu lépe pochopit vaše potřeby
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#6B7280] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#6B7280]">
                Vaše zpětná vazba je důvěrná a slouží výhradně pro interní zlepšování našich služeb.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={() => setStep('confirmation')}
              className="px-6 py-3 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zpět
            </button>
            
            <button
              onClick={handleCancel}
              disabled={!selectedReasonType}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                selectedReasonType
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {project.status === 'draft' || project.status === 'rejected' ? (
                <>
                  <Trash2 className="w-4 h-4" />
                  Smazat projekt
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  Zrušit zalistování
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Processing
  if (step === 'processing') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-[#215EF8]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#215EF8] rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-[#040F2A] mb-2">
            Zpracovávám zrušení...
          </h2>
          <p className="text-[#6B7280]">
            Prosím vyčkejte, aktualizujeme systém
          </p>
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-[#EAEAEA] rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-[#040F2A] mb-3">
            {project.status === 'draft' || project.status === 'rejected'
              ? 'Projekt byl smazán'
              : 'Projekt byl zrušen'}
          </h2>
          <p className="text-[#6B7280] mb-2">
            {project.name} byl úspěšně {project.status === 'draft' || project.status === 'rejected' ? 'odstraněn' : 'zrušen'}
          </p>
          <p className="text-sm text-[#6B7280] mb-8">
            {project.status === 'draft' || project.status === 'rejected'
              ? 'Všechna data byla trvale smazána'
              : 'Developer a administrátoři byli informováni'}
          </p>

          <button
            onClick={handleComplete}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all"
          >
            Zpět na přehled projektů
          </button>
        </div>
      </div>
    );
  }

  return null;
}