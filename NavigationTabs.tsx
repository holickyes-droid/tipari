/**
 * NAVIGATION TABS COMPONENT
 * Main navigation for Tipari.cz platform
 */

import { Activity, Wallet, User, LayoutDashboard, Ticket, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavigationTabsProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function NavigationTabs({ activePage, onPageChange }: NavigationTabsProps) {
  // Check if any aktivity or provize subpage is active
  const isAktivityActive = activePage.startsWith('aktivity');
  const isProvizeActive = activePage.startsWith('provize');

  return (
    <nav className="flex items-center gap-2">
      {/* Tikety */}
      <button
        onClick={() => onPageChange('tikety')}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${
          activePage === 'tikety'
            ? 'bg-[#215EF8]/10 text-[#215EF8]'
            : 'text-[#040F2A] hover:bg-[#215EF8]/5'
        }`}
      >
        <Ticket className="w-5 h-5" />
        Tikety
      </button>

      {/* Aktivity - Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${
              isAktivityActive
                ? 'bg-[#215EF8]/10 text-[#215EF8]'
                : 'text-[#040F2A] hover:bg-[#215EF8]/5'
            }`}
          >
            <Activity className="w-5 h-5" />
            Aktivity
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => onPageChange('aktivity-rezervace')}
            className={activePage === 'aktivity-rezervace' ? 'bg-[#215EF8]/10 text-[#215EF8]' : ''}
          >
            Moje rezervace
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onPageChange('aktivity-projekty')}
            className={activePage === 'aktivity-projekty' ? 'bg-[#215EF8]/10 text-[#215EF8]' : ''}
          >
            Zalistované projekty
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Provize - Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${
              isProvizeActive
                ? 'bg-[#215EF8]/10 text-[#215EF8]'
                : 'text-[#040F2A] hover:bg-[#215EF8]/5'
            }`}
          >
            <Wallet className="w-5 h-5" />
            Provize
            <ChevronDown className="w-4 h-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() => onPageChange('provize-projekty')}
            className={activePage === 'provize-projekty' ? 'bg-[#215EF8]/10 text-[#215EF8]' : ''}
          >
            Projekty
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onPageChange('provize-rezervace')}
            className={activePage === 'provize-rezervace' ? 'bg-[#215EF8]/10 text-[#215EF8]' : ''}
          >
            Rezervace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Investoři */}
      <button
        onClick={() => onPageChange('investori')}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${
          activePage === 'investori'
            ? 'bg-[#215EF8]/10 text-[#215EF8]'
            : 'text-[#040F2A] hover:bg-[#215EF8]/5'
        }`}
      >
        <User className="w-5 h-5" />
        Investoři
      </button>

      {/* Přehled */}
      <button
        onClick={() => onPageChange('prehled')}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${
          activePage === 'prehled'
            ? 'bg-[#215EF8]/10 text-[#215EF8]'
            : 'text-[#040F2A] hover:bg-[#215EF8]/5'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        Přehled
      </button>
    </nav>
  );
}
