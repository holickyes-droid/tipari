/**
 * BOTTOM NAVIGATION COMPONENT
 * Testing & development navigation for Tipari.cz platform
 * Shows all sections including sub-sections for quick access
 */

import { Home, Activity, Wallet, User, LayoutDashboard, FolderOpen } from 'lucide-react';

interface BottomNavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

export function BottomNavigation({ activePage, onPageChange }: BottomNavigationProps) {
  const navigationStructure = [
    {
      id: 'nabidka',
      label: 'Tikety',
      icon: Home,
      subPages: [],
    },
    {
      id: 'projekty',
      label: 'Projekty',
      icon: FolderOpen,
      subPages: [],
    },
    {
      id: 'aktivity',
      label: 'Aktivity',
      icon: Activity,
      subPages: [
        { id: 'aktivity-rezervace', label: 'Mé rezervace' },
        { id: 'aktivity-projekty', label: 'Mé projekty' },
      ],
    },
    {
      id: 'provize',
      label: 'Provize',
      icon: Wallet,
      subPages: [
        { id: 'provize-projekty', label: 'Z mých projektů' },
        { id: 'provize-rezervace', label: 'Z mých rezervací' },
      ],
    },
    {
      id: 'investori',
      label: 'Investoři',
      icon: User,
      subPages: [],
    },
    {
      id: 'prehled',
      label: 'Přehled',
      icon: LayoutDashboard,
      subPages: [],
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between gap-8">
          {navigationStructure.map((section) => {
            const Icon = section.icon;
            const isMainActive = activePage === section.id;
            
            return (
              <div key={section.id} className="flex flex-col gap-2">
                {/* Main Section */}
                <button
                  onClick={() => onPageChange(section.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isMainActive
                      ? 'bg-[#215EF8]/10 text-[#215EF8]'
                      : 'text-[#040F2A] hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>

                {/* Sub-sections */}
                {section.subPages.length > 0 && (
                  <div className="flex flex-col gap-1 ml-6">
                    {section.subPages.map((subPage) => {
                      const isSubActive = activePage === subPage.id;
                      
                      return (
                        <button
                          key={subPage.id}
                          onClick={() => onPageChange(subPage.id)}
                          className={`px-3 py-1 rounded text-xs transition-colors text-left ${
                            isSubActive
                              ? 'text-[#215EF8] font-medium'
                              : 'text-[#6B7280] hover:text-[#040F2A]'
                          }`}
                        >
                          {subPage.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}