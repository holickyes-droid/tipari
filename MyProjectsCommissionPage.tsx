/**
 * MY PROJECTS COMMISSION PAGE
 * Aggregated commission view by projects
 * Based on Tipari.cz commission system
 */

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { mockCommissions, calculateCommissionSummary, getCommissionsByProject } from '../data/mockCommissions';
import { mockProjects } from '../data/mockProjects';
import { Project } from '../types/project';
import { CommissionProjectDetail } from './CommissionProjectDetail';

interface ProjectCommission {
  projectId: string;
  projectName: string;
  totalCommissions: number;
  expectedAmount: number;
  earnedAmount: number;
  paidAmount: number;
  lostAmount: number;
  successfulDeals: number;
  totalDeals: number;
  conversionRate: number;
}

export function MyProjectsCommissionPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // If detail view is open, show it
  if (selectedProject) {
    return (
      <CommissionProjectDetail 
        project={selectedProject} 
        onBack={() => setSelectedProject(null)}
      />
    );
  }

  // Aggregate commissions by project
  const projectCommissions: ProjectCommission[] = [];
  
  // Group by project
  const projectMap = new Map<string, typeof mockCommissions>();
  mockCommissions.forEach(commission => {
    if (!projectMap.has(commission.projectId)) {
      projectMap.set(commission.projectId, []);
    }
    projectMap.get(commission.projectId)!.push(commission);
  });

  // Calculate aggregates
  projectMap.forEach((commissions, projectId) => {
    const projectName = commissions[0]?.projectName || `Projekt ${projectId}`;
    
    const expected = commissions.filter(c => c.status === 'EXPECTED').reduce((sum, c) => sum + c.amount, 0);
    const earned = commissions.filter(c => c.status === 'EARNED' || c.status === 'PENDING_PAYMENT').reduce((sum, c) => sum + c.amount, 0);
    const paid = commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0);
    const lost = commissions.filter(c => c.status === 'LOST').length;
    
    const successful = commissions.filter(c => c.status === 'PAID' || c.status === 'PENDING_PAYMENT' || c.status === 'EARNED').length;
    const total = commissions.length;
    const conversion = total > 0 ? Math.round((successful / total) * 100) : 0;

    projectCommissions.push({
      projectId,
      projectName,
      totalCommissions: commissions.length,
      expectedAmount: expected,
      earnedAmount: earned,
      paidAmount: paid,
      lostAmount: lost,
      successfulDeals: successful,
      totalDeals: total,
      conversionRate: conversion,
    });
  });

  // Sort by total value (expected + earned + paid)
  projectCommissions.sort((a, b) => {
    const totalA = a.expectedAmount + a.earnedAmount + a.paidAmount;
    const totalB = b.expectedAmount + b.earnedAmount + b.paidAmount;
    return totalB - totalA;
  });

  // Calculate overall stats
  const summary = calculateCommissionSummary();
  const totalProjects = projectCommissions.length;
  const projectsWithEarnings = projectCommissions.filter(p => p.paidAmount > 0 || p.earnedAmount > 0).length;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#040F2A] mb-2">Provize podle projektů</h1>
          <p className="text-[#6B7280]">Agregovaný přehled provizí podle investičních projektů</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            Faktury
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#040F2A] bg-white border border-[#EAEAEA] rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export provizí
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Vyplacené provize</div>
          <div className="text-2xl font-semibold text-[#14AE6B]">{formatCurrency(summary.paid)}</div>
          <div className="text-xs text-[#6B7280] mt-1">Hotovost na účtu</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">K vyplacení</div>
          <div className="text-2xl font-semibold text-[#215EF8]">{formatCurrency(summary.earned)}</div>
          <div className="text-xs text-[#6B7280] mt-1">Čeká na úhradu</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Očekávané provize</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{formatCurrency(summary.expected)}</div>
          <div className="text-xs text-[#6B7280] mt-1">Aktivní rezervace</div>
        </div>
        <div className="bg-white border border-[#EAEAEA] rounded-lg p-4">
          <div className="text-sm text-[#6B7280] mb-1">Projektů s provizí</div>
          <div className="text-2xl font-semibold text-[#040F2A]">{projectsWithEarnings}</div>
          <div className="text-xs text-[#6B7280] mt-1">z {totalProjects} celkem</div>
        </div>
      </div>

      {/* Projects Commission Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <div className="border-b border-[#EAEAEA] px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-[#040F2A]">Provize podle projektů</h2>
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
                  Obchody
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Vyplaceno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  K vyplacení
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Očekáváno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Celkem potenciál
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                  Úspěšnost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#EAEAEA]">
              {projectCommissions.map((project) => {
                const totalPotential = project.expectedAmount + project.earnedAmount + project.paidAmount;
                const projectData = mockProjects.find(p => p.id === project.projectId);
                
                return (
                  <tr 
                    key={project.projectId} 
                    onClick={() => projectData && setSelectedProject(projectData)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-[#040F2A] max-w-[250px] truncate">
                        {project.projectName}
                      </div>
                      <div className="text-xs text-[#6B7280]">ID: {project.projectId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#040F2A]">
                        <span className="font-medium">{project.successfulDeals}</span>
                        <span className="text-[#6B7280]"> / {project.totalDeals}</span>
                      </div>
                      <div className="text-xs text-[#6B7280]">Úspěšných / Celkem</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.paidAmount > 0 ? (
                        <div className="text-sm font-semibold text-[#14AE6B]">
                          {formatCurrency(project.paidAmount)}
                        </div>
                      ) : (
                        <div className="text-sm text-[#6B7280]">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.earnedAmount > 0 ? (
                        <div className="text-sm font-semibold text-[#215EF8]">
                          {formatCurrency(project.earnedAmount)}
                        </div>
                      ) : (
                        <div className="text-sm text-[#6B7280]">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.expectedAmount > 0 ? (
                        <div className="text-sm font-medium text-[#040F2A]">
                          {formatCurrency(project.expectedAmount)}
                        </div>
                      ) : (
                        <div className="text-sm text-[#6B7280]">—</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#040F2A]">
                        {formatCurrency(totalPotential)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#040F2A]">
                        {project.conversionRate}%
                      </div>
                      <div className="text-xs text-[#6B7280]">Konverze</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {projectCommissions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[#6B7280]">Zatím nemáte žádné provize</p>
          </div>
        )}
      </div>
    </div>
  );
}