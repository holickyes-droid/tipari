/**
 * FAQ MODAL - PROFESSIONAL B2B
 * Vysvětluje klíčové koncepty: Rezervace, SLA & Sloty, Provize
 */

import { Shield, Clock, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#040F2A]">
            Často kladené otázky
          </DialogTitle>
          <DialogDescription className="sr-only">
            Vysvětlení klíčových konceptů platformy Tipari.cz: Rezervace, SLA a Sloty, Provize
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 gap-4 mt-4 pr-4">
            {/* Co je to rezervace? */}
            <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Co je to rezervace?
                  </h3>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Rezervace tiketu vám zajišťuje právo vyjednávat s developerem o investici. Není to závazek investovat.
                  </p>
                </div>
              </div>
              <div className="pl-11 space-y-2 text-sm text-blue-800">
                <p>
                  <strong>Jak to funguje:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Rezervujete tiket → spotřebujete 1 slot</li>
                  <li>Máte čas vyjednávat podmínky investice s developerem</li>
                  <li>Pokud investice proběhne → dostanete provizi</li>
                  <li>Pokud investice neproběhne do SLA → slot se uvolní</li>
                </ul>
              </div>
            </div>

            {/* SLA a Sloty */}
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    SLA a Sloty
                  </h3>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    Každý tiket má SLA termín. Pokud do té doby nevyužijete rezervaci, slot se automaticky uvolní.
                  </p>
                </div>
              </div>
              <div className="pl-11 space-y-2 text-sm text-amber-800">
                <p>
                  <strong>Limity slotů podle úrovně:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Associate:</strong> 3 paralelní sloty (max 3 aktivní rezervace)</li>
                  <li><strong>Professional:</strong> 6 paralelních slotů (max 6 aktivních rezervací)</li>
                  <li><strong>Elite:</strong> 10 paralelních slotů (max 10 aktivních rezervací)</li>
                </ul>
                <p className="mt-3">
                  <strong>SLA lhůta:</strong> Časový limit pro uzavření investice. Pokud do té doby neuzavřete deal, slot se automaticky uvolní a můžete rezervovat jiný tiket.
                </p>
              </div>
            </div>

            {/* Provize */}
            <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Provize
                  </h3>
                  <p className="text-sm text-green-800 leading-relaxed">
                    Provize se vyplácí po úspěšném uzavření investice mezi vaším investorem a developerem.
                  </p>
                </div>
              </div>
              <div className="pl-11 space-y-2 text-sm text-green-800">
                <p>
                  <strong>Kdy dostanete provizi:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Váš investor podepíše investiční smlouvu s developerem</li>
                  <li>Investor převede prostředky podle smlouvy</li>
                  <li>Po potvrzení platby vám vyplatíme provizi na váš účet</li>
                </ul>
                <p className="mt-3">
                  <strong>Výše provize</strong> je fixně stanovena u každého tiketu a zobrazuje se v detailu tiketu. Provize je garantována a nelze ji dodatečně měnit.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer note */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Důležité:</strong> Tipari.cz slouží výhradně jako B2B katalogová platforma pro facilitaci obchodních kontaktů mezi Tipary (zprostředkovateli) a developery. Není určena pro sběr osobních údajů (PII) ani pro správu citlivých dat. Veškeré investiční smlouvy jsou uzavírány přímo mezi investory a developery.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}