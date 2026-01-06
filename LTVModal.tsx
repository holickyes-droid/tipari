/**
 * LTV MODAL
 * Detail LTV a znaleckého posudku při najetí myši
 */

import { X, FileText, Building2, Globe } from 'lucide-react';

interface LTVModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  projectName: string;
  ltvPercent?: number;
  security: string;
  valuatorName?: string;
  valuatorCompany?: string;
  valuatorWebsite?: string;
  valuationType?: string;
  hasValuationAccess?: boolean;
}

export function LTVModal({
  isOpen,
  onClose,
  ticketId,
  projectName,
  ltvPercent = 0,
  security,
  valuatorName = 'Ing. Jana Horáková',
  valuatorCompany = 'FAST VALUATIONS CZ s.r.o.',
  valuatorWebsite = 'www.fast-valuations.cz',
  valuationType = 'externí znalecký posudek',
  hasValuationAccess = true,
}: LTVModalProps) {
  if (!isOpen) return null;

  const getLTVCategory = (ltv: number) => {
    if (ltv < 60) return {
      label: 'Konzervativní',
      color: 'text-[#14AE6B]',
      bgColor: 'bg-[#14AE6B]/10',
      description: 'Nízké LTV znamená vyšší bezpečnost investice'
    };
    if (ltv <= 70) return {
      label: 'Standardní',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Standardní úroveň pro tento typ investice'
    };
    return {
      label: 'Vyšší riziko',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      description: 'Vyšší LTV může znamenat zvýšené riziko'
    };
  };

  const category = getLTVCategory(ltvPercent);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] bg-white rounded-xl shadow-2xl z-50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-[#215EF8]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#215EF8]" />
              </div>
              <h2 className="font-bold text-gray-900">LTV / Posudek</h2>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{ticketId}</span> • {projectName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* LTV Value Display */}
          <div className={`${category.bgColor} rounded-xl p-8 text-center`}>
            <p className="text-sm font-semibold text-gray-600 mb-3">Loan to Value Ratio</p>
            <p className={`text-6xl font-bold ${category.color} mb-3`}>
              {ltvPercent}%
            </p>
            <p className="text-sm text-gray-600 mb-4">Poměr výše úvěru k hodnotě nemovitosti</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${category.bgColor} border border-current/20`}>
              <span className={`text-xs font-semibold ${category.color}`}>
                {category.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">{category.description}</p>
          </div>

          {/* Informace o posudku */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Informace o posudku</h3>
            
            <div className="bg-gray-50 rounded-lg p-5 space-y-5">
              {/* Typ posudku */}
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Typ posudku</p>
                <p className="text-sm text-gray-900">
                  Hodnota LTV byla stanovena na základě <span className="font-semibold">{valuationType}</span>.
                </p>
              </div>

              {/* Zhotovitel posudku */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-600 mb-3">Zhotovitel posudku</p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#215EF8]/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#215EF8]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{valuatorName}</p>
                    <p className="text-sm text-gray-600">{valuatorCompany}</p>
                  </div>
                </div>
              </div>

              {/* Website */}
              {valuatorWebsite && (
                <div className="pt-3">
                  <a
                    href={`https://${valuatorWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#215EF8] hover:text-[#1B4FD1] transition-colors text-sm font-semibold"
                  >
                    <Globe className="w-4 h-4" />
                    {valuatorWebsite}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Access Info */}
          {hasValuationAccess ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 mb-1">Přístup k posudku</p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Kompletní znalecký posudek je k dispozici k nahlédnutí. Dokument obsahuje detailní ocenění nemovitosti a všechny relevantní údaje.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Přístup k posudku</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Posudek bude k dispozici po úspěšné rezervaci tiketu.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Zavřít
          </button>
          {hasValuationAccess && (
            <button
              type="button"
              onClick={() => {
                console.log('📄 Zobrazení znaleckého posudku pro:', ticketId);
                // Here you would open the PDF or navigate to the document
              }}
              className="px-5 py-2.5 bg-[#215EF8] text-white rounded-lg font-semibold text-sm hover:bg-[#1B4FD1] transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Zobrazit znalecký posudek
            </button>
          )}
        </div>
      </div>
    </>
  );
}