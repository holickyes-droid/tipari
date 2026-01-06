import { useState } from 'react';
import { Send, UserPlus, MessageCircle, X, ArrowUpRight, Users, FileText, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface CTASectionProps {
  onOpenAddInvestor?: () => void;
  onOpenDraftsPanel?: () => void;
  onNewProject?: () => void;
  onOpenFAQ?: () => void;
}

export function CTASection({ onOpenAddInvestor, onOpenDraftsPanel, onNewProject, onOpenFAQ }: CTASectionProps) {
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set());

  const dismissCard = (cardId: string) => {
    setDismissedCards((prev) => new Set(prev).add(cardId));
    toast.success('Karta skryta');
  };

  const cards = [
    {
      id: 'poslat-projekt',
      icon: Send,
      title: 'Poslat projekt',
      description: 'Máte zajímavou příležitost? Sdílejte ji s námi a získejte provizi.',
      ctaLabel: 'Nahrát projekt',
      onClick: onNewProject,
    },
    {
      id: 'ulozt-investora',
      icon: UserPlus,
      title: 'Uložit investora',
      description: 'Spravujte své kontakty a doporučujte vhodné projekty přímo z platformy.',
      ctaLabel: 'Přidat investora',
      onClick: onOpenAddInvestor,
    },
    {
      id: 'rozpracovane-rezervace',
      icon: FileText,
      title: 'Rozpracované rezervace',
      description: 'Pokračujte v nedokončených rezervacích a nenechte si uniknout příležitosti.',
      ctaLabel: 'Otevřít rozpracované',
      onClick: onOpenDraftsPanel,
    },
  ];

  const visibleCards = cards.filter((card) => !dismissedCards.has(card.id));

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {visibleCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="relative bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-[#215EF8]/30 transition-all group"
          >
            {/* Dismiss button */}
            <button
              onClick={() => dismissCard(card.id)}
              className="absolute top-4 right-4 z-10 p-1.5 hover:bg-white/80 rounded-full transition-all backdrop-blur-sm"
              aria-label="Zavřít"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-[#040F2A]" />
            </button>

            {/* Content */}
            <div className="relative p-6 space-y-4">
              {/* Icon container */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#215EF8]/10 to-[#215EF8]/5 flex items-center justify-center ring-1 ring-[#215EF8]/10">
                <Icon className="w-6 h-6 text-[#215EF8]" />
              </div>

              {/* Text content */}
              <div className="space-y-2 pr-6">
                <h3 className="text-[#040F2A] font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* CTA Button */}
              <Button 
                variant="outline" 
                className="w-full group-hover:border-[#215EF8]/30 group-hover:text-[#215EF8] transition-all cursor-pointer"
                disabled={false}
                type="button"
                onClick={() => {
                  if (card.onClick) {
                    card.onClick();
                  } else {
                    toast.info(`${card.ctaLabel} - funkce bude brzy k dispozici`);
                  }
                }}
              >
                {card.ctaLabel}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}