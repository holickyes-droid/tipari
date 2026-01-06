import { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Download, 
  Plus,
  Building2,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  FileCheck,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { CancelProjectPage } from './CancelProjectPage';
import { ListedProjectDetailPage } from './ListedProjectDetailPage';
import { ReportChangesPage } from './ReportChangesPage';

type ProjectStatus = 'draft' | 'pending' | 'in-negotiation' | 'approved' | 'active' | 'rejected';
type ProjectType = 'residential' | 'commercial' | 'mixed-use' | 'industrial';
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'volume-high' | 'volume-low';
type ViewMode = 'list' | 'cancel' | 'detail' | 'report-changes';

interface ListedProject {
  id: string;
  name: string;
  location: string;
  submittedDate: string;
  status: ProjectStatus;
  statusMessage?: string;
  ticketsCount: number;
  totalVolume: number;
  adminNotes?: string;
  lastUpdate: string;
  projectType: ProjectType;
  developerName: string;
  developerEmail: string;
  developerPhone: string;
  expectedYield: number;
  estimatedActivation?: string;
  documentsCount: number;
  reservationsCount?: number;
  description: string;
  listedDate: string;
  approvedDate?: string;
  tickets: {
    id: string;
    name: string;
    investmentAmount: number;
    yieldPA: number;
    duration: number;
    commission: number;
    reservations: number;
    maxReservations: number;
    status: 'available' | 'reserved' | 'sold';
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    size: string;
  }[];
  activities: {
    id: string;
    type: 'created' | 'updated' | 'approved' | 'rejected';
    description: string;
    timestamp: string;
    user: string;
  }[];
}

interface ListedProjectsPageProps {
  onNewProject: () => void;
}

export function ListedProjectsPage({ onNewProject }: ListedProjectsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedProject, setSelectedProject] = useState<ListedProject | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  const [projects] = useState<ListedProject[]>([
    {
      id: '1',
      name: 'Rezidence Park View',
      location: 'Praha 6 - Dejvice',
      submittedDate: '2024-12-15T14:30:00',
      status: 'pending',
      ticketsCount: 5,
      totalVolume: 150000000,
      lastUpdate: '2024-12-15T14:30:00',
      projectType: 'residential',
      developerName: 'Central Group',
      developerEmail: 'info@centralgroup.cz',
      developerPhone: '+420 777 888 999',
      expectedYield: 7.2,
      documentsCount: 12,
      estimatedActivation: '2025-01-10',
      description: 'Moderní rezidenční projekt v atraktivní lokalitě Prahy 6. Zahrnuje výstavbu bytových jednotek s vysokým standardem vybavení a společnými prostory včetně fitness centra a dětského hřiště.',
      listedDate: '15. 12. 2024',
      tickets: [
        {
          id: 't1-1',
          name: 'Tiket A - Standardní byty',
          investmentAmount: 30000000,
          yieldPA: 7.2,
          duration: 24,
          commission: 2.5,
          reservations: 0,
          maxReservations: 3,
          status: 'available' as const
        },
        {
          id: 't1-2',
          name: 'Tiket B - Premium byty',
          investmentAmount: 50000000,
          yieldPA: 6.8,
          duration: 30,
          commission: 3.0,
          reservations: 0,
          maxReservations: 3,
          status: 'available' as const
        }
      ],
      documents: [
        {
          id: 'd1-1',
          name: 'Projektová dokumentace',
          type: 'pdf',
          uploadedAt: '10. 12. 2024',
          size: '15.2 MB'
        },
        {
          id: 'd1-2',
          name: 'Stavební povolení',
          type: 'pdf',
          uploadedAt: '12. 12. 2024',
          size: '2.8 MB'
        }
      ],
      activities: [
        {
          id: 'a1-1',
          type: 'created',
          description: 'Projekt byl vytvořen a odeslán ke schválení',
          timestamp: '15. 12. 2024 14:30',
          user: 'Jan Novák'
        }
      ]
    },
    {
      id: '2',
      name: 'Bytový komplex Vinohrady',
      location: 'Praha 2 - Vinohrady',
      submittedDate: '2024-12-10T09:00:00',
      status: 'in-negotiation',
      statusMessage: 'Probíhá jednání s developerem o provizních podmínkách. Očekáváme finalizaci do 7 dnů.',
      ticketsCount: 8,
      totalVolume: 280000000,
      lastUpdate: '2024-12-18T10:15:00',
      projectType: 'residential',
      developerName: 'Finep',
      developerEmail: 'info@finep.cz',
      developerPhone: '+420 222 333 444',
      expectedYield: 8.5,
      documentsCount: 18,
      estimatedActivation: '2025-01-05',
      description: 'Prémiový bytový komplex v centru Vinohrad s nadstandardním vybavením a terasami.',
      listedDate: '10. 12. 2024',
      tickets: [],
      documents: [],
      activities: []
    },
    {
      id: '3',
      name: 'Komerční centrum Brno',
      location: 'Brno - střed',
      submittedDate: '2024-12-05T11:20:00',
      status: 'active',
      ticketsCount: 12,
      totalVolume: 450000000,
      lastUpdate: '2024-12-20T16:45:00',
      projectType: 'commercial',
      developerName: 'CTP',
      developerEmail: 'info@ctp.cz',
      developerPhone: '+420 533 444 555',
      expectedYield: 6.8,
      documentsCount: 24,
      reservationsCount: 8,
      description: 'Moderní komerční centrum v centru Brna s retailovými prostory a kancelářemi.',
      listedDate: '5. 12. 2024',
      approvedDate: '8. 12. 2024',
      tickets: [],
      documents: [],
      activities: []
    },
    {
      id: '4',
      name: 'Vila Karlovy Vary',
      location: 'Karlovy Vary',
      submittedDate: '2024-12-01T13:45:00',
      status: 'rejected',
      adminNotes: 'Developer nemá kompletní stavební povolení. Projekt můžete upravit a znovu odeslat po doplnění dokumentace.',
      ticketsCount: 3,
      totalVolume: 45000000,
      lastUpdate: '2024-12-03T09:20:00',
      projectType: 'residential',
      developerName: 'Villa Development s.r.o.',
      developerEmail: 'info@villdev.cz',
      developerPhone: '+420 353 222 111',
      expectedYield: 9.5,
      documentsCount: 8,
      description: 'Luxusní vila v lázeňském městě Karlovy Vary.',
      listedDate: '1. 12. 2024',
      tickets: [],
      documents: [],
      activities: []
    },
    {
      id: '5',
      name: 'Logistický park Čestlice',
      location: 'Praha-východ - Čestlice',
      submittedDate: '2024-11-28T08:15:00',
      status: 'active',
      ticketsCount: 15,
      totalVolume: 620000000,
      lastUpdate: '2024-12-22T14:20:00',
      projectType: 'industrial',
      developerName: 'Prologis',
      developerEmail: 'info@prologis.cz',
      developerPhone: '+420 272 000 000',
      expectedYield: 7.8,
      documentsCount: 32,
      reservationsCount: 12,
      description: 'Průmyslový logistický park u dálnice D1 s moderními skladovými halami.',
      listedDate: '28. 11. 2024',
      approvedDate: '30. 11. 2024',
      tickets: [],
      documents: [],
      activities: []
    },
    {
      id: '6',
      name: 'Mixed-use Anděl City',
      location: 'Praha 5 - Smíchov',
      submittedDate: '2024-11-20T10:30:00',
      status: 'approved',
      statusMessage: 'Projekt schválen, čeká na podpis provizní smlouvy s developerem.',
      ticketsCount: 20,
      totalVolume: 850000000,
      lastUpdate: '2024-12-19T11:30:00',
      projectType: 'mixed-use',
      developerName: 'Sekyra Group',
      developerEmail: 'info@sekyragroup.cz',
      developerPhone: '+420 225 990 990',
      expectedYield: 6.2,
      documentsCount: 45,
      estimatedActivation: '2025-01-02',
      description: 'Multifunkční komplex s byty, kancelářemi a obchody v centru Smíchova.',
      listedDate: '20. 11. 2024',
      approvedDate: '15. 12. 2024',
      tickets: [],
      documents: [],
      activities: []
    },
  ]);

  const getStatusBadge = (status: ProjectStatus) => {
    const config = {
      draft: { 
        label: 'Koncept', 
        className: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: FileText 
      },
      pending: { 
        label: 'Čeká na schválení', 
        className: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Clock 
      },
      'in-negotiation': { 
        label: 'V jednání', 
        className: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: MessageSquare 
      },
      approved: { 
        label: 'Schváleno', 
        className: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle2 
      },
      active: { 
        label: 'Aktivní', 
        className: 'bg-[#14AE6B]/10 text-[#14AE6B] border-[#14AE6B]/30',
        icon: CheckCircle2 
      },
      rejected: { 
        label: 'Zamítnuto', 
        className: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle 
      },
    };

    const { label, className, icon: Icon } = config[status];
    
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm ${className}`}>
        <Icon className="w-4 h-4" />
        {label}
      </span>
    );
  };

  const getStatusDescription = (status: ProjectStatus) => {
    const descriptions = {
      draft: 'Projekt je uložen jako koncept',
      pending: 'Projekt čeká na kontrolu administrátorem',
      'in-negotiation': 'Probíhá jednání s developerem o podmínkách',
      approved: 'Projekt schválen, čeká na podpis smlouvy',
      active: 'Projekt je aktivní a viditelný na platformě',
      rejected: 'Projekt byl zamítnut, zkontrolujte poznámky'
    };
    return descriptions[status];
  };

  const filterProjects = (projects: ListedProject[]) => {
    let filteredProjects = projects;

    if (statusFilter !== 'all') {
      filteredProjects = filteredProjects.filter(p => p.status === statusFilter);
    }

    if (searchQuery) {
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.developerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredProjects;
  };

  const sortProjects = (projects: ListedProject[]) => {
    switch (sortBy) {
      case 'newest':
        return projects.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
      case 'oldest':
        return projects.sort((a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());
      case 'name-asc':
        return projects.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return projects.sort((a, b) => b.name.localeCompare(a.name));
      case 'volume-high':
        return projects.sort((a, b) => b.totalVolume - a.totalVolume);
      case 'volume-low':
        return projects.sort((a, b) => a.totalVolume - b.totalVolume);
      default:
        return projects;
    }
  };

  const filteredProjects = filterProjects(projects);
  const sortedProjects = sortProjects(filteredProjects);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Zalistované projekty</h1>
          <p className="text-muted-foreground">Přehled projektů, které jste navrhl(a) k zalistování</p>
        </div>
        
        <button
          onClick={onNewProject}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nový projekt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Celkem</span>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-[#040F2A]">{projects.length}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">Čeká na schválení</span>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {projects.filter(p => p.status === 'pending').length}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-amber-700">V jednání</span>
            <MessageSquare className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900">
            {projects.filter(p => p.status === 'in-negotiation').length}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-700">Aktivní</span>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">
            {projects.filter(p => p.status === 'active').length}
          </p>
        </div>
      </div>

      {/* Search, Filter & Sort Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Hledat podle názvu projektu, lokace nebo developera..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-[#040F2A] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
              className="pl-10 pr-8 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] appearance-none cursor-pointer"
            >
              <option value="all">Všechny statusy</option>
              <option value="draft">Koncept</option>
              <option value="pending">Čeká na schválení</option>
              <option value="in-negotiation">V jednání</option>
              <option value="approved">Schváleno</option>
              <option value="active">Aktivní</option>
              <option value="rejected">Zamítnuto</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-10 pr-8 py-2 border border-[#EAEAEA] rounded-lg text-sm text-[#040F2A] bg-white focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] appearance-none cursor-pointer"
            >
              <option value="newest">Nejnovější</option>
              <option value="oldest">Nejstarší</option>
              <option value="name-asc">Název A-Z</option>
              <option value="name-desc">Název Z-A</option>
              <option value="volume-high">Objem: nejvyšší</option>
              <option value="volume-low">Objem: nejnižší</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="px-4 py-2 border border-[#EAEAEA] rounded-lg text-sm font-medium text-[#040F2A] hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Active Filters Indicator */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="mt-3 pt-3 border-t border-[#EAEAEA] flex items-center gap-2 text-sm">
            <span className="text-[#6B7280]">
              Zobrazeno {sortedProjects.length} z {projects.length} projektů
            </span>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-[#215EF8] hover:underline"
              >
                Zrušit filtry
              </button>
            )}
          </div>
        )}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {sortedProjects.map(project => (
          <div key={project.id} className="bg-white border border-[#EAEAEA] rounded-xl overflow-hidden hover:shadow-lg transition-all">
            {/* Header - Title & Status */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#040F2A]">{project.name}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      {project.developerName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      {project.projectType === 'residential' ? 'Rezidenční' :
                       project.projectType === 'commercial' ? 'Komerční' :
                       project.projectType === 'mixed-use' ? 'Mixed-use' : 'Průmyslový'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Message/Alert */}
              {(project.statusMessage || project.adminNotes) && (
                <div className={`mb-4 rounded-lg p-4 border ${
                  project.status === 'rejected' ? 'bg-red-50 border-red-200' :
                  project.status === 'in-negotiation' ? 'bg-amber-50 border-amber-200' :
                  project.status === 'approved' ? 'bg-green-50 border-green-200' :
                  'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    {project.status === 'rejected' ? (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    ) : project.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-semibold mb-1 ${
                        project.status === 'rejected' ? 'text-red-900' : 
                        project.status === 'approved' ? 'text-green-900' :
                        'text-amber-900'
                      }`}>
                        {project.status === 'rejected' ? 'Poznámka administrátora' : 
                         project.status === 'approved' ? 'Projekt schválen' :
                         'Průběh jednání'}
                      </p>
                      <p className={`text-sm ${
                        project.status === 'rejected' ? 'text-red-800' : 
                        project.status === 'approved' ? 'text-green-800' :
                        'text-amber-800'
                      }`}>
                        {project.adminNotes || project.statusMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Project Key Metrics - Grid */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-xs text-[#6B7280] font-medium">Tikety</span>
                  </div>
                  <p className="text-lg font-semibold text-[#040F2A]">{project.ticketsCount}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-xs text-[#6B7280] font-medium">Celkový objem</span>
                  </div>
                  <p className="text-lg font-semibold text-[#040F2A]">
                    {(project.totalVolume / 1000000).toFixed(0)} mil. Kč
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-[#14AE6B]" />
                    <span className="text-xs text-[#6B7280] font-medium">Výnos p.a.</span>
                  </div>
                  <p className="text-lg font-semibold text-[#14AE6B]">{project.expectedYield.toFixed(1)}%</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCheck className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-xs text-[#6B7280] font-medium">Dokumenty</span>
                  </div>
                  <p className="text-lg font-semibold text-[#040F2A]">{project.documentsCount}</p>
                </div>

                {project.status === 'active' && project.reservationsCount !== undefined ? (
                  <div className="bg-[#14AE6B]/5 rounded-lg p-3 border border-[#14AE6B]/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#14AE6B]" />
                      <span className="text-xs text-[#14AE6B] font-medium">Rezervace</span>
                    </div>
                    <p className="text-lg font-semibold text-[#14AE6B]">{project.reservationsCount}</p>
                  </div>
                ) : project.estimatedActivation ? (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-blue-700 font-medium">Očekávaná aktivace</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">
                      {new Date(project.estimatedActivation).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-[#6B7280]" />
                      <span className="text-xs text-[#6B7280] font-medium">Status</span>
                    </div>
                    <p className="text-sm font-semibold text-[#040F2A]">{getStatusDescription(project.status).substring(0, 20)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Timeline & Actions */}
            <div className="bg-gray-50 px-6 py-4 border-t border-[#EAEAEA]">
              <div className="flex items-center justify-between">
                {/* Left: Timeline info */}
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Odesláno: {new Date(project.submittedDate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Aktualizováno: {new Date(project.lastUpdate).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {/* Right: Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setViewMode('detail');
                    }}
                    className="px-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Detail
                  </button>
                  {(project.status === 'draft' || project.status === 'rejected') && (
                    <button className="px-4 py-2 rounded-lg bg-white border border-[#EAEAEA] text-[#040F2A] hover:bg-gray-100 transition-all flex items-center gap-2 text-sm font-medium">
                      <Edit className="w-4 h-4" />
                      Upravit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setViewMode('cancel');
                    }}
                    className="px-4 py-2 rounded-lg bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2 text-sm font-medium"
                    title={project.status === 'draft' || project.status === 'rejected' ? 'Smazat projekt' : 'Zrušit zalistování'}
                  >
                    <Trash2 className="w-4 h-4" />
                    {project.status === 'draft' || project.status === 'rejected' ? 'Smazat' : 'Zrušit'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Zatím žádné projekty</h3>
          <p className="text-gray-600 mb-6">Začněte přidáním prvního projektu k zalistování</p>
          <button
            onClick={onNewProject}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Přidat první projekt
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 mb-3">Proces zalistování projektu</h4>
        <ol className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Vyplníte formulář s informacemi o projektu a tiketech</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Administrátor zkontroluje projekt (obdržíte email)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Zahájíme jednání s developerem o provizních podmínkách</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Po podpisu provizní smlouvy projekt aktivujeme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span>Tikety se zobrazí v nabídce a můžete začít získávat provize</span>
          </li>
        </ol>
      </div>

      {/* Cancel Project View */}
      {viewMode === 'cancel' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="w-full max-w-5xl mx-4">
            <CancelProjectPage
              project={selectedProject}
              onBack={() => {
                setViewMode('list');
                setSelectedProject(null);
              }}
              onCancelSuccess={() => {
                setViewMode('list');
                setSelectedProject(null);
                // In real app, remove project from list
              }}
            />
          </div>
        </div>
      )}

      {/* Detail Project View */}
      {viewMode === 'detail' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="w-full max-w-5xl mx-4">
            <ListedProjectDetailPage
              project={selectedProject}
              onBack={() => {
                setViewMode('list');
                setSelectedProject(null);
              }}
              onEdit={() => {
                // TODO: Navigate to edit form
                alert('Editace projektu - zatím neimplementováno');
              }}
              onCancel={() => {
                setViewMode('cancel');
              }}
              onReportChanges={() => {
                setViewMode('report-changes');
              }}
            />
          </div>
        </div>
      )}

      {/* Report Changes View */}
      {viewMode === 'report-changes' && selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="w-full max-w-5xl mx-4">
            <ReportChangesPage
              project={selectedProject}
              onBack={() => {
                setViewMode('detail');
                setSelectedProject(selectedProject);
              }}
              onSuccess={() => {
                setViewMode('list');
                setSelectedProject(null);
                // In real app, update project in list
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}