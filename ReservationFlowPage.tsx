/**
 * RESERVATION FLOW PAGE - ENHANCED UX
 * Professional B2B reservation flow with comprehensive investor search
 * and detailed signature method comparison
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, AlertCircle, Clock, TrendingUp, FileText, 
  ArrowRight, Upload, Shield, Info, Users, Plus, Search, Mail, Download, 
  X, MapPin, Calendar, AlertTriangle, Building2, Filter, SortAsc, Phone,
  Building, Eye, Edit2, Check, ExternalLink, Zap, Lock, DollarSign,
  Timer, Smartphone, Printer, FileSignature, ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

type SignatureMethod = 'electronic' | 'physical' | null;

type FlowStep = 
  | 'investor-selection'
  | 'summary'
  | 'signature-method'
  | 'electronic-prepare'
  | 'electronic-sending'
  | 'physical-info'
  | 'physical-download'
  | 'upload-document'
  | 'document-uploaded'
  | 'final-summary'
  | 'reservation-complete';

interface Investor {
  id: string;
  name: string;
  initials: string;
  type: 'Privátní investor' | 'Fond' | 'Family Office' | 'Instituce';
  email: string;
  phone: string;
  portfolioValue: number;
  activeInvestments: number;
  preferredAmount: number;
  preferredYield: number;
  isActive: boolean;
  ico?: string;
  lastActivity?: string;
}

interface TicketData {
  id: string;
  projectName: string;
  projectImage: string;
  investmentAmount: number;
  investmentType: 'Ekvita' | 'Zápůjčka' | 'Mezanin';
  yieldPercent: number;
  duration: string;
  security: string;
  commissionAmount: number;
  location: string;
}

interface ReservationFlowPageProps {
  ticket: TicketData;
  investors: Investor[];
  onBack: () => void;
  onComplete: () => void;
  onAddInvestor: () => void;
  onNavigateToReservations?: () => void;
}

// Enhanced Progress Stepper with Navigation
function ConnectedProgressStepper({ 
  currentStep, 
  onStepClick 
}: { 
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}) {
  const steps = [
    { number: 1, label: 'Investor' },
    { number: 2, label: 'Shrnutí' },
    { number: 3, label: 'Odeslání k podpisu' },
    { number: 4, label: 'Dokončení' },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isClickable = isCompleted || isActive;
          const showLine = index < steps.length - 1;
          
          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all relative z-10 ${
                    isCompleted 
                      ? 'bg-[#14AE6B] text-white shadow-lg shadow-[#14AE6B]/30 hover:shadow-xl cursor-pointer' 
                      : isActive
                      ? 'bg-[#215EF8] text-white ring-4 ring-[#215EF8]/20 shadow-lg cursor-default'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.number}
                </button>
                <div className={`text-xs mt-1 font-semibold whitespace-nowrap ${
                  isActive ? 'text-[#215EF8]' : isCompleted ? 'text-[#14AE6B]' : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
              </div>
              
              {showLine && (
                <div className="flex-1 h-1 mx-4 relative -mt-6">
                  <div className="absolute inset-0 bg-gray-200 rounded-full" />
                  <div 
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-[#14AE6B] w-full' : 'bg-transparent w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReservationFlowPage({ ticket, investors, onBack, onComplete, onAddInvestor, onNavigateToReservations }: ReservationFlowPageProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('investor-selection');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [signatureMethod, setSignatureMethod] = useState<SignatureMethod>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Investor search & filter
  const [investorSearch, setInvestorSearch] = useState('');
  const [investorTypeFilter, setInvestorTypeFilter] = useState<string>('all');
  const [investorStatusFilter, setInvestorStatusFilter] = useState<string>('all');
  const [investorSortBy, setInvestorSortBy] = useState<'name' | 'portfolio' | 'activity'>('name');
  
  // Email editing
  const [editedEmail, setEditedEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showContractPreview, setShowContractPreview] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Canonical reservation status model
  type ReservationStatus = 'WAITING_FOR_INVESTOR_SIGNATURE' | 'WAITING_FOR_INTERNAL_REVIEW' | 'COMPLETED';
  
  const getReservationStatus = (): ReservationStatus => {
    if (signatureMethod === 'physical' && uploadedFile) {
      return 'WAITING_FOR_INTERNAL_REVIEW';
    }
    if (signatureMethod === 'electronic' || signatureMethod === 'physical') {
      return 'WAITING_FOR_INVESTOR_SIGNATURE';
    }
    return 'WAITING_FOR_INVESTOR_SIGNATURE';
  };

  const getStatusConfig = (status: ReservationStatus) => {
    const configs = {
      'WAITING_FOR_INVESTOR_SIGNATURE': {
        badge: 'Čeká na podpis investora',
        primary: 'Investor obdrží smlouvu k podpisu',
        secondary: 'Z vaší strany není vyžadována žádná akce',
        tooltip: 'Investor má rezervační smlouvu k dispozici. Po podpisu budete informováni.',
        whoActs: 'investor',
        userActionRequired: false,
      },
      'WAITING_FOR_INTERNAL_REVIEW': {
        badge: 'Probíhá kontrola',
        primary: 'Smlouva je v kontrole',
        secondary: 'Z vaší strany není vyžadována žádná akce',
        tooltip: 'Podepsaná smlouva byla nahrána a je v interní kontrole. Budete informováni o výsledku.',
        whoActs: 'internal',
        userActionRequired: false,
      },
      'COMPLETED': {
        badge: 'Rezervace potvrzena',
        primary: 'Rezervace byla úspěšně potvrzena',
        secondary: 'Můžete kontaktovat investora',
        tooltip: 'Rezervace byla zkontrolována a potvrzena. Můžete zahájit vyjednávání s investorem.',
        whoActs: 'user',
        userActionRequired: false,
      }
    };
    return configs[status];
  };

  // Email validation helper
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  // Enhanced investor filtering
  const filteredAndSortedInvestors = investors
    .filter(inv => {
      // Search
      const searchLower = investorSearch.toLowerCase();
      const matchesSearch = 
        inv.name.toLowerCase().includes(searchLower) ||
        inv.email.toLowerCase().includes(searchLower) ||
        inv.phone.includes(investorSearch) ||
        (inv.ico && inv.ico.includes(investorSearch));
      
      if (!matchesSearch) return false;
      
      // Type filter
      if (investorTypeFilter !== 'all' && inv.type !== investorTypeFilter) return false;
      
      // Status filter
      if (investorStatusFilter === 'active' && !inv.isActive) return false;
      if (investorStatusFilter === 'inactive' && inv.isActive) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (investorSortBy === 'name') return a.name.localeCompare(b.name);
      if (investorSortBy === 'portfolio') return b.portfolioValue - a.portfolioValue;
      if (investorSortBy === 'activity') return b.activeInvestments - a.activeInvestments;
      return 0;
    });

  // Get step number for progress
  const getStepNumber = (): number => {
    const stepMap: Record<FlowStep, number> = {
      'investor-selection': 1,
      'summary': 2,
      'signature-method': 3,
      'electronic-prepare': 3,
      'electronic-sending': 3,
      'physical-info': 3,
      'physical-download': 3,
      'upload-document': 3,
      'document-uploaded': 4,
      'final-summary': 4,
      'reservation-complete': 4,
    };
    return stepMap[currentStep];
  };

  const handleInvestorSelect = (investor: Investor) => {
    setSelectedInvestor(investor);
    setEditedEmail(investor.email);
  };

  // Navigation between steps via stepper
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      setCurrentStep('investor-selection');
    } else if (stepNumber === 2 && selectedInvestor) {
      setCurrentStep('summary');
    } else if (stepNumber === 3 && selectedInvestor) {
      setCurrentStep('signature-method');
    }
    // Step 4 is completion, not navigable
  };

  const handleContinueToSummary = () => {
    if (!selectedInvestor) {
      return;
    }
    setCurrentStep('summary');
  };

  const handleContinueToSignature = () => {
    setCurrentStep('signature-method');
  };

  const handleSignatureMethodSelect = (method: SignatureMethod) => {
    setSignatureMethod(method);
    if (method === 'electronic') {
      setCurrentStep('electronic-prepare');
    } else {
      setCurrentStep('physical-info');
    }
  };

  const handleSendElectronicSignature = () => {
    setCurrentStep('electronic-sending');
    setTimeout(() => {
      setCurrentStep('final-summary');
      // Simulate email update in DB
      if (editedEmail !== selectedInvestor?.email) {
        toast.success('Email investora byl aktualizován');
      }
      setTimeout(() => {
        setCurrentStep('reservation-complete');
        toast.success('Rezervace byla úspěšně vytvořena!');
      }, 1500);
    }, 2500);
  };

  const handleContinuePhysical = () => {
    setCurrentStep('physical-download');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`Soubor ${file.name} byl nahrán`);
      // DON'T auto-advance - let user click "Pokračovat"
    }
  };

  const handleFinalizeReservation = () => {
    setCurrentStep('final-summary');
    setTimeout(() => {
      setCurrentStep('reservation-complete');
      toast.success('Rezervace byla úspěšně vytvořena!');
      // DON'T auto-redirect - let user choose where to go
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3">
        {/* Header */}
        <div className="mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#215EF8] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Zpět na detail tiketu</span>
          </button>

          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-[#040F2A] mb-1">Nová rezervace</h1>
              <p className="text-sm text-gray-600">{ticket.projectName} • {ticket.location}</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left - Flow content with stepper */}
          <div className="col-span-2">
            <ConnectedProgressStepper currentStep={getStepNumber()} onStepClick={handleStepClick} />
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
              
              {/* STEP 1: Enhanced Investor Selection */}
              {currentStep === 'investor-selection' && (
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#040F2A] mb-1">Vyberte investora</h2>
                    <p className="text-sm text-gray-600">Pro koho chcete tento tiket rezervovat?</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Po výběru investora vytvoříte rezervační smlouvu k podpisu.
                    </p>
                  </div>

                  {/* Advanced search */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={investorSearch}
                        onChange={(e) => setInvestorSearch(e.target.value)}
                        placeholder="Hledat podle jména, emailu, telefonu nebo IČO..."
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                      />
                    </div>

                    {/* Filters & Sort */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 flex-1">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <div className="relative flex-1">
                          <select
                            value={investorTypeFilter}
                            onChange={(e) => setInvestorTypeFilter(e.target.value)}
                            className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[#215EF8]/50 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all cursor-pointer"
                          >
                            <option value="all">Všechny typy</option>
                            <option value="Privátní investor">Privátní investor</option>
                            <option value="Fond">Fond</option>
                            <option value="Family Office">Family Office</option>
                            <option value="Instituce">Instituce</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative flex-1">
                          <select
                            value={investorStatusFilter}
                            onChange={(e) => setInvestorStatusFilter(e.target.value)}
                            className="w-full appearance-none px-3 py-2 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[#215EF8]/50 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all cursor-pointer"
                          >
                            <option value="all">Všechny stavy</option>
                            <option value="active">Aktivní</option>
                            <option value="inactive">Neaktivní</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4 text-gray-400" />
                        <div className="relative">
                          <select
                            value={investorSortBy}
                            onChange={(e) => setInvestorSortBy(e.target.value as any)}
                            className="appearance-none px-3 py-2 pr-8 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[#215EF8]/50 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all cursor-pointer"
                          >
                            <option value="name">Jméno A-Z</option>
                            <option value="portfolio">Portfolio (nejvyšší)</option>
                            <option value="activity">Aktivita (nejvíce)</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Results count */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Zobrazeno <strong>{filteredAndSortedInvestors.length}</strong> investorů</span>
                      {investorSearch && (
                        <button
                          onClick={() => {
                            setInvestorSearch('');
                            setInvestorTypeFilter('all');
                            setInvestorStatusFilter('all');
                          }}
                          className="text-[#215EF8] hover:text-[#1B4FD1] font-medium"
                        >
                          Vymazat filtry
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Investors list */}
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
                    {filteredAndSortedInvestors.map((investor) => (
                      <button
                        key={investor.id}
                        onClick={() => handleInvestorSelect(investor)}
                        className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                          selectedInvestor?.id === investor.id
                            ? 'border-[#215EF8] bg-[#215EF8]/5 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#215EF8] to-[#1B4FD1] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {investor.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{investor.name}</p>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                investor.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {investor.isActive ? 'Aktivní' : 'Neaktivní'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                                {investor.type}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{investor.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{investor.phone}</span>
                              </div>
                              {investor.ico && (
                                <div className="flex items-center gap-1">
                                  <Building className="w-3 h-3" />
                                  <span>IČO: {investor.ico}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="font-semibold text-gray-900">
                                Portfolio: {formatCurrency(investor.portfolioValue)} Kč
                              </span>
                              <span className="text-gray-600">
                                {investor.activeInvestments} aktivních investic
                              </span>
                            </div>
                          </div>
                          {selectedInvestor?.id === investor.id && (
                            <CheckCircle2 className="w-8 h-8 text-[#215EF8] flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}

                    {filteredAndSortedInvestors.length === 0 && (
                      <div className="py-6 text-center">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-2">Žádný investor nenalezen</p>
                        <button
                          onClick={() => {
                            setInvestorSearch('');
                            setInvestorTypeFilter('all');
                            setInvestorStatusFilter('all');
                          }}
                          className="text-sm text-[#215EF8] hover:text-[#1B4FD1] font-medium"
                        >
                          Vymazat filtry
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Add new investor */}
                  <button
                    onClick={onAddInvestor}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#215EF8] hover:text-[#215EF8] hover:bg-[#215EF8]/5 transition-all flex items-center justify-center gap-2 font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Přidat nového investora
                  </button>

                  {/* Continue button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleContinueToSummary}
                      disabled={!selectedInvestor}
                      className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        selectedInvestor
                          ? 'bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white hover:shadow-lg hover:shadow-[#215EF8]/30'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Pokračovat na shrnutí
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    {!selectedInvestor && (
                      <p className="text-sm text-gray-500 text-center mt-2">
                        Nejprve vyberte investora.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Summary (unchanged, keeping compact) */}
              {currentStep === 'summary' && selectedInvestor && (
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#040F2A] mb-1">Zkontrolujte údaje</h2>
                    <p className="text-sm text-gray-600 mb-2">Ověřte si všechny informace před pokračováním</p>
                    <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      Tento tiket alokujete pro vybraného investora. Rezervace ještě není závazná investice—investor nejprve podepíše rezervační smlouvu k zahájení procesu.
                    </p>
                  </div>

                  {/* Investor info */}
                  <div className="bg-white border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">Investor</p>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#215EF8] to-[#1B4FD1] flex items-center justify-center text-white font-bold text-lg">
                        {selectedInvestor.initials}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{selectedInvestor.name}</p>
                        <p className="text-sm text-gray-600">{selectedInvestor.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{selectedInvestor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Portfolio: {formatCurrency(selectedInvestor.portfolioValue)} Kč</span>
                      </div>
                    </div>
                  </div>

                  {/* Project & ticket info */}
                  <div className="bg-white border border-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-sm font-bold text-green-900 uppercase tracking-wide">Tiket & Projekt</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Název projektu:</span>
                        <span className="text-sm font-bold text-gray-900 text-right">{ticket.projectName}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Lokace:</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.location}</span>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Výše investice:</span>
                        <span className="text-base font-bold text-gray-900">{formatCurrency(ticket.investmentAmount)} Kč</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Typ investice:</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.investmentType}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Očekávaný výnos:</span>
                        <span className="text-base font-bold text-[#14AE6B]">{ticket.yieldPercent}% p.a.</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Doba trvání:</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.duration}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Zajištění:</span>
                        <span className="text-sm font-semibold text-gray-900">{ticket.security}</span>
                      </div>
                      <div className="h-px bg-green-200" />
                      <div className="flex justify-between items-start pt-2">
                        <span className="text-sm font-semibold text-gray-700">Vaše provize:</span>
                        <span className="text-xl font-bold text-[#14AE6B]">{formatCurrency(ticket.commissionAmount)} Kč</span>
                      </div>
                    </div>
                  </div>

                  {/* Important notice */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Důležité upozornění</p>
                        <p className="mb-2">Rezervace není závazek k investici. Získáváte právo vyjednávat s developerem jménem vašeho investora.</p>
                        <p>Rezervací zahajujete formální proces jménem investora a alokujete konkrétní tiket.</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentStep('investor-selection')}
                      className="flex-1 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Zpět
                    </button>
                    <button
                      onClick={handleContinueToSignature}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center justify-center gap-2"
                    >
                      Pokračovat
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Signature Method - ENHANCED WITH DETAILED COMPARISON */}
              {currentStep === 'signature-method' && (
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Způsob podpisu smlouvy</h2>
                    <p className="text-sm text-gray-600 mb-2">Vyberte metodu, která nejlépe vyhovuje vašemu investorovi</p>
                    <p className="text-sm text-gray-600 italic">
                      Většina profesionálních investorů volí elektronický podpis.
                    </p>
                  </div>

                  {/* Comparison Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Electronic Signature - EMPHASIZED */}
                    <button
                      onClick={() => handleSignatureMethodSelect('electronic')}
                      className="group p-5 rounded-2xl border-3 border-[#215EF8] shadow-lg shadow-[#215EF8]/20 hover:shadow-xl hover:shadow-[#215EF8]/30 transition-all text-left bg-gradient-to-br from-[#215EF8]/5 to-white"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-16 h-16 rounded-xl bg-[#215EF8] flex items-center justify-center">
                          <Smartphone className="w-8 h-8 text-white" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#14AE6B] text-white text-xs font-bold">
                          DOPORUČENO
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-xl mb-2">Elektronický podpis</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Moderní a rychlý způsob podpisu s okamžitým trackingem
                      </p>

                      {/* Features - SHORTENED */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-[#14AE6B]" />
                          <span className="text-gray-700"><strong>Rychlost:</strong> 5-30 minut</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Timer className="w-4 h-4 text-[#14AE6B]" />
                          <span className="text-gray-700"><strong>Tracking:</strong> V reálném čase</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#14AE6B]" />
                          <span className="text-gray-700"><strong>Náročnost:</strong> Minimální</span>
                        </div>
                      </div>
                    </button>

                    {/* Physical Signature */}
                    <button
                      onClick={() => handleSignatureMethodSelect('physical')}
                      className="group p-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left bg-white"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mb-4 transition-colors">
                        <FileSignature className="w-6 h-6 text-gray-600" />
                      </div>
                      
                      <h3 className="font-bold text-gray-900 text-lg mb-2">Fyzický podpis</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Tradiční metoda s vytištěnou smlouvou
                      </p>

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700"><strong>Rychlost:</strong> 1-3 dny</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Upload className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700"><strong>Tracking:</strong> Manuální</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700"><strong>Náročnost:</strong> Střední</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Comparison Table - REDUCED TO 3 KEY DIFFERENCES */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                    <h4 className="font-bold text-gray-900 mb-4">Klíčové rozdíly</h4>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="font-semibold text-gray-700"></div>
                      <div className="text-center font-semibold text-[#215EF8]">Elektronický</div>
                      <div className="text-center font-semibold text-gray-600">Fyzický</div>

                      <div className="text-gray-600">Rychlost</div>
                      <div className="text-center font-semibold text-[#14AE6B]">5-30 minut</div>
                      <div className="text-center text-gray-900">1-3 dny</div>

                      <div className="text-gray-600">Náročnost pro investora</div>
                      <div className="text-center font-semibold text-[#14AE6B]">Minimální</div>
                      <div className="text-center text-gray-900">Střední</div>

                      <div className="text-gray-600">Tracking</div>
                      <div className="text-center font-semibold text-[#14AE6B]">Automatický</div>
                      <div className="text-center text-gray-900">Manuální</div>
                    </div>
                  </div>

                  {/* Back button */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentStep('summary')}
                      className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Zpět na shrnutí
                    </button>
                  </div>
                </div>
              )}

              {/* ELECTRONIC FLOW: Prepare & Send - ENHANCED */}
              {currentStep === 'electronic-prepare' && selectedInvestor && (
                <div className="p-4 space-y-3">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-10 h-10 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Připraveno k odeslání</h2>
                    <p className="text-sm text-gray-600 mb-3">Zkontrolujte údaje před odesláním emailu investorovi</p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 inline-block">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Po odeslání už není vyžadována žádná akce z vaší strany.<br />
                        Budeme vás informovat o průběhu podpisu.
                      </p>
                    </div>
                  </div>

                  {/* Email Recipients */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Příjemci emailu</h3>
                      {!isEditingEmail && (
                        <button
                          onClick={() => setIsEditingEmail(true)}
                          className="text-sm text-[#215EF8] hover:text-[#1B4FD1] font-medium flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Upravit
                        </button>
                      )}
                    </div>

                    {isEditingEmail ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                            placeholder="email@example.com"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsEditingEmail(false);
                              if (editedEmail !== selectedInvestor.email) {
                                toast.success('Email bude aktualizován v kartě investora');
                              }
                            }}
                            disabled={!isValidEmail(editedEmail)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                              isValidEmail(editedEmail)
                                ? 'bg-[#215EF8] text-white hover:bg-[#1B4FD1]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                            Uložit
                          </button>
                          <button
                            onClick={() => {
                              setEditedEmail(selectedInvestor.email);
                              setIsEditingEmail(false);
                            }}
                            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
                          >
                            Zrušit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Investor Email */}
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Mail className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-gray-700 uppercase">Investor</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{editedEmail}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{selectedInvestor.name}</p>
                            </div>
                          </div>
                        </div>

                        {/* Tipar Email (You) */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-blue-900 uppercase">Tipar (Vy)</span>
                                <span className="text-xs px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded font-medium">Kopie</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">jan.novak@tipari.cz</p>
                              <p className="text-xs text-gray-600 mt-0.5">Obdržíte kopii smlouvy a shrnutí rezervace</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600 flex items-start gap-2 pt-2">
                          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>Předmět: <strong>Rezervační smlouva - {ticket.projectName}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contract preview & download */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Rezervační smlouva</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowContractPreview(!showContractPreview)}
                          className="text-sm text-[#215EF8] hover:text-[#1B4FD1] font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {showContractPreview ? 'Skrýt náhled' : 'Zobrazit náhled'}
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-[#215EF8] text-white text-sm font-semibold hover:bg-[#1B4FD1] transition-all flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Stáhnout PDF
                        </button>
                      </div>
                    </div>

                    {showContractPreview && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                        <div className="space-y-4 text-sm">
                          <div className="text-center border-b border-gray-200 pb-4">
                            <h4 className="font-bold text-lg text-gray-900 mb-1">REZERVAČNÍ SMLOUVA</h4>
                            <p className="text-xs text-gray-600">Č. smlouvy: RZ-{Date.now().toString().slice(-8)}</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 mb-2">Smluvní strany:</p>
                            <p className="text-gray-700"><strong>Tipar:</strong> {selectedInvestor.name}</p>
                            <p className="text-gray-700"><strong>Platforma:</strong> Tipari.cz</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 mb-2">Předmět rezervace:</p>
                            <p className="text-gray-700"><strong>Projekt:</strong> {ticket.projectName}</p>
                            <p className="text-gray-700"><strong>Lokace:</strong> {ticket.location}</p>
                            <p className="text-gray-700"><strong>Výše investice:</strong> {formatCurrency(ticket.investmentAmount)} Kč</p>
                            <p className="text-gray-700"><strong>Typ:</strong> {ticket.investmentType}</p>
                            <p className="text-gray-700"><strong>Očekávaný výnos:</strong> {ticket.yieldPercent}% p.a.</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 mb-2">Provize:</p>
                            <p className="text-gray-700">
                              Tipar obdrží provizi ve výši <strong>{formatCurrency(ticket.commissionAmount)} Kč</strong> po úspěšném 
                              uzavření investiční smlouvy mezi investorem a developerem.
                            </p>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded p-3">
                            <p className="text-xs text-amber-800">
                              <strong>Upozornění:</strong> Toto je zjednodušený náhled smlouvy. Kompletní PDF obsahuje 
                              všechny právní podmínky a přílohy.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* What happens next - COLLAPSED */}
                  <details className="bg-blue-50 border border-blue-200 rounded-lg group">
                    <summary className="p-4 cursor-pointer font-semibold text-blue-900 flex items-center justify-between hover:bg-blue-100 transition-colors rounded-lg list-none">
                      <span className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Co se bude dít po odeslání?
                      </span>
                      <ChevronDown className="w-5 h-5 text-blue-600 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 pb-4">
                      <ol className="space-y-2 text-sm text-blue-800 pt-2">
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                          <span>Investor obdrží email s bezpečným odkazem k podpisu (platnost 7 dní)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                          <span>Po přihlášení uvidí kompletní rezervační smlouvu k prostudování</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                          <span>Podepíše elektronicky pomocí SMS kódu (2FA)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                          <span>Budete informováni a můžete kontaktovat investora</span>
                        </li>
                      </ol>
                    </div>
                  </details>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep('signature-method')}
                      className="flex-1 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Zpět
                    </button>
                    <button
                      onClick={handleSendElectronicSignature}
                      disabled={!isValidEmail(editedEmail)}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isValidEmail(editedEmail)
                          ? 'bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white hover:shadow-lg hover:shadow-[#215EF8]/30'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Mail className="w-5 h-5" />
                      Odeslat email investorovi
                    </button>
                  </div>
                </div>
              )}

              {/* ELECTRONIC FLOW: Sending (unchanged) */}
              {currentStep === 'electronic-sending' && (
                <div className="p-4 text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-[#215EF8]/10 flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-10 h-10 text-[#215EF8] animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Odesílání emailu...</h2>
                  <p className="text-sm text-gray-600">Prosím vyčkejte, připravujeme a odesíláme email</p>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#215EF8] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#215EF8] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#215EF8] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Rest of the steps remain similar but I'll include key ones... */}
              {/* For brevity, keeping sent, physical flow, upload, and complete steps compact */}

              {/* Physical flow steps - keeping compact for space */}
              {currentStep === 'physical-info' && (
                <div className="p-4 space-y-3">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Fyzický podpis smlouvy</h2>
                    <p className="text-sm text-gray-600 mb-2">Postup pro fyzický podpis a nahrání smlouvy</p>
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      Stáhněte smlouvu, zajistěte podpis investora a následně ji nahrajte zpět.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h3 className="font-semibold text-amber-900 mb-4">Jak postupovat:</h3>
                    <ol className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 font-bold text-amber-900">1</div>
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-1">Stáhněte rezervační smlouvu</p>
                          <p className="text-xs">PDF dokument obsahuje všechny údaje</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 font-bold text-amber-900">2</div>
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-1">Vytiskněte nebo předejte investorovi</p>
                          <p className="text-xs">Investor podepíše na poslední straně</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 font-bold text-amber-900">3</div>
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-1">Naskenujte podepsanou smlouvu</p>
                          <p className="text-xs">Musí být viditelný podpis a všechny strany</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 font-bold text-amber-900">4</div>
                        <div className="text-sm text-amber-800">
                          <p className="font-semibold mb-1">Nahrajte PDF zpět</p>
                          <p className="text-xs">Po kontrole bude rezervace potvrzena</p>
                        </div>
                      </li>
                    </ol>
                    <p className="text-xs text-amber-700 mt-4 italic">
                      Doporučujeme nahrát podepsanou smlouvu bez zbytečného odkladu, ideálně do 24 hodin.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep('signature-method')}
                      className="flex-1 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Zpět
                    </button>
                    <button
                      onClick={handleContinuePhysical}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Pokračovat
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'physical-download' && (
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Stáhněte smlouvu</h2>
                    <p className="text-sm text-gray-600">Rezervační smlouva je připravena ke stažení</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rezervační smlouva</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      {ticket.projectName} • {selectedInvestor?.name}<br />
                      Investice: {formatCurrency(ticket.investmentAmount)} Kč
                    </p>
                    <button className="px-8 py-4 rounded-lg bg-[#215EF8] text-white font-semibold hover:bg-[#1B4FD1] transition-all flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl">
                      <Download className="w-5 h-5" />
                      Stáhnout smlouvu (PDF)
                    </button>
                    <p className="text-xs text-gray-500 mt-3">Velikost: ~250 KB • 3 strany</p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <button
                      onClick={() => setCurrentStep('upload-document')}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center justify-center gap-2"
                    >
                      Pokračovat k nahrání smlouvy
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => {
                        toast.success('Rezervace uložena do rozpracovaných');
                        onNavigateToReservations?.();
                      }}
                      className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Uložit do rozpracovaných
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'upload-document' && (
                <div className="p-4 space-y-3">
                  <div>
                    <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Nahrajte podepsanou smlouvu</h2>
                    <p className="text-sm text-gray-600 mb-2">Nahrajte PDF nebo obrázek podepsané smlouvy</p>
                    <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      Smlouva bude po nahrání zkontrolována. Z vaší strany poté není vyžadována žádná akce.
                    </p>
                  </div>

                  {/* File preview if uploaded */}
                  {uploadedFile ? (
                    <div className="bg-white border-2 border-green-200 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-green-200 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-green-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-600">{(uploadedFile.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      
                      <label className="block">
                        <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
                          <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <p className="text-sm font-medium text-green-800">Nahrát jiný soubor</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-[#215EF8] hover:bg-[#215EF8]/5 transition-all cursor-pointer">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="font-semibold text-gray-900 mb-2">Klikněte nebo přetáhněte soubor</p>
                        <p className="text-sm text-gray-600">PDF, JPG nebo PNG, max 10 MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    {uploadedFile && (
                      <button
                        onClick={() => setCurrentStep('document-uploaded')}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center justify-center gap-2"
                      >
                        Pokračovat
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setCurrentStep('physical-download')}
                      className="w-full py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Zpět
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'document-uploaded' && uploadedFile && selectedInvestor && (
                <div className="p-4 space-y-4">
                  <div className="text-center py-8">
                    <div className="w-24 h-24 rounded-full bg-[#14AE6B] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#14AE6B]/30 animate-in zoom-in duration-500">
                      <CheckCircle2 className="w-14 h-14 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#040F2A] mb-3">Smlouva úspěšně nahrána</h2>
                    <p className="text-gray-600 mb-4">
                      Podepsaná smlouva byla nahrána a nyní probíhá kontrola.
                    </p>
                    
                    {/* Status badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg mb-2">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span className="text-sm font-medium text-amber-800">Probíhá kontrola</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-4 max-w-md mx-auto leading-relaxed">
                      Kontrola obvykle probíhá do 24 hodin v pracovních dnech. Po schválení bude rezervace potvrzena.
                    </p>

                    {/* Uploaded file confirmation */}
                    <div className="mt-6 inline-flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="w-5 h-5 text-green-700" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-green-900">{uploadedFile.name}</p>
                        <p className="text-xs text-green-700">{(uploadedFile.size / 1024).toFixed(0)} KB • Nahráno úspěšně</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  </div>

                  {/* Where to find the reservation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Kde najdete vytvořenou rezervaci?</h3>
                        <p className="text-sm text-blue-800 mb-3">
                          Rezervace byla uložena a můžete ji kdykoliv sledovat v sekci <strong>Aktivity → Moje rezervace</strong>
                        </p>
                        <div className="space-y-2 text-sm text-blue-800">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Sledujte stav rezervace v reálném čase</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Stáhněte si smlouvu a dokumenty</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Pokračujte v komunikaci s investorem po schválení</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      Co bude následovat?
                    </h3>
                    <ol className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">1</span>
                        <span>Nahraná smlouva je zkontrolována (obvykle do 24 hodin)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">2</span>
                        <span>Po schválení bude rezervace potvrzena</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">3</span>
                        <span>Můžete zahájit finální vyjednávání s investorem</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14AE6B] text-white text-xs flex items-center justify-center font-bold">✓</span>
                        <span>Po uzavření investice obdržíte provizi <strong>{formatCurrency(ticket.commissionAmount)} Kč</strong></span>
                      </li>
                    </ol>
                  </div>

                  {/* Navigation options */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (onNavigateToReservations) {
                          onNavigateToReservations();
                        }
                        onComplete();
                      }}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">Přejít na rezervaci</div>
                          <div className="text-xs text-blue-100">Sledujte stav a komunikaci</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Další možnosti:</p>
                      <div className="space-y-2">
                        <button
                          onClick={onBack}
                          className="w-full py-2.5 px-4 rounded-lg text-gray-600 text-sm hover:bg-gray-50 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>Zpět na tikety</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => {
                            // Create another reservation
                            window.location.reload();
                          }}
                          className="w-full py-2.5 px-4 rounded-lg text-gray-600 text-sm hover:bg-gray-50 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4 text-gray-400" />
                            <span>Vytvořit další rezervaci</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'final-summary' && (
                <div className="p-4 text-center py-6">
                  <div className="w-20 h-20 rounded-full bg-[#215EF8]/10 flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-[#215EF8] animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#040F2A] mb-2">Finalizace rezervace...</h2>
                  <p className="text-sm text-gray-600">Ukládáme data a připravujeme potvrzení</p>
                </div>
              )}

              {currentStep === 'reservation-complete' && selectedInvestor && (
                <div className="p-4 space-y-4">
                  <div className="text-center py-8">
                    <div className="w-24 h-24 rounded-full bg-[#14AE6B] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#14AE6B]/30 animate-in zoom-in duration-500">
                      <CheckCircle2 className="w-14 h-14 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#040F2A] mb-3">Rezervace úspěšně vytvořena!</h2>
                    <p className="text-gray-600 mb-4">
                      Rezervační číslo: <span className="font-mono font-bold text-[#215EF8]">RZ-{Date.now().toString().slice(-6)}</span>
                    </p>
                    
                    {/* PRIMARY STATUS MESSAGE - Single source of truth */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-2 inline-block">
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Rezervace je vytvořena a čeká se na podpis investora.
                      </p>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-4">
                      {signatureMethod === 'physical' && uploadedFile 
                        ? 'Kontrola obvykle probíhá do 24 hodin v pracovní dny.'
                        : 'Po podpisu vás budeme informovat.'
                      }
                    </p>
                    
                    {/* Confirmation of what was sent/done */}
                    <div className="mt-4 space-y-2">
                      {signatureMethod === 'electronic' && (
                        <>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <Mail className="w-4 h-4 text-green-700" />
                            <span className="text-sm text-green-800">Rezervační smlouva byla odeslána na <strong>{editedEmail}</strong></span>
                          </div>
                          <p className="text-xs text-gray-500">Kopie byla odeslána na jan.novak@tipari.cz</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Where to find the reservation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Kde najdete vytvořenou rezervaci?</h3>
                        <p className="text-sm text-blue-800 mb-3">
                          Rezervace byla uložena a můžete ji sledovat v sekci <strong>Aktivity → Moje rezervace</strong>
                        </p>
                        <div className="space-y-2 text-sm text-blue-800">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Sledujte stav podpisu v reálném čase</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Stáhněte si smlouvu a dokumenty</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            <span>Komunikujte s investorem po podpisu</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      Co bude následovat?
                    </h3>
                    {signatureMethod === 'electronic' ? (
                      <ol className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">1</span>
                          <span>Investor <strong>{selectedInvestor.name}</strong> obdržel email s odkazem k podpisu (platnost 7 dní)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">2</span>
                          <span>Po podpisu vás budeme informovat a rezervace bude potvrzena</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">3</span>
                          <span>Můžete kontaktovat investora a zahájit vyjednávání</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14AE6B] text-white text-xs flex items-center justify-center font-bold">✓</span>
                          <span>Po uzavření investice obdržíte provizi <strong>{formatCurrency(ticket.commissionAmount)} Kč</strong></span>
                        </li>
                      </ol>
                    ) : (
                      <ol className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">1</span>
                          <span>Podepsaná smlouva bude zkontrolována (obvykle do 24 hodin)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">2</span>
                          <span>Po kontrole vás budeme informovat a rezervace bude potvrzena</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#215EF8] text-white text-xs flex items-center justify-center font-bold">3</span>
                          <span>Můžete kontaktovat investora a zahájit vyjednávání</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#14AE6B] text-white text-xs flex items-center justify-center font-bold">✓</span>
                          <span>Po uzavření investice obdržíte provizi <strong>{formatCurrency(ticket.commissionAmount)} Kč</strong></span>
                        </li>
                      </ol>
                    )}
                  </div>

                  {/* Navigation options */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (onNavigateToReservations) {
                          onNavigateToReservations();
                        }
                        onComplete();
                      }}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold">Přejít na rezervaci</div>
                          <div className="text-xs text-blue-100">Sledujte stav a komunikaci</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Další možnosti:</p>
                      <div className="space-y-2">
                        <button
                          onClick={onBack}
                          className="w-full py-2.5 px-4 rounded-lg text-gray-600 text-sm hover:bg-gray-50 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>Zpět na tikety</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                          onClick={() => {
                            // Create another reservation
                            window.location.reload();
                          }}
                          className="w-full py-2.5 px-4 rounded-lg text-gray-600 text-sm hover:bg-gray-50 transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4 text-gray-400" />
                            <span>Vytvořit další rezervaci</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Summary sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Přehled rezervace</h3>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <img
                    src={ticket.projectImage}
                    alt={ticket.projectName}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  {/* Context-aware status badge - only show after investor selection and during signing/waiting phases */}
                  {selectedInvestor && ['signature-method', 'electronic-prepare', 'electronic-sending', 'physical-info', 'physical-download', 'upload-document', 'document-uploaded', 'final-summary', 'reservation-complete'].includes(currentStep) && (() => {
                    const status = getReservationStatus();
                    const statusConfig = getStatusConfig(status);
                    return (
                      <>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg group relative">
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-xs font-semibold text-amber-900">
                            {statusConfig.badge}
                          </span>
                          <div className="relative">
                            <Info className="w-3.5 h-3.5 text-amber-600 cursor-help" />
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block w-64 z-50">
                              <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl">
                                {statusConfig.tooltip}
                                <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {!statusConfig.userActionRequired && (
                          <p className="text-xs text-gray-500 mt-2">
                            Aktuálně není vyžadována žádná akce z vaší strany.
                          </p>
                        )}
                      </>
                    );
                  })()}
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Projekt</p>
                  <h4 className="font-bold text-gray-900 mb-1">{ticket.projectName}</h4>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{ticket.location}</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Výše investice:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(ticket.investmentAmount)} Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Typ:</span>
                    <span className="font-semibold text-gray-900">{ticket.investmentType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Výnos:</span>
                    <span className="font-bold text-[#14AE6B] text-base">{ticket.yieldPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doba:</span>
                    <span className="font-semibold text-gray-900">{ticket.duration}</span>
                  </div>
                </div>

                {selectedInvestor && (
                  <>
                    <div className="h-px bg-gray-200" />
                    
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Investor rezervace</p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#215EF8] to-[#1B4FD1] flex items-center justify-center text-white font-bold">
                          {selectedInvestor.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{selectedInvestor.name}</p>
                          <p className="text-xs text-gray-600">{selectedInvestor.type}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="h-px bg-gray-200" />

                {/* Context-aware commission display - calmer during signing steps */}
                {['signature-method', 'electronic-prepare', 'electronic-sending', 'physical-info', 'physical-download', 'upload-document', 'document-uploaded', 'final-summary', 'reservation-complete'].includes(currentStep) ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Vaše provize</p>
                    <p className="text-xl font-bold text-gray-700">{formatCurrency(ticket.commissionAmount)} Kč</p>
                    <p className="text-xs text-gray-500 mt-2">Vyplaceno po úspěšném uzavření investice</p>
                  </div>
                ) : (
                  <div className="bg-white border border-green-200 rounded-xl p-4">
                    <p className="text-xs text-gray-600 mb-1">Vaše provize</p>
                    <p className="text-2xl font-bold text-[#14AE6B]">{formatCurrency(ticket.commissionAmount)} Kč</p>
                    <p className="text-xs text-gray-600 mt-2">Vyplaceno po úspěšném uzavření investice</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
