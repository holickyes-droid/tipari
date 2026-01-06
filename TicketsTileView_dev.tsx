/**
 * 🧩 TICKETS TILE VIEW DEV MODE
 * Tento soubor je bezpečná pracovní kopie verze v2.1.
 * Jakékoli úpravy se netýkají produkčního buildu.
 * 
 * Base Version: v2.1 (Snapshot Locked)
 * Production File: /src/app/components/TicketsTileView.tsx
 * Status: 🔓 UNLOCKED - Development Active
 * Last Sync: 2026-01-06
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * INHERITED FROM v2.1 SNAPSHOT:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * TICKETS TILE VIEW - B2B MINIMAL DESIGN
 * Profesionálně čisté dlaždicové zobrazení tiketů s private banking estetikou
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🚧 DEVELOPMENT NOTES:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * [2026-01-06] - Dev kopie vytvořena z v2.1 snapshot
 * [2026-01-06] - Visual enhancements:
 *   • Border-radius: 8px → 12px (modernější look)
 *   • Hover efekt: scale-[1.01] + shadow-xl (jemnější animace)
 *   • Modrá barva: #215EF8 → #1E4EEB (změkčená)
 *   • Card padding: p-4 → p-5 (více prostoru)
 *   • Tlačítko Rezervovat: py-4 + ikona 🎟️ (větší prominence)
 *   • Název projektu: větší písmo (text-lg font-bold)
 *   • Mini avatar u "Shody s investory" (placeholder iniciály)
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import React from 'react';
import { MapPin, TrendingUp, Shield, Clock, DollarSign, Eye, Ticket, Calendar, Target, Info, Users, FileText } from 'lucide-react';
import { calculateSecurityScore, type SecurityType } from '../../utils/securityScoring';
import { useState } from 'react';
import { InvestorMatchesModal } from '../InvestorMatchesModal';
import { LTVModal } from '../LTVModal';

interface TicketData {
  id: string;
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
  profitShare?: 'Ano' | 'Ne' | 'Dohodou';
  investorMatches?: number;
  investorMatchDetails?: string[];
}

interface TicketsTileViewDevProps {
  tickets: TicketData[];
  onViewDetail: (ticketId: string) => void;
  onReserve: (ticketId: string) => void;
  userSlotsAvailable: number;
}

export function TicketsTileViewDev({ tickets, onViewDetail, onReserve, userSlotsAvailable }: TicketsTileViewDevProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (security: SecurityType) => {
    const score = calculateSecurityScore(security);
    if (score >= 80) return 'text-[#14AE6B] bg-[#14AE6B]/10';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const getSLAColor = (days: number) => {
    if (days <= 14) return 'text-red-600 bg-red-50';
    if (days <= 60) return 'text-amber-600 bg-amber-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getTypeColor = (type: string) => {
    if (type === 'Ekvita') return 'bg-purple-100 text-purple-700';
    if (type === 'Zápůjčka') return 'bg-blue-100 text-blue-700';
    return 'bg-orange-100 text-orange-700';
  };

  const getProfitShareBadge = (profitShare?: string) => {
    if (!profitShare) return null;
    
    const colors = {
      'Ano': 'bg-green-50 text-green-700 border-green-200',
      'Ne': 'bg-gray-50 text-gray-700 border-gray-200',
      'Dohodou': 'bg-blue-50 text-blue-700 border-blue-200',
    };

    const labels = {
      'Ano': 'Podíl na zisku',
      'Ne': 'Bez podílu na zisku',
      'Dohodou': 'Podíl k dohodě',
    };

    return (
      <div className={`px-2.5 py-1 rounded border text-[11px] font-semibold ${colors[profitShare as keyof typeof colors]}`}>
        {labels[profitShare as keyof typeof labels]}
      </div>
    );
  };

  // Helper to get initials from investor count
  const getInvestorInitials = (count: number) => {
    if (count >= 10) return '10+';
    return count.toString();
  };

  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [ltvModalTicket, setLtvModalTicket] = useState<TicketData | null>(null);

  // Mock investor data for modal
  const getMockInvestors = () => [
    { id: 'INV-001', name: 'Petr Novák', type: 'Fyzická osoba', matchPercent: 92, portfolioUsed: 0, portfolioTotal: 3, portfolioAvailable: 3 },
    { id: 'INV-002', name: 'Jana Novotná', type: 'Fyzická osoba', matchPercent: 88, portfolioUsed: 1, portfolioTotal: 2, portfolioAvailable: 1 },
    { id: 'INV-003', name: 'Martin Král', type: 'Fyzická osoba', matchPercent: 76, portfolioUsed: 2, portfolioTotal: 2, portfolioAvailable: 0 },
  ];

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16">
        <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="font-semibold text-gray-900 mb-1">Žádné tikety nenalezeny</p>
        <p className="text-sm text-gray-600">Zkuste upravit filtry nebo vyhledávání</p>
      </div>
    );
  }

  return (
    <>
      {/* Investor Matches Modal */}
      {selectedTicket && (
        <InvestorMatchesModal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          ticketId={selectedTicket.id}
          ticketName={selectedTicket.projectName}
          investmentAmount={selectedTicket.investmentAmount}
          yieldPercent={selectedTicket.yieldPercent}
          duration={selectedTicket.duration}
          ltvPercent={selectedTicket.ltvPercent}
          security={selectedTicket.security}
          totalMatches={selectedTicket.investorMatches || 0}
          investors={getMockInvestors()}
        />
      )}

      {/* LTV Modal */}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => {
          const canReserve = userSlotsAvailable > 0 && ticket.slotsAvailable > 0;
          const occupancyPercent = ((ticket.slotsTotal - ticket.slotsAvailable) / ticket.slotsTotal) * 100;
          const securityScore = calculateSecurityScore(ticket.security, ticket.ltvPercent);

          return (
            <div
              key={ticket.id}
              className="group/card bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl shadow-md transition-all hover:scale-[1.01] overflow-hidden flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={ticket.projectImage}
                  alt={ticket.projectName}
                  className="w-full h-full object-cover"
                />
                
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Top badges row */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {/* Type badge */}
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${getTypeColor(ticket.investmentType)} shadow`}>
                      {ticket.investmentType}</span>
                    
                    {/* Security tier badge with tooltip */}
                    <div className="relative inline-block group/security">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold shadow flex items-center gap-1 ${securityScore.bgColor} ${securityScore.color} border ${securityScore.borderColor} cursor-help`}>
                        <Shield className="w-3 h-3" />
                        {securityScore.label}
                        <Info className="w-3 h-3 opacity-50" />
                      </span>
                      {/* Tooltip */}
                      <div className="absolute left-0 top-full mt-2 w-72 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl z-[100] opacity-0 invisible group-hover/security:opacity-100 group-hover/security:visible transition-all duration-200">
                        <div className="font-semibold mb-2">{securityScore.label}</div>
                        <div className="mb-3 leading-relaxed">{securityScore.description}</div>
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <div className="font-medium mb-1">Zajištění:</div>
                          <div className="text-gray-300">{ticket.security}</div>
                          {ticket.ltvPercent && (
                            <div className="text-gray-400 text-[11px] mt-1">
                              LTV: {ticket.ltvPercent}% {ticket.ltvPercent > 70 ? '(vyšší riziko)' : ticket.ltvPercent < 60 ? '(konzervativní)' : '(standardní)'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Detail icon + Ticket ID */}
                  <div className="flex items-center gap-2">
                    {/* Detail Project Icon - SEKUNDÁRNÍ AKCE */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetail(ticket.id);
                      }}
                      className="p-2 rounded-lg bg-white/90 hover:bg-white backdrop-blur-sm text-gray-600 hover:text-[#1E4EEB] shadow-md hover:shadow-lg transition-all duration-200 border border-white/30 hover:border-[#1E4EEB]/20"
                      title="Zobrazit detail projektu"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    
                    {/* Ticket ID */}
                    <span className="px-2.5 py-1 rounded bg-black/50 backdrop-blur-sm text-white text-xs font-mono font-semibold shadow">
                      {ticket.id}
                    </span>
                  </div>
                </div>

                {/* Bottom - Project name and location */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <h3 className="text-white text-lg font-bold leading-tight mb-1.5 drop-shadow-lg">
                    {ticket.projectName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-white/90 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span className="drop-shadow">{ticket.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col">
                {/* Key metrics - 2x2 grid - PRIORITY: PROVIZE FIRST */}
                <div className="grid grid-cols-2 gap-3">
                  {/* PROVIZE - PRIORITA #1 for obchodník */}
                  <div className="bg-white border-2 border-[#1E4EEB]/30 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Target className="w-3.5 h-3.5 text-[#1E4EEB]" />
                      <span className="text-[10px] font-semibold text-[#1E4EEB] uppercase tracking-wider">Vaše provize</span>
                    </div>
                    <p className="font-bold text-lg text-[#1E4EEB] leading-none tracking-tight">
                      {formatCurrency(ticket.commissionAmount)} <span className="text-xs">Kč</span>
                    </p>
                  </div>

                  {/* Výnos */}
                  <div className="bg-white border border-[#14AE6B]/20 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#14AE6B]" />
                      <span className="text-[10px] font-semibold text-[#14AE6B] uppercase tracking-wider">Výnos</span>
                    </div>
                    <p className="font-bold text-[#14AE6B] text-lg leading-none tracking-tight">
                      {ticket.yieldPercent}<span className="text-xs">%</span> <span className="text-[10px] font-medium text-gray-600">p.a.</span>
                    </p>
                  </div>

                  {/* Investice */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Investice</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm leading-none tracking-tight">
                      {formatCurrency(ticket.investmentAmount)} <span className="text-[10px] text-gray-600">Kč</span>
                    </p>
                  </div>

                  {/* Doba trvání */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Doba</span>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm leading-none">{ticket.duration}</p>
                  </div>
                </div>

                {/* Podíl na zisku - only for Ekvita */}
                {ticket.investmentType === 'Ekvita' && ticket.profitShare && (
                  <div className="pt-1.5 border-t border-gray-100">
                    {getProfitShareBadge(ticket.profitShare)}
                  </div>
                )}

                {/* LTV badge if exists - clickable to open modal */}
                {ticket.ltvPercent && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLtvModalTicket(ticket);
                    }}
                    className={`w-full px-3 py-2 rounded border text-center transition-all cursor-pointer group/ltv ${
                      ticket.ltvPercent > 75 
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 hover:border-amber-300' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-semibold">LTV: {ticket.ltvPercent}%</span>
                      <Info className="w-3.5 h-3.5 opacity-50 group-hover/ltv:opacity-100 transition-opacity" />
                    </div>
                  </button>
                )}

                {/* Obsazenost slotů */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-700">Obsazenost slotů</span>
                    <span className="font-semibold text-gray-900">
                      {ticket.slotsTotal - ticket.slotsAvailable}/{ticket.slotsTotal}
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        occupancyPercent >= 100 ? 'bg-red-500' :
                        occupancyPercent >= 66 ? 'bg-amber-500' :
                        'bg-[#14AE6B]'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>

                  {/* Slot details */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span>
                      {ticket.slotsAvailable > 0 ? (
                        <span className="text-[#14AE6B] font-semibold">
                          {ticket.slotsAvailable} {ticket.slotsAvailable === 1 ? 'volná pozice' : 'volné pozice'}
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">Plně obsazeno</span>
                      )}
                    </span>
                    {ticket.reservedByOthers > 0 && (
                      <span className="text-gray-600 font-medium">
                        {ticket.reservedByOthers} {ticket.reservedByOthers === 1 ? 'Tipar rezervoval' : 'Tipaři rezervovali'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Investor Matches - clickable to open modal with mini avatar */}
                {ticket.investorMatches && ticket.investorMatches > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTicket(ticket);
                    }}
                    className="w-full px-3 py-2 rounded border border-[#1E4EEB]/30 bg-[#1E4EEB]/5 hover:bg-[#1E4EEB]/10 hover:border-[#1E4EEB]/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Mini Avatar with initials */}
                        <div className="w-6 h-6 rounded-full bg-[#1E4EEB] text-white flex items-center justify-center text-[10px] font-bold">
                          {getInvestorInitials(ticket.investorMatches)}
                        </div>
                        <Users className="w-3.5 h-3.5 text-[#1E4EEB]" />
                        <span className="text-xs font-semibold text-[#1E4EEB]">Shody s investory</span>
                      </div>
                      <span className="text-xs font-semibold text-[#1E4EEB]">
                        {ticket.investorMatches} {ticket.investorMatches === 1 ? 'investor' : ticket.investorMatches < 5 ? 'investoři' : 'investorů'}
                      </span>
                    </div>
                  </button>
                )}

                {/* SLA countdown */}
                <div className={`px-3 py-2 rounded border ${getSLAColor(ticket.slaDaysRemaining)} ${
                  ticket.slaDaysRemaining <= 14 ? 'border-red-200' :
                  ticket.slaDaysRemaining <= 60 ? 'border-amber-200' :
                  'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ticket.slaDaysRemaining <= 14 && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">Do konce</span>
                    </div>
                    <span className="text-xs font-semibold">
                      {ticket.slaDaysRemaining} {ticket.slaDaysRemaining === 1 ? 'den' : ticket.slaDaysRemaining < 5 ? 'dny' : 'dní'}
                    </span>
                  </div>
                </div>

                {/* Actions - pushed to bottom - PRIMÁRNÍ CTA ZVÝRAZNĚNÉ */}
                <div className="pt-2 mt-auto space-y-3">
                  {/* PRIMÁRNÍ CTA - REZERVOVAT - DOMINANTNÍ */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canReserve) {
                        onReserve(ticket.id);
                      }
                    }}
                    disabled={!canReserve}
                    className={`w-full py-4 px-5 rounded-lg font-bold text-[15px] transition-all hover:scale-[1.02] flex items-center justify-center gap-2.5 ${
                      canReserve
                        ? 'bg-[#1E4EEB] text-white hover:bg-[#1640C9] shadow-md hover:shadow-xl'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      userSlotsAvailable === 0 ? 'Nemáte volné sloty' :
                      ticket.slotsAvailable === 0 ? 'Tiket je plně obsazen' :
                      'Rezervovat'
                    }
                  >
                    <span className="text-lg">🎟️</span>
                    Rezervovat
                  </button>

                  {/* Warning if can't reserve */}
                  {!canReserve && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-amber-900 font-semibold">
                        {userSlotsAvailable === 0 ? 'Nemáte dostupné sloty' : 'Tiket je plně obsazen'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// DEV MODE EXPORTS
export { TicketsTileViewDev };
