import { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  DollarSign,
  Calendar,
  X,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface NewProjectFormProps {
  onBack: () => void;
  onComplete: () => void;
}

export function NewProjectForm({ onBack, onComplete }: NewProjectFormProps) {
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'mixed'>('residential');
  const [phase, setPhase] = useState<'planning' | 'construction' | 'completion'>('construction');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const [developerName, setDeveloperName] = useState('');
  const [developerEmail, setDeveloperEmail] = useState('');
  const [developerPhone, setDeveloperPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [experience, setExperience] = useState('');
  const [references, setReferences] = useState('');

  const [totalVolume, setTotalVolume] = useState('');
  const [fundingNeeded, setFundingNeeded] = useState('');
  const [currentPhase, setCurrentPhase] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');

  const [tickets, setTickets] = useState<Array<{
    id: string;
    type: 'Ekvita' | 'Zápůjčka' | 'Mezanin';
    amount: string;
    minInvestment: string;
    interestRate: string;
    maturity: string;
    security: '1. pořadí' | '2. pořadí' | 'Bez zajištění';
    profitShare: 'Ano' | 'Ne' | 'Dohodou';
    description: string;
  }>>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 10) {
      toast.error('Maximálně 10 obrázků');
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addTicket = () => {
    if (tickets.length >= 25) {
      toast.error('Maximálně 25 tiketů');
      return;
    }
    setTickets([...tickets, {
      id: `ticket-${Date.now()}`,
      type: 'Zápůjčka',
      amount: '',
      minInvestment: '',
      interestRate: '',
      maturity: '',
      security: '1. pořadí',
      profitShare: 'Ne',
      description: ''
    }]);
  };

  const removeTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
  };

  const updateTicket = (id: string, field: string, value: any) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="py-12 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#14AE6B] to-green-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-[#040F2A] mb-3">Projekt odeslán!</h2>
              <p className="text-gray-600 mb-6">
                Váš projekt <strong>{projectName || 'projekt'}</strong> byl úspěšně odeslán ke schválení
              </p>

              <div className="max-w-2xl mx-auto space-y-4 mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Co se stane dál?</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Administrátor zkontroluje zadané informace</li>
                        <li>Budete kontaktováni pro jednání s developerem</li>
                        <li>Po podpisu provizní smlouvy bude projekt aktivován</li>
                        <li>Tikety se zobrazí v nabídce pro Tipary</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="text-sm text-green-900">
                      <p className="font-semibold mb-1">Notifikace odeslány</p>
                      <p>✉️ Email s potvrzením byl odeslán na váš email</p>
                      <p>🔔 In-app notifikace o změnách statusu aktivována</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onComplete}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all"
              >
                Zpět na aktivity
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showReview) {
    const projectTypeLabels = {
      residential: 'Rezidenční',
      commercial: 'Komerční',
      mixed: 'Smíšený'
    };

    const phaseLabels = {
      planning: 'Plánování',
      construction: 'Výstavba',
      completion: 'Dokončování'
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          {/* Header */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-[#215EF8] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Zpět na úpravy</span>
            </button>
            
            <div>
              <h1 className="text-3xl font-bold text-[#040F2A] mb-2">Shrnutí projektu</h1>
              <p className="text-gray-600">Zkontrolujte všechny informace před odesláním</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Info Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[#215EF8]" />
                Základní informace
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Název projektu</span>
                  <p className="font-semibold text-gray-900">{projectName || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Lokace</span>
                  <p className="font-semibold text-gray-900">{location || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Typ projektu</span>
                  <p className="font-semibold text-gray-900">{projectTypeLabels[projectType]}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Fáze projektu</span>
                  <p className="font-semibold text-gray-900">{phaseLabels[phase]}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Datum dokončení</span>
                  <p className="font-semibold text-gray-900">{deliveryDate || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Obrázky</span>
                  <p className="font-semibold text-gray-900">{images.length} nahrán{images.length === 1 ? '' : images.length < 5 ? 'y' : 'o'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-600 block mb-1">Popis projektu</span>
                  <p className="text-gray-900">{description || '(nevyplněno)'}</p>
                </div>
              </div>
            </div>

            {/* Developer Info Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#215EF8]" />
                Developer
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Název developera</span>
                  <p className="font-semibold text-gray-900">{developerName || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Email</span>
                  <p className="font-semibold text-gray-900">{developerEmail || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Telefon</span>
                  <p className="font-semibold text-gray-900">{developerPhone || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Kontaktní osoba</span>
                  <p className="font-semibold text-gray-900">{contactPerson || '(nevyplněno)'}</p>
                </div>
                {experience && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 block mb-1">Zkušenosti a historie</span>
                    <p className="text-gray-900">{experience}</p>
                  </div>
                )}
                {references && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 block mb-1">Reference</span>
                    <p className="text-gray-900">{references}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Info Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-[#215EF8]" />
                Finance
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Celkový objem projektu</span>
                  <p className="font-semibold text-gray-900">{totalVolume || '(nevyplněno)'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Potřeba financování</span>
                  <p className="font-semibold text-gray-900">{fundingNeeded || '(nevyplněno)'}</p>
                </div>
                {currentPhase && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 block mb-1">Aktuální fáze financování</span>
                    <p className="text-gray-900">{currentPhase}</p>
                  </div>
                )}
                {expectedReturn && (
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 block mb-1">Očekávaný výnos</span>
                    <p className="text-gray-900">{expectedReturn}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tickets Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#215EF8]" />
                Tikety ({tickets.length})
              </h3>
              {tickets.length === 0 ? (
                <p className="text-gray-600">Zatím nebyly přidány žádné tikety</p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket, idx) => (
                    <div key={ticket.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-900">Tiket #{idx + 1}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ticket.type === 'Ekvita' ? 'bg-purple-100 text-purple-800' :
                          ticket.type === 'Zápůjčka' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {ticket.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 block mb-1">Částka</span>
                          <p className="font-semibold text-gray-900">{ticket.amount || '(nevyplněno)'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-1">Min. investice</span>
                          <p className="font-semibold text-gray-900">{ticket.minInvestment || '(nevyplněno)'}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 block mb-1">Zajištění</span>
                          <p className="font-semibold text-gray-900">{ticket.security}</p>
                        </div>
                        {ticket.type === 'Zápůjčka' && ticket.interestRate && (
                          <div>
                            <span className="text-gray-600 block mb-1">Úrok p.a.</span>
                            <p className="font-semibold text-gray-900">{ticket.interestRate}</p>
                          </div>
                        )}
                        {ticket.type === 'Ekvita' && (
                          <div>
                            <span className="text-gray-600 block mb-1">Podíl na zisku</span>
                            <p className="font-semibold text-gray-900">{ticket.profitShare}</p>
                          </div>
                        )}
                        {ticket.maturity && (
                          <div>
                            <span className="text-gray-600 block mb-1">Splatnost</span>
                            <p className="font-semibold text-gray-900">{ticket.maturity}</p>
                          </div>
                        )}
                        {ticket.description && (
                          <div className="col-span-3">
                            <span className="text-gray-600 block mb-1">Popis</span>
                            <p className="text-gray-900">{ticket.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Decision Box */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-900">
                    <p className="font-bold mb-2">Rozhodnutí o dalším kroku</p>
                    <p className="mb-3">Zkontrolovali jste všechny zadané informace. Co chcete udělat?</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li><strong>Zpět na úpravy:</strong> Vrátit se k formuláři a upravit informace</li>
                      <li><strong>Potvrdit odeslání:</strong> Odeslat projekt administrátorovi ke schválení</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReview(false)}
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all select-none"
                >
                  ← Zpět na úpravy
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#14AE6B] to-green-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all select-none"
                >
                  ✓ Potvrdit odeslání
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1600px] mx-auto px-6 py-3">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#215EF8] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Zpět na aktivity</span>
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-[#040F2A] mb-2">Nový projekt</h1>
            <p className="text-gray-600">Vyplňte všechny informace o projektu pro zalistování na platformě</p>
          </div>
        </div>

        {/* Single scrollable form with all sections */}
        <div className="space-y-6">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#215EF8] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-2xl font-bold text-[#040F2A]">Základní informace o projektu</h2>
              </div>
              <p className="text-sm text-gray-600 ml-11">Poskytněte klíčové detaily o projektu</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Název projektu *</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="např. Rezidence Park View"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lokace *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    placeholder="např. Praha 6 - Dejvice"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Typ projektu *</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                >
                  <option value="residential">Rezidenční</option>
                  <option value="commercial">Komerční</option>
                  <option value="mixed">Smíšený</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fáze projektu *</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                >
                  <option value="planning">Plánování</option>
                  <option value="construction">Výstavba</option>
                  <option value="completion">Dokončování</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Předpokládané datum dokončení *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Popis projektu *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="Detailní popis projektu, jeho výhody, umístění, infrastruktura..."
                />
                <p className="text-xs text-gray-500 mt-1">{description.length} znaků</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Obrázky projektu (max 10)</label>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 mb-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={URL.createObjectURL(img)} 
                            alt={`Upload ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">{img.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {images.length < 10 && (
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#215EF8] hover:bg-[#215EF8]/5 transition-all cursor-pointer">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="font-semibold text-gray-900 mb-1">Nahrát obrázky</p>
                      <p className="text-sm text-gray-600">JPG, PNG nebo WEBP, max 5 MB každý</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Developer Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#215EF8] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-2xl font-bold text-[#040F2A]">Informace o developerovi</h2>
              </div>
              <p className="text-sm text-gray-600 ml-11">Kontaktní údaje a reference developera</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Název developera *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={developerName}
                    onChange={(e) => setDeveloperName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    placeholder="např. ABC Development s.r.o."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={developerEmail}
                  onChange={(e) => setDeveloperEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="kontakt@developer.cz"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon *</label>
                <input
                  type="tel"
                  value={developerPhone}
                  onChange={(e) => setDeveloperPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="+420 XXX XXX XXX"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kontaktní osoba</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="Jméno a pozice kontaktní osoby"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Zkušenosti a historie</label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="Kolik let na trhu, počet realizovaných projektů..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reference a předchozí projekty</label>
                <textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="Seznam realizovaných projektů, klientů..."
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-[#215EF8] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="text-2xl font-bold text-[#040F2A]">Finanční parametry</h2>
              </div>
              <p className="text-sm text-gray-600 ml-11">Celkový objem a potřeby financování</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Celkový objem projektu *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={totalVolume}
                    onChange={(e) => setTotalVolume(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    placeholder="např. 150 000 000 Kč"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Potřeba financování *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fundingNeeded}
                    onChange={(e) => setFundingNeeded(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                    placeholder="např. 50 000 000 Kč"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Aktuální fáze financování</label>
                <input
                  type="text"
                  value={currentPhase}
                  onChange={(e) => setCurrentPhase(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="např. Zajištěno 60% z bank, hledáme 40% od investorů"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Očekávaný výnos pro investory</label>
                <input
                  type="text"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8]"
                  placeholder="např. 8-12% p.a. nebo dle tiketu"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Upozornění</p>
                  <p>Tyto informace jsou pouze orientační. Detailní finanční podmínky budou definovány v jednotlivých tiketech v dalším kroku.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tickets */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#215EF8] text-white flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#040F2A]">Tikety projektu</h2>
                    <p className="text-sm text-gray-600">Definujte investiční tikety (max 25)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addTicket}
                  disabled={tickets.length >= 25}
                  className="px-4 py-2 rounded-lg bg-[#215EF8] text-white font-semibold hover:bg-[#1B4FD1] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Přidat tiket
                </button>
              </div>
            </div>

            {tickets.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="font-semibold text-gray-900 mb-2">Zatím žádné tikety</p>
                <p className="text-sm text-gray-600 mb-6">Přidejte první tiket pro tento projekt</p>
                <button
                  type="button"
                  onClick={addTicket}
                  className="px-6 py-3 rounded-lg bg-[#215EF8] text-white font-semibold hover:bg-[#1B4FD1] transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Přidat první tiket
                </button>
              </div>
            )}

            <div className="space-y-4">
              {tickets.map((ticket, idx) => (
                <div key={ticket.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Tiket #{idx + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTicket(ticket.id)}
                      className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Smazat
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Typ *</label>
                      <select
                        value={ticket.type}
                        onChange={(e) => updateTicket(ticket.id, 'type', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                      >
                        <option value="Zápůjčka">Zápůjčka</option>
                        <option value="Ekvita">Ekvita</option>
                        <option value="Mezanin">Mezanin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Částka *</label>
                      <input
                        type="text"
                        value={ticket.amount}
                        onChange={(e) => updateTicket(ticket.id, 'amount', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                        placeholder="např. 10 000 000 Kč"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Min. investice *</label>
                      <input
                        type="text"
                        value={ticket.minInvestment}
                        onChange={(e) => updateTicket(ticket.id, 'minInvestment', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                        placeholder="např. 500 000 Kč"
                      />
                    </div>

                    {ticket.type === 'Zápůjčka' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Úrok p.a. *</label>
                        <input
                          type="text"
                          value={ticket.interestRate}
                          onChange={(e) => updateTicket(ticket.id, 'interestRate', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                          placeholder="např. 8.5%"
                        />
                      </div>
                    )}

                    {ticket.type === 'Ekvita' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Podíl na zisku</label>
                        <select
                          value={ticket.profitShare}
                          onChange={(e) => updateTicket(ticket.id, 'profitShare', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                        >
                          <option value="Ano">Ano</option>
                          <option value="Ne">Ne</option>
                          <option value="Dohodou">Dohodou</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Splatnost</label>
                      <input
                        type="text"
                        value={ticket.maturity}
                        onChange={(e) => updateTicket(ticket.id, 'maturity', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                        placeholder="např. 24 měsíců"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Zajištění</label>
                      <select
                        value={ticket.security}
                        onChange={(e) => updateTicket(ticket.id, 'security', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                      >
                        <option value="1. pořadí">1. pořadí</option>
                        <option value="2. pořadí">2. pořadí</option>
                        <option value="Bez zajištění">Bez zajištění</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Popis tiketu</label>
                      <textarea
                        value={ticket.description}
                        onChange={(e) => updateTicket(ticket.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20"
                        placeholder="Specifika tohoto tiketu..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Final Warning & Submit */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-900">
                  <p className="font-bold mb-2">Důležité informace před odesláním</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Projekt bude odeslán ke schválení administrátorovi platformy</li>
                    <li>Po schválení bude zahájena jednání s developerem o provizních podmínkách</li>
                    <li>Projekt bude aktivován až po podpisu provizní smlouvy</li>
                    <li>O změně statusu budete informováni emailem a in-app notifikací</li>
                    <li>Své projekty sledujte v sekci "Zalistované projekty"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all cursor-pointer"
              >
                Zrušit
              </button>
              <button
                type="button"
                onClick={() => setShowReview(true)}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#14AE6B] to-green-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 pointer-events-none flex-shrink-0" />
                <span className="pointer-events-none">Odeslat na schválení</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}