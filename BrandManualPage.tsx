/**
 * BRAND MANUAL PAGE - TIPARI.CZ
 * 
 * Kompletní design system založený na analýze Fingood + Investown
 * Hybrid přístup: Investown struktura (information-dense) + Fingood estetika (minimal colors)
 */

import { 
  Copy, Check, ArrowLeft, ChevronRight, AlertCircle, CheckCircle2,
  Home, Activity, Users, Ticket, TrendingUp, FileText, Settings2,
  Search, Filter, Plus, Edit, Trash2, X, Eye, Download,
  Clock, Calendar, Info, HelpCircle, Bell, Star, ArrowRight,
  Building2, Briefcase, Shield, Mail, Phone, MessageCircle,
  DollarSign, Target, Award, Palette, Circle
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BrandManualPageProps {
  onBack?: () => void;
}

export function BrandManualPage({ onBack }: BrandManualPageProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(name);
    toast.success(`${name} zkopírováno`);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Sticky Header */}
      {onBack && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Zpět na platformu
            </button>
            
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#040F2A] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#14AE6B]" />
                <span className="text-white font-semibold text-xs">v2.0 - Hybrid</span>
              </div>
              <span className="text-sm text-gray-600">Design System Tipari.cz</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-8 py-12">
        
        {/* Page Header */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#215EF8] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <h1 className="text-5xl font-bold text-[#040F2A]">Tipari.cz</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Profesionální B2B investiční platforma s estetikou private bankingu
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-full border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#215EF8]" />
              <span className="text-sm font-medium text-gray-700">Investown struktura</span>
            </div>
            <div className="w-1 h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14AE6B]" />
              <span className="text-sm font-medium text-gray-700">Fingood estetika</span>
            </div>
          </div>
        </div>

        {/* ============================================
            DESIGN PRINCIPLES
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Principy designu
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[#215EF8]/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#215EF8]" />
              </div>
              <h3 className="font-bold text-[#040F2A] mb-2">Decision-First UX</h3>
              <p className="text-sm text-gray-600">
                Hierarchie pro rychlé rozhodování profesionálních Tipařů. Urgentní rezervace vždy nahoře.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-[#14AE6B]/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#14AE6B]" />
              </div>
              <h3 className="font-bold text-[#040F2A] mb-2">Compliance-First Copy</h3>
              <p className="text-sm text-gray-600">
                Rezervace ≠ Investice. Právně bezpečná komunikace. Použití kanonické terminologie.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-[#040F2A]" />
              </div>
              <h3 className="font-bold text-[#040F2A] mb-2">Private Banking Aesthetic</h3>
              <p className="text-sm text-gray-600">
                Calm UI, profesionální hierarchie, minimální barvy, hodně whitespace uvnitř elementů.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            BRAND COLORS
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Brand Colors
          </h2>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Primary Blue */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="h-32 bg-[#215EF8] relative group cursor-pointer" 
                onClick={() => copyToClipboard('#215EF8', 'Primary Blue')}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white rounded-lg p-3 shadow-lg">
                    {copiedColor === 'Primary Blue' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">Primary Blue</span>
                  <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">#215EF8</code>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  CTA buttons, odkazy, focused states, aktivní tabyy, charts (modrá čára/bars)
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-current text-[#215EF8]" />
                    <span className="text-gray-600">Buttons: bg-[#215EF8]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-current text-[#215EF8]" />
                    <span className="text-gray-600">Links: text-[#215EF8]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Green */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="h-32 bg-[#14AE6B] relative group cursor-pointer" 
                onClick={() => copyToClipboard('#14AE6B', 'Success Green')}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white rounded-lg p-3 shadow-lg">
                    {copiedColor === 'Success Green' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">Success Green</span>
                  <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">#14AE6B</code>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Success states, výnosy, provize, progress bars, completed states
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-current text-[#14AE6B]" />
                    <span className="text-gray-600">Progress: bg-[#14AE6B]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-current text-[#14AE6B]" />
                    <span className="text-gray-600">Success text: text-[#14AE6B]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deep Navy */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="h-32 bg-[#040F2A] relative group cursor-pointer" 
                onClick={() => copyToClipboard('#040F2A', 'Deep Navy')}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white rounded-lg p-3 shadow-lg">
                    {copiedColor === 'Deep Navy' ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">Deep Navy</span>
                  <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">#040F2A</code>
                </div>
                <p className="text-xs text-gray-600 mb-4">
                  Headings, primární text, logo, navigace, důležité elementy
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-current text-[#040F2A]" />
                    <span className="text-gray-600">Headings: text-[#040F2A]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="w-3 h-3 fill-current text-[#040F2A]" />
                    <span className="text-gray-600">Logo: bg-[#215EF8] text-white</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            NEUTRAL COLORS (FINGOOD-INSPIRED)
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-4 text-center">
            Neutral Colors
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            90% platformy používá šedou škálu. Barvy jen pro význam (CTA, success, warning).
          </p>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="grid grid-cols-6 gap-4">
              {[
                { name: 'White', hex: '#FFFFFF', usage: 'Pozadí karet, hlavní background' },
                { name: 'Gray 50', hex: '#F9FAFB', usage: 'Alternativní pozadí, light boxy' },
                { name: 'Gray 200', hex: '#E5E7EB', usage: 'Bordery, separátory (1px)' },
                { name: 'Gray 500', hex: '#6B7280', usage: 'Sekundární text, labels' },
                { name: 'Gray 700', hex: '#374151', usage: 'Body text' },
                { name: 'Gray 900', hex: '#111827', usage: 'Černý text, hodnoty' },
              ].map((color) => (
                <div key={color.name} className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg mb-2 border border-gray-200 cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex, color.name)}
                  />
                  <p className="text-xs font-semibold text-gray-900 mb-1">{color.name}</p>
                  <code className="text-[10px] font-mono text-gray-500">{color.hex}</code>
                  <p className="text-[10px] text-gray-500 mt-1">{color.usage}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            TYPOGRAPHY SYSTEM
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Typography System
          </h2>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#040F2A]">Page Title (H1)</h1>
                  <p className="text-sm text-gray-500 mt-1">Mé rezervace, Tikety, Přehled</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-mono">text-4xl (36px)</p>
                  <p className="font-mono">font-bold (700)</p>
                  <p className="font-mono">text-[#040F2A]</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#040F2A]">Section Title (H2)</h2>
                  <p className="text-sm text-gray-500 mt-1">Aktivní rezervace, Filtry</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-mono">text-2xl (24px)</p>
                  <p className="font-mono">font-bold (700)</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#040F2A]">Card Title (H3)</h3>
                  <p className="text-sm text-gray-500 mt-1">Název projektu, investor</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-mono">text-lg (18px)</p>
                  <p className="font-mono">font-semibold (600)</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-base text-gray-900">Body Text</p>
                  <p className="text-sm text-gray-500 mt-1">Hlavní text, popisy</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-mono">text-base (16px)</p>
                  <p className="font-mono">font-normal (400)</p>
                  <p className="font-mono">text-gray-900</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                <div>
                  <p className="text-sm text-gray-600">Secondary Text</p>
                  <p className="text-sm text-gray-500 mt-1">Meta info, labels, timestamps</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-mono">text-sm (14px)</p>
                  <p className="font-mono">font-normal (400)</p>
                  <p className="font-mono">text-gray-600</p>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-gray-500">Tertiary Text</p>
                  <p className="text-sm text-gray-500 mt-1">Velmi malý text, footers</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-mono">text-xs (12px)</p>
                  <p className="font-mono">font-normal (400)</p>
                  <p className="font-mono">text-gray-500</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Font Family:</span> System font stack (Inter-like). Line height: 1.5 pro text, 1.2 pro headings.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SPACING SYSTEM
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-4 text-center">
            Spacing System
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Konzistentní spacing jako Fingood - hodně whitespace mezi sekcemi, méně uvnitř elementů.
          </p>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="space-y-4">
              {[
                { token: 'gap-2', px: '8px', usage: 'Malé ikony + text, inline elementy' },
                { token: 'gap-4', px: '16px', usage: 'Related content, button groups' },
                { token: 'gap-6', px: '24px', usage: 'List items, card spacing' },
                { token: 'p-6', px: '24px', usage: 'Card padding (běžné)' },
                { token: 'p-8', px: '32px', usage: 'Modal padding, velké karty' },
                { token: 'my-12', px: '48px', usage: 'Page sections vertical spacing' },
              ].map((space) => (
                <div key={space.token} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <code className="text-sm font-mono text-[#215EF8] font-semibold w-24">{space.token}</code>
                  <div className="h-6 bg-[#215EF8] rounded" style={{ width: space.px }} />
                  <span className="text-sm text-gray-700 flex-1">{space.usage}</span>
                  <span className="text-sm text-gray-500 font-mono">{space.px}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            COMPONENT PATTERNS
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Component Patterns
          </h2>
          
          <div className="space-y-8">
            
            {/* Buttons */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="font-bold text-[#040F2A] mb-6 flex items-center gap-2">
                <span className="text-2xl">🔘</span>
                Buttons
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Primary CTA</p>
                  <button className="px-6 py-3 rounded-lg bg-[#215EF8] text-white font-semibold hover:bg-[#1a4dd1] transition-colors">
                    Rezervovat tiket
                  </button>
                  <code className="block mt-2 text-xs text-gray-600 font-mono">
                    bg-[#215EF8] text-white px-6 py-3 rounded-lg
                  </code>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Success CTA</p>
                  <button className="px-6 py-3 rounded-lg bg-[#14AE6B] text-white font-semibold hover:bg-[#0f8b54] transition-colors">
                    Dokončit rezervaci
                  </button>
                  <code className="block mt-2 text-xs text-gray-600 font-mono">
                    bg-[#14AE6B] text-white px-6 py-3 rounded-lg
                  </code>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Secondary</p>
                  <button className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    Zrušit
                  </button>
                  <code className="block mt-2 text-xs text-gray-600 font-mono">
                    border border-gray-300 bg-white px-6 py-3
                  </code>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Icon Button (Investown)</p>
                  <button className="w-10 h-10 rounded-full bg-[#14AE6B] text-white flex items-center justify-center hover:bg-[#0f8b54] transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <code className="block mt-2 text-xs text-gray-600 font-mono">
                    w-10 h-10 rounded-full bg-[#14AE6B]
                  </code>
                </div>
              </div>
            </div>

            {/* Tabs with Counters (Investown) */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="font-bold text-[#040F2A] mb-6 flex items-center gap-2">
                <span className="text-2xl">📑</span>
                Tabs with Counters (Investown pattern)
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <button className="px-4 py-2 rounded-full bg-[#1e293b] text-white text-sm font-medium">
                  Vše 22
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                  Vyžaduje akci 2
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                  V procesu 8
                </button>
                <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">
                  Dokončeno 5
                </button>
              </div>
              
              <code className="block text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded">
                Active: bg-[#1e293b] text-white rounded-full<br />
                Inactive: bg-gray-100 text-gray-700 rounded-full
              </code>
            </div>

            {/* Progress Bar (NE kroužky!) */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="font-bold text-[#040F2A] mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Progress Bar (NE kroužky!)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">Krok 2 z 5: Dokumentace</span>
                    <span className="text-gray-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#14AE6B] h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-700">Krok 5 z 5: Dokončeno</span>
                    <span className="text-gray-600">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-[#14AE6B] h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
              
              <code className="block mt-4 text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded">
                Container: w-full bg-gray-200 rounded-full h-2<br />
                Fill: bg-[#14AE6B] h-2 rounded-full
              </code>
            </div>

            {/* Status Indicators */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="font-bold text-[#040F2A] mb-6 flex items-center gap-2">
                <span className="text-2xl">🔴</span>
                Status Indicators (tečky + text)
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#14AE6B]" />
                  <span className="text-sm text-gray-700">Vše v pořádku</span>
                  <span className="text-sm text-gray-500">· Další výplata 10. 2. 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#215EF8]" />
                  <span className="text-sm text-gray-700">V procesu</span>
                  <span className="text-sm text-gray-500">· Krok 3 z 5</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-gray-700">Čeká na akci</span>
                  <span className="text-sm text-gray-500">· Deadline za 3 dny</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-700">Vyžaduje akci</span>
                  <span className="text-sm text-gray-500">· Deadline DNES</span>
                </div>
              </div>
            </div>

            {/* Inline Warnings (NE boxy!) */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="font-bold text-[#040F2A] mb-6 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Warnings (inline, NE žluté boxy!)
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-gray-700">Chybí podpis na smlouvě</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Dokumenty ke stažení připraveny</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14AE6B]" />
                  <span className="text-sm text-gray-700">Rezervace schválena</span>
                </div>
              </div>
              
              <code className="block mt-4 text-xs text-gray-600 font-mono bg-gray-50 p-3 rounded">
                Ikona + text inline, BEZ barevného pozadí boxu!
              </code>
            </div>

          </div>
        </section>

        {/* ============================================
            LAYOUT PATTERNS
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Layout Patterns (Investown)
          </h2>
          
          <div className="space-y-6">
            
            {/* List View Pattern */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="font-bold text-[#040F2A] mb-6">
                List View - Horizontal Cards (Desktop-optimized)
              </h3>
              
              <div className="space-y-4">
                {/* Example Row 1 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-16 bg-gray-200 rounded flex-shrink-0" />
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Jan Novák · Rezidence Na Valeh</h4>
                          <p className="text-xs text-gray-600">Standard · Krok 2/5: Dokumentace</p>
                        </div>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">B+</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <span>1 250 000 Kč</span>
                        <span>·</span>
                        <span>12,5% p.a.</span>
                        <span>·</span>
                        <span>48 měs.</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          2 dny
                        </span>
                      </div>
                      
                      <div className="w-48 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-[#14AE6B] h-1.5 rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>
                    
                    {/* Action */}
                    <button className="w-8 h-8 rounded-full bg-[#14AE6B] text-white flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Example Row 2 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-16 bg-gray-200 rounded flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">Marie Svobodová · Bytový komplex Anděl</h4>
                          <p className="text-xs text-gray-600">Premium · Krok 4/5: Schválení</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">A-</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <span>850 000 Kč</span>
                        <span>·</span>
                        <span>10,8% p.a.</span>
                        <span>·</span>
                        <span>36 měs.</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          5 dnů
                        </span>
                      </div>
                      <div className="w-48 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-[#14AE6B] h-1.5 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-[#14AE6B] text-white flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Klíč:</span> Landscape thumbnail (80x64px) + Inline stats + Progress bar + Icon button. Všechno v jednom řádku pro rychlé skenování.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================
            ICON LIBRARY
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Icon Library (Lucide React)
          </h2>
          
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <p className="text-sm text-gray-600 mb-6">
              Všechny ikony z <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">lucide-react</code> knihovny. 
              Velikosti: 16px (small), 20px (default), 24px (large).
            </p>

            <div className="grid grid-cols-12 gap-3">
              {[
                Home, Activity, Users, Ticket, TrendingUp, FileText, 
                Search, Filter, Plus, Edit, Trash2, X, Eye, Download,
                Clock, Calendar, CheckCircle2, AlertCircle, Info, Bell,
                Building2, Briefcase, Shield, Mail, Phone, MessageCircle,
                DollarSign, Target, Award, ArrowRight, Settings2, Star
              ].map((Icon, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#215EF8]/10 text-[#215EF8]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            DO's and DON'Ts
            ============================================ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#040F2A] mb-8 text-center">
            Do's and Don'ts
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            
            {/* DO */}
            <div className="bg-green-50 rounded-xl border-2 border-green-200 p-8">
              <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                ✅ DO (Fingood + Investown)
              </h3>
              <ul className="space-y-2 text-sm text-green-900">
                <li>• Používat 90% šedé škály (white/gray)</li>
                <li>• Barvy POUZE pro význam (CTA, success, warning)</li>
                <li>• Tenké bordery (1px gray)</li>
                <li>• Hodně whitespace MEZI sekcemi</li>
                <li>• Progress bars (ne kroužky!)</li>
                <li>• Tabs s counters (Investown)</li>
                <li>• Landscape thumbnails pro list view</li>
                <li>• Inline warnings (ikona + text)</li>
                <li>• Icon buttons (zelený kroužek)</li>
                <li>• Sortable columns v tabulkách</li>
                <li>• Sticky sidebars s klíčovými daty</li>
              </ul>
            </div>

            {/* DON'T */}
            <div className="bg-red-50 rounded-xl border-2 border-red-200 p-8">
              <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2">
                <X className="w-6 h-6" />
                ❌ DON'T (Anti-patterns)
              </h3>
              <ul className="space-y-2 text-sm text-red-900">
                <li>• Barevné bordery na kartách</li>
                <li>• Barevné stats pills (červená/modrá/zelená)</li>
                <li>• Progress kroužky (5x circles)</li>
                <li>• Warning boxy se žlutým pozadím</li>
                <li>• Deadline boxy s barevným borderem</li>
                <li>• Full width buttons v listu</li>
                <li>• 15+ elementů v jedné kartě</li>
                <li>• Badges všude (NOVÉ, pills, tags)</li>
                <li>• Fancy hover efekty s glow</li>
                <li>• Barevná pozadí pro sekce</li>
                <li>• Random colors bez významu</li>
              </ul>
            </div>

          </div>
        </section>

        {/* ============================================
            BOTTOM CTA
            ============================================ */}
        <div className="bg-gradient-to-r from-[#215EF8] to-[#14AE6B] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Hybrid Design System
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Investown struktura (desktop-first, information-dense) + Fingood estetika (minimal colors, clean)
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              Desktop Primary
            </div>
            <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              B2B Professional
            </div>
            <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              Efficiency First
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
