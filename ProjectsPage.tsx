/**
 * PROJECTS PAGE
 * Detailed overview of all investment projects for introducer
 * Based on Tipari.cz business model - projects with tickets and reservations
 */

import { useState } from 'react';
import { Plus, Download, Filter, FileText } from 'lucide-react';
import { mockProjects } from '../data/mockProjects';
import { Project } from '../types/project';
import { ProjectDetail } from './ProjectDetail';

interface ProjectsPageProps {
  onNewProject?: () => void;
  onViewListedProjects?: () => void;
}

export function ProjectsPage({ onNewProject, onViewListedProjects }: ProjectsPageProps = {}) {
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

  // Use all projects (no filtering)
  const filteredProjects = mockProjects;

  // Status color helper
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Open':
        return 'text-[#14AE6B] bg-[#14AE6B]/10';
      case 'Paused':
        return 'text-[#215EF8] bg-[#215EF8]/10';
      case 'Fully reserved':
        return 'text-[#6B7280] bg-gray-100';
      case 'Finished':
        return 'text-[#040F2A] bg-gray-200';
      default:
        return 'text-[#6B7280] bg-gray-100';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'Open': return 'Otevřeno';
      case 'Paused': return 'Pozastaveno';
      case 'Fully reserved': return 'Plně rezervováno';
      case 'Finished': return 'Dokončeno';
      default: return status;
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `${(amount / 1_000_000).toFixed(1)}M Kč`;
  };

  const formatCurrencyFull = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount / 1000) + 'k';
  };

  const getDurationRange = (project: Project) => {
    if (project.tickets.length === 0) return '—';
    const durations = project.tickets.map(t => t.duration);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    if (minDuration === maxDuration) {
      return `${minDuration} měs.`;
    }
    return `${minDuration}-${maxDuration} měs.`;
  };

  const calculateTotalCommission = (project: Project) => {
    return project.tickets.reduce((total, ticket) => {
      return total + (ticket.investmentAmount * ticket.commission) / 100;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {(onNewProject || onViewListedProjects) && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Projekty</h1>
            <p className="text-muted-foreground">Přehled všech investičních projektů na platformě</p>
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
      )}

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-[#EAEAEA] overflow-hidden">
        <table className="w-full">
          <tbody className="bg-white divide-y divide-[#EAEAEA]">
            {filteredProjects.map((project, index) => {
              const statusColor = getStatusColor(project.status);
              const isFirst = index === 0;
              const isLast = index === filteredProjects.length - 1;
              
              return (
                <tr 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className={`px-4 py-4 ${isFirst ? 'rounded-tl-lg' : ''} ${isLast ? 'rounded-bl-lg' : ''}`}>
                    <div className="flex items-start gap-3">
                      {project.imageUrl && (
                        <img 
                          src={project.imageUrl} 
                          alt={project.name}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#040F2A] max-w-[180px] truncate">
                          {project.name}
                        </div>
                        <div className="text-xs text-[#6B7280] truncate">{project.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#040F2A]">
                      {formatCurrency(project.totalInvestmentVolume)}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#14AE6B]">
                      {project.yieldPA.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#040F2A]">{getDurationRange(project)}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#040F2A]">{project.ltv}%</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-[#040F2A]">
                      {formatCurrencyFull(calculateTotalCommission(project))} Kč
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#6B7280]">{project.investmentForm}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusColor}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProjects.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-[#6B7280]">Nebyly nalezeny žádné projekty</p>
        </div>
      )}
    </div>
  );
}