/**
 * PROJECT DETAIL PAGE - PROFESSIONAL B2B UX
 * 
 * UX Principles:
 * - Decision-first hierarchy (key info first)
 * - Compliance-first copy
 * - Private banking aesthetic
 * - Clear information architecture
 */

import { ArrowLeft, MapPin, Building2, TrendingUp, Shield, Calendar, FileText, Download, Users, Clock, CheckCircle, AlertCircle, Mail, Phone, ChevronRight, ExternalLink, Layers, Home, Factory, Target } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MOCK_PROJECT_DETAILS, ProjectDetailData } from '../data/mockProjectDetails';
import { MOCK_TICKETS } from './TicketsPageNew';
import { useState } from 'react';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
  onReserve?: (ticketId: string) => void;
}

export function ProjectDetail({ projectId, onBack, onReserve }: ProjectDetailProps) {
  const projectData = MOCK_PROJECT_DETAILS[projectId];
  const projectTickets = MOCK_TICKETS.filter(t => t.projectId === projectId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!projectData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Projekt nenalezen</h2>
          <Button onClick={onBack}>Zpět na tikety</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fundingProgress = (projectData.fundingSecured / projectData.totalFundingRequired) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Příprava': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Výstavba': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Kolaudace': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Prodej': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Nízké': return 'text-[#14AE6B] bg-[#14AE6B]/10 border-[#14AE6B]/20';
      case 'Střední': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Vysoké': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDocumentIcon = (type: string) => {
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="py-4 flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-[#040F2A] hover:bg-gray-50 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na tikety
            </Button>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${getStatusColor(projectData.projectStatus)}`}>
                {projectData.projectStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="grid grid-cols-[1fr_500px] gap-12">
            {/* Left: Project Info */}
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-mono text-gray-500">{projectData.projectId}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{projectData.projectType}</span>
                </div>
                <h1 className="text-[#040F2A] mb-3 text-4xl font-semibold leading-tight">
                  {projectData.projectName}
                </h1>
                
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 font-medium">{projectData.locationDetails.address}</span>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* Total Value */}
                <div className="bg-gradient-to-br from-[#215EF8]/5 to-[#215EF8]/10 border-2 border-[#215EF8]/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#215EF8]" />
                    <span className="text-xs font-semibold text-[#215EF8] uppercase tracking-wider">Celková hodnota</span>
                  </div>
                  <p className="text-2xl font-bold text-[#215EF8]">
                    {formatCurrency(projectData.totalProjectValue / 1000000)} <span className="text-sm">mil. Kč</span>
                  </p>
                </div>

                {/* Area */}
                {projectData.buildingArea && (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Plocha</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(projectData.buildingArea)} <span className="text-sm">m²</span>
                    </p>
                  </div>
                )}

                {/* Units / Floors */}
                {projectData.units ? (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Jednotky</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectData.units} <span className="text-sm">bytů</span>
                    </p>
                  </div>
                ) : projectData.floors ? (
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Podlaží</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectData.floors}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Developer Info */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Developer</div>
                    <h3 className="text-lg font-semibold text-[#040F2A]">{projectData.developerCompany}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Realizované projekty</div>
                    <div className="text-2xl font-bold text-[#215EF8]">{projectData.developerProjects}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{projectData.developerDescription}</p>
              </div>
            </div>

            {/* Right: Image Gallery */}
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-xl border border-gray-200 mb-3">
                <ImageWithFallback 
                  src={projectData.galleryImages[selectedImage]} 
                  alt={projectData.projectName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {projectData.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-[#215EF8] ring-2 ring-[#215EF8]/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ImageWithFallback 
                      src={img} 
                      alt={`${projectData.projectName} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="grid grid-cols-[1fr_400px] gap-8">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#040F2A] mb-4">Popis projektu</h2>
              <div className="prose prose-sm max-w-none">
                {projectData.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-600 leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            {/* Key Features */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#040F2A] mb-4">Klíčové vlastnosti</h2>
              <div className="grid grid-cols-2 gap-3">
                {projectData.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#14AE6B] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#040F2A] mb-4">Časová osa projektu</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-xs text-gray-500 mb-1">Zahájení</div>
                    <div className="font-semibold text-[#040F2A]">{projectData.startDate}</div>
                  </div>
                  <div className="flex-1">
                    <div className="h-px bg-gray-200 my-3"></div>
                  </div>
                </div>
                
                <div className="bg-[#215EF8]/5 border-2 border-[#215EF8]/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-[#215EF8]" />
                    <span className="text-xs font-semibold text-[#215EF8] uppercase">Aktuální fáze</span>
                  </div>
                  <p className="font-semibold text-[#040F2A]">{projectData.currentPhase}</p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="h-px bg-gray-200 my-3"></div>
                  </div>
                  <div className="w-24 flex-shrink-0 text-right">
                    <div className="text-xs text-gray-500 mb-1">Dokončení</div>
                    <div className="font-semibold text-[#040F2A]">{projectData.expectedCompletion}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Location Details */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#040F2A] mb-4">Lokalita</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Adresa</div>
                  <p className="text-gray-600">{projectData.locationDetails.address}</p>
                  <p className="text-gray-600">{projectData.locationDetails.city}, {projectData.locationDetails.district}</p>
                </div>
                
                {projectData.locationDetails.publicTransport && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Veřejná doprava</div>
                    <div className="space-y-1">
                      {projectData.locationDetails.publicTransport.map((transport, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{transport}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {projectData.locationDetails.nearbyAmenities && (
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Občanská vybavenost</div>
                    <div className="space-y-1">
                      {projectData.locationDetails.nearbyAmenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Documents */}
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#040F2A] mb-4">Dokumenty</h2>
              <div className="space-y-2">
                {projectData.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div>
                        <div className="font-medium text-[#040F2A] text-sm">{doc.name}</div>
                        <div className="text-xs text-gray-500">
                          {doc.category} • {doc.size} • {doc.uploadDate}
                        </div>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-[#215EF8]" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Available Tickets */}
            <div className="bg-white rounded-xl border-2 border-[#215EF8]/20 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-[#040F2A] mb-4">Dostupné tikety ({projectTickets.length})</h3>
              
              <div className="space-y-3 mb-6">
                {projectTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#215EF8]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">{ticket.id}</div>
                        <div className="text-sm font-semibold text-[#040F2A]">{ticket.investmentType}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        ticket.investmentType === 'Ekvita' ? 'bg-purple-100 text-purple-700' :
                        ticket.investmentType === 'Zápůjčka' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {ticket.yieldPercent}% p.a.
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Investice</span>
                        <span className="font-semibold text-gray-900">{formatCurrency(ticket.investmentAmount)} Kč</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Vaše provize</span>
                        <span className="font-bold text-[#215EF8]">{formatCurrency(ticket.commissionAmount)} Kč</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Dostupnost</span>
                        <span className={`font-semibold ${ticket.slotsAvailable > 0 ? 'text-[#14AE6B]' : 'text-red-600'}`}>
                          {ticket.slotsAvailable}/{ticket.slotsTotal} slotů
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onReserve?.(ticket.id)}
                      disabled={ticket.slotsAvailable === 0}
                      className="w-full"
                      size="sm"
                    >
                      {ticket.slotsAvailable > 0 ? 'Rezervovat' : 'Obsazeno'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Funding Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#040F2A] mb-4">Průběh financování</h3>
              
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Zajištěno</span>
                  <span className="text-sm font-semibold text-gray-900">{Math.round(fundingProgress)}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#14AE6B] to-[#14AE6B]/80 transition-all"
                    style={{ width: `${fundingProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Zajištěno</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(projectData.fundingSecured / 1000000)} mil. Kč</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Požadováno</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(projectData.totalFundingRequired / 1000000)} mil. Kč</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Zbývá</span>
                  <span className="font-bold text-[#215EF8]">
                    {formatCurrency((projectData.totalFundingRequired - projectData.fundingSecured) / 1000000)} mil. Kč
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#040F2A] mb-4">Rizikové hodnocení</h3>
              
              <div className={`px-4 py-3 rounded-lg border-2 font-semibold mb-4 ${getRiskColor(projectData.riskLevel)}`}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Riziko: {projectData.riskLevel}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {projectData.riskFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      projectData.riskLevel === 'Nízké' ? 'text-[#14AE6B]' :
                      projectData.riskLevel === 'Střední' ? 'text-amber-600' :
                      'text-red-600'
                    }`} />
                    <span className="text-sm text-gray-600">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-br from-[#040F2A] to-[#040F2A]/90 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Kontaktní osoba</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-white/70 mb-1">Jméno</div>
                  <div className="font-semibold">{projectData.contactPerson}</div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-white/70" />
                  <a href={`mailto:${projectData.contactEmail}`} className="hover:underline">
                    {projectData.contactEmail}
                  </a>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-white/70" />
                  <a href={`tel:${projectData.contactPhone}`} className="hover:underline">
                    {projectData.contactPhone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}