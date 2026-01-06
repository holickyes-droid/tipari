/**
 * RESERVATION TIMELINE COMPONENT
 * Tipari.cz B2B Investment Platform
 * 
 * Displays 6-phase reservation lifecycle with decision-first UX
 */

import { Check, Clock, XCircle, Calendar, FileText, Handshake, AlertCircle } from 'lucide-react';
import { ReservationPhase } from '../types/reservation';

interface TimelineStep {
  phase: ReservationPhase;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ReservationTimelineProps {
  currentPhase: ReservationPhase;
  investorSignedAt?: string;
  developerApprovedAt?: string;
  meetingConfirmedAt?: string;
  meetingCompletedAt?: string;
  closedAt?: string;
  isExpired?: boolean;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    phase: 'WAITING_INVESTOR_SIGNATURE',
    label: 'Podpis RA investorem',
    description: 'Čeká se na podpis rezervační smlouvy',
    icon: FileText,
  },
  {
    phase: 'WAITING_DEVELOPER_DECISION',
    label: 'Rozhodnutí developera',
    description: 'Developer schvaluje/odmítá rezervaci',
    icon: Clock,
  },
  {
    phase: 'WAITING_MEETING_SELECTION',
    label: 'Volba termínu schůzky',
    description: 'Investor vybírá termín z nabídky',
    icon: Calendar,
  },
  {
    phase: 'MEETING_CONFIRMED',
    label: 'Schůzka potvrzena',
    description: 'Rezervace aktivní, identity odhaleny',
    icon: Check,
  },
  {
    phase: 'MEETING_COMPLETED',
    label: 'Schůzka dokončena',
    description: 'Čeká se na výsledek jednání',
    icon: Handshake,
  },
  {
    phase: 'SUCCESS',
    label: 'Úspěšné uzavření',
    description: 'Investiční smlouva podepsána',
    icon: Check,
  },
];

export function ReservationTimeline({
  currentPhase,
  investorSignedAt,
  developerApprovedAt,
  meetingConfirmedAt,
  meetingCompletedAt,
  closedAt,
  isExpired = false,
}: ReservationTimelineProps) {
  const getPhaseIndex = (phase: ReservationPhase): number => {
    const index = TIMELINE_STEPS.findIndex((step) => step.phase === phase);
    return index >= 0 ? index : 0;
  };

  const currentIndex = getPhaseIndex(currentPhase);

  const getStepStatus = (stepIndex: number): 'completed' | 'current' | 'pending' | 'expired' => {
    if (isExpired) return 'expired';
    if (currentPhase === 'NO_DEAL' && stepIndex > currentIndex) return 'expired';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTimestamp = (stepPhase: ReservationPhase): string | null => {
    switch (stepPhase) {
      case 'WAITING_INVESTOR_SIGNATURE':
        return null; // Created timestamp shown elsewhere
      case 'WAITING_DEVELOPER_DECISION':
        return formatDate(investorSignedAt);
      case 'WAITING_MEETING_SELECTION':
        return formatDate(developerApprovedAt);
      case 'MEETING_CONFIRMED':
        return formatDate(meetingConfirmedAt);
      case 'MEETING_COMPLETED':
        return formatDate(meetingCompletedAt);
      case 'SUCCESS':
        return formatDate(closedAt);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-1">
      {TIMELINE_STEPS.map((step, index) => {
        const status = getStepStatus(index);
        const Icon = step.icon;
        const timestamp = getTimestamp(step.phase);

        const statusConfig = {
          completed: {
            bgColor: 'bg-[#14AE6B]',
            textColor: 'text-[#14AE6B]',
            lineColor: 'bg-[#14AE6B]',
            iconColor: 'text-white',
          },
          current: {
            bgColor: 'bg-[#215EF8]',
            textColor: 'text-[#215EF8]',
            lineColor: 'bg-border',
            iconColor: 'text-white',
          },
          pending: {
            bgColor: 'bg-muted',
            textColor: 'text-muted-foreground',
            lineColor: 'bg-border',
            iconColor: 'text-muted-foreground',
          },
          expired: {
            bgColor: 'bg-red-100',
            textColor: 'text-red-600',
            lineColor: 'bg-red-200',
            iconColor: 'text-red-600',
          },
        };

        const config = statusConfig[status];

        return (
          <div key={step.phase} className="flex gap-4">
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgColor}`}
              >
                {status === 'expired' ? (
                  <XCircle className={`w-5 h-5 ${config.iconColor}`} />
                ) : (
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                )}
              </div>
              {index < TIMELINE_STEPS.length - 1 && (
                <div className={`w-0.5 h-12 ${config.lineColor} mt-2`} />
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className={`font-medium text-sm ${config.textColor}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
                {timestamp && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {timestamp}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Expired/No Deal State */}
      {(isExpired || currentPhase === 'NO_DEAL') && (
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-red-600">
              {isExpired ? 'Rezervace vypršela' : 'Neuzavřeno'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isExpired
                ? 'Nebyla dokončena v požadovaném čase'
                : 'Rezervace byla uzavřena bez dohody'}
            </p>
            {closedAt && (
              <span className="text-xs text-muted-foreground">
                {formatDate(closedAt)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
