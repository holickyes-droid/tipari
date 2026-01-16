/**
 * SystemCoreSchema v4.1 (Enhanced)
 * Canonical schema definitions aligned with SystemCore v4.1 Enhanced docs.
 */

// Updated according to SystemCore v4.1 Enhanced docs

export type UUID = string;
export type ISODate = string;

export type AuditMetadata = {
  /** User who created or triggered the change (governance/audit). */
  created_by: UUID;
  /** Session identifier for traceability. */
  session_id: UUID;
  /** Batch or pipeline run identifier. */
  run_id: UUID;
};

export type Project = {
  /** Primary key. */
  id: UUID;
  /** Display name. */
  name: string;
  /** Canonical location metadata. */
  location: string;
  /** Project type taxonomy. */
  project_type: string;
  /** Expected annual yield. */
  yield_pa: number;
  /** Canonical duration in months. */
  duration: number;
  /** Investment form identifier. */
  investment_form: string;
  /** Security forms metadata. */
  security_forms: string[];
  /** Use of funds summary. */
  use_of_funds: string;
  /** Lifecycle status for governance. */
  status: "draft" | "published" | "archived";
  /** Optional target amount (UI mapping). */
  target_amount?: number;
} & AuditMetadata;

export type Ticket = {
  /** Primary key. */
  id: UUID;
  /** FK to Project. */
  project_id: UUID;
  /** Minimum investment amount. */
  min_investment_amount: number;
  /** Expected yield percent. */
  expected_yield_percent: number;
  /** Commission rate. */
  commission_percent: number;
  /** Loan-to-value ratio. */
  ltv_percent: number;
  /** Duration in months. */
  duration: number;
  /** Status for availability and matching. */
  status: "available" | "reserved" | "closed";
  /** Maximum slots for the ticket. */
  max_slots: number;
  /** Tier for governance/priority. */
  tier: "standard" | "premium" | "vip";
} & AuditMetadata;

export type Level = {
  /** Primary key. */
  id: UUID;
  /** FK to Project. */
  project_id: UUID;
  /** Level display name. */
  name: string;
  /** Capacity for slots. */
  max_slots: number;
  /** Tier for pool management. */
  tier: "standard" | "premium" | "vip";
} & AuditMetadata;

export type Slot = {
  /** Primary key. */
  id: UUID;
  /** FK to Level. */
  level_id: UUID;
  /** FK to Ticket. */
  ticket_id: UUID;
  /** Slot state for reservation lifecycle. */
  slot_state: "available" | "reserved" | "expired";
  /** Optional reservation linkage. */
  reservation_id?: UUID;
} & AuditMetadata;

export type Reservation = {
  /** Primary key. */
  id: UUID;
  /** FK to Ticket. */
  ticket_id: UUID;
  /** FK to Slot. */
  slot_id: UUID;
  /** FK to Investor. */
  investor_id: UUID;
  /** Broker who initiated reservation. */
  broker_id: UUID;
  /** Reservation state machine. */
  reservation_state: "pending" | "active" | "expired" | "cancelled";
  /** Optional commission tracking id. */
  commission_tracking_id?: UUID;
  /** E-sign envelope identifier. */
  esign_envelope_id?: string;
} & AuditMetadata;

export type CommissionTracking = {
  /** Primary key. */
  id: UUID;
  /** FK to Reservation. */
  reservation_id: UUID;
  /** Entitlement rule identifier. */
  entitlement_rule: string;
  /** Commission status. */
  status: "draft" | "active" | "paid";
  /** Split percentage sum must equal 100. */
  split_percent_total: number;
} & AuditMetadata;

export type CommissionFinance = {
  /** Primary key. */
  id: UUID;
  /** FK to CommissionTracking. */
  commission_tracking_id: UUID;
  /** Invoice number or reference. */
  invoice_number: string;
  /** Amount and currency. */
  amount: number;
  currency: string;
} & AuditMetadata;

export type User = {
  /** Primary key. */
  id: UUID;
  /** User role for RBAC. */
  role: "admin" | "broker" | "developer" | "qa" | "compliance";
  /** Optional admin subrole. */
  admin_subrole?: string;
  /** GDPR data retention date. */
  data_retention_until?: ISODate;
} & AuditMetadata;

export type Investor = {
  /** Primary key. */
  id: UUID;
  /** Investor classification. */
  investor_type: "individual" | "company";
  /** GDPR anonymization flag. */
  anonymized_at?: ISODate;
  /** Retention metadata. */
  data_retention_until?: ISODate;
} & AuditMetadata;

export type AuditLog = {
  /** Primary key. */
  id: UUID;
  /** Entity affected. */
  entity_type: string;
  /** Entity id. */
  entity_id: UUID;
  /** Event name for audit trace. */
  event: string;
  /** Severity for incident triggers. */
  severity: "info" | "warning" | "error" | "critical";
  /** Timestamp of event. */
  created_at: ISODate;
} & AuditMetadata;

export type SystemIncident = {
  /** Primary key. */
  id: UUID;
  /** FK to AuditLog. */
  audit_log_id: UUID;
  /** Incident severity. */
  severity: "error" | "critical";
  /** SLA deadline timestamp. */
  sla_deadline: ISODate;
  /** Resolution state. */
  state: "open" | "resolved" | "archived";
} & AuditMetadata;

export type Relations = {
  /** Project has many tickets. */
  project_tickets: Record<Project["id"], Ticket[]>;
  /** Ticket has many slots. */
  ticket_slots: Record<Ticket["id"], Slot[]>;
  /** Slot has one reservation. */
  slot_reservation: Record<Slot["id"], Reservation | undefined>;
  /** Reservation has one commission tracking. */
  reservation_commission: Record<Reservation["id"], CommissionTracking | undefined>;
  /** Commission tracking has one finance record. */
  tracking_finance: Record<CommissionTracking["id"], CommissionFinance | undefined>;
};
