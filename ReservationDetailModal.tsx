/**
 * RESERVATION DETAIL MODAL
 * Tipari.cz B2B Investment Platform
 * 
 * Shows full reservation lifecycle with phase-specific actions
 * Compliance-first copy, decision-first UX
 */

import { X, Lock, Clock, MapPin, User, Building2, FileText, Download, Upload, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import { ReservationTimeline } from './ReservationTimeline';
import { Reservation } from '../types/reservation';
import { Badge } from './ui/badge';

interface ReservationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  projectName?: string;
  ticketNumber?: string;
}

export function ReservationDetailModal({
  isOpen,
  onClose,
  reservation,
  projectName = 'Načítání...',
  ticketNumber = '',
}: ReservationDetailModalProps) {
  if (!reservation) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('cs-CZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getSLAStatus = () => {
    if (!reservation.expiresAt) return null;
    
    const now = new Date();
    const expires = new Date(reservation.expiresAt);
    const hoursRemaining = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursRemaining < 0) {
      return { label: 'Vypršelo', color: 'bg-red-100 text-red-700 border-red-200', urgent: true };
    } else if (hoursRemaining < 24) {
      return { label: `Zbývá ${hoursRemaining}h`, color: 'bg-orange-100 text-orange-700 border-orange-200', urgent: true };
    } else {
      const daysRemaining = Math.floor(hoursRemaining / 24);
      return { label: `Zbývá ${daysRemaining}d`, color: 'bg-muted text-muted-foreground border-border', urgent: false };
    }
  };

  const slaStatus = getSLAStatus();

  const getPhaseLabel = () => {
    switch (reservation.phase) {
      case 'WAITING_INVESTOR_SIGNATURE':
        return 'Čeká na podpis investora';
      case 'WAITING_DEVELOPER_DECISION':
        return 'Čeká na rozhodnutí developera';
      case 'WAITING_MEETING_SELECTION':
        return 'Čeká na volbu termínu';
      case 'MEETING_CONFIRMED':
        return 'Schůzka potvrzena';
      case 'MEETING_COMPLETED':
        return 'Schůzka dokončena';
      case 'SUCCESS':
        return 'Úspěšně uzavřeno';
      case 'NO_DEAL':
        return 'Neuzavřeno';
      case 'EXPIRED':
        return 'Vypršelo';
      default:
        return 'Neznámý stav';
    }
  };

  const getNextActionLabel = () => {
    switch (reservation.nextActor) {
      case 'INVESTOR':
        return 'Čeká na akci investora';
      case 'DEVELOPER':
        return 'Čeká na akci developera';
      case 'ADMIN':
        return 'Vyžaduje administrativní akci';
      case 'NONE':
        return 'Žádná akce není potřeba';
      default:
        return '';
    }
  };

  const isActive = reservation.phase === 'MEETING_CONFIRMED';
  const identitiesRevealed = ['MEETING_CONFIRMED', 'MEETING_COMPLETED', 'SUCCESS'].includes(reservation.phase);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle className="text-xl">
                Detail rezervace
              </SheetTitle>
              <SheetDescription className="mt-1">
                {projectName} – {ticketNumber}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Reservation Header */}
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Číslo rezervace</p>
                <p className="font-mono text-sm font-medium text-[#040F2A] mt-0.5">
                  {reservation.reservationNumber}
                </p>
              </div>
              {isActive && (
                <Badge className="bg-[#14AE6B] text-white border-[#14AE6B]">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Aktivní
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Aktuální fáze</p>
                <p className="text-sm font-medium text-[#040F2A] mt-0.5">
                  {getPhaseLabel()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Vytvořeno</p>
                <p className="text-sm text-[#040F2A] mt-0.5">
                  {formatDateShort(reservation.createdAt)}
                </p>
              </div>
            </div>

            {reservation.nextActor !== 'NONE' && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#215EF8]" />
                  <span className="text-[#040F2A]">{getNextActionLabel()}</span>
                  {slaStatus && (
                    <Badge className={`text-xs ${slaStatus.color} border`}>
                      {slaStatus.label}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-medium text-sm text-[#040F2A] mb-4">
              Průběh rezervace
            </h3>
            <ReservationTimeline
              currentPhase={reservation.phase}
              investorSignedAt={reservation.investorSignedAt}
              developerApprovedAt={reservation.developerApprovedAt}
              meetingConfirmedAt={reservation.meetingConfirmedAt}
              meetingCompletedAt={reservation.meetingCompletedAt}
              closedAt={reservation.closedAt}
              isExpired={reservation.phase === 'EXPIRED'}
            />
          </div>

          {/* Meeting Details (if confirmed) */}
          {reservation.selectedMeetingDate && reservation.meetingLocation && (
            <div className="bg-[#215EF8]/5 border border-[#215EF8]/20 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-sm text-[#040F2A] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#215EF8]" />
                Detail schůzky
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground">Termín</p>
                  <p className="text-sm font-medium text-[#040F2A] mt-0.5">
                    {formatDate(reservation.selectedMeetingDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Místo konání</p>
                  <p className="text-sm text-[#040F2A] mt-0.5">
                    {reservation.meetingLocation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Identity Information */}
          {identitiesRevealed && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-700" />
                <h3 className="font-medium text-sm text-amber-900">
                  Kontaktní údaje odhaleny
                </h3>
              </div>
              <p className="text-xs text-amber-800">
                Po potvrzení schůzky byly sdíleny kontaktní údaje mezi investorem a developerem.
                Introducer má přístup k základním informacím pro sledování provize.
              </p>
              
              {/* Mock Investor Info */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-amber-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    <p className="text-xs font-medium text-amber-900">Investor</p>
                  </div>
                  <p className="text-xs text-amber-800">
                    ID: {reservation.investorId}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    <p className="text-xs font-medium text-amber-900">Developer</p>
                  </div>
                  <p className="text-xs text-amber-800">
                    Projekt: {projectName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slot Information */}
          <div className="border border-border rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-sm text-[#040F2A]">
              Využití slotu
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Slot ID</p>
                <p className="font-mono text-xs text-[#040F2A] mt-0.5">
                  {reservation.slotId}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Stav slotu</p>
                <p className="text-xs text-[#040F2A] mt-0.5">
                  {isActive ? 'LOCKED_CONFIRMED' : 'LOCKED_WAITING'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {reservation.phase !== 'SUCCESS' && reservation.phase !== 'NO_DEAL' && reservation.phase !== 'EXPIRED' && (
            <div className="space-y-2 pt-4 border-t border-border">
              {/* Introducer can see but not act on most phases */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Role introducera:</strong> Sledování rezervace a průběhu. 
                  Akce provádí investor, developer nebo administrátor podle aktuální fáze.
                </p>
              </div>

              {/* Mock Documents */}
              {reservation.investorSignedAt && (
                <Button variant="outline" className="w-full justify-start" disabled>
                  <FileText className="w-4 h-4 mr-2" />
                  Stáhnout podepsanou RA
                  <Download className="w-3.5 h-3.5 ml-auto" />
                </Button>
              )}
            </div>
          )}

          {/* Success State */}
          {reservation.phase === 'SUCCESS' && (
            <div className="bg-[#14AE6B]/10 border border-[#14AE6B]/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#14AE6B]" />
                <h3 className="font-medium text-sm text-[#14AE6B]">
                  Rezervace úspěšně dokončena
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Investiční smlouva byla podepsána. Provize bude vypočtena a zobrazena v sekci Provize.
              </p>
              {reservation.investmentAgreementUrl && (
                <Button variant="outline" className="w-full" disabled>
                  <Download className="w-4 h-4 mr-2" />
                  Stáhnout investiční smlouvu
                </Button>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
