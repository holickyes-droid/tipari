/**
 * INVESTOR DETAIL COMPONENT
 * Detailed view of investor with investment history and metrics
 * Shows investor profile, active reservations, completed investments
 * Based on Tipari.cz business model
 */

import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, TrendingUp, CheckCircle2, Clock, DollarSign, FileText, Building2, Plus, Download, Edit, Save, X, Target, Shield, Tag } from 'lucide-react';
import { Investor } from '../types/investor';
import { mockReservations } from '../data/mockReservations';
import { mockProjects } from '../data/mockProjects';
import { mockCommissions } from '../data/mockCommissions';
import { useState } from 'react';

// Investment preference constants
const INVESTMENT_FORMS = [
  'Juniorní zápůjčka',
  'Seniorní zápůjčka',
  'Majoritní ekvita',
  'Minoritní ekvita',
  'Prodej projektu',
  'Zpětný leasing',
  'Mezaninové financování',
];

const SECURITY_TYPES = [
  'Zástava 1. pořadí',
  'Zástava 2. pořadí',
  'Zástava k OP, KL, Akcie',
  'Osobní směnka',
  'Firemní směnka',
  'Notářský zápis',
  'Notářský zápis s přímou vykonatelností',
  'Ručitelský závazek',
  'Postoupení pohledávek',
  'Zástava movitých věcí',
  'Zajištění nájmů',
  'Převedení vlastnictví se zpětným odkupem',
  'Zajišťovací blankosměnka',
  'Bez zajištění',
];

const INTEREST_PAYMENT = [
  'měsíční',
  'kvartální',
  'pololetní',
  'roční',
  'na konci období',
  'jiné',
];

const PROJECT_TYPES = [
  'Rezidenční',
  'Logistika',
  'Komerční',
  'Smíšený',
  'Retail',
  'Hotel',
  'Pozemky',
  'Energetika',
  'Ostatní',
];

const REGIONS = [
  'Hlavní město Praha',
  'Jihomoravský kraj',
  'Moravskoslezský kraj',
  'Středočeský kraj',
  'Plzeňský kraj',
  'Ústecký kraj',
  'Jihočeský kraj',
  'Pardubický kraj',
  'Olomoucký kraj',
  'Zlínský kraj',
  'Liberecký kraj',
  'Královéhradecký kraj',
  'Vysočina',
  'Karlovarský kraj',
];

const CITIES = [
  'Praha',
  'Brno',
  'Ostrava',
  'Plzeň',
  'Liberec',
  'Olomouc',
  'Ústí nad Labem',
  'České Budějovice',
  'Hradec Králové',
  'Pardubice',
  'Zlín',
  'Karlovy Vary',
  'Jihlava',
];

const DECISION_SPEED_OPTIONS = [
  'okamžitě',
  'do několika dnů',
  'po prostudování podkladů',
  'individuálně',
];

const INVESTMENT_FREQUENCY_OPTIONS = [
  'jednorázově',
  'opakovaně',
  'příležitostně',
];

const INVESTOR_CONTEXT_OPTIONS = [
  'soukromý investor',
  'rodinný kapitál',
  'firma / holding',
  'institucionální',
];

interface InvestorDetailProps {
  investor: Investor;
  onBack: () => void;
}

export function InvestorDetail({ investor, onBack }: InvestorDetailProps) {
  // Edit mode states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  // Editable data states - common
  const [editedEmail, setEditedEmail] = useState(investor.email);
  const [editedPhone, setEditedPhone] = useState(investor.phone);
  const [editedLocation, setEditedLocation] = useState(investor.location);
  
  // Editable data states - legal entity specific
  const [editedCompanyName, setEditedCompanyName] = useState(investor.companyName || '');
  const [editedIco, setEditedIco] = useState(investor.ico || '');
  const [editedContactPerson, setEditedContactPerson] = useState(investor.contactPerson || '');
  
  // Preferences states
  const [editedInvestmentMin, setEditedInvestmentMin] = useState(
    investor.investmentRange?.min.toString() || ''
  );
  const [editedInvestmentMax, setEditedInvestmentMax] = useState(
    investor.investmentRange?.max.toString() || ''
  );
  const [editedAssetTypes, setEditedAssetTypes] = useState<string[]>(
    investor.preferredAssetTypes || []
  );
  const [editedExpectedYield, setEditedExpectedYield] = useState(
    investor.expectedYield || ''
  );
  
  // Extended preferences states
  const [editedInvestmentForm, setEditedInvestmentForm] = useState<string[]>(
    investor.investmentForm || []
  );
  const [editedSecurityType, setEditedSecurityType] = useState<string[]>(
    investor.securityType || []
  );
  const [editedInterestPayment, setEditedInterestPayment] = useState<string[]>(
    investor.interestPayment || []
  );
  const [editedProfitShareEnabled, setEditedProfitShareEnabled] = useState(
    investor.profitShare?.enabled || false
  );
  const [editedProfitSharePercentage, setEditedProfitSharePercentage] = useState(
    investor.profitShare?.percentage?.toString() || ''
  );
  const [editedProjectType, setEditedProjectType] = useState<string[]>(
    investor.projectType || []
  );
  const [editedLocationRegions, setEditedLocationRegions] = useState<string[]>(
    investor.locationRegions || []
  );
  const [editedLocationCities, setEditedLocationCities] = useState<string[]>(
    investor.locationCities || []
  );
  const [editedDecisionSpeed, setEditedDecisionSpeed] = useState(
    investor.decisionSpeed || ''
  );
  const [editedInvestmentFrequency, setEditedInvestmentFrequency] = useState(
    investor.investmentFrequency || ''
  );
  const [editedInvestorContext, setEditedInvestorContext] = useState(
    investor.investorContext || ''
  );
  
  // Notes state
  const [notes, setNotes] = useState(
    investor.notes || 'Investor má zájem o dlouhodobé projekty s vysokou bezpečností. Preferuje osobní schůzky v Praze.'
  );
  
  // Save handlers
  const handleSaveProfile = () => {
    // TODO: Save to backend/state
    console.log('Saving profile:', { editedEmail, editedPhone, editedLocation });
    setIsEditingProfile(false);
  };
  
  const handleSavePreferences = () => {
    // TODO: Save to backend/state
    console.log('Saving preferences:', {
      investmentMin: editedInvestmentMin,
      investmentMax: editedInvestmentMax,
      assetTypes: editedAssetTypes,
      expectedYield: editedExpectedYield,
    });
    setIsEditingPreferences(false);
  };
  
  const handleSaveNotes = () => {
    // TODO: Save to backend/state
    console.log('Saving notes:', notes);
    setIsEditingNotes(false);
  };
  
  // Cancel handlers
  const handleCancelProfile = () => {
    setEditedEmail(investor.email);
    setEditedPhone(investor.phone);
    setEditedLocation(investor.location);
    setIsEditingProfile(false);
  };
  
  const handleCancelPreferences = () => {
    setEditedInvestmentMin(investor.investmentRange?.min.toString() || '');
    setEditedInvestmentMax(investor.investmentRange?.max.toString() || '');
    setEditedAssetTypes(investor.preferredAssetTypes || []);
    setEditedExpectedYield(investor.expectedYield || '');
    setIsEditingPreferences(false);
  };
  
  const handleCancelNotes = () => {
    setNotes(investor.notes || 'Investor má zájem o dlouhodobé projekty s vysokou bezpečností. Preferuje osobní schůzky v Praze.');
    setIsEditingNotes(false);
  };
  
  // Get all reservations for this investor
  const investorReservations = mockReservations.filter(r => r.investorId === investor.id);

  // Get active reservations (MEETING_CONFIRMED phase)
  const activeReservations = investorReservations.filter(r => r.phase === 'MEETING_CONFIRMED');

  // Get completed investments (SUCCESS phase)
  const completedInvestments = investorReservations.filter(r => r.phase === 'SUCCESS');

  // Get failed reservations
  const failedReservations = investorReservations.filter(r => r.phase === 'NO_DEAL' || r.phase === 'EXPIRED');

  // Calculate total investment volume (completed only)
  const totalInvestmentVolume = completedInvestments.reduce((sum, reservation) => {
    const project = mockProjects.find(p => p.id === reservation.projectId);
    const ticket = project?.tickets.find(t => t.id === reservation.ticketId);
    return sum + (ticket?.investmentAmount || 0);
  }, 0);

  // Calculate potential volume from active reservations
  const potentialVolume = activeReservations.reduce((sum, reservation) => {
    const project = mockProjects.find(p => p.id === reservation.projectId);
    const ticket = project?.tickets.find(t => t.id === reservation.ticketId);
    return sum + (ticket?.investmentAmount || 0);
  }, 0);

  // Calculate average investment
  const averageInvestment = completedInvestments.length > 0 
    ? totalInvestmentVolume / completedInvestments.length 
    : 0;

  // Calculate conversion rate
  const totalRelevantReservations = investorReservations.filter(r => 
    r.phase !== 'WAITING_INVESTOR_SIGNATURE' && 
    r.phase !== 'WAITING_DEVELOPER_DECISION'
  ).length;
  const conversionRate = totalRelevantReservations > 0 
    ? (completedInvestments.length / totalRelevantReservations) * 100 
    : 0;

  // Get commissions earned from this investor
  const investorCommissions = mockCommissions.filter(c => c.investorId === investor.id);
  const totalCommissionsEarned = investorCommissions
    .filter(c => c.status === 'PAID' || c.status === 'EARNED')
    .reduce((sum, c) => sum + c.amount, 0);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Format datetime
  const formatDateTime = (dateStr: string): string => {
    return new Date(dateStr).toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get phase label
  const getPhaseLabel = (phase: string): string => {
    const labels: Record<string, string> = {
      'WAITING_INVESTOR_SIGNATURE': 'Čeká na podpis RA',
      'WAITING_DEVELOPER_DECISION': 'Čeká na developera',
      'WAITING_MEETING_SELECTION': 'Výběr termínu',
      'MEETING_CONFIRMED': 'Schůzka potvrzena',
      'MEETING_COMPLETED': 'Schůzka dokončena',
      'SUCCESS': 'Zafinancováno',
      'NO_DEAL': 'Nedohodnutý',
      'EXPIRED': 'Vypršela',
    };
    return labels[phase] || phase;
  };

  // Get phase color
  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'SUCCESS':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'MEETING_CONFIRMED':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'NO_DEAL':
      case 'EXPIRED':
        return 'text-[#6B7280] bg-gray-100';
      default:
        return 'text-[#040F2A] bg-gray-100';
    }
  };

  // Get project name
  const getProjectName = (projectId: string): string => {
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || 'Neznámý projekt';
  };

  // Get ticket info
  const getTicketInfo = (projectId: string, ticketId: string) => {
    const project = mockProjects.find(p => p.id === projectId);
    const ticket = project?.tickets.find(t => t.id === ticketId);
    return ticket;
  };

  // Calculate days since last activity
  const getLastActivityDays = (): number => {
    if (investorReservations.length === 0) return 0;
    const mostRecent = investorReservations.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
    });
    const now = new Date();
    const lastDate = new Date(mostRecent.createdAt);
    const diff = now.getTime() - lastDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const lastActivityDays = getLastActivityDays();

  // Helper: Toggle array value (for multi-select)
  const toggleArrayValue = <T,>(array: T[], value: T, setter: (arr: T[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  // Export investor data to JSON
  const handleExport = () => {
    const exportData = {
      investor: {
        ...investor,
        reservations: investorReservations,
        stats: {
          totalInvestmentVolume,
          potentialVolume,
          averageInvestment,
          conversionRate,
          totalCommissionsEarned,
        },
      },
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `investor-${investor.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle send email
  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Tipari.cz - Investiční příležitost`);
    const body = encodeURIComponent(`Dobrý den ${investor.name},\n\n`);
    window.location.href = `mailto:${investor.email}?subject=${subject}&body=${body}`;
  };

  // Handle new reservation
  const handleNewReservation = () => {
    // TODO: Open new reservation modal or navigate to reservation flow
    console.log('Opening new reservation flow for investor:', investor.id);
    alert(`Funkce "Nová rezervace" pro investora ${investor.name} bude brzy dostupná. Investor ID: ${investor.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na seznam
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-[#040F2A]">
            {investor.name}
          </h1>
          <p className="text-[#6B7280] mt-1">
            Kompletní profil investora a historie investic
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={handleSendEmail}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Poslat email
          </button>
          <button
            onClick={handleNewReservation}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nová rezervace
          </button>
        </div>
      </div>

      {/* Investor Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-lg p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 opacity-90" />
            <div className="text-sm opacity-90">Celkem investováno</div>
          </div>
          <div className="text-2xl font-semibold mb-1">
            {formatCurrency(totalInvestmentVolume)}
          </div>
          <div className="text-xs opacity-80">
            {completedInvestments.length} úspěšných obchodů
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] rounded-lg p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 opacity-90" />
            <div className="text-sm opacity-90">Aktivní rezervace</div>
          </div>
          <div className="text-2xl font-semibold mb-1">
            {formatCurrency(potentialVolume)}
          </div>
          <div className="text-xs opacity-80">
            {activeReservations.length} běžících rezervací
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#6B7280]" />
            <div className="text-sm text-[#6B7280]">Průměrná investice</div>
          </div>
          <div className="text-2xl font-semibold text-[#040F2A] mb-1">
            {formatCurrency(averageInvestment)}
          </div>
          <div className="text-xs text-[#6B7280]">
            Na jeden obchod
          </div>
        </div>

        <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-[#6B7280]" />
            <div className="text-sm text-[#6B7280]">Vaše provize</div>
          </div>
          <div className="text-2xl font-semibold text-[#040F2A] mb-1">
            {formatCurrency(totalCommissionsEarned)}
          </div>
          <div className="text-xs text-[#6B7280]">
            Z tohoto investora
          </div>
        </div>
      </div>

      {/* Investor Profile Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#215EF8]"/>
            <h2 className="font-semibold text-[#040F2A]">Kontaktní údaje</h2>
          </div>
          {!isEditingProfile ? (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#215EF8] hover:bg-[#215EF8]/5 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Upravit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelProfile}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Zrušit
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-[#215EF8] hover:bg-[#1a4bc7] rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Uložit
              </button>
            </div>
          )}
        </div>
        {!isEditingProfile ? (
          investor.type === 'LEGAL_ENTITY' ? (
            // Legal Entity View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Název společnosti</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.companyName || 'Neuvedeno'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">IČO</div>
                </div>
                <div className="text-sm text-[#040F2A] font-mono">{investor.ico || 'Neuvedeno'}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Kontaktní osoba</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.contactPerson || investor.name}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Email</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.email}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Telefon</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.phone}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Lokalita</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.location}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Přidán do systému</div>
                </div>
                <div className="text-sm text-[#040F2A]">{formatDate(investor.createdAt)}</div>
              </div>
            </div>
          ) : (
            // Individual View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Email</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.email}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Telefon</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.phone}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Lokalita</div>
                </div>
                <div className="text-sm text-[#040F2A]">{investor.location}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs text-[#6B7280]">Přidán do systému</div>
                </div>
                <div className="text-sm text-[#040F2A]">{formatDate(investor.createdAt)}</div>
              </div>
            </div>
          )
        ) : (
          investor.type === 'LEGAL_ENTITY' ? (
            // Legal Entity Edit Mode
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Název společnosti</label>
                <input
                  type="text"
                  value={editedCompanyName}
                  onChange={(e) => setEditedCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                  placeholder="Invest Holding s.r.o."
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">IČO</label>
                <input
                  type="text"
                  value={editedIco}
                  onChange={(e) => setEditedIco(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all font-mono"
                  placeholder="12345678"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Kontaktní osoba</label>
                <input
                  type="text"
                  value={editedContactPerson}
                  onChange={(e) => setEditedContactPerson(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                  placeholder="Jan Dvořák"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Email</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Telefon</label>
                <input
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Lokalita</label>
                <input
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                />
              </div>
            </div>
          ) : (
            // Individual Edit Mode
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Email</label>
                <input
                  type="email"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Telefon</label>
                <input
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Lokalita</label>
                <input
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                />
              </div>
            </div>
          )
        )}
      </div>

      {/* Investor Preferences Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#215EF8]" />
            <h2 className="font-semibold text-[#040F2A]">Investiční preference</h2>
          </div>
          {!isEditingPreferences ? (
            <button
              onClick={() => setIsEditingPreferences(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#215EF8] hover:bg-[#215EF8]/5 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Upravit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelPreferences}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Zrušit
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-[#215EF8] hover:bg-[#1a4bc7] rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Uložit
              </button>
            </div>
          )}
        </div>
        {!isEditingPreferences ? (
          <div className="space-y-4">
            {/* Finanční parametry - Priority info */}
            <div className="bg-gradient-to-br from-[#215EF8]/5 to-[#215EF8]/0 rounded-lg p-4 border border-[#215EF8]/10">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-[#215EF8]" />
                <h3 className="text-xs font-semibold text-[#040F2A] uppercase tracking-wide">Finanční parametry</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-[#6B7280] mb-1.5">Investiční rozsah</div>
                  <div className="text-sm font-medium text-[#040F2A]">
                    {investor.investmentRange ? `${formatCurrency(investor.investmentRange.min)} - ${formatCurrency(investor.investmentRange.max)}` : 'Neuvedeno'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1.5">Očekávaný výnos</div>
                  <div className="text-sm font-medium text-[#040F2A]">{investor.expectedYield || 'Neuvedeno'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1.5">Rychlost rozhodování</div>
                  <div className="text-sm font-medium text-[#040F2A]">{investor.decisionSpeed || 'Neuvedeno'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#6B7280] mb-1.5">Frekvence investování</div>
                  <div className="text-sm font-medium text-[#040F2A]">{investor.investmentFrequency || 'Neuvedeno'}</div>
                </div>
              </div>
            </div>

            {/* Investiční struktura */}
            <div className="bg-gradient-to-br from-[#14AE6B]/5 to-[#14AE6B]/0 rounded-lg p-4 border border-[#14AE6B]/10">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#14AE6B]" />
                <h3 className="text-xs font-semibold text-[#040F2A] uppercase tracking-wide">Investiční struktura</h3>
              </div>
              <div className="space-y-3">
                {/* Forma investice */}
                {investor.investmentForm && investor.investmentForm.length > 0 && (
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1.5 font-medium">Forma investice</div>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.investmentForm.map((form) => (
                        <span key={form} className="px-2.5 py-1 text-xs bg-[#215EF8]/10 text-[#215EF8] rounded-md font-medium">
                          {form}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zajištění */}
                {investor.securityType && investor.securityType.length > 0 && (
                  <div>
                    <div className="text-xs text-[#6B7280] mb-1.5 font-medium">Zajištění</div>
                    <div className="flex flex-wrap gap-1.5">
                      {investor.securityType.map((security) => (
                        <span key={security} className="px-2.5 py-1 text-xs bg-[#14AE6B]/10 text-[#14AE6B] rounded-md font-medium">
                          {security}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Výplata úroků & Podíl na zisku - v gridu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {investor.interestPayment && investor.interestPayment.length > 0 && (
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1.5 font-medium">Výplata úroků</div>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.interestPayment.map((payment) => (
                          <span key={payment} className="px-2.5 py-1 text-xs bg-gray-100 text-[#040F2A] rounded-md font-medium">
                            {payment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {investor.profitShare && (
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1.5 font-medium">Podíl na zisku</div>
                      <div className="text-sm font-medium text-[#040F2A]">
                        {investor.profitShare.enabled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#14AE6B]/10 text-[#14AE6B] rounded-md text-xs font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            {investor.profitShare.percentage ? `${investor.profitShare.percentage}%` : 'Ano'}
                          </span>
                        ) : (
                          <span className="text-xs text-[#6B7280]">Ne</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Projektové preference */}
            {investor.projectType && investor.projectType.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-50/0 rounded-lg p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-semibold text-[#040F2A] uppercase tracking-wide">Typ projektu</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {investor.projectType.map((type) => (
                    <span key={type} className="px-2.5 py-1 text-xs bg-purple-100 text-purple-700 rounded-md font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Geografické preference */}
            {((investor.locationRegions && investor.locationRegions.length > 0) || 
              (investor.locationCities && investor.locationCities.length > 0)) && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-50/0 rounded-lg p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-semibold text-[#040F2A] uppercase tracking-wide">Geografické preference</h3>
                </div>
                <div className="space-y-3">
                  {investor.locationRegions && investor.locationRegions.length > 0 && (
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1.5 font-medium">Kraje</div>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.locationRegions.map((region) => (
                          <span key={region} className="px-2.5 py-1 text-xs bg-amber-100 text-amber-700 rounded-md font-medium">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {investor.locationCities && investor.locationCities.length > 0 && (
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1.5 font-medium">Města</div>
                      <div className="flex flex-wrap gap-1.5">
                        {investor.locationCities.map((city) => (
                          <span key={city} className="px-2.5 py-1 text-xs bg-amber-100 text-amber-700 rounded-md font-medium">
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Kontext investora */}
            {investor.investorContext && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <User className="w-4 h-4 text-[#6B7280]" />
                  <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Typ investora</div>
                </div>
                <div className="text-sm font-medium text-[#040F2A] capitalize">{investor.investorContext}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Minimální investice (Kč)</label>
                <input
                  type="number"
                  value={editedInvestmentMin}
                  onChange={(e) => setEditedInvestmentMin(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="500000"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6B7280] mb-2">Maximální investice (Kč)</label>
                <input
                  type="number"
                  value={editedInvestmentMax}
                  onChange={(e) => setEditedInvestmentMax(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="5000000"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-2">Typy aktiv</label>
              <div className="flex flex-wrap gap-2">
                {['Residential', 'Commercial', 'Industrial', 'Land'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (editedAssetTypes.includes(type)) {
                        setEditedAssetTypes(editedAssetTypes.filter(t => t !== type));
                      } else {
                        setEditedAssetTypes([...editedAssetTypes, type]);
                      }
                    }}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      editedAssetTypes.includes(type)
                        ? 'bg-[#215EF8] text-white'
                        : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#6B7280] mb-2">Očekávaný výnos</label>
              <input
                type="text"
                value={editedExpectedYield}
                onChange={(e) => setEditedExpectedYield(e.target.value)}
                className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                placeholder="8% p.a."
              />
            </div>
          </div>
        )}
      </div>

      {/* Notes Card */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#215EF8]" />
            <h2 className="font-semibold text-[#040F2A]">Poznámky</h2>
          </div>
          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#215EF8] hover:bg-[#215EF8]/5 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Upravit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelNotes}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Zrušit
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-[#215EF8] hover:bg-[#1a4bc7] rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Uložit
              </button>
            </div>
          )}
        </div>
        {!isEditingNotes ? (
          <div className="text-sm text-[#040F2A] whitespace-pre-wrap">
            {notes || 'Žádné poznámky'}
          </div>
        ) : (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] resize-none"
            placeholder="Přidejte poznámky o investorovi..."
          />
        )}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-6">
        <h2 className="font-semibold text-[#040F2A] mb-4">Výkonnostní metriky</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Conversion rate</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {conversionRate.toFixed(1)}%
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              {completedInvestments.length} z {totalRelevantReservations} rezervací
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Celkem rezervací</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {investorReservations.length}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Úspěšných: {completedInvestments.length} • Neúspěšných: {failedReservations.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Poslední aktivita</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {lastActivityDays === 0 ? 'Dnes' : `${lastActivityDays} dní`}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Od poslední rezervace
            </div>
          </div>
          <div>
            <div className="text-sm text-[#6B7280] mb-1">Aktivní pipeline</div>
            <div className="text-xl font-semibold text-[#040F2A]">
              {activeReservations.length}
            </div>
            <div className="text-xs text-[#6B7280] mt-1">
              Rezervací s potvrzenou schůzkou
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Investments Table */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#14AE6B]" />
              <h2 className="font-semibold text-[#040F2A]">Dokončené investice</h2>
            </div>
            <span className="text-xs text-[#6B7280]">{completedInvestments.length} celkem</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            {completedInvestments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Projekt
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                      Částka
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                      Výnos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {completedInvestments.map((reservation) => {
                    const ticket = getTicketInfo(reservation.projectId, reservation.ticketId);
                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium text-[#040F2A] mb-1">
                            {getProjectName(reservation.projectId)}
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            {formatDate(reservation.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-xs font-semibold text-[#040F2A]">
                            {formatCurrency(ticket?.investmentAmount || 0)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-xs font-semibold text-[#14AE6B]">
                            {ticket?.yieldPA.toFixed(1)}%
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            {ticket?.duration}m
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-[#6B7280]">Zatím žádné dokončené investice</p>
              </div>
            )}
          </div>
        </div>

        {/* Active Reservations Table */}
        <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
          <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-semibold text-[#040F2A]">Aktivní rezervace</h2>
            </div>
            <span className="text-xs text-[#6B7280]">{activeReservations.length} běží</span>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            {activeReservations.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                      Projekt
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                      Částka
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-[#6B7280] uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {activeReservations.map((reservation) => {
                    const ticket = getTicketInfo(reservation.projectId, reservation.ticketId);
                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-xs font-medium text-[#040F2A] mb-1">
                            {getProjectName(reservation.projectId)}
                          </div>
                          <div className="text-xs text-[#6B7280]">
                            {formatDate(reservation.createdAt)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="text-xs font-semibold text-[#040F2A]">
                            {formatCurrency(ticket?.investmentAmount || 0)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(reservation.phase)}`}>
                            {getPhaseLabel(reservation.phase)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-[#6B7280]">Momentálně žádné aktivní rezervace</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Reservations History */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#215EF8]" />
            <h2 className="font-semibold text-[#040F2A]">Kompletní historie rezervací</h2>
          </div>
          <span className="text-xs text-[#6B7280]">{investorReservations.length} celkem</span>
        </div>
        <div className="overflow-x-auto">
          {investorReservations.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    Číslo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    Projekt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    Tiket
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">
                    Částka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    Fáze
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {investorReservations.map((reservation) => {
                  const ticket = getTicketInfo(reservation.projectId, reservation.ticketId);
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-[#040F2A]">
                          {reservation.reservationNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#040F2A]">
                          {getProjectName(reservation.projectId)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono text-[#040F2A]">
                          {reservation.ticketId}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm font-semibold text-[#040F2A]">
                          {formatCurrency(ticket?.investmentAmount || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${getPhaseColor(reservation.phase)}`}>
                          {getPhaseLabel(reservation.phase)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-[#6B7280]">
                          {formatDate(reservation.createdAt)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-[#6B7280]">Žádné rezervace pro tohoto investora</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="bg-[#215EF8]/5 border border-[#215EF8]/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-[#215EF8] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-[#040F2A] mb-1">Detail investora</div>
            <div className="text-sm text-[#6B7280]">
              Tento investor je ve vaší databázi. Vidíte kompletní historii jeho rezervací, dokončených investic a výkonnostní metriky. 
              Aktivní rezervace = potvrzená schůzka. Dokončené investice = fáze SUCCESS (zafinancováno).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}