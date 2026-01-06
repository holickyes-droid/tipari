import { TrendingUp, DollarSign, Calendar, Award } from 'lucide-react';

export function CommissionPage() {
  const commissions = [
    {
      id: '1',
      project: 'Rezidenční komplex Green Valley',
      ticket: 'T-001-01',
      amount: 125000,
      status: 'Vyplaceno',
      date: '2024-12-15',
      investor: 'Petr Novák',
    },
    {
      id: '2',
      project: 'Obchodní centrum City Plaza',
      ticket: 'T-003-02',
      amount: 89500,
      status: 'Vyplaceno',
      date: '2024-12-10',
      investor: 'Jana Novotná',
    },
    {
      id: '3',
      project: 'Bytový dům Karlín Residence',
      ticket: 'T-005-01',
      amount: 156000,
      status: 'Čeká na vyplacení',
      date: '2025-01-05',
      investor: 'Martin Král',
    },
    {
      id: '4',
      project: 'Hotel Complex Prague',
      ticket: 'T-008-03',
      amount: 210000,
      status: 'V procesu',
      date: '2025-01-20',
      investor: 'Marie Svobodová',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Vyplaceno':
        return 'bg-[#14AE6B]/10 text-[#14AE6B] border-[#14AE6B]/20';
      case 'Čeká na vyplacení':
        return 'bg-[#215EF8]/10 text-[#215EF8] border-[#215EF8]/20';
      case 'V procesu':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalEarned = commissions
    .filter(c => c.status === 'Vyplaceno')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPending = commissions
    .filter(c => c.status !== 'Vyplaceno')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Provize</h1>
          <p className="text-muted-foreground">Přehled všech vašich provizí z uzavřených obchodů</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#14AE6B] to-[#0D7A4A] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Celkem vyplaceno</div>
            <DollarSign className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(totalEarned)} Kč</div>
        </div>
        <div className="bg-gradient-to-br from-[#215EF8] to-[#1a4bc7] rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm opacity-90">Očekávaná provize</div>
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <div className="text-3xl font-bold">{formatCurrency(totalPending)} Kč</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Uzavřené obchody</div>
            <Award className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-[#040F2A]">{commissions.length}</div>
        </div>
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Průměrná provize</div>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-[#040F2A]">
            {formatCurrency(Math.round((totalEarned + totalPending) / commissions.length))} Kč
          </div>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold text-[#040F2A]">Historie provizí</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Projekt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tiket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Investor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Provize
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {commissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#040F2A]">{commission.project}</td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{commission.ticket}</td>
                  <td className="px-6 py-4 text-sm text-[#040F2A]">{commission.investor}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(commission.date).toLocaleDateString('cs-CZ')}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-right text-[#14AE6B]">
                    {formatCurrency(commission.amount)} Kč
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-medium ${getStatusStyle(commission.status)}`}>
                      {commission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
