/**
 * MULTI-SELECT DROPDOWN COMPONENT
 * Professional searchable dropdown with multi-selection for private banking UX
 * 
 * Psychology principles applied:
 * - Progressive disclosure (show only what's needed)
 * - Reduced cognitive load (search instead of scan)
 * - Immediate feedback (visual selection state)
 * - Clear affordances (hover states, icons)
 */

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  accentColor?: 'blue' | 'green' | 'amber' | 'purple';
}

export function MultiSelectDropdown({
  options,
  selectedValues,
  onChange,
  placeholder = 'Vyberte...',
  label,
  required = false,
  error,
  accentColor = 'blue',
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Color schemes for different accent colors
  const colorSchemes = {
    blue: {
      border: 'border-[#215EF8]',
      bg: 'bg-[#215EF8]',
      bgLight: 'bg-[#215EF8]/10',
      text: 'text-[#215EF8]',
      hover: 'hover:bg-[#215EF8]/5',
    },
    green: {
      border: 'border-[#14AE6B]',
      bg: 'bg-[#14AE6B]',
      bgLight: 'bg-[#14AE6B]/10',
      text: 'text-[#14AE6B]',
      hover: 'hover:bg-[#14AE6B]/5',
    },
    amber: {
      border: 'border-amber-500',
      bg: 'bg-amber-500',
      bgLight: 'bg-amber-500/10',
      text: 'text-amber-700',
      hover: 'hover:bg-amber-500/5',
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-700',
      hover: 'hover:bg-purple-500/5',
    },
  };

  const colors = colorSchemes[accentColor];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  const removeValue = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Main Input */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full min-h-[48px] px-4 py-2.5 rounded-lg border-2 transition-all cursor-pointer ${
          error
            ? 'border-red-500 bg-red-50'
            : isOpen
            ? `${colors.border} ${colors.bgLight}`
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selected items as chips */}
          {selectedValues.length > 0 ? (
            <>
              {selectedValues.map((value) => (
                <span
                  key={value}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${colors.bgLight} ${colors.text} text-sm font-medium`}
                >
                  {value}
                  <button
                    type="button"
                    onClick={(e) => removeValue(value, e)}
                    className={`${colors.hover} rounded-full p-0.5 transition-colors`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </>
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>

        {/* Right icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {selectedValues.length > 0 && (
            <>
              <button
                type="button"
                onClick={clearAll}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Vymazat vše"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-300" />
            </>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="relative z-50">
          <div className="absolute top-1 left-0 right-0 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden flex flex-col">
            {/* Search input */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Hledat..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#215EF8]/20 focus:border-[#215EF8] text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options list */}
            <div className="overflow-y-auto flex-1">
              {filteredOptions.length > 0 ? (
                <div className="py-1">
                  {filteredOptions.map((option) => {
                    const isSelected = selectedValues.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(option)}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
                          isSelected
                            ? `${colors.bgLight} ${colors.text} font-medium`
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? `${colors.border} ${colors.bg}`
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                        <span className="text-sm">{option}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                  Žádné výsledky pro "{searchQuery}"
                </div>
              )}
            </div>

            {/* Footer with count */}
            {selectedValues.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-600">
                  Vybráno: <span className="font-semibold">{selectedValues.length}</span> z {options.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
