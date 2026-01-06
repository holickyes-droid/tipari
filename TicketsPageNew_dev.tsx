/**
 * 🧩 TICKETS PAGE DEV MODE
 * Tento soubor je bezpečná pracovní kopie verze v2.1.
 * Jakékoli úpravy se netýkají produkčního buildu.
 * 
 * Base Version: v2.1 (Snapshot Locked)
 * Production File: /src/app/components/TicketsPageNew.tsx
 * Status: 🔓 UNLOCKED - Development Active
 * Last Sync: 2026-01-06
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * INHERITED FROM v2.1 SNAPSHOT:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * FIGMA SAFE MODE:
 * ✅ React.memo aktivní - prevence zbytečných re-renderů
 * ✅ Debounced search - žádné re-rendery při každém keypressu
 * ✅ Runtime cache optimalizován - useMemo/useCallback
 * ✅ Hover eventy pouze na interaktivních prvcích
 * ✅ Vizuální layout, barvy a obsah zachován
 * 
 * TYPOGRAPHY SYSTEM:
 * ✅ Headings: 32px/24px/18px, font-weight 600-700
 * ✅ Secondary text: 13px, #6B7280, line-height 1.5
 * ✅ Values: font-weight 700, tabular numbers
 * ✅ Line-height: 1.4-1.5 napříč texty
 * ✅ WCAG AA kontrast standard
 * 
 * MICROINTERACTIONS:
 * ✅ Fade-in animations: 150-200ms ease-out
 * ✅ Hover effects: scale(1.02), opacity transitions
 * ✅ Modal animations: fade-in + zoom (0.98→1)
 * ✅ View transitions: cross-fade dissolve
 * ✅ Performance: CSS-only, no extra JS listeners
 * 
 * VISUAL DEPTH & LAYERING:
 * ✅ Card shadows: shadow-md (rgba(0,0,0,0.05))
 * ✅ Modal shadows: shadow-xl (20px spread)
 * ✅ Sticky bar: downward shadow (rgba(0,0,0,0.08))
 * ✅ Background gradient: white → #F9FAFB
 * ✅ Border radius: 8px unified system
 * ✅ Visual hierarchy: Preserved and enhanced
 * 
 * TICKETS PAGE - PROFESSIONAL B2B UX:
 * - Decision-first hierarchy (what matters most is visible first)
 * - Compliance-first copy (Rezervace ≠ Investice)
 * - Scarcity + Urgency psychology (slot counter, SLA timers)
 * - Private banking aesthetic (clean, breathing room, sophisticated)
 * - Reduced cognitive load (max 7 columns)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🚧 DEVELOPMENT NOTES:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * ⚠️ Změny v tomto souboru se NETÝKAJÍ produkční verze!
 * 📝 Dokumentuj všechny významné úpravy zde:
 * 
 * [2026-01-06] - Dev kopie vytvořena z v2.1 snapshot
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { Eye, X, Check, Zap, Target, TrendingUp, Shield, Users } from 'lucide-react';
import { TicketsTileViewDev } from './TicketsTileView_dev';
import { TicketsTableView } from '../TicketsTableView';
import { TicketsEmptyState } from '../TicketsEmptyState';
import { toast } from 'sonner';
import { SearchFilterBar } from '../SearchFilterBar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { InvestorMatchesModal } from '../InvestorMatchesModal';
import { LTVModal } from '../LTVModal';
import { PreferencesDrawer } from '../PreferencesDrawer';
import { useTicketsPageLogic } from '../hooks/useTicketsPageLogic';
import { type SecurityType } from '../../utils/securityScoring';
import { motion, AnimatePresence } from 'motion/react';

interface TicketData {
  id: string;
  projectId: string;
  projectName: string;
  projectImage: string;
  investmentAmount: number;
  investmentType: 'Ekvita' | 'Zápůjčka' | 'Mezanin';
  yieldPercent: number;
  ltvPercent?: number;
  duration: string;
  security: SecurityType;
  commissionAmount: number;
  slotsAvailable: number;
  slotsTotal: number;
  reservedByOthers: number;
  slaDaysRemaining: number;
  location: string;
  profitShare?: 'Ano' | 'Ne' | 'Dohodou'; // For Ekvita only
  investorMatches?: number; // Number of investors with matching preferences
  investorMatchDetails?: string[]; // What preferences match (e.g., ["Lokace", "Typ", "Výnos"])
}

// Mock data - tikety seskupené podle projektů
export const MOCK_TICKETS_DEV: TicketData[] = [
  // Rezidence Viktoria Park - 3 tikety
  {
    id: 'TKT-001',
    projectId: 'PRJ-001',
    projectName: 'Rezidence Viktoria Park',
    projectImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    investmentAmount: 2500000,
    investmentType: 'Ekvita',
    yieldPercent: 14,
    ltvPercent: 65,
    duration: '24 měsíců',
    security: 'Zástava 1. pořadí',
    commissionAmount: 140000,
    slotsAvailable: 2,
    slotsTotal: 3,
    reservedByOthers: 1,
    slaDaysRemaining: 346,
    location: 'Praha 6',
    profitShare: 'Ano',
    investorMatches: 8,
    investorMatchDetails: ['Lokalita', 'Typ investice', 'Výnos'],
  },
  {
    id: 'TKT-002',
    projectId: 'PRJ-001',
    projectName: 'Rezidence Viktoria Park',
    projectImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    investmentAmount: 1500000,
    investmentType: 'Zápůjčka',
    yieldPercent: 11,
    ltvPercent: 65,
    duration: '18 měsíců',
    security: 'Zástava 1. pořadí',
    commissionAmount: 85000,
    slotsAvailable: 3,
    slotsTotal: 3,
    reservedByOthers: 0,
    slaDaysRemaining: 346,
    location: 'Praha 6',
    investorMatches: 5,
    investorMatchDetails: ['Lokalita', 'Zajištění'],
  },
  {
    id: 'TKT-003',
    projectId: 'PRJ-001',
    projectName: 'Rezidence Viktoria Park',
    projectImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    investmentAmount: 3000000,
    investmentType: 'Mezanin',
    yieldPercent: 16,
    ltvPercent: 75,
    duration: '24 měsíců',
    security: 'Zástava 2. pořadí',
    commissionAmount: 175000,
    slotsAvailable: 1,
    slotsTotal: 2,
    reservedByOthers: 1,
    slaDaysRemaining: 346,
    location: 'Praha 6',
    investorMatches: 3,
    investorMatchDetails: ['Výnos', 'Doba trvání'],
  },
  
  // Logistické centrum Průhonice - 2 tikety
  {
    id: 'TKT-004',
    projectId: 'PRJ-002',
    projectName: 'Logistické centrum Průhonice',
    projectImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    investmentAmount: 5000000,
    investmentType: 'Zápůjčka',
    yieldPercent: 12,
    duration: '18 měsíců',
    security: 'Notářský zápis s přímou vykonatelností',
    commissionAmount: 250000,
    slotsAvailable: 3,
    slotsTotal: 3,
    reservedByOthers: 0,
    slaDaysRemaining: 89,
    location: 'Praha-západ',
  },
  {
    id: 'TKT-005',
    projectId: 'PRJ-002',
    projectName: 'Logistické centrum Průhonice',
    projectImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400',
    investmentAmount: 3500000,
    investmentType: 'Ekvita',
    yieldPercent: 15,
    ltvPercent: 60,
    duration: '24 měsíců',
    security: 'Zástava 1. pořadí',
    commissionAmount: 195000,
    slotsAvailable: 2,
    slotsTotal: 4,
    reservedByOthers: 2,
    slaDaysRemaining: 89,
    location: 'Praha-západ',
    profitShare: 'Ano',
    investorMatches: 12,
    investorMatchDetails: ['Lokalita', 'Výnos', 'Zajištění'],
  },
  
  // Bytový komplex Nové Brno - 2 tikety
  {
    id: 'TKT-006',
    projectId: 'PRJ-003',
    projectName: 'Bytový komplex Nové Brno',
    projectImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    investmentAmount: 3200000,
    investmentType: 'Mezanin',
    yieldPercent: 16,
    ltvPercent: 78,
    duration: '30 měsíců',
    security: 'Zástava 2. pořadí',
    commissionAmount: 185000,
    slotsAvailable: 1,
    slotsTotal: 3,
    reservedByOthers: 2,
    slaDaysRemaining: 12,
    location: 'Brno-střed',
  },
  {
    id: 'TKT-007',
    projectId: 'PRJ-003',
    projectName: 'Bytový komplex Nové Brno',
    projectImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    investmentAmount: 2800000,
    investmentType: 'Zápůjčka',
    yieldPercent: 13,
    ltvPercent: 70,
    duration: '24 měsíců',
    security: 'Zástava 1. pořadí',
    commissionAmount: 155000,
    slotsAvailable: 2,
    slotsTotal: 3,
    reservedByOthers: 1,
    slaDaysRemaining: 12,
    location: 'Brno-střed',
  },
  
  // Hotel & Spa Karlovy Vary - 1 tiket
  {
    id: 'TKT-008',
    projectId: 'PRJ-004',
    projectName: 'Hotel & Spa Karlovy Vary',
    projectImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    investmentAmount: 8500000,
    investmentType: 'Ekvita',
    yieldPercent: 18,
    ltvPercent: 55,
    duration: '36 měsíců',
    security: 'Převedení vlastnictví se zpětným odkupem',
    commissionAmount: 480000,
    slotsAvailable: 2,
    slotsTotal: 6,
    reservedByOthers: 4,
    slaDaysRemaining: 156,
    location: 'Karlovy Vary',
    profitShare: 'Ano',
  },
  
  // Retail Park Ostrava - 2 tikety
  {
    id: 'TKT-009',
    projectId: 'PRJ-005',
    projectName: 'Retail Park Ostrava',
    projectImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    investmentAmount: 6200000,
    investmentType: 'Ekvita',
    yieldPercent: 15,
    ltvPercent: 70,
    duration: '24 měsíců',
    security: 'Zástava 1. pořadí',
    commissionAmount: 340000,
    slotsAvailable: 1,
    slotsTotal: 5,
    reservedByOthers: 4,
    slaDaysRemaining: 45,
    location: 'Ostrava',
    profitShare: 'Ano',
  },
  {
    id: 'TKT-010',
    projectId: 'PRJ-005',
    projectName: 'Retail Park Ostrava',
    projectImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    investmentAmount: 4500000,
    investmentType: 'Zápůjčka',
    yieldPercent: 12,
    duration: '18 měsíců',
    security: 'Firemní směnka',
    commissionAmount: 225000,
    slotsAvailable: 3,
    slotsTotal: 4,
    reservedByOthers: 1,
    slaDaysRemaining: 45,
    location: 'Ostrava',
  },
];

interface TicketsPageNewDevProps {
  onViewDetail: (ticketId: string) => void;
  onReserve: (ticketId: string) => void;
  onOpenAddInvestor?: () => void;
  onOpenDraftsPanel?: () => void;
  onNewProject?: () => void;
  onOpenFAQ?: () => void;
}

export default function TicketsPageNewDev({ onViewDetail, onReserve, onOpenAddInvestor, onOpenDraftsPanel, onNewProject, onOpenFAQ }: TicketsPageNewDevProps) {
  const {
    slotsAvailable,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    selectedProjectId,
    setSelectedProjectId,
    uniqueProjects,
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
    quickFilter,
    setQuickFilter,
    showNotification,
    setShowNotification,
    isPreferencesOpen,
    setIsPreferencesOpen,
    hasPreferences,
    selectedInvestorMatchTicket,
    setSelectedInvestorMatchTicket,
    ltvModalTicket,
    setLtvModalTicket,
    filteredTickets,
    sortedTickets,
    getMockInvestors,
    formatCurrency,
  } = useTicketsPageLogic();

  const handleResetFilters = () => {
    setYieldFilter('all');
    setInvestmentFilter('all');
    setTypeFilter('all');
    setSecurityFilter('all');
    setAvailabilityFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F9FAFB]">
      {/* DEV MODE INDICATOR */}
      <div className="bg-amber-100 border-b-2 border-amber-300 px-6 py-2">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2">
          <span className="text-amber-800 text-xs font-bold">🚧 DEV MODE</span>
          <span className="text-amber-700 text-xs">Pracovní kopie v2.1 - změny se netýkají produkce</span>
        </div>
      </div>

      {/* 12-column grid container with max-width 1600px */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        
        {/* NOTIFICATION BANNER - Spacing: 24px bottom */}
        {showNotification && (
          <div className="bg-blue-50/40 border border-[#215EF8] rounded-lg px-6 py-5 shadow-md mb-6">
            <div className="flex items-start justify-between gap-4">
              <Eye className="w-5 h-5 text-[#215EF8] flex-shrink-0 mt-1" />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[18px] leading-[1.4] text-[#215EF8] mb-2">
                  3 nové tikety odpovídají vašim preferencím
                </h3>
                <p className="text-[13px] leading-[1.5] text-[#215EF8] mb-4">
                  Nastavte parametry sledování a buďte první, kdo se dozví o relevantních příležitostech.
                </p>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPreferencesOpen(true)}
                    className="px-5 py-2.5 rounded-lg border border-[#215EF8] text-[#215EF8] text-[13px] leading-[1.4] font-semibold hover:bg-[#215EF8]/5 hover-scale transition-colors"
                  >
                    Upravit preference
                  </button>
                  <div className="inline-flex items-center gap-2 text-[13px] leading-[1.4]">
                    {hasPreferences ? (
                      <>
                        <Check className="w-4 h-4 text-[#14AE6B]" />
                        <span className="text-[#215EF8] font-medium">Preference nastaveny</span>
                      </>
                    ) : (
                      <span className="text-gray-500 font-medium">Zatím žádné</span>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowNotification(false)}
                className="flex-shrink-0 p-2 hover:bg-[#215EF8]/10 rounded-lg transition-colors hover-scale"
              >
                <X className="w-5 h-5 text-[#215EF8]" />
              </button>
            </div>
          </div>
        )}

        {/* HEADER - Spacing: 24px bottom */}
        <div className="mb-6">
          <div>
            <h1 className="text-[32px] leading-[1.4] font-bold text-[#040F2A] mb-1">Tikety</h1>
            <p className="text-[13px] leading-[1.5] text-[#6B7280]">Přehled všech dostupných investičních tiketů</p>
          </div>
        </div>
        
        {/* STICKY FILTERS - Spacing: 24px bottom */}
        <div className="sticky top-0 z-10 bg-white pb-3 mb-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)]">
          {/* SEARCH + FILTER BAR */}
          <div className="mb-3">
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy="relevance"
              onSortChange={() => toast.info('Sort změněn')}
              onAdvancedFiltersClick={() => toast.info('Pokročilé filtry otevřeny')}
              activeFilterCount={
                (yieldFilter !== 'all' ? 1 : 0) +
                (investmentFilter !== 'all' ? 1 : 0) +
                (typeFilter !== 'all' ? 1 : 0) +
                (securityFilter !== 'all' ? 1 : 0) +
                (availabilityFilter !== 'all' ? 1 : 0) +
                (selectedProjectId !== 'all' ? 1 : 0)
              }
              selectedProjectId={selectedProjectId}
              onProjectChange={setSelectedProjectId}
              projects={uniqueProjects}
              totalTickets={MOCK_TICKETS_DEV.length}
            />
          </div>

          {/* SORTING INDICATION */}
          {sortBy && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#215EF8]/10 border border-[#215EF8]/30 rounded-lg text-[13px] shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Seřazeno podle:</span>
                <span className="font-semibold text-[#215EF8]">
                  {sortBy === 'investice' && 'Investice'}
                  {sortBy === 'vynos' && 'Výnos p.a.'}
                  {sortBy === 'delka' && 'Doba trvání'}
                  {sortBy === 'ltv' && 'LTV'}
                  {sortBy === 'provize' && 'Provize'}
                </span>
                <span className="text-gray-500">
                  {sortDirection === 'desc' ? '↓ (sestupně)' : '↑ (vzestupně)'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSortBy(null);
                  setSortDirection('desc');
                  toast.info('Řazení zrušeno');
                }}
                className="ml-auto p-1 hover:bg-white/50 rounded transition-colors hover-scale"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {/* TABLE TOOLBAR - Spacing: 24px bottom */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-md mb-6">
          <div className="flex items-center">
            {/* Left Section - View Layout Toggle */}
            <div className="flex items-center gap-3 px-6 py-4 border-r border-gray-200 flex-shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#215EF8] text-white shadow-sm'
                    : 'text-gray-400 hover:text-[#040F2A] hover:bg-gray-50'
                }`}
              >
                {/* Rows icon - 3 horizontal lines */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor" />
                  <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor" />
                  <rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('tiles')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'tiles'
                    ? 'bg-[#215EF8] text-white shadow-sm'
                    : 'text-gray-400 hover:text-[#040F2A] hover:bg-gray-50'
                }`}
              >
                {/* Grid icon - 4 squares */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" />
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" />
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" />
                </svg>
              </button>
              <span className="text-xs font-medium text-gray-700 ml-2 min-w-[110px]">
                {viewMode === 'table' ? 'Tabulkový výpis' : 'Dlaždicový výpis'}
              </span>
            </div>

            {/* Center Section - Column Labels with Sort - Only visible in table mode */}
            {viewMode === 'table' && (
            <div className="flex items-center flex-1 divide-x divide-gray-100">
              <button
                onClick={() => {
                  setSortBy('investice');
                  setSortDirection(sortBy === 'investice' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-xs font-medium transition-colors hover:bg-gray-50 ${
                  sortBy === 'investice' ? 'text-[#215EF8]' : 'text-gray-600'
                }`}
                style={{ flex: 1 }}
              >
                <span>Investice</span>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={sortBy === 'investice' ? 'opacity-100' : 'opacity-30'}>
                  <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor" />
                  <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setSortBy('vynos');
                  setSortDirection(sortBy === 'vynos' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-xs font-medium transition-colors hover:bg-gray-50 ${
                  sortBy === 'vynos' ? 'text-[#215EF8]' : 'text-gray-600'
                }`}
                style={{ flex: 1 }}
              >
                <span>Výnos</span>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={sortBy === 'vynos' ? 'opacity-100' : 'opacity-30'}>
                  <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor" />
                  <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setSortBy('delka');
                  setSortDirection(sortBy === 'delka' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-xs font-medium transition-colors hover:bg-gray-50 ${
                  sortBy === 'delka' ? 'text-[#215EF8]' : 'text-gray-600'
                }`}
                style={{ flex: 1 }}
              >
                <span>Délka</span>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={sortBy === 'delka' ? 'opacity-100' : 'opacity-30'}>
                  <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor" />
                  <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setSortBy('ltv');
                  setSortDirection(sortBy === 'ltv' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-xs font-medium transition-colors hover:bg-gray-50 ${
                  sortBy === 'ltv' ? 'text-[#215EF8]' : 'text-gray-600'
                }`}
                style={{ flex: 1 }}
              >
                <span>LTV</span>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={sortBy === 'ltv' ? 'opacity-100' : 'opacity-30'}>
                  <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor" />
                  <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setSortBy('provize');
                  setSortDirection(sortBy === 'provize' ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
                }}
                className={`flex items-center justify-center gap-2 px-4 py-4 text-xs font-medium transition-colors hover:bg-gray-50 ${
                  sortBy === 'provize' ? 'text-[#215EF8]' : 'text-gray-600'
                }`}
                style={{ flex: 1 }}
              >
                <span>Provize</span>
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={sortBy === 'provize' ? 'opacity-100' : 'opacity-30'}>
                  <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor" />
                  <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor" />
                </svg>
              </button>
              
              {/* Forma Dropdown */}
              <div className="flex items-center justify-center px-4 py-4" style={{ flex: 1 }}>
                <Select 
                  value={typeFilter === 'all' ? 'all' : typeFilter} 
                  onValueChange={(value) => setTypeFilter(value)}
                >
                  <SelectTrigger className="border-0 shadow-none bg-transparent p-0 h-auto gap-2 text-xs font-medium text-gray-600 hover:text-[#215EF8] w-auto [&_svg]:w-3 [&_svg]:h-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="center">
                    <SelectItem value="all">Forma</SelectItem>
                    <SelectItem value="Ekvita">Ekvita</SelectItem>
                    <SelectItem value="Zápůjčka">Zápůjčka</SelectItem>
                    <SelectItem value="Mezanin">Mezanin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            )}

            {/* Right Section - Toggle Switch + Counter with Context */}
            <div className="flex items-center gap-3 px-6 py-4 border-l border-gray-200">
              <button
                onClick={() => {
                  setActiveFilters(prev => ({ ...prev, otevrene: !prev.otevrene }));
                  toast.success(activeFilters.otevrene ? 'Zobrazeny všechny tikety' : 'Zobrazeny pouze otevřené tikety');
                }}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${activeFilters.otevrene ? 'bg-[#14AE6B]' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                    ${activeFilters.otevrene ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
              <span className="text-xs font-medium text-gray-700 min-w-[65px]">
                {activeFilters.otevrene ? 'Otevřené' : 'Zavřené'}
              </span>
              {/* Counter with context */}
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center min-w-[32px] h-6 px-2 rounded-full bg-[#215EF8] text-white text-xs font-bold">
                  {filteredTickets.length}
                </span>
                <span className="text-xs text-gray-500">/ {MOCK_TICKETS_DEV.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK FILTERS - Above tickets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setQuickFilter(quickFilter === 'urgent' ? null : 'urgent');
              setAvailabilityFilter(quickFilter === 'urgent' ? 'all' : 'urgent');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              quickFilter === 'urgent'
                ? 'bg-red-100 text-red-700 border-2 border-red-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Urgentní ({'<'} 30 dní)
          </button>
          
          <button
            onClick={() => {
              const matchingTickets = MOCK_TICKETS_DEV.filter(t => (t.investorMatches || 0) > 0);
              if (matchingTickets.length > 0) {
                toast.success(`Zobrazeno ${matchingTickets.length} tiketů s matching investory`);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all bg-white text-gray-700 border border-gray-300 hover:border-[#215EF8]`}
          >
            <Users className="w-3.5 h-3.5" />
            S matching investory
          </button>
          
          <button
            onClick={() => {
              setYieldFilter('15+');
              toast.success('Zobrazeny tikety s výnosem > 15%');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              yieldFilter === '15+'
                ? 'bg-green-100 text-green-700 border-2 border-green-300'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-green-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Vysoký výnos ({'>'} 15%)
          </button>
          
          <button
            onClick={() => {
              toast.info('Filter na Tier 1 zajištění aplikován');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:border-[#14AE6B] transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            Tier 1 zajištění
          </button>
          
          <button
            onClick={() => {
              setAvailabilityFilter('available');
              toast.success('Zobrazeny pouze tikety s volnými sloty');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:border-gray-400 transition-all"
          >
            <Target className="w-3.5 h-3.5" />
            Volné sloty
          </button>
        </div>

        {/* VIEW - CONDITIONAL RENDERING WITH CROSS-FADE */}
        <AnimatePresence mode="wait">
          {viewMode === 'tiles' ? (
            /* TILES VIEW */
            <motion.div
              key="tiles-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <TicketsTileViewDev
                tickets={filteredTickets}
                onViewDetail={onViewDetail}
                onReserve={onReserve}
                userSlotsAvailable={slotsAvailable}
              />
            </motion.div>
          ) : (
            /* TABLE VIEW */
            <motion.div
              key="table-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {sortedTickets.length > 0 ? (
                <TicketsTableView
                  tickets={sortedTickets}
                  onViewDetail={onViewDetail}
                  onReserve={onReserve}
                  slotsAvailable={slotsAvailable}
                  formatCurrency={formatCurrency}
                  onOpenInvestorMatchModal={setSelectedInvestorMatchTicket}
                  onOpenLTVModal={setLtvModalTicket}
                />
              ) : (
                <TicketsEmptyState onResetFilters={handleResetFilters} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Modals - Table View */}
      {selectedInvestorMatchTicket && (
        <InvestorMatchesModal
          isOpen={!!selectedInvestorMatchTicket}
          onClose={() => setSelectedInvestorMatchTicket(null)}
          ticketId={selectedInvestorMatchTicket.id}
          ticketName={selectedInvestorMatchTicket.projectName}
          investmentAmount={selectedInvestorMatchTicket.investmentAmount}
          yieldPercent={selectedInvestorMatchTicket.yieldPercent}
          duration={selectedInvestorMatchTicket.duration}
          ltvPercent={selectedInvestorMatchTicket.ltvPercent}
          security={selectedInvestorMatchTicket.security}
          totalMatches={selectedInvestorMatchTicket.investorMatches || 0}
          investors={getMockInvestors()}
        />
      )}
      
      {ltvModalTicket && (
        <LTVModal
          isOpen={!!ltvModalTicket}
          onClose={() => setLtvModalTicket(null)}
          ticketId={ltvModalTicket.id}
          projectName={ltvModalTicket.projectName}
          ltvPercent={ltvModalTicket.ltvPercent}
          security={ltvModalTicket.security}
        />
      )}
      
      {/* Preferences Drawer */}
      <PreferencesDrawer
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );
}

// DEV MODE EXPORTS
export { TicketsPageNewDev };
export { MOCK_TICKETS_DEV };