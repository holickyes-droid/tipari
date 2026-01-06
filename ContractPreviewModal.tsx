import { X, FileText } from 'lucide-react';
import { Button } from './ui/button';

interface ContractPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
  projectName: string;
  ticketAmount: number;
  investorName: string;
}

export function ContractPreviewModal({ 
  isOpen, 
  onClose, 
  onDownload,
  projectName,
  ticketAmount,
  investorName
}: ContractPreviewModalProps) {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const today = new Date().toLocaleDateString('cs-CZ');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-3 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#215EF8] flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[#040F2A]">Náhled smlouvy</h3>
              <p className="text-xs text-muted-foreground">Rezervační smlouva - {projectName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-[#040F2A] transition-colors p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contract Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 max-w-3xl mx-auto">
            {/* Contract Header */}
            <div className="text-center mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-[#040F2A] mb-2">
                REZERVAČNÍ SMLOUVA
              </h1>
              <p className="text-sm text-muted-foreground">
                Číslo smlouvy: RS-{Date.now().toString().slice(-8)}
              </p>
              <p className="text-sm text-muted-foreground">
                Datum vyhotovení: {today}
              </p>
            </div>

            {/* Parties */}
            <div className="mb-6">
              <h2 className="font-semibold text-[#040F2A] mb-3">Smluvní strany</h2>
              
              <div className="mb-4">
                <p className="text-sm font-semibold text-[#040F2A] mb-1">1. Tipar (zprostředkovatel)</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Obchodní firma: Tipari s.r.o.<br />
                  Se sídlem: Praha 1, Václavské náměstí 123/45, PSČ 110 00<br />
                  IČO: 12345678<br />
                  DIČ: CZ12345678
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-[#040F2A] mb-1">2. Investor</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Jméno a příjmení: {investorName}<br />
                  Adresa: Lorem ipsum dolor sit amet 123, 120 00 Praha<br />
                  Datum narození: 01.01.1980<br />
                  Email: investor@example.com
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#040F2A] mb-1">3. Developer (příjemce investice)</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Obchodní firma: Development Group a.s.<br />
                  Se sídlem: Brno, Masarykova 789/12, PSČ 602 00<br />
                  IČO: 87654321<br />
                  Projekt: {projectName}
                </p>
              </div>
            </div>

            {/* Article I */}
            <div className="mb-6">
              <h2 className="font-semibold text-[#040F2A] mb-3">Článek I - Předmět smlouvy</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                1.1 Předmětem této smlouvy je rezervace investičního tiketu v rámci projektu <strong>{projectName}</strong> 
                ve výši <strong>{formatCurrency(ticketAmount)} Kč</strong>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                1.2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                1.3 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum.
              </p>
            </div>

            {/* Article II */}
            <div className="mb-6">
              <h2 className="font-semibold text-[#040F2A] mb-3">Článek II - Práva a povinnosti Tipara</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                2.1 Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto 
                beatae vitae dicta sunt explicabo.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                2.2 Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                2.3 Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci 
                velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam 
                quaerat voluptatem.
              </p>
            </div>

            {/* Article III */}
            <div className="mb-6">
              <h2 className="font-semibold text-[#040F2A] mb-3">Článek III - Práva a povinnosti investora</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                3.1 At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
                voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati 
                cupiditate non provident.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                3.2 Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. 
                Et harum quidem rerum facilis est et expedita distinctio.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                3.3 Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id 
                quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
              </p>
            </div>

            {/* Article IV */}
            <div className="mb-6">
              <h2 className="font-semibold text-[#040F2A] mb-3">Článek IV - Provize a odměna</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                4.1 Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet 
                ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                4.2 Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores 
                alias consequatur aut perferendis doloribus asperiores repellat.
              </p>
            </div>

            {/* Article V */}
            <div className="mb-8">
              <h2 className="font-semibold text-[#040F2A] mb-3">Článek V - Závěrečná ustanovení</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                5.1 Hanc ego cum teneam sententiam, quid est cur verear ne ad eam non possim accommodare 
                Torquatos nostros? quos tu paulo ante cum memoriter, tum etiam erga nos amice et benivole 
                collegisti.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                5.2 Nec vero sum nescius esse utilitatem in historia, non modo voluptatem. Hanc quoque 
                iucunditatem, si vis, transfer in animum; de quo enim alio actu rerum gerendarum.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                5.3 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua.
              </p>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm font-semibold text-[#040F2A] mb-8">Za Tipara:</p>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-xs text-muted-foreground">Podpis a razítko</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#040F2A] mb-8">Investor:</p>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-xs text-muted-foreground">Podpis investora</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with actions */}
        <div className="border-t border-gray-200 px-5 py-3 bg-white flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Smlouvu si můžete stáhnout pro fyzický podpis
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Zavřít
            </Button>
            <Button
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Stáhnout smlouvu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
