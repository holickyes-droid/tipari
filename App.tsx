import { useState, useMemo } from 'react';
import { NavigationTabs } from './components/NavigationTabs';
import { UserAvatar } from './components/UserAvatar';
import { ProjectCard } from './components/ProjectCard';
import { AdvancedFilters } from './components/AdvancedFilters';
import { SearchFilterBar } from './components/SearchFilterBar';
import { ProjectListHeader } from './components/ProjectListHeader';
import { CTASection } from './components/CTASection';
import { ActivitiesPage } from './components/ActivitiesPage';
import { MyProjectsActivitiesPage } from './components/MyProjectsActivitiesPage';
import { MyReservationsActivitiesPage } from './components/MyReservationsActivitiesPage';
import { MyReservationsPageV2 } from './components/MyReservationsPageV2';
import { CommissionPage } from './components/CommissionPage';
import { MyProjectsCommissionPage } from './components/MyProjectsCommissionPage';
import { MyReservationsCommissionPage } from './components/MyReservationsCommissionPage';
import { InvestorsPage } from './components/InvestorsPage';
import { OverviewPage } from './components/OverviewPage';
import { ProjectsPage } from './components/ProjectsPage';
import { TicketsPageNew, MOCK_TICKETS } from './components/TicketsPageNew';
import { ReservationFlowPage } from './components/ReservationFlowPage';
import { NewProjectForm } from './components/NewProjectForm';
import { ListedProjectsPage } from './components/ListedProjectsPage';
import { ProjectDetail } from './components/ProjectDetail';
import { SortOption, Project } from './types/project';
import { mockProjects } from './data/mockProjects';
import { DraftReservationsPanel, DraftReservation } from './components/DraftReservationsPanel';
import { AddInvestorModal, InvestorFormData } from './components/AddInvestorModal';
import { FloatingActionMenu, QuickContactModal } from './components/FloatingActionMenu';
import { BrandManualPage } from './components/BrandManualPage';
import { FAQModal } from './components/FAQModal';
import { FileText, Palette } from 'lucide-react';
import { Toaster } from 'sonner';
import { NotificationProvider } from './contexts/NotificationContext';

type ActivePage = 'tikety' | 'aktivity' | 'aktivity-projekty' | 'aktivity-rezervace' | 'provize' | 'provize-projekty' | 'provize-rezervace' | 'investori' | 'prehled' | 'new-project' | 'listed-projects' | 'brand-manual' | 'projekt-detail';

export interface Investor {
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
  notes?: string;
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('tikety');
  const [pageTimestamp, setPageTimestamp] = useState<number>(Date.now()); // Force refresh timestamp
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewLayout, setViewLayout] = useState<'rows' | 'grid'>('grid');
  const [projectStatusFilter, setProjectStatusFilter] = useState<'open' | 'closed'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClosedProjects, setShowClosedProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<string | null>(null);
  
  // Ticket page navigation
  const [ticketView, setTicketView] = useState<'list' | 'detail' | 'reservation'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // Draft reservations and investors management
  const [showDraftsPanel, setShowDraftsPanel] = useState(false);
  const [draftReservations, setDraftReservations] = useState<DraftReservation[]>([
    {
      id: 'draft-1',
      ticket: mockProjects[0].tickets[0],
      projectName: mockProjects[0].name,
      investorName: 'Petr Novák',
      currentStep: 'signature-method',
      savedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'draft-2',
      ticket: mockProjects[1].tickets[0],
      projectName: mockProjects[1].name,
      investorName: 'Jana Novotná',
      currentStep: 'waiting-electronic',
      signatureMethod: 'electronic',
      savedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 'draft-3',
      ticket: mockProjects[2].tickets[1],
      projectName: mockProjects[2].name,
      currentStep: 'investor-selection',
      savedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
  ]);
  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [showQuickContactModal, setShowQuickContactModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [investors, setInvestors] = useState<Investor[]>([
    {
      id: '1',
      name: 'Petr Novák',
      initials: 'PN',
      type: 'Privátní investor',
      email: 'petr.novak@email.cz',
      phone: '+420 603 123 456',
      portfolioValue: 15000000,
      activeInvestments: 3,
      preferredAmount: 5000000,
      preferredYield: 6.5,
      isActive: true,
      lastActivity: '2 dny',
    },
    {
      id: '2',
      name: 'Jana Novotná',
      initials: 'JN',
      type: 'Family Office',
      email: 'jana.novotna@email.cz',
      phone: '+420 608 234 567',
      portfolioValue: 50000000,
      activeInvestments: 8,
      preferredAmount: 10000000,
      preferredYield: 5.5,
      isActive: true,
      lastActivity: '5 hodin',
    },
    {
      id: '3',
      name: 'Martin Král',
      initials: 'MK',
      type: 'Privátní investor',
      email: 'martin.kral@email.cz',
      phone: '+420 777 345 678',
      portfolioValue: 80000000,
      activeInvestments: 12,
      preferredAmount: 8000000,
      preferredYield: 5.0,
      isActive: true,
      lastActivity: '1 den',
    },
    {
      id: '4',
      name: 'Investiční Fond Alpha',
      initials: 'IF',
      type: 'Fond',
      email: 'info@fondalpha.cz',
      phone: '+420 724 456 789',
      portfolioValue: 250000000,
      activeInvestments: 25,
      preferredAmount: 20000000,
      preferredYield: 6.0,
      isActive: true,
      ico: '12345678',
      lastActivity: '3 hodiny',
    },
    {
      id: '5',
      name: 'Tomáš Procházka',
      initials: 'TP',
      type: 'Privátní investor',
      email: 'tomas.prochazka@email.cz',
      phone: '+420 602 987 654',
      portfolioValue: 35000000,
      activeInvestments: 6,
      preferredAmount: 7000000,
      preferredYield: 7.0,
      isActive: false,
      lastActivity: '2 měsíce',
    },
    {
      id: '6',
      name: 'Beta Capital Partners',
      initials: 'BC',
      type: 'Instituce',
      email: 'contact@betacapital.com',
      phone: '+420 734 111 222',
      portfolioValue: 500000000,
      activeInvestments: 45,
      preferredAmount: 50000000,
      preferredYield: 4.5,
      isActive: true,
      ico: '87654321',
      lastActivity: '6 hodin',
    },
  ]);

  // Výpočet počtu aktivních filtrů
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (projectForm) count += 1;
    return count;
  }, [projectForm]);

  // Výpočet otevřených/zavřených projektů pro header
  const projectCounts = useMemo(() => {
    const openCount = mockProjects.filter((project) => 
      project.status === 'Open' || project.status === 'Paused'
    ).length;
    const closedCount = mockProjects.filter((project) => 
      project.status === 'Fully reserved' || project.status === 'Finished'
    ).length;
    return { openProjectsCount: openCount, closedProjectsCount: closedCount };
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...mockProjects];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((project) =>
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.type.toLowerCase().includes(query)
      );
    }

    // Apply project status filter (show/hide closed projects)
    if (!showClosedProjects) {
      result = result.filter((project) => 
        project.status === 'Open' || project.status === 'Paused'
      );
    }

    // Apply project form filter
    if (projectForm) {
      result = result.filter((project) => {
        // Map filter values to project investmentForm values
        const formMapping: Record<string, string[]> = {
          'loan': ['Zápůjčka'],
          'majority-equity': ['Majoritní ekvita'],
          'minority-equity': ['Minoritní ekvita'],
          'project-sale': ['Prodej projektu'],
          'leaseback': ['Zpětný leasing'],
          'mezzanine': ['Mezaninové financování'],
        };
        
        const allowedForms = formMapping[projectForm] || [];
        return allowedForms.some(form => 
          project.investmentForm?.toLowerCase() === form.toLowerCase()
        );
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'relevance':
        result.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        break;
      case 'newest':
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'priority':
        result.sort((a, b) => {
          // Priority: time-limited first, then by status
          if (a.timeLimited && !b.timeLimited) return -1;
          if (!a.timeLimited && b.timeLimited) return 1;
          return 0;
        });
        break;
      case 'yield-desc':
        result.sort((a, b) => b.yieldPA - a.yieldPA);
        break;
      case 'yield-asc':
        result.sort((a, b) => a.yieldPA - b.yieldPA);
        break;
      case 'ltv-asc':
        result.sort((a, b) => a.ltv - b.ltv);
        break;
      case 'ltv-desc':
        result.sort((a, b) => b.ltv - a.ltv);
        break;
      case 'duration-asc':
        result.sort((a, b) => {
          const getMinDuration = (project: typeof a) => {
            if (project.tickets.length === 0) return 0;
            return Math.min(...project.tickets.map(t => t.duration));
          };
          return getMinDuration(a) - getMinDuration(b);
        });
        break;
      case 'duration-desc':
        result.sort((a, b) => {
          const getMinDuration = (project: typeof a) => {
            if (project.tickets.length === 0) return 0;
            return Math.min(...project.tickets.map(t => t.duration));
          };
          return getMinDuration(b) - getMinDuration(a);
        });
        break;
      case 'volume-desc':
        result.sort((a, b) => b.totalInvestmentVolume - a.totalInvestmentVolume);
        break;
      case 'volume-asc':
        result.sort((a, b) => a.totalInvestmentVolume - b.totalInvestmentVolume);
        break;
      case 'commission-desc':
        result.sort((a, b) => {
          const getTotalCommission = (project: typeof a) => {
            return project.tickets.reduce((total, ticket) => {
              return total + (ticket.investmentAmount * ticket.commission) / 100;
            }, 0);
          };
          return getTotalCommission(b) - getTotalCommission(a);
        });
        break;
      case 'commission-asc':
        result.sort((a, b) => {
          const getTotalCommission = (project: typeof a) => {
            return project.tickets.reduce((total, ticket) => {
              return total + (ticket.investmentAmount * ticket.commission) / 100;
            }, 0);
          };
          return getTotalCommission(a) - getTotalCommission(b);
        });
        break;
      case 'available-tickets':
        result.sort((a, b) => {
          const getAvailableTickets = (project: typeof a) => {
            return project.tickets.filter(t => 
              t.occupancy.current < t.occupancy.total
            ).length;
          };
          return getAvailableTickets(b) - getAvailableTickets(a);
        });
        break;
    }

    return result;
  }, [sortBy, projectStatusFilter, searchQuery, showClosedProjects, projectForm]);

  // Handlers for draft reservations
  const handleSaveDraft = (draft: DraftReservation) => {
    setDraftReservations(prev => [draft, ...prev]);
  };

  const handleContinueDraft = (draft: DraftReservation) => {
    // TODO: Navigate to project detail and restore reservation flow with draft data
    console.log('Continue draft:', draft);
    setShowDraftsPanel(false);
    setSelectedProjectId(draft.ticket.projectId || mockProjects[0].id);
  };

  const handleDeleteDraft = (draftId: string) => {
    setDraftReservations(prev => prev.filter(d => d.id !== draftId));
  };

  // Handler for adding new investor
  const handleAddInvestor = (investorData: InvestorFormData) => {
    // Generate full name
    const fullName = investorData.investorType === 'FO'
      ? `${investorData.firstName} ${investorData.lastName}`
      : investorData.companyName || '';

    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Map InvestorFormData to Investor
    const newInvestor: Investor = {
      id: `inv-${Date.now()}`,
      name: fullName,
      initials: getInitials(fullName),
      type: investorData.investorType === 'FO' ? 'Privátní investor' : 'Fond',
      email: investorData.email,
      phone: investorData.phone || '',
      portfolioValue: investorData.investmentVolumeMax || 0,
      activeInvestments: 0,
      preferredAmount: investorData.investmentVolumeMin || 0,
      preferredYield: investorData.expectedYield ? parseFloat(investorData.expectedYield.match(/\d+/)?.[0] || '0') : 0,
      isActive: true,
      notes: investorData.internalNotes,
    };

    setInvestors(prev => [newInvestor, ...prev]);
    alert(`Investor ${newInvestor.name} byl úspěšně přidán!`);
  };

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-white">
        {/* Top Header - Single Row with Logo, Navigation, and User */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between gap-8">
            {/* Left: Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded bg-[#215EF8] flex items-center justify-center">
                <span className="text-white font-semibold text-base">T</span>
              </div>
              <span className="text-xl font-semibold text-[#040F2A]">Tipari.cz</span>
            </div>

            {/* Center: Navigation */}
            <NavigationTabs 
              activePage={activePage} 
              onPageChange={(page) => {
                // ALWAYS reset state when changing pages (even if clicking same page)
                console.log('Navigation clicked:', page, 'Current:', activePage);
                
                // Reset ticket view state
                setTicketView('list');
                setSelectedTicketId(null);
                
                // Reset project detail state
                setSelectedProjectId(null);
                
                // Update active page (this will trigger re-render even if same)
                setActivePage(page);
                setPageTimestamp(Date.now()); // Force refresh
              }} 
            />

            {/* Right: User */}
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Brand Manual Button */}
              <button
                onClick={() => setActivePage('brand-manual')}
                className={`relative p-2 rounded-lg transition-colors ${
                  activePage === 'brand-manual' 
                    ? 'bg-[#215EF8]/10 text-[#215EF8]' 
                    : 'hover:bg-gray-100 text-[#6B7280]'
                }`}
                title="Logomanual platformy"
              >
                <Palette className="w-5 h-5" />
              </button>

              {/* Draft Reservations Button */}
              <button
                onClick={() => setShowDraftsPanel(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Rozpracované rezervace"
              >
                <FileText className="w-5 h-5 text-[#6B7280]" />
                {draftReservations.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#215EF8] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {draftReservations.length}
                  </span>
                )}
              </button>
              
              {/* User Profile */}
              <UserAvatar 
                userName="Jan Novák"
                userLevel="Senior"
                remainingSlots={8}
                totalSlots={15}
                unreadNotifications={2}
                onNewProject={() => {
                  console.log('🔵 Aktivace: Nahrát nový projekt z User menu');
                  setActivePage('new-project');
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8" key={`${activePage}-${pageTimestamp}`}>
          {activePage === 'tikety' ? (
            ticketView === 'list' ? (
              <TicketsPageNew 
                onViewDetail={(ticketId) => {
                  const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
                  if (ticket) {
                    setSelectedTicketId(ticketId);
                    setActivePage('projekt-detail');
                  }
                }}
                onReserve={(ticketId) => {
                  setSelectedTicketId(ticketId);
                  setTicketView('reservation');
                }}
                onOpenAddInvestor={() => {
                  console.log('🔵 Aktivace: Přidat investora z Tiketů');
                  setShowAddInvestorModal(true);
                }}
                onOpenDraftsPanel={() => {
                  console.log('🔵 Aktivace: Otevřít rozpracované z Tiketů');
                  setShowDraftsPanel(true);
                }}
                onNewProject={() => {
                  console.log('🔵 Aktivace: Nahrát nový projekt z Tiketů');
                  setActivePage('new-project');
                }}
                onOpenFAQ={() => {
                  console.log('🔵 Aktivace: Otevřít FAQ z Tiketů');
                  setShowFAQModal(true);
                }}
              />
            ) : ticketView === 'reservation' && selectedTicketId ? (
              <ReservationFlowPage
                ticket={MOCK_TICKETS.find(t => t.id === selectedTicketId) || MOCK_TICKETS[0]}
                investors={investors}
                onBack={() => {
                  setTicketView('list');
                  setSelectedTicketId(null);
                }}
                onComplete={() => {
                  setTicketView('list');
                  setSelectedTicketId(null);
                }}
                onAddInvestor={() => setShowAddInvestorModal(true)}
                onNavigateToReservations={() => {
                  setActivePage('aktivity-rezervace');
                }}
              />
            ) : null
          ) : activePage === 'new-project' ? (
            <NewProjectForm 
              onBack={() => setActivePage('tikety')}
              onComplete={() => setActivePage('listed-projects')}
            />
          ) : activePage === 'listed-projects' ? (
            <ListedProjectsPage 
              onNewProject={() => setActivePage('new-project')}
            />
          ) : activePage === 'aktivity' || activePage === 'aktivity-projekty' || activePage === 'aktivity-rezervace' ? (
            activePage === 'aktivity-projekty' ? (
              <ListedProjectsPage 
                onNewProject={() => setActivePage('new-project')}
              />
            ) : activePage === 'aktivity-rezervace' ? (
              <MyReservationsPageV2 />
            ) : (
              <ActivitiesPage 
                onNewProject={() => setActivePage('new-project')}
                onViewListedProjects={() => setActivePage('listed-projects')}
              />
            )
          ) : activePage === 'provize' || activePage === 'provize-projekty' || activePage === 'provize-rezervace' ? (
            activePage === 'provize-projekty' ? (
              <MyProjectsCommissionPage />
            ) : activePage === 'provize-rezervace' ? (
              <MyReservationsCommissionPage />
            ) : (
              <CommissionPage />
            )
          ) : activePage === 'investori' ? (
            <InvestorsPage onAddInvestor={() => setShowAddInvestorModal(true)} />
          ) : activePage === 'prehled' ? (
            <OverviewPage 
              onNavigate={(page: string) => setActivePage(page as ActivePage)}
              onOpenAddInvestor={() => setShowAddInvestorModal(true)}
              onOpenDraftsPanel={() => setShowDraftsPanel(true)}
              onNewProject={() => setActivePage('new-project')}
              onOpenFAQ={() => setShowFAQModal(true)}
            />
          ) : activePage === 'brand-manual' ? (
            <BrandManualPage onBack={() => setActivePage('tikety')} />
          ) : activePage === 'projekt-detail' && selectedTicketId ? (
            (() => {
              const ticket = MOCK_TICKETS.find(t => t.id === selectedTicketId);
              return ticket ? (
                <ProjectDetail 
                  projectId={ticket.projectId}
                  onBack={() => {
                    setActivePage('tikety');
                    setSelectedTicketId(null);
                  }}
                  onReserve={(ticketId) => {
                    setSelectedTicketId(ticketId);
                    setTicketView('reservation');
                    setActivePage('tikety');
                  }}
                />
              ) : null;
            })()
          ) : null}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-border mt-16">
          <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div>© 2025 Tipari.cz – Uzavřená B2B platforma pro investiční zprostředkování</div>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-[#040F2A] transition-colors">
                  Podmínky použití
                </a>
                <a href="#" className="hover:text-[#040F2A] transition-colors">
                  Ochrana dat
                </a>
                <a href="#" className="hover:text-[#040F2A] transition-colors">
                  Podpora
                </a>
                <button 
                  onClick={() => setActivePage('brand-manual')}
                  className="hover:text-[#040F2A] transition-colors font-medium cursor-pointer"
                >
                  Logomanual
                </button>
              </div>
            </div>
          </div>
        </footer>

        {/* Advanced Filters Panel */}
        <AdvancedFilters
          isOpen={showAdvancedFilters}
          onClose={() => setShowAdvancedFilters(false)}
          onApply={() => {
            // Aplikace pokročilých filtrů
            console.log('Pokročilé filtry aplikovány');
          }}
        />
        
        {/* Draft Reservations Panel */}
        <DraftReservationsPanel
          isOpen={showDraftsPanel}
          onClose={() => setShowDraftsPanel(false)}
          drafts={draftReservations}
          onContinueDraft={handleContinueDraft}
          onDeleteDraft={handleDeleteDraft}
        />
        
        {/* Add Investor Modal */}
        <AddInvestorModal
          isOpen={showAddInvestorModal}
          onClose={() => setShowAddInvestorModal(false)}
          onSubmit={handleAddInvestor}
        />
        
        {/* Quick Contact Modal */}
        <QuickContactModal
          isOpen={showQuickContactModal}
          onClose={() => setShowQuickContactModal(false)}
        />
        
        {/* Floating Action Menu - Global Quick Actions */}
        <FloatingActionMenu
          onAddInvestor={() => setShowAddInvestorModal(true)}
          onCreateReservation={() => {
            // Navigate to tickets page or open reservation flow
            setActivePage('tikety');
            alert('Vyberte tiket pro vytvoření rezervace');
          }}
          onQuickContact={() => setShowQuickContactModal(true)}
          onNewProject={() => setActivePage('new-project')}
        />
        
        {/* FAQ Modal */}
        <FAQModal
          isOpen={showFAQModal}
          onClose={() => setShowFAQModal(false)}
        />
        
        {/* Toaster */}
        <Toaster />
      </div>
    </NotificationProvider>
  );
}