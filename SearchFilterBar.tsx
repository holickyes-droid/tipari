import { Search } from 'lucide-react';
import { SortOption } from '../types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Project {
  id: string;
  name: string;
  location: string;
  ticketCount?: number;
}

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onAdvancedFiltersClick: () => void;
  activeFilterCount?: number;
  // Project filter props
  selectedProjectId?: string;
  onProjectChange?: (projectId: string) => void;
  projects?: Project[];
  totalTickets?: number;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onAdvancedFiltersClick,
  activeFilterCount,
  selectedProjectId,
  onProjectChange,
  projects,
  totalTickets,
}: SearchFilterBarProps) {
  const getSortLabel = (sort: SortOption): string => {
    const labels: Record<SortOption, string> = {
      'relevance': 'Všechny',
      'newest': 'Od nejnovějších',
      'priority': 'Brzy končí',
      'yield-desc': 'Výnos p.a. (nejvyšší)',
      'yield-asc': 'Výnos p.a. (nejnižší)',
      'ltv-asc': 'LTV (nejnižší)',
      'ltv-desc': 'LTV (nejvyšší)',
      'duration-asc': 'Doba trvání (nejkratší)',
      'duration-desc': 'Doba trvání (nejdelší)',
      'volume-desc': 'Objem (nejvyšší)',
      'volume-asc': 'Objem (nejnižší)',
      'commission-desc': 'Provize (nejvyšší)',
      'commission-asc': 'Provize (nejnižší)',
      'available-tickets': 'Podle dostupných tiketů',
    };
    return labels[sort] || 'Všechny';
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      {/* Left: Search Input */}
      <div className="relative flex-1 max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Hledat..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#215EF8] focus:border-[#215EF8]"
        />
      </div>

      {/* Right: Sort Dropdown + Filter Icon */}
      <div className="flex items-center gap-3">
        {/* Project Selector Dropdown (if projects provided) */}
        {projects && onProjectChange && selectedProjectId !== undefined && (
          <>
            <Select value={selectedProjectId} onValueChange={onProjectChange}>
              <SelectTrigger className="border-0 shadow-none bg-transparent px-0 py-0 h-auto gap-1.5 text-sm hover:text-[#215EF8] w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="all">
                  Všechny projekty ({totalTickets || 0} tiketů)
                </SelectItem>
                {projects.map((project) => {
                  const ticketCount = project.ticketCount || 0;
                  return (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name} · {project.location} ({ticketCount} {ticketCount === 1 ? 'tiket' : ticketCount < 5 ? 'tikety' : 'tiketů'})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {selectedProjectId !== 'all' && (
              <button
                onClick={() => onProjectChange('all')}
                className="text-sm text-[#215EF8] hover:text-[#1B4FD1] font-medium whitespace-nowrap"
              >
                Zrušit filtr
              </button>
            )}
          </>
        )}

        {/* Filter Icon Button */}
        <button
          onClick={onAdvancedFiltersClick}
          className="p-2.5 border border-border hover:bg-gray-50 rounded-lg transition-colors"
        >
          {/* Custom Filter Icon - 3 horizontal lines with funnel shape */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H17" stroke="#040F2A" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M6 10H14" stroke="#040F2A" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 14H12" stroke="#040F2A" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}