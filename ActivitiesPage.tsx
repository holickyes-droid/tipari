import projectImg from 'figma:asset/2733456db5562a25a8cb2b8e20bf9ce1190c8df9.png';
import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';

interface ActivitiesPageProps {
  onNewProject?: () => void;
  onViewListedProjects?: () => void;
}

export function ActivitiesPage({ onNewProject, onViewListedProjects }: ActivitiesPageProps = {}) {
  const [activeView, setActiveView] = useState<'rezervace' | 'projekty'>('projekty');
  
  const activities = [
    {
      id: '1',
      projectName: 'Viladomy Hermanikovice',
      projectDate: '19.11.2025 / 13:48',
      partner: 'BTK Development s.r.o.',
      investice: '25 000 000 Kč',
      rezervace: 5,
      sloty: 10,
      tikety: '5/10',
      stav: 'Aktivní',
      countdown: '1d 12h 35m',
    },
    {
      id: '2',
      projectName: 'Viladomy Hermanikovice',
      projectDate: '19.11.2025 / 13:48',
      partner: 'BTK Development s.r.o.',
      investice: '25 000 000 Kč',
      rezervace: 5,
      sloty: 10,
      tikety: '7/12',
      stav: 'Aktivní',
      countdown: '1d 12h 35m',
    },
    {
      id: '3',
      projectName: 'Viladomy Hermanikovice',
      projectDate: '19.11.2025 / 13:48',
      partner: 'BTK Development s.r.o.',
      investice: '25 000 000 Kč',
      rezervace: 5,
      sloty: 10,
      tikety: '12/20',
      stav: 'Aktivní',
      countdown: '1d 12h 35m',
    },
    {
      id: '4',
      projectName: 'Viladomy Hermanikovice',
      projectDate: '19.11.2025 / 13:48',
      partner: 'BTK Development s.r.o.',
      investice: '25 000 000 Kč',
      rezervace: 5,
      sloty: 10,
      tikety: '12/20',
      stav: 'Aktivní',
      countdown: '1d 12h 35m',
    },
  ];

  const reservations = [
    {
      id: '1',
      projectName: 'Viladomy Hermanikovice',
      projectId: 'číslo projektu',
      investor: 'Jan Novák',
      tiket: 'T2',
      investice: '25 000 000 Kč',
      vytvořeno: '15.9.2025 (11:05)',
      stav: 'Neaktivní',
      countdown: '1d 12h 12m',
    },
    {
      id: '2',
      projectName: 'Viladomy Hermanikovice',
      projectId: 'číslo projektu',
      investor: 'Jan Novák',
      tiket: 'T2',
      investice: '25 000 000 Kč',
      vytvořeno: '15.9.2025 (11:05)',
      stav: 'Neaktivní',
      countdown: '1d 12h 12m',
    },
    {
      id: '3',
      projectName: 'Viladomy Hermanikovice',
      projectId: 'číslo projektu',
      investor: 'Jan Novák',
      tiket: 'T2',
      investice: '25 000 000 Kč',
      vytvořeno: '15.9.2025 (11:05)',
      stav: 'Neaktivní',
      countdown: '1d 12h 12m',
    },
    {
      id: '4',
      projectName: 'Viladomy Hermanikovice',
      projectId: 'číslo projektu',
      investor: 'Jan Novák',
      tiket: 'T2',
      investice: '25 000 000 Kč',
      vytvořeno: '15.9.2025 (11:05)',
      stav: 'Neaktivní',
      countdown: '1d 12h 12m',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Aktivity</h1>
          <p className="text-muted-foreground">Přehled všech vašich aktivit na platformě</p>
        </div>
        
        <div className="flex items-center gap-3">
          {onViewListedProjects && (
            <button
              onClick={onViewListedProjects}
              className="px-6 py-3 rounded-lg border-2 border-[#215EF8] text-[#215EF8] font-semibold hover:bg-[#215EF8]/5 transition-all flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Zalistované projekty
            </button>
          )}
          {onNewProject && (
            <button
              onClick={onNewProject}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#215EF8] to-[#1B4FD1] text-white font-semibold hover:shadow-lg hover:shadow-[#215EF8]/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nový projekt
            </button>
          )}
        </div>
      </div>

      {/* Switcher and Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[28px] font-medium text-[#040F2A]">5</span>
          <span className="text-[15px] text-muted-foreground">Aktivních projektů</span>
        </div>
        
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              activeView === 'rezervace' 
                ? 'bg-white text-[#040F2A] shadow-sm' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveView('rezervace')}
          >
            Rezervace
          </button>
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              activeView === 'projekty' 
                ? 'bg-[#040F2A] text-white shadow-sm' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveView('projekty')}
          >
            Projekty
          </button>
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              {activeView === 'projekty' ? (
                <>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Projekt</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Partner</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Investice</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">
                    Rezervace
                    <div className="text-[9px] font-normal text-muted-foreground">(Aktivní)</div>
                  </th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">
                    Sloty
                    <div className="text-[9px] font-normal text-muted-foreground">(Aktivní)</div>
                  </th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">
                    Tikety
                    <div className="text-[9px] font-normal text-muted-foreground">(Aktivní)</div>
                  </th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">
                    Stav
                    <div className="text-[9px] font-normal text-muted-foreground">(Do konce)</div>
                  </th>
                  <th className="px-4 py-2"></th>
                </>
              ) : (
                <>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">
                    Projekt / ID
                  </th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Investor</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Tiket</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Investice</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Vytvořeno</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Stav</th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold text-[#040F2A] whitespace-nowrap">Zbývá</th>
                  <th className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-9 h-5 bg-[#14AE6B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                      </label>
                      <span className="text-[11px] font-semibold text-[#040F2A]">Aktivní</span>
                      <span className="text-[11px] text-muted-foreground">(4)</span>
                    </div>
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activeView === 'projekty' ? (
              activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={projectImg} 
                        alt={activity.projectName}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-[#040F2A] whitespace-nowrap">{activity.projectName}</div>
                        <div className="text-[11px] text-muted-foreground whitespace-nowrap">{activity.projectDate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{activity.partner}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{activity.investice}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{activity.rezervace}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{activity.sloty}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{activity.tikety}</td>
                  <td className="px-4 py-3">
                    <div className="text-[12px] font-medium text-[#040F2A] whitespace-nowrap">{activity.stav}</div>
                    <div className="text-[11px] text-muted-foreground whitespace-nowrap">{activity.countdown}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-[11px] font-medium text-[#215EF8] hover:underline whitespace-nowrap">
                      Detail rezervací
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={projectImg} 
                        alt={reservation.projectName}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium text-[#040F2A] whitespace-nowrap">{reservation.projectName}</div>
                        <div className="text-[11px] text-muted-foreground whitespace-nowrap">{reservation.projectId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{reservation.investor}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{reservation.tiket}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{reservation.investice}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{reservation.vytvořeno}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{reservation.stav}</td>
                  <td className="px-4 py-3 text-[12px] text-[#040F2A] whitespace-nowrap">{reservation.countdown}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-[11px] font-medium text-[#215EF8] hover:underline whitespace-nowrap">
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}