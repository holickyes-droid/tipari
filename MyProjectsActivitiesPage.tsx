/**
 * MY PROJECTS ACTIVITIES PAGE
 * Shows activity on projects introduced by current user
 * Displays external reservations from other introducers
 * Based on Tipari.cz introducer business model
 */

import { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { mockProjects, calculateProjectSummary, ProjectSummary } from '../data/mockProjects';
import { mockReservations } from '../data/mockReservations';
import { Project } from '../types/project';
import { ProjectDetail } from './ProjectDetail';

export function MyProjectsActivitiesPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // If detail view is open, show it
  if (selectedProject) {
    return (
      <ProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  // Calculate summary for each project
  const projectSummaries: ProjectSummary[] = mockProjects.map(project => calculateProjectSummary(project, mockReservations));

  // Sort by last activity (most recent first)
  projectSummaries.sort((a, b) => 
    new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );

  // Calculate stats
  const totalProjects = projectSummaries.length;
  const projectsWithActive = projectSummaries.filter(p => p.activeReservations > 0).length;
  const totalCompleted = projectSummaries.reduce((sum, p) => sum + p.completedReservations, 0);
  const totalReservations = projectSummaries.reduce((sum, p) => sum + p.totalReservations, 0);
  const conversionRate = totalReservations > 0 ? Math.round((totalCompleted / totalReservations) * 100) : 0;

  // Phase label helper
  const getPhaseLabel = (phase: string): string => {
    switch (phase) {
      case 'WAITING_INVESTOR_SIGNATURE': return 'Čeká na podpis';
      case 'WAITING_DEVELOPER_DECISION': return 'Čeká na developera';
      case 'WAITING_MEETING_SELECTION': return 'Výběr termínu';
      case 'MEETING_CONFIRMED': return 'Schůzka potvrzena';
      case 'MEETING_COMPLETED': return 'Schůzka dokončena';
      case 'SUCCESS': return 'Úspěch';
      case 'NO_DEAL': return 'Nedohodnutý';
      case 'EXPIRED': return 'Vypršelý';
      default: return phase;
    }
  };

  // Status color helper
  const getStatusColor = (activity: ProjectSummary): string => {
    if (activity.activeReservations > 0) {
      return 'text-[#14AE6B] bg-[#14AE6B]/10';
    } else if (activity.waitingReservations > 0) {
      return 'text-[#215EF8] bg-[#215EF8]/10';
    } else {
      return 'text-[#6B7280] bg-gray-100';
    }
  };

  const getStatusLabel = (activity: ProjectSummary): string => {
    if (activity.activeReservations > 0) {
      return 'Aktivní';
    } else if (activity.waitingReservations > 0) {
      return 'Čeká na akci';
    } else {
      return 'Dokončeno';
    }
  };

  // Format date helper
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return `Dnes ${date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffHours < 48) {
      return 'Včera';
    } else {
      return date.toLocaleDateString('cs-CZ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Mé projekty</h1>
          <p className="text-[#6B7280]">Přehled projektů s vašimi aktivními nebo historickými rezervacemi</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#215EF8] rounded-lg hover:bg-[#1a4bc7] transition-colors">
            <Plus className="w-4 h-4" />
            Přidat projekt
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Celkem projektů</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{totalProjects}</div>
          <div className="text-xs text-[#6B7280] mt-1">S rezervacemi</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Aktivní projekty</div>
          <div className="text-2xl font-semibold text-[#14AE6B]">{projectsWithActive}</div>
          <div className="text-xs text-[#6B7280] mt-1">S potvrzenou schůzkou</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Dokončené rezervace</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{totalCompleted}</div>
          <div className="text-xs text-[#6B7280] mt-1">Schůzky proběhly</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Míra konverze</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{conversionRate}%</div>
          <div className="text-xs text-[#6B7280] mt-1">Dokončené/Celkem</div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#040F2A]">Projekty s aktivitami</h2>
          <p className="text-xs text-[#6B7280]">Klikněte na řádek pro detail projektu</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#EAEAEA]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Projekt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Rezervace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Aktivní / Čekající
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Tikety
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Nejvyšší fáze
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Poslední aktivita
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#EAEAEA]">
              {projectSummaries.map((activity) => {
                const statusColor = getStatusColor(activity);
                const project = mockProjects.find(p => p.id === activity.projectId);
                
                return (
                  <tr 
                    key={activity.projectId} 
                    onClick={() => project && setSelectedProject(project)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#040F2A] max-w-[250px] truncate">
                        {activity.projectName}
                      </div>
                      <div className="text-xs text-[#6B7280]">ID: {activity.projectId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#040F2A]">{activity.totalReservations}</div>
                      <div className="text-xs text-[#6B7280]">Celkem</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#040F2A]">
                        <span className="font-medium text-[#14AE6B]">{activity.activeReservations}</span>
                        {' / '}
                        <span className="font-medium text-[#215EF8]">{activity.waitingReservations}</span>
                      </div>
                      <div className="text-xs text-[#6B7280]">Aktivní / Čekající</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-[#040F2A]">
                        {activity.ticketsWithReservations.join(', ')}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {activity.ticketsWithReservations.length} tiket{activity.ticketsWithReservations.length !== 1 && 'ů'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6B7280]">
                        {getPhaseLabel(activity.highestPhase)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusColor}`}>
                        {getStatusLabel(activity)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#6B7280]">
                        {formatDate(activity.lastActivity)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {projectSummaries.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">Zatím nemáte žádné projekty s rezervacemi</p>
          </div>
        )}
      </div>
    </div>
  );
}