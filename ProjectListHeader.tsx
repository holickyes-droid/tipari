import { SortOption } from '../types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ProjectListHeaderProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewLayout: 'rows' | 'grid';
  onViewLayoutChange: (layout: 'rows' | 'grid') => void;
  showClosedProjects: boolean;
  onShowClosedProjectsChange: (show: boolean) => void;
  openProjectsCount: number;
  closedProjectsCount: number;
  projectForm: string | null;
  onProjectFormChange: (form: string | null) => void;
}

interface ColumnSort {
  key: SortOption;
  label: string;
}

export function ProjectListHeader({ sortBy, onSortChange, viewLayout, onViewLayoutChange, showClosedProjects, onShowClosedProjectsChange, openProjectsCount, closedProjectsCount, projectForm, onProjectFormChange }: ProjectListHeaderProps) {
  const columns = [
    { key: 'volume-desc', label: 'Investice' },
    { key: 'yield-desc', label: 'Výnos' },
    { key: 'duration-asc', label: 'Délka' },
    { key: 'ltv-asc', label: 'LTV' },
    { key: 'commission-desc', label: 'Provize' },
  ] as const;

  const getSortIcon = (columnKey: SortOption) => {
    const baseKey = columnKey.replace(/-asc|-desc/, '');
    const currentBaseKey = sortBy.replace(/-asc|-desc/, '');
    const isActive = baseKey === currentBaseKey;
    
    if (!isActive) {
      // Inactive state - stacked arrows
      return (
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
          <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor"/>
          <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor"/>
        </svg>
      );
    }

    // Active state - single arrow
    if (sortBy.includes('-desc')) {
      return (
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4L3 7L9 7L6 4Z" fill="currentColor"/>
        </svg>
      );
    } else {
      return (
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L9 9L3 9L6 12Z" fill="currentColor"/>
        </svg>
      );
    }
  };

  const handleSort = (columnKey: SortOption) => {
    // Toggle between asc and desc
    if (sortBy === columnKey) {
      // If already sorting by this column, toggle direction
      if (columnKey.includes('-desc')) {
        const ascKey = columnKey.replace('-desc', '-asc') as SortOption;
        onSortChange(ascKey);
      } else if (columnKey.includes('-asc')) {
        const descKey = columnKey.replace('-asc', '-desc') as SortOption;
        onSortChange(descKey);
      }
    } else {
      // First click: set to this column's default sort
      onSortChange(columnKey);
    }
  };

  const isActive = (columnKey: SortOption) => {
    const baseKey = columnKey.replace(/-asc|-desc/, '');
    const currentBaseKey = sortBy.replace(/-asc|-desc/, '');
    return baseKey === currentBaseKey;
  };

  return (
    <div className="bg-gray-50/50 rounded-lg mb-4">
      <div className="flex items-center">
        {/* Left Section - View Layout Toggle */}
        <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0">
          <button
            onClick={() => onViewLayoutChange('rows')}
            className={`p-1 rounded transition-colors ${
              viewLayout === 'rows'
                ? 'bg-[#040F2A] text-white'
                : 'text-[#040F2A]/40 hover:text-[#040F2A]'
            }`}
          >
            {/* Rows icon - 3 horizontal lines */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"/>
              <rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <button
            onClick={() => onViewLayoutChange('grid')}
            className={`p-1 rounded transition-colors ${
              viewLayout === 'grid'
                ? 'bg-[#040F2A] text-white'
                : 'text-[#040F2A]/40 hover:text-[#040F2A]'
            }`}
          >
            {/* Grid icon - 4 squares */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"/>
              <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"/>
            </svg>
          </button>
          <span className="text-xs text-[#040F2A] ml-1 w-[100px]">
            {viewLayout === 'rows' ? 'Řádkový výpis' : 'Tabulkový výpis'}
          </span>
        </div>

        {/* Center Section - Metric Column Labels */}
        <div className="flex items-center flex-1">
          {columns.map((column, index) => (
            <button
              key={index}
              onClick={() => handleSort(column.key)}
              className={`
                flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-normal
                transition-colors
                ${
                  isActive(column.key)
                    ? 'text-[#215EF8]'
                    : 'text-[#040F2A]'
                }
              `}
              style={{ flex: 1 }}
            >
              <span>{column.label}</span>
              {getSortIcon(column.key)}
            </button>
          ))}
          
          {/* Forma Dropdown */}
          <div className="flex items-center justify-center px-4 py-3" style={{ flex: 1 }}>
            <Select 
              value={projectForm || 'all'} 
              onValueChange={(value) => onProjectFormChange(value === 'all' ? null : value)}
            >
              <SelectTrigger className="border-0 shadow-none bg-transparent p-0 h-auto gap-1.5 text-xs font-normal text-[#040F2A] hover:text-[#215EF8] w-auto [&_svg]:w-3 [&_svg]:h-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="center">
                <SelectItem value="all">Forma</SelectItem>
                <SelectItem value="loan">Zápůjčka</SelectItem>
                <SelectItem value="majority-equity">Majoritní ekvita</SelectItem>
                <SelectItem value="minority-equity">Minoritní ekvita</SelectItem>
                <SelectItem value="project-sale">Prodej projektu</SelectItem>
                <SelectItem value="leaseback">Zpětný leasing</SelectItem>
                <SelectItem value="mezzanine">Mezaninové financování</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right Section - Toggle Switch */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => onShowClosedProjectsChange(!showClosedProjects)}
            className={`
              relative inline-flex h-5 w-9 items-center rounded-full transition-colors
              ${showClosedProjects ? 'bg-[#040F2A]' : 'bg-[#14AE6B]'}
            `}
          >
            <span
              className={`
                inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform
                flex items-center justify-center
                ${showClosedProjects ? 'translate-x-5' : 'translate-x-0.5'}
              `}
            >
              {/* Small dash inside the circle matching the switch background color */}
              <span 
                className={`
                  w-1.5 h-0.5 rounded-full
                  ${showClosedProjects ? 'bg-[#040F2A]' : 'bg-[#14AE6B]'}
                `}
              />
            </span>
          </button>
          <span className="text-xs text-[#040F2A] w-[60px]">
            {showClosedProjects ? 'Zavřené' : 'Otevřené'}
          </span>
          <span className="text-xs text-[#040F2A] font-medium w-[30px]">
            ({showClosedProjects ? closedProjectsCount : openProjectsCount})
          </span>
        </div>
      </div>
    </div>
  );
}