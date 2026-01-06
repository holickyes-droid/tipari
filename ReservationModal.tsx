import { useState } from 'react';
import { X, Shield, Check, ChevronDown, Minus, Plus, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Ticket } from '../types/project';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from './ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { mockReservations, mockSlotAllocation, mockGlobalSlots, CURRENT_INTRODUCER_ID } from '../data/mockReservations';
import { Reservation } from '../types/reservation';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  projectName: string;
  projectId?: string;
  onReservationCreated?: (reservation: Reservation) => void;
}

type ReservationState = 'ready' | 'loading' | 'success' | 'error';

interface MatchingInvestor {
  id: string;
  name: string;
  matchPercentage: number;
  availableCapacity: number;
  hasActiveReservation: boolean;
}

export function ReservationModal({
  isOpen,
  onClose,
  ticket,
  projectName,
  projectId = '1',
  onReservationCreated,
}: ReservationModalProps) {
  const [reservationState, setReservationState] = useState<ReservationState>('ready');
  const [slotsToReserve, setSlotsToReserve] = useState(1);
  const [reservationId, setReservationId] = useState<string>('');
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>('');
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  if (!ticket) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Mock matching investors
  const matchingInvestors: MatchingInvestor[] = ticket.recommendedInvestors.length > 0
    ? [
        {
          id: 'INV-001',
          name: 'Petr Novák',
          matchPercentage: 92,
          availableCapacity: 1500000,
          hasActiveReservation: false,
        },
        {
          id: 'INV-023',
          name: 'Jana Novotná',
          matchPercentage: 88,
          availableCapacity: 800000,
          hasActiveReservation: false,
        },
        {
          id: 'INV-045',
          name: 'Martin Král',
          matchPercentage: 76,
          availableCapacity: 2000000,
          hasActiveReservation: true,
        },
      ]
    : [];

  const availableSlots = ticket.occupancy.total - ticket.occupancy.current;

  const handleConfirmReservation = async () => {
    setReservationState('loading');

    // Simulate API call - create new reservation in Phase 1
    setTimeout(() => {
      const newReservationNumber = `RES-2024-${String(Date.now()).slice(-6)}`;
      const newReservationId = `res-${String(Date.now()).slice(-6)}`;
      setReservationId(newReservationNumber);

      // Find first free slot
      const freeSlot = mockGlobalSlots.find(slot => slot.state === 'FREE');
      
      if (!freeSlot) {
        setReservationState('error');
        return;
      }

      // Create new reservation in Phase 1 - WAITING_INVESTOR_SIGNATURE
      const now = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48h SLA

      const newReservation: Reservation = {
        id: newReservationId,
        reservationNumber: newReservationNumber,
        introducerId: CURRENT_INTRODUCER_ID,
        slotId: freeSlot.id,
        projectId: projectId,
        ticketId: ticket.id,
        investorId: selectedInvestorId || 'inv-new-' + Date.now(),
        phase: 'WAITING_INVESTOR_SIGNATURE',
        status: 'waiting_investor_signature',
        nextActor: 'INVESTOR',
        createdAt: now,
        expiresAt: expiresAt,
      };

      // Update slot state
      freeSlot.state = 'LOCKED_WAITING';
      freeSlot.reservationId = newReservationId;
      freeSlot.lockedAt = now;

      // Update slot allocation
      mockSlotAllocation.freeSlots -= 1;
      mockSlotAllocation.lockedWaitingSlots += 1;

      // Add to reservations
      mockReservations.push(newReservation);

      setCreatedReservation(newReservation);
      setReservationState('success');

      // Call callback
      if (onReservationCreated) {
        onReservationCreated(newReservation);
      }
    }, 1500);
  };

  const handleClose = () => {
    setReservationState('ready');
    setSlotsToReserve(1);
    setReservationId('');
    setSelectedInvestorId('');
    setCreatedReservation(null);
    onClose();
  };

  const incrementSlots = () => {
    if (slotsToReserve < availableSlots) {
      setSlotsToReserve(slotsToReserve + 1);
    }
  };

  const decrementSlots = () => {
    if (slotsToReserve > 1) {
      setSlotsToReserve(slotsToReserve - 1);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-[540px] overflow-y-auto">
        {reservationState === 'success' ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-6">
            <div className="w-16 h-16 rounded-full bg-[#14AE6B]/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-[#14AE6B]" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl text-[#040F2A]">Rezervace vytvořena</h3>
              <p className="text-sm text-muted-foreground">
                Číslo rezervace: <span className="font-medium text-[#040F2A]">{reservationId}</span>
              </p>
            </div>
            <div className="w-full bg-muted rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-[#040F2A]">Co se děje dál?</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#215EF8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-[#215EF8]">1</span>
                  </div>
                  <p><strong>Fáze 1:</strong> Investor obdrží rezervační smlouvu (RA) k podpisu (48h SLA)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">2</span>
                  </div>
                  <p><strong>Fáze 2:</strong> Developer schválí nebo odmítne rezervaci (72h SLA)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">3</span>
                  </div>
                  <p><strong>Fáze 3:</strong> Investor vybere termín schůzky (48h SLA)</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-muted-foreground">4</span>
                  </div>
                  <p><strong>Fáze 4:</strong> Schůzka potvrzena – rezervace aktivní, identity odhaleny</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-[#040F2A]">
                Rezervaci můžete sledovat v sekci <strong>Aktivity → Mé rezervace</strong>
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-[#215EF8] hover:bg-[#1a4bc7]">
              Zavřít
            </Button>
          </div>
        ) : reservationState === 'error' ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 px-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl text-[#040F2A]">Rezervace se nezdařila</h3>
              <p className="text-sm text-muted-foreground">
                Omlouváme se, ale rezervaci se nepodařilo dokončit. Zkuste to prosím znovu.
              </p>
            </div>
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Zrušit
              </Button>
              <Button
                onClick={() => setReservationState('ready')}
                className="flex-1 bg-[#215EF8] hover:bg-[#1a4bc7]"
              >
                Zkusit znovu
              </Button>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Rezervace tiketu</SheetTitle>
              <SheetDescription>
                {projectName} – {ticket.ticketNumber}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Ticket Summary */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#040F2A]">Přehled tiketu</h4>
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Výše investice</div>
                      <div className="text-sm font-medium text-[#040F2A]">
                        {formatCurrency(ticket.investmentAmount)} Kč
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Výnos p.a.</div>
                      <div className="text-sm font-medium text-[#14AE6B]">
                        {ticket.yieldPA.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Doba trvání</div>
                      <div className="text-sm font-medium text-[#040F2A]">
                        {ticket.duration} měs.
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Provize pro tipaře</div>
                      <div className="text-sm font-medium text-[#040F2A]">
                        {formatCurrency((ticket.investmentAmount * ticket.commission) / 100)} Kč
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {ticket.secured ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-[#14AE6B]/10 flex items-center justify-center">
                            <Shield className="w-3 h-3 text-[#14AE6B]" />
                          </div>
                          <span className="text-xs text-[#040F2A]">Zajištěno</span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Nezajištěno</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Obsazenost: {ticket.occupancy.current} / {ticket.occupancy.total}
                    </div>
                  </div>
                </div>
              </div>

              {/* Matching Investors */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#040F2A]">Shody s investory</h4>
                {matchingInvestors.length > 0 ? (
                  <div className="space-y-2">
                    {matchingInvestors.map((investor) => (
                      <div
                        key={investor.id}
                        className="border border-border rounded-lg p-3 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#040F2A]">
                              {investor.name}
                            </span>
                            {investor.hasActiveReservation && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                Má aktivní rezervaci
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Kapacita: {formatCurrency(investor.availableCapacity)} Kč
                          </div>
                        </div>
                        <div className="text-sm font-medium text-[#14AE6B]">
                          {investor.matchPercentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Pro tento tiket zatím nemáte uloženého vhodného investora.
                    </p>
                  </div>
                )}
              </div>

              {/* Reservation Settings */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#040F2A]">Nastavení rezervace</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      Počet slotů k rezervaci
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decrementSlots}
                        disabled={slotsToReserve <= 1}
                        className="w-10 h-10 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-2xl font-medium text-[#040F2A]">{slotsToReserve}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={incrementSlots}
                        disabled={slotsToReserve >= availableSlots}
                        className="w-10 h-10 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Zbývá {availableSlots} {availableSlots === 1 ? 'slot' : 'slotů'}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-[#040F2A]">
                      Rezervací potvrzujete vážný zájem investora.
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Info */}
              <Accordion type="single" collapsible>
                <AccordionItem value="legal" className="border-0">
                  <AccordionTrigger className="text-sm text-[#040F2A] hover:no-underline py-3 border-t border-border">
                    Jak rezervace funguje
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground space-y-2 pt-2">
                    <p>• Rezervace je nezávazná a slouží k zajištění investiční příležitosti.</p>
                    <p>• Investor i developer zůstávají vzájemně anonymní.</p>
                    <p>
                      • Developer uvidí kontaktní údaje investora až po podpisu rezervační smlouvy
                      investorem.
                    </p>
                    <p>• Rezervace má časovou platnost 14 dní od vytvoření.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={handleClose} className="flex-1" disabled={reservationState === 'loading'}>
                  Zrušit
                </Button>
                <Button
                  onClick={handleConfirmReservation}
                  className="flex-1 bg-[#215EF8] hover:bg-[#1a4bc7] text-white"
                  disabled={reservationState === 'loading'}
                >
                  {reservationState === 'loading' ? 'Zpracovávám...' : 'Potvrdit rezervaci'}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}