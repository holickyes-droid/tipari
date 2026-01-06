/**
 * RESERVATION FLOW - COMPLETE USER FLOW
 * 
 * Step-by-step reservation process from investor selection to signature
 * Rendered inline within the same modal as tickets
 */

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Clock, TrendingUp, FileText, ArrowRight, ArrowLeft, Upload, Shield, Info, Users, Plus, Search, Edit2, Download } from 'lucide-react';
import { Button } from './ui/button';
import { SLACountdown } from './SLACountdown';
import { Ticket } from '../types/project';
import { ProgressStepper } from './ProgressStepper';
import { ContractPreviewModal } from './ContractPreviewModal';
import { CloseReservationConfirmation } from './CloseReservationConfirmation';
import { toast } from 'sonner';

// ––––––––––––––––––––
// TYPE DEFINITIONS
// ––––––––––––––––––––

type SignatureMethod = 'electronic' | 'physical' | null;

type FlowStep = 
  | 'investor-selection'           // Krok 1: Výběr investora
  | 'summary'                       // Krok 2: Shrnutí rezervace
  | 'signature-method'              // Krok 3: Výběr způsobu podpisu
  | 'waiting-electronic'            // Krok 4A: Čeká na elektronický podpis
  | 'electronic-signed'             // Krok 5A: Investor podepsal elektronicky
  | 'waiting-physical-upload'       // Krok 4B: Čeká na nahrání fyzického podpisu
  | 'upload-document'               // Krok 5B: Formulář pro nahrání dokumentu
  | 'document-uploaded'             // Krok 6B: Dokument nahrán
  | 'physical-confirmed'            // Krok 7B: Fyzický podpis potvrzen
  | 'reservation-pending';          // Společný: Čeká na developera

interface Investor {
  id: string;
  name: string;
  initials: string;
  type: 'Privátní investor' | 'Family office' | 'Investiční skupina' | 'Právnická osoba';
  email: string;
  phone: string;
  portfolioValue: number;
  activeInvestments: number;
  preferredAmount: number;
  preferredYield: number;
}

interface UploadedDocument {
  fileName: string;
  uploadedAt: number;
  fileSize: number;
}

interface ReservationData {
  reservationNumber: string;
  createdAt: number;
  expiresAt: number;
  signatureMethod: SignatureMethod;
  investor: Investor;
  uploadedDocument?: UploadedDocument;
}

export interface ReservationFlowProps {
  isOpen?: boolean;
  ticket: Ticket | null;
  projectName: string;
  projectId?: string;
  onClose: () => void;
  onBack?: () => void;
  onSaveDraft?: (draft: {
    id: string;
    ticket: Ticket;
    projectName: string;
    investorName?: string;
    currentStep: string;
    signatureMethod?: 'electronic' | 'physical';
    customEmail?: string;
    savedAt: Date;
  }) => void;
}

// ––––––––––––––––––––
// MAIN COMPONENT
// ––––––––––––––––––––

export function ReservationFlow({ isOpen = true, ticket, projectName, projectId, onClose, onBack, onSaveDraft }: ReservationFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('investor-selection');
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<SignatureMethod>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [showNewInvestorForm, setShowNewInvestorForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [contractSentAt, setContractSentAt] = useState<Date | null>(null);
  const [newInvestorData, setNewInvestorData] = useState({
    name: '',
    type: 'Privátní investor' as string,
    email: '',
    phone: ''
  });
  
  // Mock CRM investors data
  const [crmInvestors, setCrmInvestors] = useState<Investor[]>([
    {
      id: '1',
      name: 'Petr Novák',
      initials: 'PN',
      type: 'Fyzická osoba',
      email: 'petr.novak@email.cz',
      phone: '+420 603 123 456',
      portfolioValue: 15000000,
      activeInvestments: 3,
      preferredAmount: 5000000,
      preferredYield: 6.5,
    },
    {
      id: '2',
      name: 'Jana Novotná',
      initials: 'JN',
      type: 'Fyzická osoba',
      email: 'jana.novotna@email.cz',
      phone: '+420 608 234 567',
      portfolioValue: 50000000,
      activeInvestments: 8,
      preferredAmount: 10000000,
      preferredYield: 5.5,
    },
    {
      id: '3',
      name: 'Martin Král',
      initials: 'MK',
      type: 'Fyzická osoba',
      email: 'martin.kral@email.cz',
      phone: '+420 777 345 678',
      portfolioValue: 80000000,
      activeInvestments: 12,
      preferredAmount: 8000000,
      preferredYield: 5.0,
    },
    {
      id: '4',
      name: 'Marie Svobodová',
      initials: 'MS',
      type: 'Právnická osoba',
      email: 'marie.svobodova@email.cz',
      phone: '+420 724 456 789',
      portfolioValue: 25000000,
      activeInvestments: 5,
      preferredAmount: 6000000,
      preferredYield: 6.0,
    },
  ]);

  if (!isOpen) return null;
  if (!ticket) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' Kč';
  };

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} mil. Kč`;
    }
    return formatCurrency(amount);
  };

  const filteredInvestors = crmInvestors.filter(inv =>
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigation handlers
  const handleSelectInvestor = (investor: Investor) => {
    setSelectedInvestor(investor);
  };

  const handleContinueToSummary = () => {
    if (!selectedInvestor || !ticket) return;
    
    // Save draft
    if (onSaveDraft) {
      const draft = {
        id: `draft-${Date.now()}`,
        ticket: ticket,
        projectName: projectName,
        investorName: selectedInvestor.name,
        currentStep: 'summary',
        savedAt: new Date(),
      };
      onSaveDraft(draft);
      
      // Show toast notification
      toast.success('Rezervace uložena', {
        description: `Rozpracovaná rezervace pro ${selectedInvestor.name} byla automaticky uložena.`,
        duration: 4000,
      });
    }
    
    setCurrentStep('summary');
  };

  const handleContinueToSignature = () => {
    setCurrentStep('signature-method');
  };

  const handleSignatureMethodSelected = () => {
    if (!selectedSignature) return;
    
    if (selectedSignature === 'electronic') {
      // Validate email is provided
      const emailToUse = customEmail || selectedInvestor?.email;
      if (!emailToUse) {
        alert('Prosím zadejte email investora pro zaslání smlouvy');
        return;
      }
      
      // Store the email used for contract
      setContractSentAt(new Date());
      
      setCurrentStep('waiting-electronic');
      // Simulate electronic signing after 3 seconds
      setTimeout(() => {
        setCurrentStep('electronic-signed');
        createReservation();
      }, 3000);
    } else {
      // For physical signature, generate PDF contract
      setCurrentStep('waiting-physical-upload');
    }
  };

  const createReservation = () => {
    if (!selectedInvestor || !selectedSignature) return;
    
    const now = Math.floor(Date.now() / 1000);
    setReservation({
      reservationNumber: `R-${Math.floor(Math.random() * 10000)}`,
      createdAt: now,
      expiresAt: now + (48 * 60 * 60),
      signatureMethod: selectedSignature,
      investor: selectedInvestor,
      uploadedDocument: uploadedDoc || undefined,
    });
  };

  const handleUploadDocument = () => {
    setCurrentStep('upload-document');
  };

  const handleDocumentUploaded = () => {
    // Mock upload
    const doc: UploadedDocument = {
      fileName: 'rezervacni_smlouva_podepsana.pdf',
      uploadedAt: Math.floor(Date.now() / 1000),
      fileSize: 245632,
    };
    setUploadedDoc(doc);
    setCurrentStep('document-uploaded');
  };

  const handleConfirmPhysicalSignature = () => {
    createReservation();
    setCurrentStep('physical-confirmed');
  };

  const handleContinueToPending = () => {
    setCurrentStep('reservation-pending');
  };

  const handleBack = () => {
    if (currentStep === 'summary') {
      setCurrentStep('investor-selection');
    } else if (currentStep === 'signature-method') {
      setCurrentStep('summary');
    } else if (currentStep === 'waiting-physical-upload') {
      setCurrentStep('signature-method');
    } else if (currentStep === 'upload-document') {
      setCurrentStep('waiting-physical-upload');
    } else if (currentStep === 'document-uploaded') {
      setCurrentStep('waiting-physical-upload');
    } else if (currentStep === 'waiting-electronic') {
      setCurrentStep('signature-method');
    }
  };

  // Save draft and close handlers
  const handleSaveAndClose = () => {
    // Save draft if investor is selected or any progress made
    if (selectedInvestor && onSaveDraft && ticket) {
      const draft = {
        id: `draft-${Date.now()}`,
        ticket: ticket,
        projectName: projectName,
        investorName: selectedInvestor.name,
        currentStep: currentStep,
        signatureMethod: selectedSignature || undefined,
        customEmail: customEmail || undefined,
        savedAt: new Date(),
      };
      onSaveDraft(draft);
      
      // Show toast notification
      toast.success('Rezervace uložena', {
        description: `Můžete v ní pokračovat později ze správy rezervací.`,
        duration: 4000,
      });
    }
    onClose();
  };

  const handleCloseClick = () => {
    // If investor selected, show confirmation
    if (selectedInvestor) {
      setShowCloseConfirmation(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowCloseConfirmation(false);
    handleSaveAndClose();
  };

  const handleCancelClose = () => {
    setShowCloseConfirmation(false);
  };

  // Mock PDF generation and download
  const handleDownloadContract = () => {
    if (!selectedInvestor || !ticket) return;
    
    // Create mock PDF content
    const pdfContent = `
REZERVAČNÍ SMLOUVA

Projekt: ${projectName}
Tiket: ${ticket.ticketNumber}
Výše investice: ${formatCurrency(ticket.investmentAmount)}
Investor: ${selectedInvestor.name}
Typ investora: ${selectedInvestor.type}

Datum vytvoření: ${new Date().toLocaleDateString('cs-CZ')}
    `.trim();
    
    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rezervacni_smlouva_${ticket.ticketNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle resend contract with email selection
  const handleResendContract = () => {
    const emailToUse = customEmail || selectedInvestor?.email;
    if (!emailToUse) return;
    
    // Mock: Send contract to email
    setContractSentAt(new Date());
    setShowEmailChangeForm(false);
    
    // Show success message (in real app, handle API call)
    alert(`Smlouva byla odeslána na email: ${emailToUse}`);
  };

  // Generate contract content for preview
  const getContractContent = () => {
    if (!selectedInvestor || !ticket) return '';
    
    return `REZERVAČNÍ SMLOUVA
č. ${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}

uzavřená níže uvedeného dne, měsíce a roku mezi:

1. INVESTOR
Jméno/Název: ${selectedInvestor.name}
Typ: ${selectedInvestor.type}
Email: ${selectedInvestor.email}
Telefon: ${selectedInvestor.phone}

2. TIPAŘ
(vaše údaje)

3. PŘEDMĚT SMLOUVY
Projekt: ${projectName}
Investiční tiket: ${ticket.ticketNumber}
Výše rezervované investice: ${formatCurrency(ticket.investmentAmount)}
Forma investice: ${ticket.investmentForm || 'Zápůjčka'}
Roční výnos: ${ticket.yieldPA}% p.a.
Doba trvání: ${ticket.duration} měsíců

4. PRÁVA A POVINNOSTI
Rezervace je nezávazná a časově omezená.
Nejde o investiční smlouvu.

Datum vytvoření: ${new Date().toLocaleDateString('cs-CZ')}
    `;
  };

  // Ticket Summary Component - zobrazí se na začátku každého kroku
  const TicketSummary = () => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#215EF8]/20 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#215EF8] flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
            Rezervace tiketu
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-[#6B7280] mb-0.5">Projekt</div>
              <div className="text-sm font-bold text-[#040F2A]">{projectName}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-0.5">Tiket</div>
              <div className="text-sm font-bold text-[#040F2A]">{ticket.ticketNumber}</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-0.5">Výše investice</div>
              <div className="text-sm font-bold text-[#215EF8]">{formatCurrencyCompact(ticket.investmentAmount)}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-2 pt-2 border-t border-[#215EF8]/10">
            <div>
              <div className="text-xs text-[#6B7280] mb-0.5">Výnos p.a.</div>
              <div className="text-sm font-bold text-[#14AE6B]">{ticket.yieldPA}%</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-0.5">Doba trvání</div>
              <div className="text-sm font-bold text-[#040F2A]">{ticket.duration} měs.</div>
            </div>
            <div>
              <div className="text-xs text-[#6B7280] mb-0.5">Vaše provize</div>
              <div className="text-sm font-bold text-amber-700">{formatCurrency((ticket.investmentAmount * ticket.commission) / 100)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // ====================================================
  // Wrapper helper to add confirmation dialog to all returns
  const withConfirmationDialog = (content: React.ReactNode) => {
    return (
      <>
        {/* Modal Overlay and Container */}
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseClick}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseClick}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>

            {/* Content with padding */}
            <div className="flex-1 overflow-y-auto p-8">
              {content}
            </div>
          </div>
        </div>

        <CloseReservationConfirmation
          isOpen={showCloseConfirmation}
          investorName={selectedInvestor?.name}
          ticketNumber={ticket?.ticketNumber}
          onConfirm={handleConfirmClose}
          onCancel={handleCancelClose}
        />
      </>
    );
  };

  // KROK 1 – VÝBĚR INVESTORA (CRM)
  // ====================================================

  if (currentStep === 'investor-selection') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} signatureMethod={selectedSignature} />
        
        {/* Ticket Summary - zobrazí parametry tiketu */}
        <TicketSummary />
        
        {/* Header */}
        <div className="relative border-b border-gray-200 pb-3 mb-4">
          <button
            onClick={onBack || handleCloseClick}
            className="absolute top-0 left-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-3 pl-10">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#040F2A] mb-0.5">
                Vyberte investora
              </h2>
              <p className="text-xs text-[#6B7280]">
                Vyberte investora, kterému bude zaslána rezervační smlouva
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Vyhledat investora"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8] focus:border-transparent"
            />
          </div>

          {/* Add new investor button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewInvestorForm(!showNewInvestorForm)}
              className="border-[#215EF8] text-[#215EF8] hover:bg-[#215EF8] hover:text-white text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Přidat nového investora
            </Button>
          </div>

          {/* New investor form */}
          {showNewInvestorForm && (
            <div className="bg-white border-2 border-[#215EF8] rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#040F2A]">Nový investor</h3>
                <button
                  onClick={() => setShowNewInvestorForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Jméno a příjmení / Název *</label>
                  <input 
                    type="text"
                    value={newInvestorData.name}
                    onChange={(e) => setNewInvestorData({...newInvestorData, name: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#215EF8]"
                    placeholder="Jan Novák"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Typ investora *</label>
                  <select 
                    value={newInvestorData.type}
                    onChange={(e) => setNewInvestorData({...newInvestorData, type: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#215EF8]"
                  >
                    <option>Privátní investor</option>
                    <option>Family office</option>
                    <option>Investiční skupina</option>
                    <option>Právnická osoba</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Email *</label>
                  <input 
                    type="email"
                    value={newInvestorData.email}
                    onChange={(e) => setNewInvestorData({...newInvestorData, email: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#215EF8]"
                    placeholder="jan.novak@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B7280] mb-1 block">Telefon *</label>
                  <input 
                    type="tel"
                    value={newInvestorData.phone}
                    onChange={(e) => setNewInvestorData({...newInvestorData, phone: e.target.value})}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#215EF8]"
                    placeholder="+420 123 456 789"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNewInvestorForm(false);
                    setNewInvestorData({ name: '', type: 'Privátní investor', email: '', phone: '' });
                  }}
                  className="text-xs"
                >
                  Zrušit
                </Button>
                <Button
                  size="sm"
                  disabled={!newInvestorData.name || !newInvestorData.email || !newInvestorData.phone}
                  className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white text-xs disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => {
                    // Create new investor
                    const getInitials = (name: string) => {
                      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                    };
                    
                    const newInvestor: Investor = {
                      id: `new-${Date.now()}`,
                      name: newInvestorData.name,
                      initials: getInitials(newInvestorData.name),
                      type: newInvestorData.type,
                      email: newInvestorData.email,
                      phone: newInvestorData.phone,
                      portfolioValue: 0,
                      activeInvestments: 0,
                      preferredAmount: 0,
                      preferredYield: 0,
                    };
                    
                    // Add to CRM investors list
                    setCrmInvestors([newInvestor, ...crmInvestors]);
                    
                    // Auto-select the new investor
                    setSelectedInvestor(newInvestor);
                    
                    // Clear form and close
                    setNewInvestorData({ name: '', type: 'Privátní investor', email: '', phone: '' });
                    setShowNewInvestorForm(false);
                    
                    // Show success notification
                    alert(`Investor ${newInvestor.name} byl úspěšně přidán a vybrán!`);
                  }}
                >
                  Přidat investora
                </Button>
              </div>
            </div>
          )}

          {/* Investor list */}
          <div className="space-y-2">
            {filteredInvestors.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#6B7280]">
                Žádný investor nenalezen
              </div>
            ) : (
              filteredInvestors.map(investor => (
                <div
                  key={investor.id}
                  className={`w-full p-4 rounded-lg border transition-all ${
                    selectedInvestor?.id === investor.id
                      ? 'border-[#215EF8] bg-[#215EF8]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{investor.initials}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-bold text-[#040F2A]">
                          {investor.name}
                        </div>
                        {selectedInvestor?.id === investor.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#215EF8]" />
                        )}
                      </div>
                      <div className="text-xs text-[#6B7280]">{investor.type}</div>
                    </div>

                    <Button
                      size="sm"
                      variant={selectedInvestor?.id === investor.id ? "default" : "outline"}
                      className={selectedInvestor?.id === investor.id 
                        ? "bg-[#215EF8] hover:bg-[#1a4bc7] text-white text-xs"
                        : "text-xs"
                      }
                      onClick={() => handleSelectInvestor(investor)}
                    >
                      {selectedInvestor?.id === investor.id ? 'Vybráno' : 'Vybrat'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info when no investor selected */}
          {!selectedInvestor && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs text-amber-900">
                <strong>Pro pokračování vyberte investora</strong>, kterému bude zaslána rezervační smlouva.
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            onClick={onBack || handleCloseClick}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Zrušit
          </Button>
          <Button
            onClick={handleContinueToSummary}
            disabled={!selectedInvestor}
            className={`${
              selectedInvestor
                ? 'bg-[#215EF8] hover:bg-[#1a4bc7] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Pokračovat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ====================================================
  // KROK 2 – SHRNUTÍ REZERVACE
  // ====================================================

  if (currentStep === 'summary') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} signatureMethod={selectedSignature} />
        
        {/* Header */}
        <div className="relative border-b border-gray-200 pb-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#14AE6B] to-[#0d8f56] flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#040F2A] mb-0.5">
                Shrnutí rezervace
              </h2>
              <p className="text-xs text-[#6B7280]">
                Zkontrolujte detaily před pokračováním k podpisu
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Investor section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                Investor
              </div>
              <button
                onClick={() => setCurrentStep('investor-selection')}
                className="flex items-center gap-1 text-xs text-[#215EF8] hover:text-[#1a4bc7]"
              >
                <Edit2 className="w-3 h-3" />
                Změnit
              </button>
            </div>
            
            {selectedInvestor && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{selectedInvestor.initials}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#040F2A] mb-0.5">
                      {selectedInvestor.name}
                    </div>
                    <div className="text-xs text-[#6B7280]">{selectedInvestor.type}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Project and ticket section */}
          <div>
            <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">
              Projekt a tiket
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">Název projektu</div>
                  <div className="text-base font-semibold text-[#040F2A]">
                    {projectName || 'Rezidence Nová Vinohrady'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">Název / ID tiketu</div>
                    <div className="text-sm font-semibold text-[#040F2A]">{ticket.ticketNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1">Typ</div>
                    <div className="text-sm font-semibold text-[#040F2A]">{ticket.investmentForm || 'Zápůjčka'}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="text-xs text-[#6B7280] mb-1">Rezervovaný objem / slot</div>
                  <div className="text-lg font-bold text-[#040F2A]">
                    {formatCurrencyCompact(ticket.investmentAmount)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#215EF8] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#6B7280]">
                <strong className="text-[#040F2A]">Rezervujete kapacitu pro konkrétního investora.</strong>
                <br />
                Rezervace je nezávazná a časově omezená.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět
          </Button>
          <Button
            onClick={handleContinueToSignature}
            className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            Pokračovat k podpisu
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ====================================================
  // KROK 3 – VÝBĚR ZPŮSOBU PODPISU
  // ====================================================

  if (currentStep === 'signature-method') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Progress Stepper */}
        <ProgressStepper currentStep={currentStep} signatureMethod={selectedSignature} />
        
        {/* Header */}
        <div className="relative border-b border-gray-200 pb-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#040F2A] mb-0.5">
                Způsob podpisu rezervační smlouvy
              </h2>
              <p className="text-xs text-[#6B7280]">
                Vyberte způsob podpisu smlouvy investorem
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Explanation */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong>Rezervační smlouva formálně potvrzuje rezervaci kapacity.</strong>
                <br />
                Nejde o investiční smlouvu.
              </div>
            </div>
          </div>

          {/* Signature method selection */}
          <div>
            <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
              Vyberte způsob podpisu (povinné)
            </div>

            <div className="space-y-2">
              {/* Electronic signature */}
              <button
                onClick={() => setSelectedSignature('electronic')}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedSignature === 'electronic'
                    ? 'border-[#215EF8] bg-[#215EF8]/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" 
                       style={{
                         borderColor: selectedSignature === 'electronic' ? '#215EF8' : '#D1D5DB',
                         backgroundColor: selectedSignature === 'electronic' ? '#215EF8' : 'transparent'
                       }}>
                    {selectedSignature === 'electronic' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#040F2A] mb-1">
                      Elektronický podpis
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      Smlouva bude odeslána investorovi k elektronickému podpisu.
                    </div>
                  </div>
                </div>
              </button>
              
              {/* Email input for electronic signature */}
              {selectedSignature === 'electronic' && (
                <div className="ml-6 bg-white border border-[#215EF8] rounded-lg p-3">
                  <label className="text-xs font-semibold text-[#040F2A] mb-1 block">
                    Email investora *
                  </label>
                  <input
                    type="email"
                    value={customEmail || selectedInvestor?.email || ''}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="investor@example.com"
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#215EF8]"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Smlouva bude odeslána na tento email k podpisu
                  </p>
                </div>
              )}

              {/* Physical signature */}
              <button
                onClick={() => setSelectedSignature('physical')}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedSignature === 'physical'
                    ? 'border-[#215EF8] bg-[#215EF8]/5'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                       style={{
                         borderColor: selectedSignature === 'physical' ? '#215EF8' : '#D1D5DB',
                         backgroundColor: selectedSignature === 'physical' ? '#215EF8' : 'transparent'
                       }}>
                    {selectedSignature === 'physical' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-[#040F2A] mb-1">
                      Fyzický podpis
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      Investor podepíše smlouvu fyzicky. Nahrajete dokument do 24 hodin.
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět
          </Button>
          <Button
            onClick={handleSignatureMethodSelected}
            disabled={!selectedSignature || (selectedSignature === 'electronic' && !(customEmail || selectedInvestor?.email))}
            className={`${
              selectedSignature && (selectedSignature !== 'electronic' || customEmail || selectedInvestor?.email)
                ? 'bg-[#215EF8] hover:bg-[#1a4bc7] text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Pokračovat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ====================================================
  // VARIANTA A – ELEKTRONICKÝ PODPIS
  // ====================================================

  // KROK 4A – ČEKÁ SE NA PODPIS INVESTORA
  if (currentStep === 'waiting-electronic') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] flex items-center justify-center mx-auto animate-pulse">
            <Clock className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-[#040F2A] mb-2">
              Čeká se na podpis investora
            </h2>
            <p className="text-sm text-[#6B7280]">
              Rezervační smlouva byla odeslána investorovi k elektronickému podpisu.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs font-semibold text-[#040F2A] mb-1">Stav smlouvy</div>
            <div className="text-sm text-[#6B7280]">Čeká na podpis</div>
          </div>

          <Button
            variant="outline"
            className="w-full"
          >
            Zobrazit smlouvu
          </Button>
        </div>
      </div>
    );
  }

  // KROK 5A – INVESTOR PODEPSAL
  if (currentStep === 'electronic-signed') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Success header */}
        <div className="border-b border-gray-200 pb-4 mb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14AE6B] to-[#0d8f56] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-bold text-[#040F2A] mb-2">
            Smlouva podepsána investorem
          </h2>
          <p className="text-sm text-[#6B7280]">
            Investor podepsal rezervační smlouvu.<br />
            Rezervace postupuje do další fáze.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[#6B7280] mb-1">Projekt</div>
                <div className="text-sm font-semibold text-[#040F2A]">{projectName}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-1">Tiket</div>
                <div className="text-sm font-semibold text-[#040F2A]">{ticket.ticketNumber}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-1">Investor</div>
                <div className="text-sm font-semibold text-[#040F2A]">{selectedInvestor?.name}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-1">Způsob podpisu</div>
                <div className="text-sm font-semibold text-[#040F2A]">Elektronický</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-200 mt-4">
          <Button
            onClick={handleContinueToPending}
            className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            Pokračovat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ====================================================
  // VARIANTA B – FYZICKÝ PODPIS
  // ====================================================

  // KROK 4B – ČEKÁ SE NA NAHRÁNÍ SMLOUVY
  if (currentStep === 'waiting-physical-upload') {
    const uploadDeadline = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200 pb-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#040F2A] mb-0.5">
                Nahrajte podepsanou smlouvu
              </h2>
              <p className="text-xs text-[#6B7280]">
                Investor podepsal smlouvu fyzicky
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Upload deadline */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-semibold text-amber-900">
                Nahrajte podepsaný dokument do 24 hodin
              </div>
            </div>
            <div className="pl-6">
              <SLACountdown expiresAt={uploadDeadline} />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-semibold text-[#040F2A] mb-2">
              Postup
            </div>
            <div className="text-xs text-[#6B7280] space-y-1">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#215EF8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">1</span>
                </div>
                <span>Prohlédněte si nebo stáhněte smlouvu</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#215EF8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">2</span>
                </div>
                <span>Investor podepíše vytištěnou smlouvu</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#215EF8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">3</span>
                </div>
                <span>Naskenujte podepsaný dokument</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 rounded-full bg-[#215EF8] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">4</span>
                </div>
                <span>Nahrajte PDF soubor do systému</span>
              </div>
            </div>
          </div>

          {/* Download contract */}
          <div className="bg-white border-2 border-[#215EF8] rounded-lg p-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#215EF8] flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-[#040F2A] mb-1">
                  Rezervační smlouva
                </div>
                <div className="text-xs text-[#6B7280]">
                  Prohlédněte si nebo stáhněte smlouvu k podpisu
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowContractPreview(true)}
                  className="border-[#215EF8] text-[#215EF8] hover:bg-[#215EF8]/5"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Náhled
                </Button>
                <Button
                  onClick={handleDownloadContract}
                  className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Stáhnout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zpět
          </Button>
          <Button
            onClick={handleUploadDocument}
            className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Nahrát podepsanou smlouvu
          </Button>
        </div>
        
        {/* Contract Preview Modal */}
        <ContractPreviewModal
          isOpen={showContractPreview}
          onClose={() => setShowContractPreview(false)}
          onDownload={handleDownloadContract}
          projectName={projectName}
          ticketAmount={ticket.amount}
          investorName={selectedInvestor?.name || 'Investor'}
        />
      </div>
    );
  }

  // KROK 5B – NAHRÁNÍ DOKUMENTU
  if (currentStep === 'upload-document') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200 pb-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] flex items-center justify-center flex-shrink-0">
              <Upload className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#040F2A] mb-0.5">
                Nahrání podepsané smlouvy
              </h2>
              <p className="text-xs text-[#6B7280]">
                Vyberte PDF dokument s podpisem investora
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Upload area - show uploaded state if document exists */}
          {uploadedDoc ? (
            <div className="border-2 border-[#14AE6B] bg-green-50 rounded-lg p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#14AE6B] mx-auto mb-3" />
              <div className="text-sm font-semibold text-[#040F2A] mb-1">
                Dokument nahrán úspěšně
              </div>
              <div className="text-xs text-[#6B7280] mb-2">
                {uploadedDoc.fileName}
              </div>
              <div className="text-xs text-[#6B7280]">
                Velikost: {(uploadedDoc.fileSize / 1024).toFixed(1)} KB
              </div>
            </div>
          ) : (
            <div 
              onClick={handleDocumentUploaded}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#215EF8] transition-colors cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <div className="text-sm font-semibold text-[#040F2A] mb-1">
                Přetáhněte soubor sem nebo klikněte pro výběr
              </div>
              <div className="text-xs text-[#6B7280]">
                Podporované formáty: PDF (max. 10 MB)
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#215EF8] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#6B7280]">
                <strong className="text-[#040F2A]">Nahrajte čitelný PDF dokument</strong> s podpisem investora.
                Ujistěte se, že je dokument čitelný a všechny podpisy jsou viditelné.
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-300 hover:bg-gray-50"
          >
            Zrušit
          </Button>
          {uploadedDoc ? (
            <Button
              onClick={() => {
                createReservation();
                setCurrentStep('document-uploaded');
              }}
              className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Pokračovat
            </Button>
          ) : (
            <Button
              onClick={handleDocumentUploaded}
              className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Nahrát podepsanou smlouvu
            </Button>
          )}
        </div>
      </div>
    );
  }

  // KROK 6B – KONTROLA NAHRANÉ VERZE
  if (currentStep === 'document-uploaded') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200 pb-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#14AE6B] to-[#0d8f56] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-[#040F2A] mb-0.5">
                Podepsaná smlouva nahrána
              </h2>
              <p className="text-xs text-[#6B7280]">
                Zkontrolujte nahraný dokument
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {/* Document info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#6B7280] mb-1">Název souboru</div>
                <div className="text-sm font-semibold text-[#040F2A]">
                  {uploadedDoc?.fileName || 'rezervacni_smlouva_podepsana.pdf'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">Datum a čas nahrání</div>
                  <div className="text-xs font-semibold text-[#040F2A]">
                    {new Date().toLocaleString('cs-CZ')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1">Velikost</div>
                  <div className="text-xs font-semibold text-[#040F2A]">
                    {uploadedDoc ? `${(uploadedDoc.fileSize / 1024).toFixed(0)} KB` : '240 KB'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document preview placeholder */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <div className="text-xs text-[#6B7280]">Náhled dokumentu</div>
          </div>

          {/* Actions on document */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
            >
              Zobrazit dokument
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentStep('upload-document')}
              className="flex-1"
            >
              Nahrát novou verzi
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-200 mt-4">
          <Button
            onClick={handleConfirmPhysicalSignature}
            className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            Potvrdit a pokračovat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // KROK 7B – POTVRZENÍ PODPISU
  if (currentStep === 'physical-confirmed') {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Success header */}
        <div className="border-b border-gray-200 pb-4 mb-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14AE6B] to-[#0d8f56] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-xl font-bold text-[#040F2A] mb-2">
            Smlouva potvrzena
          </h2>
          <p className="text-sm text-[#6B7280]">
            Podepsaná smlouva byla úspěšně uložena.<br />
            Rezervace postupuje do další fáze.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[#6B7280] mb-1">Projekt</div>
                <div className="text-sm font-semibold text-[#040F2A]">{projectName}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-1">Tiket</div>
                <div className="text-sm font-semibold text-[#040F2A]">{ticket.ticketNumber}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-1">Investor</div>
                <div className="text-sm font-semibold text-[#040F2A]">{selectedInvestor?.name}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-1">Způsob podpisu</div>
                <div className="text-sm font-semibold text-[#040F2A]">Fyzický</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center pt-4 border-t border-gray-200 mt-4">
          <Button
            onClick={handleContinueToPending}
            className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            Pokračovat
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // ====================================================
  // SPOLEČNÝ DALŠÍ PROCES – ČEKÁ NA DEVELOPERA
  // ====================================================

  if (currentStep === 'reservation-pending' && reservation) {
    return withConfirmationDialog(
      <div className="w-full h-full flex flex-col">
        {/* Success header */}
        <div className="border-b border-gray-200 pb-3 mb-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#14AE6B] to-[#0d8f56] flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-lg font-bold text-[#040F2A] mb-1">
            Rezervace vytvořena
          </h2>
          <p className="text-sm text-[#6B7280] mb-0.5">
            Rezervace {reservation.reservationNumber} byla úspěšně vytvořena
          </p>
          <p className="text-xs text-[#6B7280]">
            {projectName || 'Rezidence Nová Vinohrady'} · {ticket.ticketNumber}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-2.5">
          {/* Current status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#215EF8] flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-[#040F2A] mb-1">
                  Stav: Čeká na schválení developerem
                </div>
                <div className="text-xs text-[#6B7280] mb-2">
                  Vaše rezervace byla odeslána developerovi k posouzení.
                </div>
                
                {/* SLA */}
                <div className="bg-white rounded-lg p-2 border border-blue-200">
                  <div className="text-xs font-semibold text-[#040F2A] mb-1">
                    SLA odpočet
                  </div>
                  <SLACountdown expiresAt={reservation.expiresAt} />
                  <div className="text-xs text-[#6B7280] mt-1">
                    Developer má 48 hodin na rozhodnutí
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation details */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
              Detail rezervace
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-[#6B7280] mb-0.5">Vybraný investor</div>
                <div className="text-sm font-bold text-[#040F2A]">{reservation.investor.name}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-0.5">Smlouva</div>
                <div className="text-sm font-bold text-[#14AE6B]">Podepsána</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-0.5">Výše investice</div>
                <div className="text-sm font-bold text-[#040F2A]">{formatCurrencyCompact(ticket.investmentAmount)}</div>
              </div>
              <div>
                <div className="text-[#6B7280] mb-0.5">Vaše provize</div>
                <div className="text-sm font-bold text-amber-700">{formatCurrency((ticket.investmentAmount * ticket.commission) / 100)}</div>
              </div>
            </div>
          </div>

          {/* Possible outcomes */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
              Možné výsledky
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#14AE6B]" />
                <span className="text-[#6B7280]"><strong className="text-[#040F2A]">Schváleno</strong> - Developer potvrdil</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[#6B7280]"><strong className="text-[#040F2A]">Zamítnuto</strong> - Developer zamítl</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[#6B7280]"><strong className="text-[#040F2A]">Vypršelo</strong> - SLA čas vypršel</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 mt-3">
          <Button
            variant="outline"
            onClick={handleCloseClick}
            className="flex-1 border-gray-300 hover:bg-gray-50"
          >
            Zavřít
          </Button>
          <Button
            onClick={() => {
              // TODO: Navigate to reservation detail
              console.log('Navigate to reservation:', reservation.reservationNumber);
              onClose();
            }}
            className="flex-1 bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
          >
            Sledovat rezervaci
          </Button>
        </div>
      </div>
    );
  }

  return null;
}