import { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Edit,
  Trash2,
  Mail,
  Phone,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Copy,
  Activity,
  BarChart3,
  Percent,
  MessageSquare,
  Plus,
  Info,
  Briefcase,
  Award,
  FileCheck,
  Link as LinkIcon
} from 'lucide-react';

type ProjectStatus = 'draft' | 'pending' | 'in-negotiation' | 'approved' | 'active' | 'rejected';

interface Ticket {
  id: string;
  name: string;
  investmentAmount: number;
  yieldPA: number;
  duration: number;
  commission: number;
  reservations: number;
  maxReservations: number;
  status: 'available' | 'reserved' | 'filled';
}

interface ListedProject {
  id: string;
  name: string;
  location: string;
  status: ProjectStatus;
  ticketsCount: number;
  totalVolume: number;
  reservationsCount?: number;
  developerName: string;
  developerEmail: string;
  developerPhone: string;
  projectType: 'residential' | 'commercial' | 'mixed-use' | 'industrial';
  listedDate: string;
  approvedDate?: string;
  projectStartDate?: string;
  description: string;
  expectedYield: number;
  tickets: Ticket[];
  documents?: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    size: string;
  }[];
  activities?: {
    id: string;
    type: 'created' | 'updated' | 'reservation' | 'comment' | 'document' | 'status-change';
    description: string;
    timestamp: string;
    user?: string;
  }[];
}

interface ListedProjectDetailPageProps {
  project: ListedProject;
  onBack: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onReportChanges?: () => void;  // NEW: For reporting changes before publication
}

export function ListedProjectDetailPage({ 
  project, 
  onBack, 
  onEdit,
  onCancel,
  onReportChanges
}: ListedProjectDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'activity' | 'documents'>('overview');

  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case 'draft':
        return { label: 'Koncept', color: 'bg-gray-100 text-gray-700', icon: Edit };
      case 'pending':
        return { label: 'Čeká na schválení', color: 'bg-amber-100 text-amber-700', icon: Clock };
      case 'in-negotiation':
        return { label: 'V jednání', color: 'bg-blue-100 text-blue-700', icon: MessageSquare };
      case 'approved':
        return { label: 'Schváleno', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
      case 'active':
        return { label: 'Aktivní', color: 'bg-[#14AE6B]/10 text-[#14AE6B]', icon: CheckCircle2 };
      case 'rejected':
        return { label: 'Zamítnuto', color: 'bg-red-100 text-red-700', icon: XCircle };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  // Calculate stats
  const totalCommissionPotential = project.tickets.reduce((sum, ticket) => 
    sum + (ticket.investmentAmount * ticket.commission / 100), 0
  );
  
  const totalReservations = project.reservationsCount || project.tickets.reduce((sum, ticket) => sum + ticket.reservations, 0);
  
  const averageYield = project.tickets.length > 0 
    ? project.tickets.reduce((sum, ticket) => sum + ticket.yieldPA, 0) / project.tickets.length 
    : project.expectedYield || 0;

  const reservationRate = project.tickets.reduce((sum, ticket) => sum + ticket.maxReservations, 0) > 0
    ? (totalReservations / project.tickets.reduce((sum, ticket) => sum + ticket.maxReservations, 0)) * 100
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#EAEAEA] px-8 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Zpět na přehled
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#215EF8] to-[#1B4FD1] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-semibold text-[#040F2A]">{project.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#6B7280]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span className="capitalize">{project.projectType === 'residential' ? 'Rezidenční' :
                    project.projectType === 'commercial' ? 'Komerční' :
                    project.projectType === 'mixed-use' ? 'Mixed-use' : 'Průmyslový'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Zalistováno {project.listedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Report Changes - Only for non-published projects */}
            {project.status !== 'active' && onReportChanges && (
              <button
                onClick={onReportChanges}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#215EF8] bg-[#215EF8]/5 text-[#215EF8] hover:bg-[#215EF8]/10 transition-all font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                Nahlásit změny
              </button>
            )}
            
            {(project.status === 'draft' || project.status === 'rejected') && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-50 transition-all font-medium"
              >
                <Edit className="w-4 h-4" />
                Upravit
              </button>
            )}
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Zrušit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Key Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#215EF8]/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#215EF8]" />
              </div>
              <TrendingUp className="w-5 h-5 text-[#14AE6B]" />
            </div>
            <p className="text-2xl font-semibold text-[#040F2A] mb-1">
              {formatCurrency(project.totalVolume)}
            </p>
            <p className="text-sm text-[#6B7280]">Celkový objem</p>
          </div>

          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#14AE6B]/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-[#14AE6B]" />
              </div>
              <Info className="w-5 h-5 text-[#6B7280]" />
            </div>
            <p className="text-2xl font-semibold text-[#040F2A] mb-1">
              {formatCurrency(totalCommissionPotential)}
            </p>
            <p className="text-sm text-[#6B7280]">Potenciální provize</p>
          </div>

          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#040F2A] mb-1">
              {project.ticketsCount}
            </p>
            <p className="text-sm text-[#6B7280]">Tikety celkem</p>
          </div>

          <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-[#040F2A] mb-1">
              {totalReservations}
            </p>
            <p className="text-sm text-[#6B7280]">Aktivních rezervací</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-[#215EF8]/5 to-[#14AE6B]/5 border border-[#215EF8]/20 rounded-xl p-6">
          <h3 className="text-base font-semibold text-[#040F2A] mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#215EF8]" />
            Výkonnost projektu
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl font-semibold text-[#040F2A]">{averageYield.toFixed(1)}%</p>
                <span className="text-sm text-[#6B7280]">p.a.</span>
              </div>
              <p className="text-sm text-[#6B7280]">Průměrný výnos</p>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl font-semibold text-[#040F2A]">{reservationRate.toFixed(0)}%</p>
                <TrendingUp className={`w-5 h-5 ${reservationRate > 50 ? 'text-[#14AE6B]' : 'text-amber-500'}`} />
              </div>
              <p className="text-sm text-[#6B7280]">Míra rezervací</p>
            </div>
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl font-semibold text-[#040F2A]">
                  {project.tickets.filter(t => t.status === 'available').length}
                </p>
                <span className="text-sm text-[#6B7280]">/ {project.ticketsCount}</span>
              </div>
              <p className="text-sm text-[#6B7280]">Dostupné tikety</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className={`${activeTab === 'tickets' ? 'col-span-3' : 'col-span-2'} space-y-6`}>
            {/* Tabs */}
            <div className="border-b border-[#EAEAEA]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-[#215EF8] text-[#215EF8]'
                      : 'border-transparent text-[#6B7280] hover:text-[#040F2A]'
                  }`}
                >
                  Přehled
                </button>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'tickets'
                      ? 'border-[#215EF8] text-[#215EF8]'
                      : 'border-transparent text-[#6B7280] hover:text-[#040F2A]'
                  }`}
                >
                  Tikety ({project.ticketsCount})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-[#215EF8] text-[#215EF8]'
                      : 'border-transparent text-[#6B7280] hover:text-[#040F2A]'
                  }`}
                >
                  Aktivita
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'documents'
                      ? 'border-[#215EF8] text-[#215EF8]'
                      : 'border-transparent text-[#6B7280] hover:text-[#040F2A]'
                  }`}
                >
                  Dokumenty ({project.documents?.length || 0})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Project Description */}
                <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#040F2A] mb-4">Popis projektu</h3>
                  <p className="text-[#6B7280] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Key Information */}
                <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#040F2A] mb-4">Klíčové informace</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#040F2A]">Typ projektu</p>
                        <p className="text-sm text-[#6B7280] capitalize">
                          {project.projectType === 'residential' ? 'Rezidenční' :
                            project.projectType === 'commercial' ? 'Komerční' :
                            project.projectType === 'mixed-use' ? 'Mixed-use' : 'Průmyslový'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#040F2A]">Lokace</p>
                        <p className="text-sm text-[#6B7280]">{project.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#040F2A]">Datum zalistování</p>
                        <p className="text-sm text-[#6B7280]">{project.listedDate}</p>
                      </div>
                    </div>
                    {project.approvedDate && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#040F2A]">Datum schválení</p>
                          <p className="text-sm text-[#6B7280]">{project.approvedDate}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="space-y-3">
                {project.tickets.length > 0 ? (
                  project.tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-white border border-[#EAEAEA] rounded-xl p-6 hover:border-[#215EF8]/30 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-[#040F2A]">{ticket.name}</h4>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              ticket.status === 'available' 
                                ? 'bg-green-100 text-green-700' 
                                : ticket.status === 'reserved'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {ticket.status === 'available' ? 'Dostupný' : ticket.status === 'reserved' ? 'Rezervován' : 'Obsazen'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                            <span>{formatCurrency(ticket.investmentAmount)}</span>
                            <span>•</span>
                            <span>{ticket.yieldPA}% p.a.</span>
                            <span>•</span>
                            <span>{ticket.duration} měsíců</span>
                            <span>•</span>
                            <span className="text-[#14AE6B] font-medium">{ticket.commission}% provize</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-50 transition-all text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          Detail
                        </button>
                      </div>
                      
                      {/* Reservation Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-[#6B7280]">Rezervace</span>
                          <span className="font-medium text-[#040F2A]">
                            {ticket.reservations} / {ticket.maxReservations}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] rounded-full transition-all"
                            style={{ width: `${(ticket.reservations / ticket.maxReservations) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#EAEAEA] rounded-xl p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#6B7280]">Zatím nejsou k dispozici žádné tikety</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                {project.activities && project.activities.length > 0 ? (
                  project.activities.map((activity) => {
                    const getActivityIcon = () => {
                      switch (activity.type) {
                        case 'created': return <Plus className="w-4 h-4" />;
                        case 'updated': return <Edit className="w-4 h-4" />;
                        case 'reservation': return <Users className="w-4 h-4" />;
                        case 'comment': return <MessageSquare className="w-4 h-4" />;
                        case 'document': return <FileText className="w-4 h-4" />;
                        case 'status-change': return <Activity className="w-4 h-4" />;
                        default: return <Activity className="w-4 h-4" />;
                      }
                    };

                    const getActivityColor = () => {
                      switch (activity.type) {
                        case 'created': return 'bg-green-100 text-green-600';
                        case 'updated': return 'bg-blue-100 text-blue-600';
                        case 'reservation': return 'bg-[#215EF8]/10 text-[#215EF8]';
                        case 'comment': return 'bg-amber-100 text-amber-600';
                        case 'document': return 'bg-purple-100 text-purple-600';
                        case 'status-change': return 'bg-gray-100 text-gray-600';
                        default: return 'bg-gray-100 text-gray-600';
                      }
                    };

                    return (
                      <div key={activity.id} className="bg-white border border-[#EAEAEA] rounded-xl p-4 hover:border-[#215EF8]/30 transition-all">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor()}`}>
                            {getActivityIcon()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-[#040F2A] font-medium mb-1">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                              <Clock className="w-3 h-3" />
                              <span>{activity.timestamp}</span>
                              {activity.user && (
                                <>
                                  <span>•</span>
                                  <span>{activity.user}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white border border-[#EAEAEA] rounded-xl p-12 text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#6B7280]">Zatím žádná aktivita</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-3">
                {project.documents && project.documents.length > 0 ? (
                  project.documents.map((doc) => (
                    <div key={doc.id} className="bg-white border border-[#EAEAEA] rounded-xl p-4 hover:border-[#215EF8]/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#6B7280]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#040F2A] mb-1">{doc.name}</p>
                            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                              <span>{doc.type.toUpperCase()}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>Nahráno {doc.uploadedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-lg border border-[#EAEAEA] text-[#6B7280] hover:bg-gray-50 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg border border-[#EAEAEA] text-[#6B7280] hover:bg-gray-50 transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-[#EAEAEA] rounded-xl p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-[#6B7280] mb-4">Žádné dokumenty nebyly nahrány</p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#215EF8] text-white hover:bg-[#1B4FD1] transition-all font-medium">
                      <Plus className="w-4 h-4" />
                      Nahrát dokument
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Developer Info */}
            <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
              <h3 className="text-base font-semibold text-[#040F2A] mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#215EF8]" />
                Developer
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[#040F2A] mb-2">{project.developerName}</p>
                </div>
                <div className="space-y-2">
                  <a 
                    href={`mailto:${project.developerEmail}`}
                    className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#215EF8] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {project.developerEmail}
                  </a>
                  <a 
                    href={`tel:${project.developerPhone}`}
                    className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#215EF8] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {project.developerPhone}
                  </a>
                </div>
                <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-medium hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all">
                  Kontaktovat
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-[#EAEAEA] rounded-xl p-6">
              <h3 className="text-base font-semibold text-[#040F2A] mb-4">Rychlé akce</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-50 transition-all text-sm font-medium">
                  <Copy className="w-4 h-4" />
                  Duplikovat projekt
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-50 transition-all text-sm font-medium">
                  <LinkIcon className="w-4 h-4" />
                  Zkopírovat odkaz
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-50 transition-all text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Stáhnout report
                </button>
              </div>
            </div>

            {/* Project ID */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-[#6B7280] mb-1">ID projektu</p>
              <p className="text-sm font-mono text-[#040F2A]">{project.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}