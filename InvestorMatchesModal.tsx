/**
 * INVESTOR MATCHES MODAL
 * Zobrazuje detailní matching investorů s tiketem
 */

import { X, Users, DollarSign, TrendingUp, Clock, Shield } from 'lucide-react';

interface InvestorMatch {
  id: string;
  name: string;
  type: string;
  matchPercent: number;
  portfolioUsed: number;
  portfolioTotal: number;
  portfolioAvailable: number;
}

interface InvestorMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketName: string;
  investmentAmount: number;
  yieldPercent: number;
  duration: string;
  ltvPercent?: number;
  security: string;
  totalMatches: number;
  investors: InvestorMatch[];
}

export function InvestorMatchesModal({
  isOpen,
  onClose,
  ticketId,
  ticketName,
  investmentAmount,
  yieldPercent,
  duration,
  ltvPercent,
  security,
  totalMatches,
  investors,
}: InvestorMatchesModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMatchColor = (percent: number) => {
    if (percent >= 90) return 'text-[#14AE6B] bg-[#14AE6B]';
    if (percent >= 75) return 'text-[#14AE6B] bg-[#14AE6B]';
    return 'text-amber-600 bg-amber-600';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-auto md:right-4 md:top-4 md:bottom-4 md:w-[900px] bg-white rounded-xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#215EF8]" />
              <h2 className="font-bold text-gray-900">Shody investorů s tiketem</h2>
              <div className="px-3 py-1 rounded-full bg-[#215EF8]/10 border border-[#215EF8]/30">
                <span className="text-sm font-bold text-[#215EF8]">{totalMatches} {totalMatches === 1 ? 'shoda' : totalMatches < 5 ? 'shody' : 'shod'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{ticketId}</span> • {ticketName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Ticket Parameters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600">Výše investice</span>
              </div>
              <p className="font-bold text-gray-900">{formatCurrency(investmentAmount)} Kč</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600">Výnos p.a.</span>
              </div>
              <p className="font-bold text-[#14AE6B]">{yieldPercent}%</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600">Doba trvání</span>
              </div>
              <p className="font-bold text-gray-900">{duration}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600">LTV</span>
              </div>
              <p className="font-bold text-gray-900">{ltvPercent}%</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Zajištění:</span>
              <span className="text-sm text-gray-900">{security}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mx-6 mt-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold">Inteligentní matching:</span> Následující investoři odpovídají parametrům tohoto tiketu na základě jejich investičních preferencí, portfolia a rizikového profilu.
          </p>
        </div>

        {/* Table Header */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600">
            <div className="col-span-3">Investor</div>
            <div className="col-span-2 text-center">Shoda</div>
            <div className="col-span-3 text-center">Portfolio</div>
            <div className="col-span-4 text-right">Akce</div>
          </div>
        </div>

        {/* Investors List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="space-y-3">
            {investors.map((investor) => (
              <div
                key={investor.id}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Investor Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#215EF8]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-[#215EF8]">
                        {getInitials(investor.name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{investor.name}</p>
                      <p className="text-xs text-gray-500">{investor.type}</p>
                    </div>
                  </div>

                  {/* Match Percent */}
                  <div className="col-span-2">
                    <div className="flex flex-col items-center">
                      <span className={`text-2xl font-bold ${getMatchColor(investor.matchPercent).split(' ')[0]}`}>
                        {investor.matchPercent}%
                      </span>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${getMatchColor(investor.matchPercent).split(' ')[1]}`}
                          style={{ width: `${investor.matchPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="col-span-3 text-center">
                    <p className="text-sm font-bold text-gray-900">
                      {investor.portfolioUsed} / {investor.portfolioTotal}
                    </p>
                    <p className="text-xs text-gray-600">
                      {investor.portfolioAvailable} {investor.portfolioAvailable === 1 ? 'volná' : investor.portfolioAvailable < 5 ? 'volné' : 'volných'}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="col-span-4 flex justify-end">
                    {investor.portfolioAvailable > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          console.log('Rezervace pro klienta:', investor.id);
                        }}
                        className="px-4 py-2 bg-[#215EF8] text-white rounded-lg font-semibold text-sm hover:bg-[#1B4FD1] transition-all"
                      >
                        Rezervovat pro klienta
                      </button>
                    ) : (
                      <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-semibold text-sm">
                        Plné portfolio
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Matching systém aktualizován: Dnes 14:32</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Zavřít
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
