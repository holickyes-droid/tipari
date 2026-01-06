/**
 * INVESTORS PAGE
 * Overview of investor portfolio for introducer
 * Based on Tipari.cz business model - introducer connects investors with developers
 */

import { mockInvestors, calculateInvestorSummary, InvestorStatus, InvestorType, Investor } from '../data/mockInvestors';
import { useState } from 'react';
import { Plus, Download, Mail, ChevronRight, X, Clock, Phone, Target, FileText, TrendingUp } from 'lucide-react';
import { InvestorDetail } from './InvestorDetail';
import { mockProjects } from '../data/mockProjects';
import { ReservationFlow } from './ReservationFlow';
import { InvestorAvatar } from './InvestorAvatar';
import { Tooltip } from './Tooltip';

interface InvestorsPageProps {
  onAddInvestor?: () => void;
}

export function InvestorsPage({ onAddInvestor }: InvestorsPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestorStatus | 'ALL'>('ALL');
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [showInProgressModal, setShowInProgressModal] = useState(false);
  const [selectedInvestorForModal, setSelectedInvestorForModal] = useState<Investor | null>(null);
  const [selectedReservationToResume, setSelectedReservationToResume] = useState<{
    projectId: string;
    ticketId: string;
  } | null>(null);

  // If detail view is open, show it
  if (selectedInvestor) {
    return (
      <InvestorDetail 
        investor={selectedInvestor} 
        onBack={() => setSelectedInvestor(null)}
      />
    );
  }

  // Filter investors
  const filteredInvestors = mockInvestors.filter((investor) => {
    const matchesSearch = 
      investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || investor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort by status priority (ACTIVE > PROSPECT > INACTIVE > DORMANT)
  const sortedInvestors = [...filteredInvestors].sort((a, b) => {
    const statusPriority: Record<InvestorStatus, number> = {
      'ACTIVE': 1,
      'PROSPECT': 2,
      'INACTIVE': 3,
      'DORMANT': 4,
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  // Calculate summary
  const summary = calculateInvestorSummary();

  // Status label helper
  const getStatusLabel = (status: InvestorStatus): string => {
    switch (status) {
      case 'ACTIVE': return 'Aktivní';
      case 'PROSPECT': return 'Prospekt';
      case 'INACTIVE': return 'Neaktivní';
      case 'DORMANT': return 'Pasivní';
      default: return status;
    }
  };

  // Status color helper
  const getStatusColor = (status: InvestorStatus): string => {
    switch (status) {
      case 'ACTIVE':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'PROSPECT':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'INACTIVE':
        return 'text-[#6B7280] bg-gray-100';
      case 'DORMANT':
        return 'text-[#6B7280] bg-gray-50';
      default:
        return 'text-[#6B7280] bg-gray-100';
    }
  };

  // Type label helper
  const getTypeLabel = (type: InvestorType): string => {
    switch (type) {
      case 'INDIVIDUAL': return 'Fyzická osoba';
      case 'LEGAL_ENTITY': return 'Právnická osoba';
      default: return type;
    }
  };

  // Calculate match score for investor
  const calculateMatchScore = (investor: Investor): { percentage: number; matchedTickets: number } => {
    if (!investor.preferredAssetTypes || investor.preferredAssetTypes.length === 0) {
      return { percentage: 0, matchedTickets: 0 };
    }

    // Get all available tickets from projects
    const allTickets = mockProjects.flatMap(project => 
      project.tickets.map(ticket => ({
        ...ticket,
        projectAssetClass: project.assetClass,
        projectStatus: project.status,
        ticketAvailable: ticket.occupancy.current < ticket.occupancy.total,
      }))
    );

    // Filter available tickets only
    const availableTickets = allTickets.filter(t => 
      t.ticketAvailable && t.projectStatus === 'Open'
    );

    if (availableTickets.length === 0) {
      return { percentage: 0, matchedTickets: 0 };
    }

    // Match tickets based on investor preferences
    const matchedTickets = availableTickets.filter(ticket => {
      // Check asset type match
      const assetTypeMatch = investor.preferredAssetTypes?.some(
        preferredType => ticket.projectAssetClass === preferredType
      );

      // Check investment range match
      const investmentMatch = investor.investmentRange
        ? ticket.investmentAmount >= investor.investmentRange.min &&
          ticket.investmentAmount <= investor.investmentRange.max
        : true;

      return assetTypeMatch && investmentMatch;
    });

    const percentage = Math.round((matchedTickets.length / availableTickets.length) * 100);
    return { percentage, matchedTickets: matchedTickets.length };
  };

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
    return new Date(dateStr).toLocaleDateString('cs-CZ');
  };

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Moji investoři</h1>
          <p className="text-[#6B7280]">Přehled investorského portfolia a jejich aktivit na platformě</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
            onClick={onAddInvestor}
          >
            <Plus className="w-4 h-4" />
            Přidat investora
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Celkem investorů</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{summary.total}</div>
          <div className="text-xs text-[#6B7280] mt-1">V portfoliu</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Aktivní investoři</div>
          <div className="text-2xl font-semibold text-[#14AE6B]">{summary.active}</div>
          <div className="text-xs text-[#6B7280] mt-1">S aktivními rezervacemi</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Úspěšné obchody</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{summary.totalDeals}</div>
          <div className="text-xs text-[#6B7280] mt-1">Dokončené transakce</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Úspěšnost</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{summary.conversionRate}%</div>
          <div className="text-xs text-[#6B7280] mt-1">Konverzní poměr</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Hledat podle jména, emailu nebo ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#215EF8] focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-[#215EF8] text-white'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
              }`}
            >
              Všichni
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'ACTIVE'
                  ? 'bg-[#14AE6B] text-white'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
              }`}
            >
              Aktivní
            </button>
            <button
              onClick={() => setStatusFilter('PROSPECT')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'PROSPECT'
                  ? 'bg-[#215EF8] text-white'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
              }`}
            >
              Prospekti
            </button>
          </div>
        </div>
      </div>

      {/* Investors Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#040F2A]">Portfolio investorů ({sortedInvestors.length})</h2>
          <p className="text-xs text-[#6B7280]">Detail investora otevřete kliknutím na ikonu vpravo</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-[#EAEAEA]">
              <tr>
                <th className="w-[20%] px-4 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Investor
                </th>
                <th className="w-[18%] px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="w-[13%] px-3 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Kapacita
                </th>
                <th className="w-[10%] px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Rezervace
                </th>
                <th className="w-[8%] px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Rozpr.
                </th>
                <th className="w-[8%] px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Obchody
                </th>
                <th className="w-[9%] px-2 py-3 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Shody
                </th>
                <th className="w-[14%] px-3 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#EAEAEA]">
              {sortedInvestors.map((investor) => {
                const matchScore = calculateMatchScore(investor);
                // Mock: For demo, some investors have in-progress reservations
                const inProgressCount = investor.id === 'inv-petr-novak' ? 2 : investor.id === 'inv-martin-kral' ? 1 : 0;
                
                return (
                  <tr 
                    key={investor.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Investor Name + Type (Status tag removed) */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <InvestorAvatar
                          avatarType={investor.avatar}
                          investorName={investor.name}
                          investorType={investor.type}
                          gender={investor.gender}
                          contactPersonGender={investor.contactPersonGender}
                          size="sm"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#040F2A] truncate" title={investor.name}>
                            {investor.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              investor.type === 'INDIVIDUAL' 
                                ? 'bg-blue-50 text-[#215EF8]' 
                                : 'bg-purple-50 text-purple-600'
                            }`}>
                              {investor.type === 'INDIVIDUAL' ? 'FO' : 'PO'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact - Email + Phone tooltip */}
                    <td className="px-3 py-3">
                      <div className="space-y-0.5">
                        <div className="text-xs text-[#040F2A] truncate" title={investor.email}>
                          {investor.email}
                        </div>
                        {investor.phone && (
                          <div className="text-[10px] text-[#6B7280] truncate" title={investor.phone}>
                            {investor.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Investment Capacity */}
                    <td className="px-3 py-3">
                      {investor.investmentRange ? (
                        <div className="space-y-0.5">
                          <div className="text-xs font-medium text-[#040F2A] whitespace-nowrap">
                            {formatCurrency(investor.investmentRange.min / 1000000)}M–{formatCurrency(investor.investmentRange.max / 1000000)}M
                          </div>
                          <div className="text-[10px] text-[#6B7280]">
                            Investiční kapacita
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-[#6B7280]">—</div>
                      )}
                    </td>

                    {/* Reservations (Active / Total) with tooltip */}
                    <td className="px-2 py-3">
                      {investor.activeReservations > 0 || investor.totalReservations > 0 ? (
                        <Tooltip content={
                          <div className="text-center">
                            <div className="font-medium mb-1">{investor.activeReservations} aktivních / {investor.totalReservations} celkem</div>
                            <div className="text-xs opacity-90">Schůzka potvrzena / Celková historie</div>
                          </div>
                        }>
                          <div className="w-full flex flex-col items-center gap-0.5 text-xs text-center py-1">
                            <div className="flex items-center gap-1">
                              <span className="font-semibold text-[#14AE6B]">{investor.activeReservations}</span>
                              <span className="text-[#6B7280]">/</span>
                              <span className="text-[#040F2A]">{investor.totalReservations}</span>
                            </div>
                            <span className="text-[10px] text-[#6B7280]">rezervací</span>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Investor zatím nemá žádné rezervace">
                          <div className="text-center">
                            <div className="text-xs text-[#6B7280]">—</div>
                            <div className="text-[10px] text-[#6B7280]">žádné</div>
                          </div>
                        </Tooltip>
                      )}
                    </td>

                    {/* In-Progress Reservations with tooltip */}
                    <td className="px-2 py-3">
                      {inProgressCount > 0 ? (
                        <Tooltip content={
                          <div className="text-center">
                            <div className="font-medium mb-1">{inProgressCount} rozpracovaných</div>
                            <div className="text-xs opacity-90">Nedokončený rezervační proces</div>
                            <div className="text-xs opacity-75 mt-1">Klikněte pro pokračování</div>
                          </div>
                        }>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvestorForModal(investor);
                              setShowInProgressModal(true);
                            }}
                            className="w-full flex flex-col items-center gap-0.5 hover:bg-blue-50 rounded-lg py-1 transition-colors group"
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#215EF8]" />
                              <span className="text-xs font-semibold text-[#215EF8] group-hover:text-[#1a4bc7]">{inProgressCount}</span>
                            </div>
                            <span className="text-[10px] text-[#6B7280]">aktivních</span>
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Investor nemá žádné rozpracované rezervace">
                          <div className="text-center">
                            <div className="text-xs text-[#6B7280]">—</div>
                            <div className="text-[10px] text-[#6B7280]">žádné</div>
                          </div>
                        </Tooltip>
                      )}
                    </td>

                    {/* Completed Deals with tooltip */}
                    <td className="px-2 py-3">
                      {investor.completedDeals > 0 ? (
                        <Tooltip content={
                          <div className="text-center">
                            <div className="font-medium mb-1">{investor.completedDeals} úspěšných obchodů</div>
                            <div className="text-xs opacity-90">Investor provedl investici</div>
                          </div>
                        }>
                          <div className="w-full flex flex-col items-center gap-0.5 py-1">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-[#14AE6B]" />
                              <span className="text-xs font-semibold text-[#040F2A]">{investor.completedDeals}</span>
                            </div>
                            <span className="text-[10px] text-[#6B7280]">úspěšných</span>
                          </div>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Investor zatím nedokončil žádné obchody">
                          <div className="text-center">
                            <div className="text-xs text-[#6B7280]">—</div>
                            <div className="text-[10px] text-[#6B7280]">žádné</div>
                          </div>
                        </Tooltip>
                      )}
                    </td>

                    {/* Match Score (Shody/tikety) with tooltip */}
                    <td className="px-2 py-3">
                      {matchScore.matchedTickets > 0 ? (
                        <Tooltip content={
                          <div className="text-center">
                            <div className="font-medium mb-1">{matchScore.matchedTickets} dostupných tiketů</div>
                            <div className="text-xs opacity-90">Odpovídá preferencím investora</div>
                            <div className="text-xs opacity-75 mt-1">Typ aktiva + objem investice</div>
                          </div>
                        }>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Open recommended tickets modal
                              alert(`Zobrazit ${matchScore.matchedTickets} doporučených tiketů pro ${investor.name}`);
                            }}
                            className="w-full flex flex-col items-center gap-0.5 hover:bg-blue-50 rounded-lg py-1 transition-colors group"
                          >
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3 text-[#215EF8]" />
                              <span className="text-xs font-semibold text-[#215EF8] group-hover:text-[#1a4bc7]">{matchScore.matchedTickets}</span>
                            </div>
                            <span className="text-[10px] text-[#6B7280]">shod</span>
                          </button>
                        </Tooltip>
                      ) : (
                        <Tooltip content="Momentálně nejsou dostupné žádné tikety odpovídající preferencím investora">
                          <div className="text-center">
                            <div className="text-xs text-[#6B7280]">—</div>
                            <div className="text-[10px] text-[#6B7280]">žádné</div>
                          </div>
                        </Tooltip>
                      )}
                    </td>

                    {/* Actions - Email + Detail only */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Email CTA */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${investor.email}`;
                          }}
                          className="p-2 text-[#6B7280] hover:text-[#215EF8] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Odeslat email investorovi"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        {/* Detail CTA - User icon instead of arrow */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvestor(investor);
                          }}
                          className="p-2 text-white bg-[#215EF8] hover:bg-[#1a4bc7] rounded-lg transition-colors"
                          title="Zobrazit detail investora"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {sortedInvestors.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">Žádní investoři nenalezeni podle zadaných kritérií</p>
          </div>
        )}
      </div>

      {/* In-Progress Reservations Modal */}
      {showInProgressModal && selectedInvestorForModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[#040F2A]">Rozpracované rezervace</h3>
                <p className="text-sm text-[#6B7280] mt-1">{selectedInvestorForModal.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowInProgressModal(false);
                  setSelectedInvestorForModal(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Mock In-Progress Reservations */}
                {selectedInvestorForModal.id === 'inv-petr-novak' && (
                  <>
                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 hover:border-[#215EF8] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[#040F2A]">Rezidence Nová Vinohrady</h4>
                            <span className="px-2 py-0.5 text-xs font-medium text-[#215EF8] bg-[#215EF8]/10 rounded">
                              Krok 2/5
                            </span>
                          </div>
                          <p className="text-sm text-[#6B7280]">Tiket T-001 • 500 000 Kč</p>
                        </div>
                        <Clock className="w-5 h-5 text-[#6B7280]" />
                      </div>
                      <div className="text-xs text-[#6B7280] mb-3">
                        Zahájeno: 15. 12. 2024 • Poslední aktivita: před 2 dny
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#6B7280]">
                          <strong>Aktuální stav:</strong> Výběr investorů
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReservationToResume({
                              projectId: '1',
                              ticketId: 't1-1'
                            });
                            setShowInProgressModal(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
                        >
                          Pokračovat
                        </button>
                      </div>
                    </div>

                    <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 hover:border-[#215EF8] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-[#040F2A]">Business Center Europeum</h4>
                            <span className="px-2 py-0.5 text-xs font-medium text-[#215EF8] bg-[#215EF8]/10 rounded">
                              Krok 4/5
                            </span>
                          </div>
                          <p className="text-sm text-[#6B7280]">Tiket T-006 • 1 200 000 Kč</p>
                        </div>
                        <Clock className="w-5 h-5 text-[#6B7280]" />
                      </div>
                      <div className="text-xs text-[#6B7280] mb-3">
                        Zahájeno: 10. 12. 2024 • Poslední aktivita: před 5 dny
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-[#6B7280]">
                          <strong>Aktuální stav:</strong> Potvrzení schůzky
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReservationToResume({
                              projectId: '3',
                              ticketId: 't3-1'
                            });
                            setShowInProgressModal(false);
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
                        >
                          Pokračovat
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {selectedInvestorForModal.id === 'inv-martin-kral' && (
                  <div className="bg-white border border-[#EAEAEA] rounded-lg p-4 hover:border-[#215EF8] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-[#040F2A]">Bytový komplex Rezidence Park</h4>
                          <span className="px-2 py-0.5 text-xs font-medium text-[#215EF8] bg-[#215EF8]/10 rounded">
                            Krok 3/5
                          </span>
                        </div>
                        <p className="text-sm text-[#6B7280]">Tiket T-004 • 750 000 Kč</p>
                      </div>
                      <Clock className="w-5 h-5 text-[#6B7280]" />
                    </div>
                    <div className="text-xs text-[#6B7280] mb-3">
                      Zahájeno: 18. 12. 2024 • Poslední aktivita: před 1 den
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#6B7280]">
                        <strong>Aktuální stav:</strong> Přiřazení a koordinace schůzky
                      </div>
                      <button
                        onClick={() => {
                          setSelectedReservationToResume({
                            projectId: '2',
                            ticketId: 't2-1'
                          });
                          setShowInProgressModal(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors"
                      >
                        Pokračovat
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Reservation Flow */}
      {selectedReservationToResume && (
        <ReservationFlow
          projectId={selectedReservationToResume.projectId}
          ticketId={selectedReservationToResume.ticketId}
          onClose={() => setSelectedReservationToResume(null)}
        />
      )}
    </div>
  );
}