/**
 * PREFERENCES DRAWER - User preference settings for ticket filtering
 * 
 * Fingood aesthetic: Clean, minimal, lots of whitespace
 * Slide-in panel from right with overlay
 */

import { X, Check, Bell, Target, TrendingUp, MapPin, Shield, Clock, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PreferencesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreferencesDrawer({ isOpen, onClose }: PreferencesDrawerProps) {
  // Preference states
  const [investmentTypes, setInvestmentTypes] = useState<string[]>(['Ekvita']);
  const [minYield, setMinYield] = useState<string>('14');
  const [locations, setLocations] = useState<string[]>(['Praha']);
  const [securityLevels, setSecurityLevels] = useState<string[]>(['Zástava 1. pořadí']);
  const [maxDuration, setMaxDuration] = useState<string>('24');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);

  const handleSave = () => {
    toast.success('Preference uloženy');
    onClose();
  };

  const handleClearAll = () => {
    setInvestmentTypes([]);
    setMinYield('10');
    setLocations([]);
    setSecurityLevels([]);
    setMaxDuration('12');
    setEmailNotifications(false);
    setBrowserNotifications(false);
    toast.success('Všechny preference zrušeny');
  };

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void) => {
    if (arr.includes(item)) {
      setter(arr.filter(i => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#040F2A]">Preference zobrazení</h2>
              <p className="text-sm text-gray-500 mt-0.5">Nastavte parametry pro automatické upozornění</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Investment Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-[#215EF8]" />
                <label className="text-sm font-semibold text-[#040F2A]">
                  Typ investice
                </label>
              </div>
              <div className="space-y-2">
                {['Ekvita', 'Zápůjčka', 'Mezanin'].map(type => (
                  <label key={type} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={investmentTypes.includes(type)}
                      onChange={() => toggleArrayItem(investmentTypes, type, setInvestmentTypes)}
                      className="w-4 h-4 text-[#215EF8] rounded border-gray-300 focus:ring-[#215EF8]"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Yield */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#14AE6B]" />
                <label className="text-sm font-semibold text-[#040F2A]">
                  Minimální výnos p.a.
                </label>
              </div>
              <div className="space-y-2">
                {['10', '12', '14', '16', '18'].map(yield_val => (
                  <label key={yield_val} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="minYield"
                      checked={minYield === yield_val}
                      onChange={() => setMinYield(yield_val)}
                      className="w-4 h-4 text-[#215EF8] border-gray-300 focus:ring-[#215EF8]"
                    />
                    <span className="text-sm text-gray-700">{yield_val}% a více</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#215EF8]" />
                <label className="text-sm font-semibold text-[#040F2A]">
                  Lokalita
                </label>
              </div>
              <div className="space-y-2">
                {['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Jiné'].map(loc => (
                  <label key={loc} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={locations.includes(loc)}
                      onChange={() => toggleArrayItem(locations, loc, setLocations)}
                      className="w-4 h-4 text-[#215EF8] rounded border-gray-300 focus:ring-[#215EF8]"
                    />
                    <span className="text-sm text-gray-700">{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Security Level */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[#215EF8]" />
                <label className="text-sm font-semibold text-[#040F2A]">
                  Forma zajištění
                </label>
              </div>
              <div className="space-y-2">
                {['Zástava 1. pořadí', 'Zástava 2. pořadí', 'Ručení', 'Kombinované', 'Nezajištěno'].map(sec => (
                  <label key={sec} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={securityLevels.includes(sec)}
                      onChange={() => toggleArrayItem(securityLevels, sec, setSecurityLevels)}
                      className="w-4 h-4 text-[#215EF8] rounded border-gray-300 focus:ring-[#215EF8]"
                    />
                    <span className="text-sm text-gray-700">{sec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Max Duration */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#215EF8]" />
                <label className="text-sm font-semibold text-[#040F2A]">
                  Maximální doba trvání
                </label>
              </div>
              <div className="space-y-2">
                {['12', '18', '24', '36', '48'].map(dur => (
                  <label key={dur} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="maxDuration"
                      checked={maxDuration === dur}
                      onChange={() => setMaxDuration(dur)}
                      className="w-4 h-4 text-[#215EF8] border-gray-300 focus:ring-[#215EF8]"
                    />
                    <span className="text-sm text-gray-700">Do {dur} měsíců</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-[#215EF8]" />
                <label className="text-sm font-semibold text-[#040F2A]">
                  Upozornění
                </label>
              </div>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                  <span className="text-sm text-gray-700">E-mailová upozornění</span>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#215EF8] rounded border-gray-300 focus:ring-[#215EF8]"
                  />
                </label>
                <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-[#215EF8]/30 cursor-pointer transition-colors">
                  <span className="text-sm text-gray-700">Browserová upozornění</span>
                  <input
                    type="checkbox"
                    checked={browserNotifications}
                    onChange={(e) => setBrowserNotifications(e.target.checked)}
                    className="w-4 h-4 text-[#215EF8] rounded border-gray-300 focus:ring-[#215EF8]"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSave}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-[#215EF8] bg-[#215EF8] text-white text-sm font-semibold hover:bg-[#1B4FD1] hover:border-[#1B4FD1] transition-colors"
            >
              Uložit preference
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2.5 rounded-lg text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                Zrušit všechny preference
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Zavřít
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}