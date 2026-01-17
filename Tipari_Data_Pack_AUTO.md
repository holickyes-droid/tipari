# Tipari.cz – Data Pack (AUTO-GENERATED)

> Tento soubor je automaticky vygenerovaný ze `SystemCoreSchema.ts` a slouží jako rychlý start pro „data handoff“ (backend + UI).

## Zdroje pravdy

- `SystemCoreSchema.ts` – kanonické entity, enumy, validační pravidla

- `SystemCoreDocumentation.md` – governance a procesní pravidla

- `systemcore_version_manifest.json` – verze a aktivní moduly


---

## Entita: `Project`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `name` | `string` | ANO |  |
| `location` | `string` | ANO |  |
| `project_type` | `ProjectType` | ANO | FIXED: renamed from 'type' to 'project_type' (v3.7.5) |
| `developer_name` | `string` | ANO |  |
| `developer_company` | `string` | ANO |  |
| `developer_contact` | `string` | ANO |  |
| `created_by` | `string` | ANO | User.id (Developer) |
| `yield_pa` | `number` | ANO | Percentage (0-100) |
| `duration` | `number` | ANO | Months |
| `investment_form` | `InvestmentForm` | ANO |  |
| `custom_investment_description` | `string` | NE | Status |
| `status` | `'draft' \| 'published' \| 'closed' \| 'paused'` | ANO | Security & funds |
| `security_forms` | `SecurityType[]` | ANO |  |
| `use_of_funds` | `FundAllocation[]` | ANO |  |
| `appraisal` | `AppraisalReportFields` | NE | DUAL BROKER MODEL (Additive) |
| `project_origin_broker_id` | `string \| null` | ANO | User.id (BROKER role) |
| `project_origin_source` | `'broker' \| 'developer' \| null` | ANO |  |
| `origin_assigned_by` | `string \| null` | ANO | User.id (Admin) |
| `origin_assigned_at` | `string \| null` | ANO | ISO timestamp |
| `intake_submitted_by` | `string \| null` | ANO | User.id (Broker) |
| `intake_status` | `'draft' \| 'submitted' \| 'under_review' \| 'needs_changes' \| 'approved' \| 'rejected'` | ANO |  |
| `intake_submitted_at` | `string \| null` | ANO | ISO timestamp |
| `intake_reviewed_by` | `string \| null` | ANO | User.id (Admin) |
| `intake_reviewed_at` | `string \| null` | ANO | ISO timestamp |
| `intake_notes` | `string \| null` | ANO | Relations |
| `tickets` | `string[]` | ANO | Ticket.id[] |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |

---

## Entita: `Ticket`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `project_id` | `string` | ANO | Project.id |
| `min_investment_amount` | `number` | ANO | CZK (Renamed from investment_amount v3.7.5) |
| `expected_yield_percent` | `number` | ANO | Percentage (0-100) (Renamed from yield_pa v3.7.5) |
| `commission` | `number` | ANO | Percentage (0-100) |
| `commission_percent` | `number` | NE | ADDED v3.7.5: for commission calculations |
| `ltv` | `number` | ANO | Percentage (0-100) |
| `duration` | `number` | ANO | Months |
| `investment_form` | `InvestmentForm` | ANO |  |
| `custom_investment_description` | `string` | NE | Security (Optional v3.7.5) |
| `forms_of_security` | `SecurityType[]` | NE | Renamed from secured_types, optional |
| `security_required` | `boolean` | NE | optional, default: false |
| `max_reservations` | `number` | ANO | Default: 3 |
| `current_reservations_count` | `number` | ANO | Status |
| `status` | `'available' \| 'locked_pending' \| 'locked_confirmed' \| 'completed'` | ANO | Relations |
| `reservations` | `string[]` | ANO | Reservation.id[] |
| `slots` | `string[]` | ANO | Slot.id[] |
| `synchronized_at` | `string` | ANO | ISO timestamp (last sync with Project) |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |

---

## Entita: `Slot`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `ticket_id` | `string` | ANO | Ticket.id |
| `slot_number` | `1 \| 2 \| 3` | ANO | Status |
| `status` | `'AVAILABLE' \| 'LOCKED_PENDING' \| 'LOCKED_CONFIRMED' \| 'COMPLETED'` | ANO | Relations |
| `reservation_id` | `string \| null` | ANO | Reservation.id (nullable) |
| `locked_at` | `string \| null` | ANO | ISO timestamp |
| `confirmed_at` | `string \| null` | ANO | ISO timestamp |
| `completed_at` | `string \| null` | ANO | ISO timestamp |
| `created_at` | `string` | ANO | ISO timestamp |

---

## Entita: `Reservation`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `reservation_number` | `string` | ANO | Auto-generated |
| `investor_id` | `string` | ANO | Investor.id |
| `ticket_id` | `string` | ANO | Ticket.id |
| `project_id` | `string` | ANO | Project.id |
| `broker_id` | `string` | ANO | User.id (BROKER role) |
| `slot_id` | `string` | ANO | Slot.id |
| `commission_id` | `string \| null` | ANO | Commission.id (created when state = 'active') |
| `reservation_state` | `ReservationState` | ANO |  |
| `cancel_reason` | `CancelReason \| null` | ANO | Only for 'cancelled' state |
| `esign_provider` | `'Signi' \| 'DocuSign' \| 'AdobeSign'` | NE |  |
| `esign_link` | `string` | NE | odkaz k podpisu |
| `esign_document_id` | `string` | NE | ID dokumentu v E-Sign |
| `esign_document_url` | `string` | NE | finální URL podepsané smlouvy |
| `investor_signed_at` | `string` | NE | ISO timestamp |
| `developer_signed_at` | `string` | NE | ISO timestamp |
| `esign_completed_at` | `string` | NE | ISO timestamp |
| `activated_at` | `string` | NE | ISO timestamp (v3.7.3 rename from both_signed_at) |
| `phase` | `string` | NE | Use reservation_state instead |
| `slot_status` | `string` | ANO | Meeting & notes |
| `meeting_scheduled_date` | `string \| null` | ANO | ISO timestamp |
| `outcome_notes` | `string \| null` | ANO | WAITING & RESPONSIBILITY (Additive) |
| `waiting_on` | `WaitingOnEntity` | ANO |  |
| `waiting_reason` | `ReservationWaitingReason \| null` | ANO |  |
| `termination_reason` | `ReservationTerminationReason \| null` | ANO | IMMUTABLE after set |
| `termination_reason_details` | `string \| null` | ANO | Timestamps |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |
| `expires_at` | `string` | ANO | ISO timestamp |

---

## Entita: `CommissionTracking`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `reservation_id` | `string` | ANO | Reservation.id |
| `broker_id` | `string` | ANO | User.id (BROKER role) |
| `commission_amount` | `number` | ANO | CZK (investment_amount × commission_percent / 100) |
| `commission_percent` | `number` | ANO | Percentage (0-100) from ticket |
| `investment_form` | `InvestmentForm` | ANO | For reporting |
| `status` | `CommissionTrackingStatus` | ANO | pending → entitled → payable → paid → written_off |
| `entitlement_phase` | `CommissionEntitlementPhase` | ANO |  |
| `payment_phase` | `CommissionPaymentPhase \| null` | ANO |  |
| `collectability` | `CommissionCollectability` | ANO | Admin Approval & Confirmation |
| `approved_by_admin` | `boolean` | ANO |  |
| `confirmed_by` | `string \| null` | ANO | User.id (Admin) |
| `confirmed_at` | `string \| null` | ANO | ISO timestamp |
| `investment_confirmed_at` | `string \| null` | ANO | ISO timestamp |
| `platform_paid_at` | `string \| null` | ANO | ISO timestamp |
| `broker_payout_prepared_at` | `string \| null` | ANO | ISO timestamp |
| `paid_at` | `string \| null` | ANO | ISO timestamp |
| `negotiation_deadline` | `string \| null` | ANO | ISO timestamp (default: +90d from active) |
| `platform_payment_deadline` | `string \| null` | ANO | ISO timestamp (default: +30d from investment_confirmed_at) |
| `broker_payout_deadline` | `string \| null` | ANO | ISO timestamp (default: +3d from platform_paid_at) |
| `commission_recipients` | `CommissionRecipient[]` | ANO |  |
| `commission_split_rule_id` | `string \| null` | ANO | CommissionSplitRule.id |
| `platform_fee_amount` | `number \| null` | ANO | CZK |
| `recipient_amounts_by_user_id` | `Record<string, number>` | ANO | user_id → amount (CZK) |
| `split_status` | `CommissionSplitStatus` | ANO |  |
| `split_calculated_at` | `string \| null` | ANO |  |
| `split_confirmed_at` | `string \| null` | ANO |  |
| `split_overridden_at` | `string \| null` | ANO |  |
| `split_override_reason` | `string \| null` | ANO | WAITING & RESPONSIBILITY |
| `waiting_on` | `WaitingOnEntity` | ANO |  |
| `waiting_reason` | `CommissionWaitingReason \| null` | ANO |  |
| `termination_reason` | `CommissionTerminationReason \| null` | ANO |  |
| `termination_reason_details` | `string \| null` | ANO | TIMELINE & HISTORY |
| `status_history` | `CommissionStatusHistory[]` | NE | Časová osa všech změn stavu |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |

---

## Entita: `CommissionFinance`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `commission_id` | `string` | ANO | CommissionTracking.id (FOREIGN KEY) |
| `invoice_url` | `string` | NE | URL nahrané faktury (PDF) |
| `invoice_uploaded` | `boolean` | NE | true = broker nahrál fakturu manuálně |
| `invoice_generated` | `boolean` | NE | true = faktura vystavena platformou (self-billing) |
| `invoice_number` | `string` | NE | číslo faktury (např. SB-2026-02-0012) |
| `invoice_confirmed_by_admin` | `boolean` | NE | potvrzení o přijetí adminem |
| `invoice_confirmed_at` | `string` | NE | ISO timestamp potvrzení |
| `invoice_confirmed_by` | `string` | NE | User.id (Admin who confirmed) |
| `invoice_amount` | `number` | NE | fakturovaná částka (s DPH nebo bez dle invoice_amount_type) |
| `invoice_currency` | `'CZK' \| 'EUR' \| 'USD'` | NE | měna faktury |
| `invoice_vat_rate` | `number` | NE | sazba DPH v % (např. 21, 15, 0) |
| `invoice_amount_type` | `'with_vat' \| 'without_vat'` | NE | typ částky |
| `invoice_due_date` | `string` | NE | ISO timestamp splatnosti faktury |
| `invoice_issued_at` | `string` | NE | ISO timestamp vystavení faktury |
| `payment_reference` | `string` | NE | Bankovní reference platby |
| `payment_date` | `string` | NE | ISO timestamp platby |
| `payment_confirmed_at` | `string` | NE | ISO timestamp potvrzení platby |
| `payout_date` | `string` | NE | ISO timestamp výplaty brokerovi |
| `accounting_system_id` | `string` | NE | ID v účetním systému (např. Pohoda, Money S3) |
| `accounting_synced_at` | `string` | NE | ISO timestamp poslední synchronizace |
| `accounting_sync_status` | `'pending' \| 'synced' \| 'error'` | NE |  |
| `accounting_sync_error` | `string` | NE | Chybová zpráva při sync |
| `isdoc_generated` | `boolean` | NE | true = ISDOC XML vygenerován |
| `isdoc_url` | `string` | NE | URL k ISDOC XML souboru |
| `isdoc_generated_at` | `string` | NE | ISO timestamp generování |
| `invoice_hash` | `string` | NE | SHA256 hash PDF faktury |
| `invoice_hash_algorithm` | `HashAlgorithm` | NE | Hash algoritmus (default: sha256) |
| `invoice_signed` | `boolean` | NE | Faktura elektronicky podepsána |
| `invoice_signature_url` | `string` | NE | URL k .p7s souboru (detached signature) |
| `invoice_signature_algorithm` | `string` | NE | Algoritmus podpisu (např. "RSA-SHA256") |
| `invoice_signature_format` | `SignatureFormat` | NE | Formát podpisu (PAdES / XAdES / CAdES) |
| `invoice_certificate_thumbprint` | `string` | NE | Thumbprint certifikátu (SHA1) |
| `invoice_certificate_issuer` | `string` | NE | Vydavatel certifikátu |
| `invoice_certificate_subject` | `string` | NE | Subjekt certifikátu (CN) |
| `invoice_certificate_valid_from` | `string` | NE | Platnost certifikátu od |
| `invoice_certificate_valid_to` | `string` | NE | Platnost certifikátu do |
| `signed_at` | `string` | NE | ISO timestamp podpisu |
| `signed_by` | `string` | NE | Kdo podepsal ("SYSTEM" nebo User.id) |
| `signature_verified_at` | `string` | NE | Timestamp poslední verifikace |
| `signature_valid` | `boolean` | NE | Výsledek poslední verifikace |
| `signature_verification_errors` | `string[]` | NE | Chyby při verifikaci |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | NE | ISO timestamp |

---

## Entita: `User`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `name` | `string` | ANO |  |
| `email` | `string` | ANO |  |
| `phone` | `string` | ANO | Role & tier |
| `role` | `UserRole` | ANO |  |
| `tipar_level` | `TiparLevel \| null` | ANO | Only for BROKER role |
| `admin_subrole` | `AdminSubrole` | NE | Specializace role admina (pouze pokud role = 'ADMIN') |
| `permissions` | `PermissionAction[]` | NE | Custom oprávnění (optional override pro role-based permissions) |
| `active` | `boolean` | ANO |  |
| `status` | `'pending_approval' \| 'active' \| 'inactive'` | ANO | ✨ LOCALIZATION (v3.7.8) |
| `language_preference` | `'cs' \| 'en'` | NE | Preferovaný jazyk uživatele (default: 'cs') |
| `anonymized_at` | `string \| null` | NE | ISO timestamp anonymizace (pouze role BROKER) |
| `anonymized_by` | `string \| null` | NE | User.id kdo anonymizoval |
| `anonymization_reason` | `AnonymizationReason` | NE | Důvod anonymizace |
| `data_retention_until` | `string` | NE | ISO timestamp do kdy musí být data uchována |
| `data_retention_reason` | `string` | NE | Důvod retention |
| `gdpr_consent_at` | `string` | NE | ISO timestamp souhlasu |
| `gdpr_consent_withdrawn_at` | `string` | NE | ISO timestamp odvolání souhlasu |
| `gdpr_consent_version` | `string` | NE | Verze consent textu |
| `state` | `'active' \| 'archived' \| 'deleted' \| 'anonymized'` | NE | Lifecycle state |
| `archived_at` | `string` | NE | ISO timestamp archivace |
| `deleted_at` | `string` | NE | ISO timestamp soft delete |
| `created_investors` | `string[]` | ANO | Investor.id[] (if role = BROKER) |
| `created_projects` | `string[]` | ANO | Project.id[] (if role = DEVELOPER) |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |

---

## Entita: `Investor`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `name` | `string` | ANO | → "ANONYMIZED_INVESTOR_<id>" po anonymizaci |
| `email` | `string \| null` | ANO | → null po anonymizaci |
| `phone` | `string \| null` | ANO | → null po anonymizaci |
| `type` | `InvestorType` | ANO | Company info (if type = PO \| Family_Office \| Institution) |
| `company_name` | `string \| null` | ANO |  |
| `ico` | `string \| null` | ANO |  |
| `address` | `string \| null` | ANO | → null po anonymizaci |
| `created_by` | `string` | ANO | User.id (BROKER role) |
| `reservations` | `string[]` | ANO | Reservation.id[] |
| `tipar_level` | `TiparLevel` | NE | Legacy field, no functional impact |
| `anonymized_at` | `string \| null` | NE | ISO timestamp anonymizace (null = není anonymizován) |
| `anonymized_by` | `string \| null` | NE | User.id kdo anonymizoval (nebo 'SYSTEM') |
| `anonymization_reason` | `AnonymizationReason` | NE | Důvod anonymizace |
| `data_retention_until` | `string` | NE | ISO timestamp do kdy musí být data uchována |
| `data_retention_reason` | `string` | NE | Důvod retention (např. "Accounting records until 2035") |
| `gdpr_consent_at` | `string` | NE | ISO timestamp souhlasu |
| `gdpr_consent_withdrawn_at` | `string` | NE | ISO timestamp odvolání souhlasu |
| `gdpr_consent_version` | `string` | NE | Verze consent textu (např. "v1.2.0") |
| `state` | `InvestorState` | NE | 'active' \| 'archived' \| 'deleted' \| 'anonymized' |
| `archived_at` | `string` | NE | ISO timestamp archivace |
| `deleted_at` | `string` | NE | ISO timestamp soft delete |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |

---

## Entita: `Document`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `name` | `string` | ANO |  |
| `type` | `DocumentType` | ANO | Relations |
| `entity_type` | `string` | ANO | 'project' \| 'reservation' \| 'user' |
| `entity_id` | `string` | ANO |  |
| `uploaded_by` | `string` | ANO | User.id |
| `file_url` | `string` | ANO |  |
| `mime_type` | `string` | ANO |  |
| `size` | `number` | ANO | bytes |
| `status` | `'draft' \| 'signed' \| 'archived'` | ANO | Timestamps |
| `uploaded_at` | `string` | ANO | ISO timestamp |
| `created_at` | `string` | ANO | ISO timestamp |
| `updated_at` | `string` | ANO | ISO timestamp |

---

## Entita: `Notification`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `user_id` | `string` | ANO | User.id |
| `type` | `string` | ANO |  |
| `title` | `string` | ANO |  |
| `message` | `string` | ANO | Relations |
| `entity_type` | `string` | ANO |  |
| `entity_id` | `string` | ANO | Status |
| `read` | `boolean` | ANO | Timestamps |
| `created_at` | `string` | ANO | ISO timestamp |

---

## Entita: `AuditLog`

| Pole | Typ | Povinné | Poznámka |
|---|---|---:|---|
| `id` | `string` | ANO |  |
| `user_id` | `string` | ANO | User.id (who performed action) |
| `action` | `AuditAction` | ANO | Relations |
| `entity_type` | `string` | ANO |  |
| `entity_id` | `string` | ANO | State change |
| `old_state` | `Record<string, any> \| null` | ANO |  |
| `new_state` | `Record<string, any> \| null` | ANO | Details |
| `reason` | `string` | ANO |  |
| `metadata` | `Record<string, any>` | ANO | MEDIUM FIX v3.7.5: supports investor_id for investor event tracking |
| `run_id` | `string` | NE | ID běhu auditu/procesu (např. "IntegrityRun#324", "WatchdogRun#58") |
| `session_id` | `string` | NE | ID relace uživatele pro zpětné trasování |
| `severity` | `'info' \| 'warning' \| 'error' \| 'critical'` | NE | Závažnost události |
| `created_at` | `string` | ANO | ISO timestamp |