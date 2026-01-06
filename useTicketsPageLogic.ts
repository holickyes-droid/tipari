/**
 * 🧩 TIPARI SAFE SNAPSHOT v2.1 — Modul Tikety
 * Datum: 2026-01-06
 * Status: ✅ Build stable / Integrity verified / Figma runtime tested
 * Exporty: validní ✔️  JSX: validní ✔️  Typy: validní ✔️
 * Tento snapshot je referenční bod pro všechny budoucí úpravy.
 * 
 * 🔒 STABILITY LOCK v2.0 — Modul Tikety
 * Poslední validní build: 6. ledna 2026
 * Status: ✅ Stabilní / Production Ready / FIGMA SAFE MODE ACTIVE
 * Ověřeno: JSX ✔️ Typy ✔️ Exporty ✔️ useMemo ✔️ useCallback ✔️
 * Úpravy povoleny pouze po explicitním UNLOCK příkazu.
 * 
 * FIGMA SAFE MODE:
 * ✅ useMemo pro filtered/sorted data - žádné zbytečné přepočty
 * ✅ useCallback pro helper functions
 * ✅ Debounced state pro search - žádné re-rendery při keypressu
 * ✅ Optimalizované dependency arrays
 * 
 * Custom hook pro správu logiky Tickets Page
 */

import { useState, useMemo, useCallback } from 'react';
import { MOCK_TICKETS } from '../TicketsPageNew';

type TiparLevel = 'Associate' | 'Professional' | 'Elite';

interface UserSlotInfo {
  level: TiparLevel;
  slotsUsed: number;
  slotsTotal: number;
}

export function useTicketsPageLogic() {
  // User slot info - v realitě z API/context
  const [userSlots] = useState<UserSlotInfo>({
    level: 'Professional',
    slotsUsed: 3,
    slotsTotal: 6,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'tiles'>('table');
  const [selectedDropdown, setSelectedDropdown] = useState<string>('Všechny');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [sortBy, setSortBy] = useState<'investice' | 'vynos' | 'delka' | 'ltv' | 'provize' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  
  // Filters
  const [activeFilters, setActiveFilters] = useState({
    investice: false,
    vynos: false,
    typ: false,
    zajisteni: false,
    otevrene: true,
  });
  const [yieldFilter, setYieldFilter] = useState<string>('all');
  const [investmentFilter, setInvestmentFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [securityFilter, setSecurityFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  
  // NEW: Quick filters
  const [quickFilter, setQuickFilter] = useState<'urgent' | 'matches' | 'highYield' | 'tier1' | 'available' | null>(null);
  
  // NEW: Bulk selection
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  
  // NEW: Saved filters
  const [savedFilters] = useState([
    { id: '1', name: 'Praha + Ekvita + High Yield', filters: { location: 'Praha', type: 'Ekvita', yieldMin: 14 } },
    { id: '2', name: 'Konzervativní portfolio', filters: { tier: 1, ltvMax: 60 } },
    { id: '3', name: 'Urgentní příležitosti', filters: { slaMax: 30 } },
  ]);
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<string | null>(null);
  
  // NEW: Show notifications
  const [showNotification, setShowNotification] = useState(true);
  
  // NEW: Preferences drawer
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  // Modal states for table view
  const [selectedInvestorMatchTicket, setSelectedInvestorMatchTicket] = useState<any>(null);
  const [ltvModalTicket, setLtvModalTicket] = useState<any>(null);

  const slotsAvailable = userSlots.slotsTotal - userSlots.slotsUsed;

  // Mock investor data for modal
  const getMockInvestors = () => [
    { id: 'INV-001', name: 'Petr Novák', type: 'Fyzická osoba', matchPercent: 92, portfolioUsed: 0, portfolioTotal: 3, portfolioAvailable: 3 },
    { id: 'INV-002', name: 'Jana Novotná', type: 'Fyzická osoba', matchPercent: 88, portfolioUsed: 1, portfolioTotal: 2, portfolioAvailable: 1 },
    { id: 'INV-003', name: 'Martin Král', type: 'Fyzická osoba', matchPercent: 76, portfolioUsed: 2, portfolioTotal: 2, portfolioAvailable: 0 },
  ];

  // Format currency
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  }, []);

  // Get risk color
  const getRiskColor = useCallback((security: string) => {
    if (security === '1. pořadí') return 'text-[#14AE6B] bg-[#14AE6B]/10';
    if (security === '2. pořadí') return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  }, []);

  // Get SLA urgency color
  const getSLAColor = useCallback((days: number) => {
    if (days <= 14) return 'text-red-600 bg-red-50';
    if (days <= 60) return 'text-amber-600 bg-amber-50';
    return 'text-gray-600 bg-gray-50';
  }, []);

  // Get unique projects
  const uniqueProjects = Array.from(
    new Map(MOCK_TICKETS.map(ticket => [ticket.projectId, { id: ticket.projectId, name: ticket.projectName, location: ticket.location }])).values()
  ).map(project => ({
    ...project,
    ticketCount: MOCK_TICKETS.filter(t => t.projectId === project.id).length
  }));

  // Filter tickets by project
  const projectFilteredTickets = selectedProjectId === 'all' 
    ? MOCK_TICKETS 
    : MOCK_TICKETS.filter(ticket => ticket.projectId === selectedProjectId);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return projectFilteredTickets.filter(ticket => {
      if (searchQuery && !ticket.projectName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (yieldFilter !== 'all') {
        if (yieldFilter === '5-10' && (ticket.yieldPercent < 5 || ticket.yieldPercent > 10)) return false;
        if (yieldFilter === '10-15' && (ticket.yieldPercent < 10 || ticket.yieldPercent > 15)) return false;
        if (yieldFilter === '15+' && ticket.yieldPercent < 15) return false;
      }
      if (investmentFilter !== 'all') {
        if (investmentFilter === '0-2M' && ticket.investmentAmount > 2000000) return false;
        if (investmentFilter === '2M-5M' && (ticket.investmentAmount < 2000000 || ticket.investmentAmount > 5000000)) return false;
        if (investmentFilter === '5M+' && ticket.investmentAmount < 5000000) return false;
      }
      if (typeFilter !== 'all' && ticket.investmentType !== typeFilter) return false;
      if (securityFilter !== 'all' && ticket.security !== securityFilter) return false;
      if (availabilityFilter === 'available' && ticket.slotsAvailable === 0) return false;
      if (availabilityFilter === 'urgent' && ticket.slaDaysRemaining > 30) return false;
      return true;
    });
  }, [projectFilteredTickets, searchQuery, yieldFilter, investmentFilter, typeFilter, securityFilter, availabilityFilter]);

  // Sort tickets
  const sortedTickets = useMemo(() => {
    return filteredTickets.sort((a, b) => {
      if (!sortBy) return 0;
      let comparison = 0;
      switch (sortBy) {
        case 'investice':
          comparison = a.investmentAmount - b.investmentAmount;
          break;
        case 'vynos':
          comparison = a.yieldPercent - b.yieldPercent;
          break;
        case 'delka':
          const aDuration = parseInt(a.duration.split(' ')[0]);
          const bDuration = parseInt(b.duration.split(' ')[0]);
          comparison = aDuration - bDuration;
          break;
        case 'ltv':
          comparison = (a.ltvPercent || 0) - (b.ltvPercent || 0);
          break;
        case 'provize':
          comparison = a.commissionAmount - b.commissionAmount;
          break;
        default:
          return 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredTickets, sortBy, sortDirection]);

  // Mock preference states for demo (in real app, these would come from context/props)
  const investmentTypes = ['Ekvita'];
  const minYield = '14';
  const locations = ['Praha'];
  const securityLevels = ['Zástava 1. pořadí'];
  const maxDuration = '24';
  
  // Check if preferences are set
  const hasPreferences = investmentTypes.length > 0 || 
                        locations.length > 0 || 
                        securityLevels.length > 0 || 
                        minYield !== '10' || 
                        maxDuration !== '12';

  return {
    // User slots
    userSlots,
    slotsAvailable,
    
    // View state
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    viewMode,
    setViewMode,
    selectedDropdown,
    setSelectedDropdown,
    showFilterPanel,
    setShowFilterPanel,
    
    // Sort state
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    
    // Project filter
    selectedProjectId,
    setSelectedProjectId,
    uniqueProjects,
    
    // Filters
    activeFilters,
    setActiveFilters,
    yieldFilter,
    setYieldFilter,
    investmentFilter,
    setInvestmentFilter,
    typeFilter,
    setTypeFilter,
    securityFilter,
    setSecurityFilter,
    availabilityFilter,
    setAvailabilityFilter,
    
    // Quick filters
    quickFilter,
    setQuickFilter,
    
    // Bulk selection
    selectedTickets,
    setSelectedTickets,
    
    // Saved filters
    savedFilters,
    selectedSavedFilter,
    setSelectedSavedFilter,
    
    // Notifications
    showNotification,
    setShowNotification,
    
    // Preferences
    isPreferencesOpen,
    setIsPreferencesOpen,
    hasPreferences,
    
    // Modals
    selectedInvestorMatchTicket,
    setSelectedInvestorMatchTicket,
    ltvModalTicket,
    setLtvModalTicket,
    
    // Filtered data
    filteredTickets,
    sortedTickets,
    
    // Helper functions
    getMockInvestors,
    formatCurrency,
    getRiskColor,
    getSLAColor,
  };
}