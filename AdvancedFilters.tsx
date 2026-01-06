import { X, Shield, FileCheck, FileText, Scale, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from './ui/sheet';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

interface FilterValues {
  yieldRange: [number, number];
  ltvRange: [number, number];
  duration: string[];
  projectStatus: string[];
  ticketStatus: string[];
  security: string[];
  investmentType: string[];
  commissionRange: [number, number];
  onlyMyProjects: boolean;
  onlyPlatformProjects: boolean;
  showOnlyMatches: boolean;
  minMatchPercentage: number;
}

export function AdvancedFilters({ isOpen, onClose, onApply }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    yieldRange: [0, 15],
    ltvRange: [0, 80],
    duration: [],
    projectStatus: [],
    ticketStatus: [],
    security: [],
    investmentType: [],
    commissionRange: [0, 10],
    onlyMyProjects: false,
    onlyPlatformProjects: false,
    showOnlyMatches: false,
    minMatchPercentage: 0,
  });

  const handleReset = () => {
    setFilters({
      yieldRange: [0, 15],
      ltvRange: [0, 80],
      duration: [],
      projectStatus: [],
      ticketStatus: [],
      security: [],
      investmentType: [],
      commissionRange: [0, 10],
      onlyMyProjects: false,
      onlyPlatformProjects: false,
      showOnlyMatches: false,
      minMatchPercentage: 0,
    });
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onApply();
    onClose();
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[540px] overflow-y-auto p-0">
        {/* Accessibility: Required for screen readers */}
        <SheetTitle className="sr-only">Pokročilé filtry</SheetTitle>
        <SheetDescription className="sr-only">
          Nastavte pokročilé filtry pro projekty podle výnosu, LTV, doby trvání, a dalších parametrů
        </SheetDescription>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#040F2A]">Pokročilé filtry</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-[#040F2A]"
              >
                Resetovat filtry
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* GROUP 1 — Výnos */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-[#040F2A]">Výnos p.a.</Label>
            <div className="space-y-3">
              <Slider
                value={filters.yieldRange}
                onValueChange={(value) => setFilters({ ...filters, yieldRange: value as [number, number] })}
                max={15}
                step={0.5}
                className="w-full"
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.yieldRange[0].toFixed(1)}%</span>
                <span>{filters.yieldRange[1].toFixed(1)}%</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, yieldRange: [6, 8] })}
                  className="text-xs"
                >
                  6–8 %
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, yieldRange: [8, 10] })}
                  className="text-xs"
                >
                  8–10 %
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, yieldRange: [10, 15] })}
                  className="text-xs"
                >
                  10 %+
                </Button>
              </div>
            </div>
          </div>

          {/* GROUP 2 — LTV */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-[#040F2A]">LTV</Label>
            <div className="space-y-3">
              <Slider
                value={filters.ltvRange}
                onValueChange={(value) => setFilters({ ...filters, ltvRange: value as [number, number] })}
                max={80}
                step={5}
                className="w-full"
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.ltvRange[0]}%</span>
                <span>{filters.ltvRange[1]}%</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, ltvRange: [0, 60] })}
                  className="text-xs"
                >
                  ≤ 60 %
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, ltvRange: [0, 70] })}
                  className="text-xs"
                >
                  ≤ 70 %
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, ltvRange: [0, 80] })}
                  className="text-xs"
                >
                  ≤ 80 %
                </Button>
              </div>
            </div>
          </div>

          {/* GROUP 3 — Doba trvání */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#040F2A]">Doba trvání</Label>
            <div className="space-y-2">
              {[
                { value: '0-12', label: 'Do 12 měsíců' },
                { value: '12-24', label: '12–24 měsíců' },
                { value: '24-36', label: '24–36 měsíců' },
                { value: '36+', label: '36+ měsíců' },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`duration-${item.value}`}
                    checked={filters.duration.includes(item.value)}
                    onCheckedChange={() =>
                      setFilters({
                        ...filters,
                        duration: toggleArrayValue(filters.duration, item.value),
                      })
                    }
                    className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                  />
                  <Label
                    htmlFor={`duration-${item.value}`}
                    className="font-normal text-sm cursor-pointer text-[#040F2A]"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* GROUP 4 — Stav projektu */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#040F2A]">Stav projektu</Label>
            <div className="space-y-2">
              {[
                { value: 'open', label: 'Otevřené' },
                { value: 'fully-reserved', label: 'Obsazeno' },
                { value: 'paused', label: 'Pozastaveno' },
                { value: 'finished', label: 'Ukončeno' },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-status-${item.value}`}
                    checked={filters.projectStatus.includes(item.value)}
                    onCheckedChange={() =>
                      setFilters({
                        ...filters,
                        projectStatus: toggleArrayValue(filters.projectStatus, item.value),
                      })
                    }
                    className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                  />
                  <Label
                    htmlFor={`project-status-${item.value}`}
                    className="font-normal text-sm cursor-pointer text-[#040F2A]"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* GROUP 5 — Stav tiketů */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#040F2A]">Stav tiketů</Label>
            <div className="space-y-2">
              {[
                { value: 'available', label: 'Dostupné tikety' },
                { value: 'last-slot', label: 'Pouze poslední slot' },
                { value: 'reserved', label: 'Již rezervované' },
                { value: 'hidden', label: 'Skryté / nedostupné' },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ticket-status-${item.value}`}
                    checked={filters.ticketStatus.includes(item.value)}
                    onCheckedChange={() =>
                      setFilters({
                        ...filters,
                        ticketStatus: toggleArrayValue(filters.ticketStatus, item.value),
                      })
                    }
                    className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                  />
                  <Label
                    htmlFor={`ticket-status-${item.value}`}
                    className="font-normal text-sm cursor-pointer text-[#040F2A]"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* GROUP 6 — Zajištění */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#040F2A]">Zajištění</Label>
            <div className="space-y-2">
              {[
                { value: 'mortgage-1', label: 'Zástava 1. pořadí', icon: Shield },
                { value: 'mortgage-2', label: 'Zástava 2. pořadí', icon: Shield },
                { value: 'notary', label: 'Notářský zápis', icon: FileCheck },
                { value: 'bill', label: 'Směnka', icon: FileText },
                { value: 'guarantee', label: 'Ručitelský závazek', icon: Scale },
                { value: 'none', label: 'Bez zajištění', icon: Building2 },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`security-${item.value}`}
                      checked={filters.security.includes(item.value)}
                      onCheckedChange={() =>
                        setFilters({
                          ...filters,
                          security: toggleArrayValue(filters.security, item.value),
                        })
                      }
                      className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                    />
                    <Label
                      htmlFor={`security-${item.value}`}
                      className="font-normal text-sm cursor-pointer text-[#040F2A] flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      {item.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GROUP 7 — Forma investice */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#040F2A]">Forma investice</Label>
            <div className="space-y-2">
              {[
                { value: 'loan', label: 'Zápůjčka' },
                { value: 'majority-equity', label: 'Majoritní ekvita' },
                { value: 'minority-equity', label: 'Minoritní ekvita' },
                { value: 'project-sale', label: 'Prodej projektu' },
                { value: 'leaseback', label: 'Zpětný leasing' },
                { value: 'mezzanine', label: 'Mezaninové financování' },
              ].map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`investment-type-${item.value}`}
                    checked={filters.investmentType.includes(item.value)}
                    onCheckedChange={() =>
                      setFilters({
                        ...filters,
                        investmentType: toggleArrayValue(filters.investmentType, item.value),
                      })
                    }
                    className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                  />
                  <Label
                    htmlFor={`investment-type-${item.value}`}
                    className="font-normal text-sm cursor-pointer text-[#040F2A]"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* GROUP 8 — Provize pro tipaře */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-[#040F2A]">Provize pro tipaře</Label>
            <div className="space-y-3">
              <Slider
                value={filters.commissionRange}
                onValueChange={(value) =>
                  setFilters({ ...filters, commissionRange: value as [number, number] })
                }
                max={10}
                step={0.5}
                className="w-full"
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{filters.commissionRange[0].toFixed(1)}%</span>
                <span>{filters.commissionRange[1].toFixed(1)}%</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, commissionRange: [2, 10] })}
                  className="text-xs"
                >
                  ≥ 2 %
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, commissionRange: [3, 10] })}
                  className="text-xs"
                >
                  ≥ 3 %
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, commissionRange: [4, 10] })}
                  className="text-xs"
                >
                  ≥ 4 %
                </Button>
              </div>
            </div>
          </div>

          {/* GROUP 9 — Projekty */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-[#040F2A]">Projekty</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="only-my-projects"
                  checked={filters.onlyMyProjects}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, onlyMyProjects: checked as boolean })
                  }
                  className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                />
                <Label
                  htmlFor="only-my-projects"
                  className="font-normal text-sm cursor-pointer text-[#040F2A]"
                >
                  Pouze moje projekty
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="only-platform-projects"
                  checked={filters.onlyPlatformProjects}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, onlyPlatformProjects: checked as boolean })
                  }
                  className="data-[state=checked]:bg-[#215EF8] data-[state=checked]:border-[#215EF8]"
                />
                <Label
                  htmlFor="only-platform-projects"
                  className="font-normal text-sm cursor-pointer text-[#040F2A]"
                >
                  Projekty platformy
                </Label>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Partner / Developer (volitelné)
                </Label>
                <Input
                  placeholder="Hledat partnera..."
                  className="focus:ring-2 focus:ring-[#215EF8]"
                />
              </div>
            </div>
          </div>

          {/* GROUP 10 — Shoda s investory */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold text-[#040F2A]">Shoda s investory</Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-only-matches" className="text-sm text-[#040F2A]">
                  Zobrazit jen projekty se shodou
                </Label>
                <Switch
                  id="show-only-matches"
                  checked={filters.showOnlyMatches}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, showOnlyMatches: checked })
                  }
                  className="data-[state=checked]:bg-[#215EF8]"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Minimální shoda</Label>
                <Slider
                  value={[filters.minMatchPercentage]}
                  onValueChange={(value) =>
                    setFilters({ ...filters, minMatchPercentage: value[0] })
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span className="font-medium text-[#040F2A]">
                    {filters.minMatchPercentage}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4">
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 hover:bg-muted" onClick={onClose}>
              Zrušit
            </Button>
            <Button
              className="flex-1 bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
              onClick={handleApply}
            >
              Použít filtry
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}