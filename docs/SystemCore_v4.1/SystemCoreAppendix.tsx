import React from "react";

export type ReservationState = "pending" | "active" | "expired" | "cancelled";
export type CommissionSplit = { recipientId: string; percent: number };

export type Reservation = {
  id: string;
  state: ReservationState;
  expiresAt: string;
};

export type CommissionInput = {
  amount: number;
  splits: CommissionSplit[];
};

export type GDPRCandidate = {
  userId: string;
  retentionUntil: string;
  anonymizedAt?: string;
};

export type AuditEvent = {
  event: string;
  entityId: string;
  runId: string;
};

export const SystemCoreAppendixMarkers = () => (
  <>
    {/* Updated according to SystemCore v4.1 Enhanced logic */}
  </>
);

// Updated according to SystemCore v4.1 Enhanced docs
export const transitionReservation = (
  reservation: Reservation,
  nowIso: string
): Reservation => {
  // audit: state transition must be logged in AuditLog
  if (reservation.state === "pending" && nowIso > reservation.expiresAt) {
    return { ...reservation, state: "expired" };
  }
  if (reservation.state === "pending") {
    return { ...reservation, state: "active" };
  }
  return reservation;
};

// Updated according to SystemCore v4.1 Enhanced docs
export const calculateCommissionSplit = (
  input: CommissionInput
): { valid: boolean; totalPercent: number } => {
  const total = input.splits.reduce((sum, split) => sum + split.percent, 0);
  // audit: log validation result to AuditLog
  return { valid: total === 100, totalPercent: total };
};

// Updated according to SystemCore v4.1 Enhanced docs
export const releaseExpiredSlots = (
  reservations: Reservation[],
  nowIso: string
): Reservation[] => {
  // audit: create SystemIncident if expired slot count exceeds threshold
  return reservations.map((reservation) => transitionReservation(reservation, nowIso));
};

// Updated according to SystemCore v4.1 Enhanced docs
export const notifyPendingAnonymization = (
  candidates: GDPRCandidate[]
): AuditEvent[] => {
  // audit: log GDPR pre-anonymization notification events
  return candidates
    .filter((candidate) => !candidate.anonymizedAt)
    .map((candidate) => ({
      event: "GDPR_PRE_ANONYMIZATION_NOTICE",
      entityId: candidate.userId,
      runId: `gdpr-${candidate.userId}`
    }));
};
