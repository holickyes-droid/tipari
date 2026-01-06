import { Activity, Wallet, User, LayoutDashboard } from 'lucide-react';

type ActivePage = 'nabidka' | 'aktivity' | 'provize' | 'investori' | 'prehled';

interface NavigationProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

export function Navigation({ activePage, onPageChange }: NavigationProps) {
  const navItems = [
    { id: 'aktivity' as ActivePage, icon: Activity, label: 'Aktivity' },
    { id: 'provize' as ActivePage, icon: Wallet, label: 'Provize' },
    { id: 'investori' as ActivePage, icon: User, label: 'Investoři' },
    { id: 'prehled' as ActivePage, icon: LayoutDashboard, label: 'Přehled' },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all
              ${
                isActive
                  ? 'bg-[#215EF8]/10 text-[#215EF8]'
                  : 'text-[#040F2A] hover:bg-[#215EF8]/5'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}