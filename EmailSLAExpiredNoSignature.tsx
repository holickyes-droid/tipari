/**
 * EMAIL TEMPLATE: SLA EXPIRED WITHOUT INVESTOR SIGNATURE
 * 
 * Sent to introducer (tipař) when:
 * - Reservation SLA expires
 * - Investor has NOT signed the reservation agreement
 * 
 * Purpose: Inform introducer that reservation was auto-closed and slot is available
 */

import { Reservation } from '../types/reservation';

interface EmailSLAExpiredNoSignatureProps {
  reservation: Reservation;
  projectName: string;
  investorName: string;
  introducerName: string;
  introducerEmail: string;
}

/**
 * Email Template Component
 * This component generates the email HTML that would be sent to the introducer
 */
export function EmailSLAExpiredNoSignature({
  reservation,
  projectName,
  investorName,
  introducerName,
  introducerEmail,
}: EmailSLAExpiredNoSignatureProps) {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
    }}>
      {/* Email Header */}
      <div style={{
        backgroundColor: '#040F2A',
        padding: '24px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#ffffff',
          letterSpacing: '0.5px',
        }}>
          Tipari.cz
        </div>
      </div>

      {/* Email Body */}
      <div style={{
        padding: '32px 24px',
      }}>
        {/* Greeting */}
        <p style={{
          fontSize: '16px',
          color: '#040F2A',
          marginBottom: '24px',
          lineHeight: '1.5',
        }}>
          Dobrý den, {introducerName},
        </p>

        {/* Main Message */}
        <div style={{
          backgroundColor: '#F3F4F6',
          borderLeft: '4px solid #6B7280',
          padding: '16px 20px',
          marginBottom: '24px',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#040F2A',
            margin: '0 0 12px 0',
            lineHeight: '1.6',
          }}>
            Investor <strong>{investorName}</strong> nepodepsal rezervační smlouvu ve stanovené lhůtě.
          </p>
          <p style={{
            fontSize: '14px',
            color: '#040F2A',
            margin: '0',
            lineHeight: '1.6',
          }}>
            Rezervace <strong>{reservation.reservationNumber}</strong> byla automaticky ukončena systémem.
          </p>
        </div>

        {/* Reservation Details */}
        <div style={{
          backgroundColor: '#FAFAFA',
          border: '1px solid #EAEAEA',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px',
            marginTop: '0',
          }}>
            Detail rezervace
          </h2>
          
          <table style={{
            width: '100%',
            fontSize: '14px',
            lineHeight: '1.8',
          }}>
            <tbody>
              <tr>
                <td style={{
                  color: '#6B7280',
                  paddingBottom: '8px',
                }}>
                  Číslo rezervace:
                </td>
                <td style={{
                  color: '#040F2A',
                  fontWeight: '500',
                  paddingBottom: '8px',
                  textAlign: 'right',
                }}>
                  {reservation.reservationNumber}
                </td>
              </tr>
              <tr>
                <td style={{
                  color: '#6B7280',
                  paddingBottom: '8px',
                }}>
                  Projekt:
                </td>
                <td style={{
                  color: '#040F2A',
                  fontWeight: '500',
                  paddingBottom: '8px',
                  textAlign: 'right',
                }}>
                  {projectName}
                </td>
              </tr>
              <tr>
                <td style={{
                  color: '#6B7280',
                  paddingBottom: '8px',
                }}>
                  Investor:
                </td>
                <td style={{
                  color: '#040F2A',
                  fontWeight: '500',
                  paddingBottom: '8px',
                  textAlign: 'right',
                }}>
                  {investorName}
                </td>
              </tr>
              <tr>
                <td style={{
                  color: '#6B7280',
                  paddingBottom: '8px',
                }}>
                  Tiket:
                </td>
                <td style={{
                  color: '#040F2A',
                  fontWeight: '500',
                  paddingBottom: '8px',
                  textAlign: 'right',
                }}>
                  {reservation.ticketId}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Slot Release Confirmation */}
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #14AE6B',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '24px',
        }}>
          <p style={{
            fontSize: '14px',
            color: '#065F46',
            margin: '0',
            lineHeight: '1.6',
            fontWeight: '500',
          }}>
            ✓ Slot byl uvolněn a je opět k dispozici pro další rezervaci.
          </p>
        </div>

        {/* Informational Note */}
        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          lineHeight: '1.6',
          marginBottom: '0',
        }}>
          Pro pokračování spolupráce s tímto investorem můžete vytvořit novou rezervaci v systému Tipari.cz.
        </p>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#F9FAFB',
        borderTop: '1px solid #EAEAEA',
        padding: '20px 24px',
      }}>
        <p style={{
          fontSize: '12px',
          color: '#9CA3AF',
          margin: '0 0 8px 0',
          lineHeight: '1.5',
          fontStyle: 'italic',
        }}>
          Tato akce byla provedena automaticky po vypršení SLA.
        </p>
        <p style={{
          fontSize: '12px',
          color: '#9CA3AF',
          margin: '0',
          lineHeight: '1.5',
        }}>
          © 2026 Tipari.cz – Profesionální B2B investiční referral platforma
        </p>
      </div>
    </div>
  );
}

/**
 * Email Subject Line
 */
export const EMAIL_SLA_EXPIRED_NO_SIGNATURE_SUBJECT = 'Rezervace ukončena – smlouva nebyla podepsána';

/**
 * Email Plain Text Version
 * For email clients that don't support HTML
 */
export function getEmailSLAExpiredNoSignaturePlainText({
  reservation,
  projectName,
  investorName,
  introducerName,
}: Omit<EmailSLAExpiredNoSignatureProps, 'introducerEmail'>): string {
  return `
Dobrý den, ${introducerName},

Investor ${investorName} nepodepsal rezervační smlouvu ve stanovené lhůtě.
Rezervace ${reservation.reservationNumber} byla automaticky ukončena systémem.

DETAIL REZERVACE
-------------------
Číslo rezervace: ${reservation.reservationNumber}
Projekt: ${projectName}
Investor: ${investorName}
Tiket: ${reservation.ticketId}

STAV SLOTU
-------------------
✓ Slot byl uvolněn a je opět k dispozici pro další rezervaci.

Pro pokračování spolupráce s tímto investorem můžete vytvořit novou rezervaci v systému Tipari.cz.

---
Tato akce byla provedena automaticky po vypršení SLA.

© 2026 Tipari.cz – Profesionální B2B investiční referral platforma
  `.trim();
}

/**
 * Email Metadata for Logging/Tracking
 */
export interface EmailSLAExpiredMetadata {
  emailType: 'SLA_EXPIRED_NO_SIGNATURE';
  triggeredAt: string; // ISO date
  reservationId: string;
  reservationNumber: string;
  introducerId: string;
  investorId: string;
  projectId: string;
  ticketId: string;
  slaDeadline: string; // ISO date
  expiredFromPhase: 'WAITING_INVESTOR_SIGNATURE';
}

/**
 * Helper function to generate email metadata for tracking
 */
export function generateEmailMetadata(
  reservation: Reservation,
): EmailSLAExpiredMetadata {
  return {
    emailType: 'SLA_EXPIRED_NO_SIGNATURE',
    triggeredAt: new Date().toISOString(),
    reservationId: reservation.id,
    reservationNumber: reservation.reservationNumber,
    introducerId: reservation.introducerId,
    investorId: reservation.investorId,
    projectId: reservation.projectId,
    ticketId: reservation.ticketId,
    slaDeadline: reservation.slaDeadline || '',
    expiredFromPhase: 'WAITING_INVESTOR_SIGNATURE',
  };
}
