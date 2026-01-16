import React from "react";

const colors = {
  tipariBlue: "#0047AB",
  successGreen: "#1BBF73",
  warningAmber: "#FFB200",
  errorRed: "#D32F2F",
  neutralGray: "#667085"
};

const cardStyle: React.CSSProperties = {
  border: `1px solid ${colors.neutralGray}`,
  borderRadius: 8,
  padding: 16,
  marginBottom: 12
};

const focusStyle: React.CSSProperties = {
  outline: `2px solid ${colors.tipariBlue}`,
  outlineOffset: 2
};

export type ProjectCardProps = {
  name: string;
  yieldPa: number;
  targetAmount?: number;
  status: string;
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  yieldPa,
  targetAmount,
  status
}) => (
  <section
    aria-label="Project card"
    tabIndex={0}
    style={{ ...cardStyle, boxShadow: `0 0 0 0 ${colors.tipariBlue}` }}
  >
    {/* Added according to Tipari UX specification */}
    <h3 style={{ color: colors.tipariBlue, marginTop: 0 }}>{name}</h3>
    <p style={{ color: colors.neutralGray }}>Yield: {yieldPa}%</p>
    {targetAmount && (
      <p style={{ color: colors.neutralGray }}>Target: {targetAmount} CZK</p>
    )}
    <p style={{ color: colors.neutralGray }}>Status: {status}</p>
    <button
      style={{
        backgroundColor: colors.tipariBlue,
        color: "white",
        padding: "8px 12px",
        borderRadius: 6,
        border: "none"
      }}
      aria-label="View project details"
    >
      View project details
    </button>
  </section>
);

export type TicketCardProps = {
  ticketId: string;
  minInvestment: number;
  durationMonths: number;
  status: "available" | "reserved" | "closed";
  availableSlots: number;
};

export const TicketCard: React.FC<TicketCardProps> = ({
  ticketId,
  minInvestment,
  durationMonths,
  status,
  availableSlots
}) => {
  const statusColor =
    status === "available"
      ? colors.successGreen
      : status === "reserved"
      ? colors.warningAmber
      : colors.errorRed;

  return (
    <section aria-label="Ticket card" tabIndex={0} style={cardStyle}>
      {/* Added according to Tipari UX specification */}
      <h4 style={{ color: colors.tipariBlue, marginTop: 0 }}>
        Ticket {ticketId}
      </h4>
      <p style={{ color: colors.neutralGray }}>
        Min Investment: {minInvestment} CZK
      </p>
      <p style={{ color: colors.neutralGray }}>Duration: {durationMonths} months</p>
      <p style={{ color: statusColor }}>Status: {status}</p>
      <p style={{ color: colors.neutralGray }}>
        Available slots: {availableSlots}
      </p>
      <button
        style={{
          backgroundColor: colors.tipariBlue,
          color: "white",
          padding: "8px 12px",
          borderRadius: 6,
          border: "none"
        }}
        aria-label="Invest now"
      >
        Invest now
      </button>
    </section>
  );
};

export type IncidentDashboardProps = {
  incidents: { id: string; severity: "warning" | "critical"; slaHours: number }[];
};

export const IncidentDashboard: React.FC<IncidentDashboardProps> = ({
  incidents
}) => (
  <section aria-label="Incident dashboard" tabIndex={0} style={cardStyle}>
    {/* Added according to Tipari UX specification */}
    <h3 style={{ color: colors.tipariBlue, marginTop: 0 }}>Incident Dashboard</h3>
    {incidents.map((incident) => (
      <div key={incident.id} style={{ marginBottom: 8 }}>
        <strong
          style={{
            color: incident.severity === "critical" ? colors.errorRed : colors.warningAmber
          }}
        >
          {incident.severity.toUpperCase()} — SLA {incident.slaHours}h
        </strong>
        <p style={{ color: colors.neutralGray }}>
          Reservation expires in {incident.slaHours}h
        </p>
      </div>
    ))}
  </section>
);

export type CICDDashboardProps = {
  buildTimeMinutes: number;
  status: "pass" | "fail";
  slaWarning: boolean;
};

export const CICDDashboard: React.FC<CICDDashboardProps> = ({
  buildTimeMinutes,
  status,
  slaWarning
}) => (
  <section aria-label="CI/CD dashboard" tabIndex={0} style={cardStyle}>
    {/* Added according to Tipari UX specification */}
    <h3 style={{ color: colors.tipariBlue, marginTop: 0 }}>CI/CD Dashboard</h3>
    <p style={{ color: colors.neutralGray }}>Build time: {buildTimeMinutes} min</p>
    <p style={{ color: status === "pass" ? colors.successGreen : colors.errorRed }}>
      Status: {status}
    </p>
    {slaWarning && (
      <p style={{ color: colors.warningAmber }}>SLA warning — investigate pipeline</p>
    )}
    <button
      style={{
        backgroundColor: colors.tipariBlue,
        color: "white",
        padding: "8px 12px",
        borderRadius: 6,
        border: "none"
      }}
      aria-label="View pipeline details"
    >
      View pipeline details
    </button>
  </section>
);

export const FocusIndicatorDemo: React.FC = () => (
  <button style={focusStyle} aria-label="Focus indicator demo">
    Focus indicator
  </button>
);
