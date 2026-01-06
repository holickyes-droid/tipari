import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Settings2 } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { SortOption, ProjectType, ProjectStatus } from '../types/project';

interface FilterBarProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onFilterChange: (filters: FilterState) => void;
  onAdvancedFiltersClick: () => void;
}

export interface FilterState {
  status: ProjectStatus[];
  type: ProjectType[];
  projectForm: string | null;
}

export function FilterBar({ sortBy, onSortChange, onFilterChange, onAdvancedFiltersClick }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    type: [],
    projectForm: null,
  });

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleArrayFilter = (key: keyof FilterState, value: any) => {
    const currentArray = filters[key] as any[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const activeFilterCount = filters.status.length + filters.type.length + (filters.projectForm ? 1 : 0);

  // Column labels matching ProjectListHeader
  const metricColumns = [
    { label: 'Investice' },
    { label: 'Výnos' },
    { label: 'Délka' },
    { label: 'LTV' },
    { label: 'Provize' },
    { label: 'Forma', hasDropdown: true },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center">
        {/* Left Section - Filters Button (matching width with view layout toggle) */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ width: '340px' }}>
          <Button 
            variant="ghost" 
            className="gap-2 text-sm text-muted-foreground hover:text-[#040F2A] p-0 h-auto"
            onClick={onAdvancedFiltersClick}
          >
            <Settings2 className="w-4 h-4" />
            Filtry
            {activeFilterCount > 0 && (
              <span className="ml-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-[#215EF8] text-white rounded-full text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Center Section - Metric Column Labels (matching ProjectListHeader columns) */}
        <div className="flex items-center flex-1">
          {metricColumns.map((column, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-4 py-3 text-xs font-medium text-muted-foreground"
              style={{ minWidth: '120px' }}
            >
              {column.hasDropdown ? (
                <Select 
                  value={filters.projectForm || 'all'} 
                  onValueChange={(value) => updateFilter('projectForm', value === 'all' ? null : value)}
                >
                  <SelectTrigger className="w-full border-0 shadow-none text-xs font-medium h-auto p-0 gap-1">
                    <SelectValue placeholder="Forma" />
                  </SelectTrigger>
                  <SelectContent align="center">
                    <SelectItem value="all">Všechny</SelectItem>
                    <SelectItem value="loan">Zápůjčka</SelectItem>
                    <SelectItem value="majority-equity">Majoritní ekvita</SelectItem>
                    <SelectItem value="minority-equity">Minoritní ekvita</SelectItem>
                    <SelectItem value="project-sale">Prodej projektu</SelectItem>
                    <SelectItem value="leaseback">Zpětný leasing</SelectItem>
                    <SelectItem value="mezzanine">Mezaninové financování</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                column.label
              )}
            </div>
          ))}
        </div>

        {/* Right Section - Sort Dropdown (matching width with project status filter) */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ minWidth: '240px' }}>
          <span className="text-xs text-muted-foreground whitespace-nowrap">Řadit:</span>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="w-full border-0 shadow-none text-xs font-medium h-auto p-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="yield-desc">Výnos p.a. (nejvyšší)</SelectItem>
              <SelectItem value="ltv-asc">LTV (nejnižší)</SelectItem>
              <SelectItem value="duration-asc">Doba trvání (nejkratší)</SelectItem>
              <SelectItem value="volume-desc">Objem (nejvyšší)</SelectItem>
              <SelectItem value="available-tickets">Dostupné tikety</SelectItem>
              <SelectItem value="newest">Nejnovější</SelectItem>
              <SelectItem value="priority">Priorita</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}