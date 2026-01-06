import { useState } from 'react';
import { X, Info, Building2, User, Mail, Phone, TrendingUp, MapPin, Clock, Shield, Tag, FileText, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import { toast } from 'sonner';

interface AddInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (investor: InvestorFormData) => void;
}

export interface InvestorFormData {
  // Typ investora
  investorType: 'FO' | 'PO';
  
  // Gender
  gender?: 'male' | 'female';  // For FO
  contactPersonGender?: 'male' | 'female';  // For PO contact person
  
  // Identifikace FO
  firstName?: string;
  lastName?: string;
  
  // Identifikace PO
  companyName?: string;
  ico?: string;
  contactPerson?: string;
  
  // Společné
  email: string;
  phone?: string;
  
  // Investiční preference - základní
  investmentVolumeMin?: number;
  investmentVolumeMax?: number;
  expectedYield?: string;
  
  // Investiční preference - rozšířené
  investmentForm?: string[];        // Forma investice
  securityTypes?: string[];         // Zajištění
  interestPayment?: string[];       // Výplata úroků
  profitShareEnabled?: boolean;     // Podíl na zisku - Ano/Ne
  profitSharePercentage?: number;   // Podíl na zisku - 1-100%
  projectTypes?: string[];          // Typ projektu
  locationRegions?: string[];       // Lokalita - Kraje
  locationCities?: string[];        // Lokalita - Města
  decisionSpeed?: string;           // Rychlost rozhodování
  investmentFrequency?: string;     // Frekvence investování
  investorContext?: string;         // Typ investora (kontext)
  
  // Interní CRM
  relationshipStatus?: 'ACTIVE' | 'HISTORICAL';
  internalTags?: string[];
  internalNotes?: string;
}

// Forma investice
const INVESTMENT_FORMS = [
  'Juniorní zápůjčka',
  'Seniorní zápůjčka',
  'Majoritní ekvita',
  'Minoritní ekvita',
  'Prodej projektu',
  'Zpětný leasing',
  'Mezaninové financování',
];

// Zajištění
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

// Výplata úroků
const INTEREST_PAYMENT_OPTIONS = [
  'měsíční',
  'kvartální',
  'pololetní',
  'roční',
  'na konci období',
  'jiné',
];

// Typ projektu
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

// Kraje ČR
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

// Města
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

// Rychlost rozhodování
const DECISION_SPEED_OPTIONS = [
  'okamžitě',
  'do několika dnů',
  'po prostudování podkladů',
  'individuálně',
];

// Frekvence investování
const INVESTMENT_FREQUENCY_OPTIONS = [
  'jednorázově',
  'opakovaně',
  'příležitostně',
];

// Typ investora (kontext)
const INVESTOR_CONTEXT_OPTIONS = [
  'soukromý investor',
  'rodinný kapitál',
  'firma / holding',
  'institucionální',
];

// Předdefinované štítky
const PREDEFINED_TAGS = [
  'VIP',
  'Velkoobjem',
  'Konzervativní',
  'Rizikový profil',
  'Kontaktovat přednostně',
  'Vyžaduje osobní jednání',
];

export function AddInvestorModal({ isOpen, onClose, onSubmit }: AddInvestorModalProps) {
  const [investorType, setInvestorType] = useState<'FO' | 'PO'>('FO');
  const [formData, setFormData] = useState<InvestorFormData>({
    investorType: 'FO',
    email: '',
    relationshipStatus: 'ACTIVE',
    internalTags: [],
    investmentForm: [],
    securityTypes: [],
    interestPayment: [],
    projectTypes: [],
    locationRegions: [],
    locationCities: [],
  });
  const [customTag, setCustomTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showInternalCRM, setShowInternalCRM] = useState(false);

  if (!isOpen) return null;

  const handleInvestorTypeChange = (type: 'FO' | 'PO') => {
    setInvestorType(type);
    setFormData(prev => ({
      ...prev,
      investorType: type,
      // Reset type-specific fields
      firstName: undefined,
      lastName: undefined,
      gender: undefined,
      companyName: undefined,
      ico: undefined,
      contactPerson: undefined,
      contactPersonGender: undefined,
    }));
    setErrors({});
  };

  const handleInputChange = (field: keyof InvestorFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleArrayValue = (field: keyof InvestorFormData, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    handleInputChange(field, newArray);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.internalTags?.includes(tag)) {
      handleInputChange('internalTags', [...(formData.internalTags || []), tag]);
    }
  };

  const removeTag = (tag: string) => {
    handleInputChange('internalTags', formData.internalTags?.filter(t => t !== tag) || []);
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Email validation - POVINNÝ
    if (!formData.email) {
      newErrors.email = 'E-mail je povinný';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neplatný formát e-mailu';
    }

    // Phone validation - POVINNÝ
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefon je povinný pro komunikaci s investorem';
    }

    // Type-specific validation
    if (investorType === 'FO') {
      if (!formData.firstName?.trim()) newErrors.firstName = 'Jméno je povinné';
      if (!formData.lastName?.trim()) newErrors.lastName = 'Příjmení je povinné';
    } else {
      if (!formData.companyName?.trim()) newErrors.companyName = 'Název společnosti je povinný';
      if (!formData.ico?.trim()) {
        newErrors.ico = 'IČO je povinné';
      } else if (!/^\d{8}$/.test(formData.ico.replace(/\s/g, ''))) {
        newErrors.ico = 'IČO musí obsahovat 8 číslic';
      }
      if (!formData.contactPerson?.trim()) newErrors.contactPerson = 'Kontaktní osoba je povinná';
    }

    // Investment volume validation - POVINNÝ MIN a MAX
    if (!formData.investmentVolumeMin) {
      newErrors.investmentVolumeMin = 'Minimální objem investice je povinný';
    }
    if (!formData.investmentVolumeMax) {
      newErrors.investmentVolumeMax = 'Maximální objem investice je povinný';
    }
    if (formData.investmentVolumeMin && formData.investmentVolumeMax) {
      if (formData.investmentVolumeMin > formData.investmentVolumeMax) {
        newErrors.investmentVolumeMax = 'Maximum musí být větší než minimum';
      }
      if (formData.investmentVolumeMin < 100000) {
        newErrors.investmentVolumeMin = 'Minimální objem musí být alespoň 100 000 Kč';
      }
    }

    // Project types validation - POVINNÝ alespoň 1
    if (!formData.projectTypes || formData.projectTypes.length === 0) {
      newErrors.projectTypes = 'Vyberte alespoň jeden typ projektu';
    }

    // Location validation - POVINNÝ alespoň kraj NEBO město
    if ((!formData.locationRegions || formData.locationRegions.length === 0) && 
        (!formData.locationCities || formData.locationCities.length === 0)) {
      newErrors.locationRegions = 'Vyberte alespoň jeden kraj nebo město';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        investorType: 'FO',
        email: '',
        relationshipStatus: 'ACTIVE',
        internalTags: [],
        investmentForm: [],
        securityTypes: [],
        interestPayment: [],
        projectTypes: [],
        locationRegions: [],
        locationCities: [],
      });
      setInvestorType('FO');
      setShowAdvanced(false);
      setShowInternalCRM(false);
      onClose();
      toast.success('Investor byl úspěšně přidán!');
    }
  };

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/\s/g, ''));
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('cs-CZ').format(number);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#040F2A] to-[#0A1A3F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#215EF8]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#215EF8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Přidat nového investora</h2>
              <p className="text-sm text-gray-400">Vyplňte povinné údaje pro správné matching</p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-6">
            
            {/* Legenda - Co je povinné */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Povinná pole pro matching</p>
                  <p className="text-blue-700">
                    Označená pole <span className="text-red-500 font-semibold">*</span> jsou povinná pro správné párování investorů s projekty. Vyplňte je pečlivě.
                  </p>
                </div>
              </div>
            </div>

            {/* SEKCE 1: TYP INVESTORA */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-[#040F2A] uppercase tracking-wide">
                1. Typ investora <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInvestorTypeChange('FO')}
                  className={`px-5 py-4 rounded-xl border-2 transition-all ${
                    investorType === 'FO'
                      ? 'border-[#215EF8] bg-[#215EF8]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      investorType === 'FO' ? 'border-[#215EF8]' : 'border-gray-300'
                    }`}>
                      {investorType === 'FO' && (
                        <div className="w-3 h-3 rounded-full bg-[#215EF8]" />
                      )}
                    </div>
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Fyzická osoba</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInvestorTypeChange('PO')}
                  className={`px-5 py-4 rounded-xl border-2 transition-all ${
                    investorType === 'PO'
                      ? 'border-[#215EF8] bg-[#215EF8]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      investorType === 'PO' ? 'border-[#215EF8]' : 'border-gray-300'
                    }`}>
                      {investorType === 'PO' && (
                        <div className="w-3 h-3 rounded-full bg-[#215EF8]" />
                      )}
                    </div>
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Právnická osoba</span>
                  </div>
                </button>
              </div>
            </div>

            {/* SEKCE 2: IDENTIFIKACE */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#040F2A] uppercase tracking-wide">
                2. Identifikace <span className="text-red-500">*</span>
              </h3>
              
              {/* FO */}
              {investorType === 'FO' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Jméno <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                        placeholder="Jan"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Příjmení <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                        placeholder="Novák"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Oslovení (volitelné)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'male')}
                        className={`px-4 py-2.5 rounded-lg border transition-all ${
                          formData.gender === 'male'
                            ? 'border-[#215EF8] bg-[#215EF8]/5 text-[#215EF8] font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Pan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'female')}
                        className={`px-4 py-2.5 rounded-lg border transition-all ${
                          formData.gender === 'female'
                            ? 'border-[#215EF8] bg-[#215EF8]/5 text-[#215EF8] font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Paní
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Pro automatický výběr avatara</p>
                  </div>
                </div>
              )}

              {/* PO */}
              {investorType === 'PO' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Název společnosti <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.companyName ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                      placeholder="ABC Investment s.r.o."
                    />
                    {errors.companyName && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        IČO <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.ico || ''}
                        onChange={(e) => handleInputChange('ico', e.target.value.replace(/\D/g, ''))}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.ico ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                        placeholder="12345678"
                        maxLength={8}
                      />
                      {errors.ico && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.ico}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Kontaktní osoba <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson || ''}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.contactPerson ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                        placeholder="Jan Novák"
                      />
                      {errors.contactPerson && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.contactPerson}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Oslovení kontaktní osoby (volitelné)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('contactPersonGender', 'male')}
                        className={`px-4 py-2.5 rounded-lg border transition-all ${
                          formData.contactPersonGender === 'male'
                            ? 'border-[#215EF8] bg-[#215EF8]/5 text-[#215EF8] font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Pan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('contactPersonGender', 'female')}
                        className={`px-4 py-2.5 rounded-lg border transition-all ${
                          formData.contactPersonGender === 'female'
                            ? 'border-[#215EF8] bg-[#215EF8]/5 text-[#215EF8] font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Paní
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SEKCE 3: KONTAKT */}
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#040F2A] uppercase tracking-wide">
                3. Kontakt <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    E-mail <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                      placeholder="jan.novak@email.cz"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                      placeholder="+420 123 456 789"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* SEKCE 4: INVESTIČNÍ PREFERENCE - ZÁKLADNÍ (POVINNÉ) */}
            <div className="bg-gradient-to-br from-[#215EF8]/5 to-[#215EF8]/0 rounded-xl p-5 border border-[#215EF8]/20 space-y-4">
              <h3 className="text-sm font-semibold text-[#040F2A] uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#215EF8]" />
                4. Investiční preference <span className="text-red-500">*</span>
              </h3>
              
              {/* Investiční rozsah */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Investiční rozsah <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={formData.investmentVolumeMin ? formatCurrency(formData.investmentVolumeMin.toString()) : ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\s/g, ''));
                        handleInputChange('investmentVolumeMin', isNaN(value) ? undefined : value);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.investmentVolumeMin ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                      placeholder="500 000"
                    />
                    <p className="text-xs text-gray-500">Minimální investice (Kč)</p>
                    {errors.investmentVolumeMin && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.investmentVolumeMin}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={formData.investmentVolumeMax ? formatCurrency(formData.investmentVolumeMax.toString()) : ''}
                      onChange={(e) => {
                        const value = parseInt(e.target.value.replace(/\s/g, ''));
                        handleInputChange('investmentVolumeMax', isNaN(value) ? undefined : value);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.investmentVolumeMax ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all`}
                      placeholder="10 000 000"
                    />
                    <p className="text-xs text-gray-500">Maximální investice (Kč)</p>
                    {errors.investmentVolumeMax && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.investmentVolumeMax}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Typ projektu */}
              <MultiSelectDropdown
                options={PROJECT_TYPES}
                selectedValues={formData.projectTypes || []}
                onChange={(values) => handleInputChange('projectTypes', values)}
                placeholder="Vyberte typ projektu..."
                label="Typ projektu"
                required
                error={errors.projectTypes}
                accentColor="blue"
              />

              {/* Lokalita - Kraje */}
              <MultiSelectDropdown
                options={REGIONS}
                selectedValues={formData.locationRegions || []}
                onChange={(values) => handleInputChange('locationRegions', values)}
                placeholder="Vyberte kraje..."
                label="Lokalita - Kraje"
                required
                error={errors.locationRegions}
                accentColor="amber"
              />

              {/* Lokalita - Města */}
              <MultiSelectDropdown
                options={CITIES}
                selectedValues={formData.locationCities || []}
                onChange={(values) => handleInputChange('locationCities', values)}
                placeholder="Vyberte města..."
                label="Lokalita - Města"
                accentColor="amber"
              />
            </div>

            {/* SEKCE 5: POKROČILÉ PREFERENCE (VOLITELNÉ) */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    5. Pokročilé preference (doporučené)
                  </span>
                </div>
                {showAdvanced ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {showAdvanced && (
                <div className="p-5 space-y-4 bg-white">
                  {/* Očekávaný výnos */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Očekávaný výnos</label>
                    <input
                      type="text"
                      value={formData.expectedYield || ''}
                      onChange={(e) => handleInputChange('expectedYield', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                      placeholder="např. 7-9% p.a."
                    />
                  </div>

                  {/* Forma investice */}
                  <MultiSelectDropdown
                    options={INVESTMENT_FORMS}
                    selectedValues={formData.investmentForm || []}
                    onChange={(values) => handleInputChange('investmentForm', values)}
                    placeholder="Vyberte formu investice..."
                    label="Forma investice"
                    accentColor="blue"
                  />

                  {/* Zajištění */}
                  <MultiSelectDropdown
                    options={SECURITY_TYPES}
                    selectedValues={formData.securityTypes || []}
                    onChange={(values) => handleInputChange('securityTypes', values)}
                    placeholder="Vyberte typ zajištění..."
                    label="Zajištění"
                    accentColor="green"
                  />

                  {/* Výplata úroků */}
                  <MultiSelectDropdown
                    options={INTEREST_PAYMENT_OPTIONS}
                    selectedValues={formData.interestPayment || []}
                    onChange={(values) => handleInputChange('interestPayment', values)}
                    placeholder="Vyberte frekvenci výplaty..."
                    label="Výplata úroků"
                    accentColor="purple"
                  />

                  {/* Podíl na zisku */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Podíl na zisku</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('profitShareEnabled', !formData.profitShareEnabled)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.profitShareEnabled
                            ? 'border-[#14AE6B] bg-[#14AE6B] text-white font-medium'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {formData.profitShareEnabled ? 'Ano' : 'Ne'}
                      </button>
                      {formData.profitShareEnabled && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={formData.profitSharePercentage || ''}
                            onChange={(e) => handleInputChange('profitSharePercentage', parseInt(e.target.value))}
                            className="w-24 px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
                            placeholder="15"
                            min={1}
                            max={100}
                          />
                          <span className="text-sm text-gray-700">%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rychlost rozhodování */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Rychlost rozhodování</label>
                    <div className="grid grid-cols-2 gap-2">
                      {DECISION_SPEED_OPTIONS.map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => handleInputChange('decisionSpeed', formData.decisionSpeed === speed ? undefined : speed)}
                          className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                            formData.decisionSpeed === speed
                              ? 'border-[#215EF8] bg-[#215EF8] text-white font-medium'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frekvence investování */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Frekvence investování</label>
                    <div className="grid grid-cols-3 gap-2">
                      {INVESTMENT_FREQUENCY_OPTIONS.map((frequency) => (
                        <button
                          key={frequency}
                          type="button"
                          onClick={() => handleInputChange('investmentFrequency', formData.investmentFrequency === frequency ? undefined : frequency)}
                          className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                            formData.investmentFrequency === frequency
                              ? 'border-[#215EF8] bg-[#215EF8] text-white font-medium'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {frequency}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typ investora (kontext) */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Typ investora (kontext)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {INVESTOR_CONTEXT_OPTIONS.map((context) => (
                        <button
                          key={context}
                          type="button"
                          onClick={() => handleInputChange('investorContext', formData.investorContext === context ? undefined : context)}
                          className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                            formData.investorContext === context
                              ? 'border-purple-500 bg-purple-500 text-white font-medium'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {context}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SEKCE 6: INTERNÍ CRM (VOLITELNÉ) */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowInternalCRM(!showInternalCRM)}
                className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    6. Interní CRM data (volitelné)
                  </span>
                </div>
                {showInternalCRM ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {showInternalCRM && (
                <div className="p-5 space-y-4 bg-white">
                  {/* Interní štítky */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Interní štítky</label>
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => formData.internalTags?.includes(tag) ? removeTag(tag) : addTag(tag)}
                          className={`px-3 py-1.5 rounded-lg border transition-all text-sm ${
                            formData.internalTags?.includes(tag)
                              ? 'border-[#14AE6B] bg-[#14AE6B] text-white font-medium'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom tag input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all text-sm"
                        placeholder="Vlastní štítek..."
                      />
                      <button
                        type="button"
                        onClick={addCustomTag}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all text-sm font-medium"
                      >
                        Přidat
                      </button>
                    </div>

                    {/* Selected custom tags */}
                    {formData.internalTags && formData.internalTags.filter(t => !PREDEFINED_TAGS.includes(t)).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.internalTags.filter(t => !PREDEFINED_TAGS.includes(t)).map((tag) => (
                          <div
                            key={tag}
                            className="px-3 py-1.5 rounded-lg bg-[#14AE6B] text-white text-sm font-medium flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-red-200 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Interní poznámka */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Interní poznámka</label>
                    <textarea
                      value={formData.internalNotes || ''}
                      onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all resize-none"
                      placeholder="Interní poznámky viditelné pouze pro Tipar..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* GDPR info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-medium mb-1">GDPR & Zpracování osobních údajů</p>
                <p className="text-amber-800">
                  Přidáním investora potvrzujete, že máte jeho souhlas se zpracováním osobních údajů pro účely zprostředkování investic. Tipari.cz není určena pro sběr citlivých údajů.
                </p>
              </div>
            </div>
          </div>

          {/* Footer - Sticky */}
          <div className="px-8 py-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Přidat investora
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}