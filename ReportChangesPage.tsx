/**
 * REPORT CHANGES PAGE - DECISION-FIRST UX
 * 
 * Workflow for reporting changes to submitted projects before publication
 * 
 * Business Rules:
 * - Only available for non-published projects (status !== 'active')
 * - Pre-fills form with current project data
 * - Submits as "change request" for admin approval
 * - Clear change tracking and justification
 * 
 * UX Flow:
 * 1. Select what to change (multi-select)
 * 2. Edit selected fields with change highlighting
 * 3. Add justification for changes
 * 4. Review & Submit
 */

import { useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Edit,
  FileText,
  Building2,
  MapPin,
  TrendingUp,
  DollarSign,
  Clock,
  MessageSquare,
  Info,
  Trash2,
  Plus
} from 'lucide-react';

type ProjectStatus = 'draft' | 'pending' | 'in-negotiation' | 'approved' | 'active' | 'rejected';

interface ListedProject {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  description: string;
  projectType: 'residential' | 'commercial' | 'mixed-use' | 'industrial';
  totalVolume: number;
  ticketsCount: number;
  developerName: string;
  developerEmail: string;
  developerPhone: string;
}

interface ReportChangesPageProps {
  project: ListedProject;
  onBack: () => void;
  onSuccess: () => void;
}

type ChangeableField = 
  | 'basic-info'
  | 'description' 
  | 'financial-terms'
  | 'developer-contact'
  | 'tickets'
  | 'documents';

type Step = 'select-fields' | 'edit-fields' | 'review' | 'processing' | 'success';

interface ChangeRequest {
  field: ChangeableField;
  oldValue: string;
  newValue: string;
}

export function ReportChangesPage({ project, onBack, onSuccess }: ReportChangesPageProps) {
  const [step, setStep] = useState<Step>('select-fields');
  const [selectedFields, setSelectedFields] = useState<ChangeableField[]>([]);
  const [changeJustification, setChangeJustification] = useState('');
  
  // Form state
  const [editedName, setEditedName] = useState(project.name);
  const [editedLocation, setEditedLocation] = useState(project.location);
  const [editedDescription, setEditedDescription] = useState(project.description);
  const [editedDeveloperName, setEditedDeveloperName] = useState(project.developerName);
  const [editedDeveloperEmail, setEditedDeveloperEmail] = useState(project.developerEmail);
  const [editedDeveloperPhone, setEditedDeveloperPhone] = useState(project.developerPhone);

  const fieldOptions: { 
    value: ChangeableField; 
    label: string; 
    description: string;
    icon: any;
  }[] = [
    { 
      value: 'basic-info', 
      label: 'Základní informace', 
      description: 'Název projektu, lokace, typ projektu',
      icon: Building2
    },
    { 
      value: 'description', 
      label: 'Popis projektu', 
      description: 'Detailní popis a charakteristika projektu',
      icon: FileText
    },
    { 
      value: 'financial-terms', 
      label: 'Finanční podmínky', 
      description: 'Objem investice, výnosy, provize',
      icon: DollarSign
    },
    { 
      value: 'developer-contact', 
      label: 'Kontakt na developera', 
      description: 'Email, telefon, kontaktní osoba',
      icon: MessageSquare
    },
    { 
      value: 'tickets', 
      label: 'Tikety', 
      description: 'Přidat, upravit nebo odebrat tikety',
      icon: TrendingUp
    },
    { 
      value: 'documents', 
      label: 'Dokumenty', 
      description: 'Nahrát nové nebo aktualizovat dokumenty',
      icon: FileText
    },
  ];

  const toggleField = (field: ChangeableField) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleSubmit = () => {
    setStep('processing');
    
    // Simulate API call with realistic timing
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const getChangeSummary = (): ChangeRequest[] => {
    const changes: ChangeRequest[] = [];
    
    if (selectedFields.includes('basic-info')) {
      if (editedName !== project.name) {
        changes.push({
          field: 'basic-info',
          oldValue: `Název: ${project.name}`,
          newValue: `Název: ${editedName}`
        });
      }
      if (editedLocation !== project.location) {
        changes.push({
          field: 'basic-info',
          oldValue: `Lokace: ${project.location}`,
          newValue: `Lokace: ${editedLocation}`
        });
      }
    }
    
    if (selectedFields.includes('description') && editedDescription !== project.description) {
      changes.push({
        field: 'description',
        oldValue: project.description.substring(0, 100) + '...',
        newValue: editedDescription.substring(0, 100) + '...'
      });
    }
    
    if (selectedFields.includes('developer-contact')) {
      if (editedDeveloperName !== project.developerName) {
        changes.push({
          field: 'developer-contact',
          oldValue: `Jméno: ${project.developerName}`,
          newValue: `Jméno: ${editedDeveloperName}`
        });
      }
      if (editedDeveloperEmail !== project.developerEmail) {
        changes.push({
          field: 'developer-contact',
          oldValue: `Email: ${project.developerEmail}`,
          newValue: `Email: ${editedDeveloperEmail}`
        });
      }
      if (editedDeveloperPhone !== project.developerPhone) {
        changes.push({
          field: 'developer-contact',
          oldValue: `Telefon: ${project.developerPhone}`,
          newValue: `Telefon: ${editedDeveloperPhone}`
        });
      }
    }
    
    return changes;
  };

  // ========================================
  // STEP 1: SELECT FIELDS TO CHANGE
  // ========================================
  if (step === 'select-fields') {
    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 p-8">
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
                Nahlásit změny projektu
              </h1>
              <p className="text-[#6B7280] mt-1">
                {project.name} · Vyberte, které informace chcete aktualizovat
              </p>
            </div>
          </div>

          {/* Project Status Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Změny před publikací projektu
                </p>
                <p className="text-sm text-blue-800">
                  Tento projekt ještě není zveřejněn na platformě. Můžete nahlásit změny, které budou posouzeny administrátorem před finálním schválením.
                  {project.status === 'pending' && ' Projekt aktuálně čeká na schválení.'}
                  {project.status === 'in-negotiation' && ' Projekt je v jednání s developerem.'}
                  {project.status === 'approved' && ' Projekt byl schválen a čeká na publikaci.'}
                </p>
              </div>
            </div>
          </div>

          {/* Field Selection */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#040F2A] mb-4">
              Co chcete změnit?
            </h3>
            <p className="text-sm text-[#6B7280] mb-6">
              Vyberte sekce, které chcete upravit. Můžete vybrat více možností najednou.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {fieldOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedFields.includes(option.value);
                
                return (
                  <label
                    key={option.value}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#215EF8] bg-[#215EF8]/5'
                        : 'border-[#EAEAEA] hover:border-[#215EF8]/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleField(option.value)}
                      className="mt-1 w-5 h-5 rounded border-[#EAEAEA] text-[#215EF8] focus:ring-2 focus:ring-[#215EF8]/20"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-[#215EF8]" />
                        <span className="text-sm font-medium text-[#040F2A]">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        {option.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Warning if tickets or financial changes selected */}
          {(selectedFields.includes('tickets') || selectedFields.includes('financial-terms')) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Změny vyžadující dodatečné schválení
                  </p>
                  <p className="text-sm text-amber-800">
                    Změny ve finančních podmínkách nebo tiketech mohou prodloužit proces schvalování, protože vyžadují dodatečnou revizi provizních podmínek.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={onBack}
              className="px-6 py-3 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zrušit
            </button>
            
            <button
              onClick={() => setStep('edit-fields')}
              disabled={selectedFields.length === 0}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                selectedFields.length > 0
                  ? 'bg-[#215EF8] text-white hover:bg-[#1a4bc7]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Pokračovat k úpravám
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 2: EDIT SELECTED FIELDS
  // ========================================
  if (step === 'edit-fields') {
    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep('select-fields')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#040F2A]">
                Upravit vybrané informace
              </h1>
              <p className="text-[#6B7280] mt-1">
                Aktualizujte informace, které chcete změnit
              </p>
            </div>
          </div>

          {/* Edit Forms */}
          <div className="space-y-6">
            {/* Basic Info */}
            {selectedFields.includes('basic-info') && (
              <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-[#215EF8]" />
                  <h3 className="text-base font-semibold text-[#040F2A]">
                    Základní informace
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#040F2A] mb-2">
                      Název projektu
                    </label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    />
                    {editedName !== project.name && (
                      <p className="text-xs text-blue-600 mt-1">
                        Původně: {project.name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#040F2A] mb-2">
                      Lokace
                    </label>
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    />
                    {editedLocation !== project.location && (
                      <p className="text-xs text-blue-600 mt-1">
                        Původně: {project.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {selectedFields.includes('description') && (
              <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#215EF8]" />
                  <h3 className="text-base font-semibold text-[#040F2A]">
                    Popis projektu
                  </h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#040F2A] mb-2">
                    Detailní popis
                  </label>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] resize-none"
                  />
                  {editedDescription !== project.description && (
                    <p className="text-xs text-blue-600 mt-1">
                      Popis byl změněn
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Developer Contact */}
            {selectedFields.includes('developer-contact') && (
              <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-[#215EF8]" />
                  <h3 className="text-base font-semibold text-[#040F2A]">
                    Kontakt na developera
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#040F2A] mb-2">
                      Jméno developera
                    </label>
                    <input
                      type="text"
                      value={editedDeveloperName}
                      onChange={(e) => setEditedDeveloperName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    />
                    {editedDeveloperName !== project.developerName && (
                      <p className="text-xs text-blue-600 mt-1">
                        Původně: {project.developerName}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#040F2A] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedDeveloperEmail}
                      onChange={(e) => setEditedDeveloperEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    />
                    {editedDeveloperEmail !== project.developerEmail && (
                      <p className="text-xs text-blue-600 mt-1">
                        Původně: {project.developerEmail}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#040F2A] mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={editedDeveloperPhone}
                      onChange={(e) => setEditedDeveloperPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    />
                    {editedDeveloperPhone !== project.developerPhone && (
                      <p className="text-xs text-blue-600 mt-1">
                        Původně: {project.developerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Financial Terms - Placeholder */}
            {selectedFields.includes('financial-terms') && (
              <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-[#215EF8]" />
                  <h3 className="text-base font-semibold text-[#040F2A]">
                    Finanční podmínky
                  </h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Úprava finančních podmínek vyžaduje konzultaci s administrátorem.
                    V dalším kroku můžete popsat požadované změny.
                  </p>
                </div>
              </div>
            )}

            {/* Tickets - Placeholder */}
            {selectedFields.includes('tickets') && (
              <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#215EF8]" />
                  <h3 className="text-base font-semibold text-[#040F2A]">
                    Tikety
                  </h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Úprava tiketů vyžaduje komplexní revizi.
                    V dalším kroku můžete popsat požadované změny.
                  </p>
                </div>
              </div>
            )}

            {/* Documents - Placeholder */}
            {selectedFields.includes('documents') && (
              <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#215EF8]" />
                  <h3 className="text-base font-semibold text-[#040F2A]">
                    Dokumenty
                  </h3>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Nahrání nebo aktualizace dokumentů bude možná po schválení změn administrátorem.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={() => setStep('select-fields')}
              className="px-6 py-3 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Zpět
            </button>
            
            <button
              onClick={() => setStep('review')}
              className="px-6 py-3 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 bg-[#215EF8] text-white hover:bg-[#1a4bc7]"
            >
              Pokračovat k přehledu
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 3: REVIEW & JUSTIFICATION
  // ========================================
  if (step === 'review') {
    const changes = getChangeSummary();
    
    return (
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep('edit-fields')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[#040F2A]">
                Přehled změn
              </h1>
              <p className="text-[#6B7280] mt-1">
                Zkontrolujte navržené změny před odesláním
              </p>
            </div>
          </div>

          {/* Changes Summary */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#040F2A] mb-4">
              Navržené změny ({changes.length})
            </h3>
            
            {changes.length > 0 ? (
              <div className="space-y-3">
                {changes.map((change, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Původní hodnota</p>
                        <p className="text-sm text-[#040F2A] line-through opacity-60">
                          {change.oldValue}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280] mb-1">Nová hodnota</p>
                        <p className="text-sm text-[#040F2A] font-medium">
                          {change.newValue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-[#6B7280]">
                  Nebyly detekovány žádné změny v editovaných polích
                </p>
              </div>
            )}
          </div>

          {/* Justification */}
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <h3 className="text-base font-semibold text-[#040F2A] mb-4">
              Zdůvodnění změn <span className="text-red-600">*</span>
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Vysvětlete, proč jsou tyto změny potřebné. Tato informace pomůže administrátorovi rychleji posoudit a schválit vaši žádost.
            </p>
            
            <textarea
              value={changeJustification}
              onChange={(e) => setChangeJustification(e.target.value)}
              placeholder="Např: Developer aktualizoval název projektu kvůli změně značky. Kontaktní telefon byl změněn na aktuální číslo kontaktní osoby..."
              rows={5}
              className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] resize-none"
            />
            <p className="text-xs text-[#6B7280] mt-2">
              Minimální délka: 20 znaků
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  Co se stane po odeslání?
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Změny budou odeslány administrátorovi k posouzení</li>
                  <li>• Obdržíte potvrzovací email s přehledem změn</li>
                  <li>• Průměrná doba schválení je 1-2 pracovní dny</li>
                  <li>• V případě dotazů vás administrátor kontaktuje</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              onClick={() => setStep('edit-fields')}
              className="px-6 py-3 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Upravit změny
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={changeJustification.length < 20 || changes.length === 0}
              className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                changeJustification.length >= 20 && changes.length > 0
                  ? 'bg-[#215EF8] text-white hover:bg-[#1a4bc7]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Odeslat změny ke schválení
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 4: PROCESSING
  // ========================================
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-lg w-full">
          <div className="p-12">
            <div className="text-center">
              {/* Animated Spinner */}
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-[#215EF8]/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#215EF8] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 border-4 border-[#14AE6B]/30 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              
              <h2 className="text-2xl font-bold text-[#040F2A] mb-3">
                Odesílám změny...
              </h2>
              <p className="text-[#6B7280] mb-6">
                Prosím vyčkejte, zpracováváme vaši žádost
              </p>
              
              {/* Progress Steps */}
              <div className="space-y-3 text-left bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#14AE6B] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-[#040F2A]">Validace změn</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#215EF8] flex items-center justify-center flex-shrink-0 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-[#040F2A] font-medium">Odesílání požadavku</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                  <span className="text-[#6B7280]">Vytvoření notifikace</span>
                </div>
              </div>

              <p className="text-xs text-[#6B7280]">
                Tento proces obvykle trvá několik vteřin
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // STEP 5: SUCCESS
  // ========================================
  if (step === 'success') {
    const changes = getChangeSummary();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-2xl w-full">
          {/* Success Header with Gradient */}
          <div className="bg-gradient-to-r from-[#14AE6B] to-[#0f8d54] px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-[#14AE6B]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  Změny byly úspěšně odeslány! 🎉
                </h2>
                <p className="text-green-50 text-sm">
                  Žádost #{Math.random().toString(36).substring(2, 9).toUpperCase()} vytvořena
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Summary Box */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-5 h-5 text-[#215EF8] mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#040F2A] mb-1">
                    Projekt: {project.name}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {changes.length} {changes.length === 1 ? 'změna' : changes.length < 5 ? 'změny' : 'změn'} navrženo ke schválení
                  </p>
                </div>
              </div>

              {/* Change List */}
              {changes.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2">
                    Navržené změny:
                  </p>
                  {changes.slice(0, 3).map((change, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#14AE6B] mt-0.5 flex-shrink-0" />
                      <span className="text-[#040F2A] line-clamp-1">
                        {change.newValue}
                      </span>
                    </div>
                  ))}
                  {changes.length > 3 && (
                    <p className="text-xs text-[#6B7280] ml-5">
                      + {changes.length - 3} dalších změn
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Timeline - Co se děje dál */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    Co se děje dál?
                  </p>
                  
                  <div className="space-y-3">
                    {/* Timeline Steps */}
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-0.5 h-8 bg-blue-200 my-1"></div>
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-medium text-blue-900">Potvrzovací email</p>
                        <p className="text-xs text-blue-700">Obdržíte do 5 minut s přehledem změn</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-800">2</span>
                        </div>
                        <div className="w-0.5 h-8 bg-blue-200 my-1"></div>
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-medium text-blue-900">Administrátorské posouzení</p>
                        <p className="text-xs text-blue-700">Průměrná doba: 1-2 pracovní dny</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-blue-800">3</span>
                        </div>
                      </div>
                      <div className="flex-1 pt-0.5">
                        <p className="text-sm font-medium text-blue-900">Schválení a aktualizace</p>
                        <p className="text-xs text-blue-700">Budete informováni emailem a v platformě</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onSuccess}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Zpět na detail projektu
              </button>
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-lg border border-gray-300 text-[#040F2A] font-medium hover:bg-gray-50 transition-colors"
              >
                Zavřít
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-[#6B7280]">
                Máte dotazy? Kontaktujte nás na <a href="mailto:podpora@tipari.cz" className="text-[#215EF8] hover:underline">podpora@tipari.cz</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}