import { useState } from "react";
import { Shield, Zap, ChevronDown, ChevronUp, ExternalLink, CheckCircle, Clock, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComponentCardProps {
  component: any;
}

const SIL_COLORS: Record<number, string> = {
  0: "bg-gray-100 text-gray-600 border-gray-300",
  1: "bg-yellow-50 text-yellow-700 border-yellow-300",
  2: "bg-orange-50 text-orange-700 border-orange-300",
  3: "bg-red-50 text-red-700 border-red-300",
  4: "bg-purple-50 text-purple-700 border-purple-300",
};

const RISK_CONFIG: Record<string, { cls: string; dot: string; label: string }> = {
  low: { cls: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-500", label: "Low Risk" },
  "very low": { cls: "bg-green-50 text-green-700 border border-green-200", dot: "bg-green-400", label: "Very Low Risk" },
  medium: { cls: "bg-orange-50 text-orange-700 border border-orange-200", dot: "bg-orange-500", label: "Medium Risk" },
  high: { cls: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-500", label: "High Risk" },
};

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const numVal = Number(value) || 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold" style={{ color }}>{numVal.toFixed(0)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${numVal}%`, background: color }} />
      </div>
    </div>
  );
}

function ComplianceIcon({ status }: { status: string }) {
  if (status === 'compliant') return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
  if (status === 'partial') return <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />;
  return <XCircle className="h-3.5 w-3.5 text-red-500" />;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const [expanded, setExpanded] = useState(false);

  const silColor = SIL_COLORS[component.silLevel ?? 0] || SIL_COLORS[0];
  const riskConfig = RISK_CONFIG[(component.riskLevel || "medium").toLowerCase()] || RISK_CONFIG.medium;
  const ramsScore = Number(component.ramsScore) || 0;
  const scoreColor = ramsScore >= 90 ? "#16a34a" : ramsScore >= 75 ? "#d97706" : "#dc2626";

  const certStatus = component.certificationStatus || "pending";
  const CertIcon = certStatus === "certified" ? CheckCircle : certStatus === "in-review" ? AlertTriangle : Clock;
  const certColor = certStatus === "certified" ? "text-green-600" : certStatus === "in-review" ? "text-yellow-500" : "text-orange-500";

  return (
    <Card className="card-hover border-border shadow-sm hover:shadow-lg transition-all duration-250 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Score Badge */}
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm"
              style={{ borderColor: scoreColor, background: `${scoreColor}12` }}>
              <span className="text-xl font-bold leading-none" style={{ color: scoreColor }}>
                {ramsScore.toFixed(0)}
              </span>
              <span className="text-xs font-medium mt-0.5" style={{ color: scoreColor }}>RAMS</span>
            </div>

            {/* Main Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                <div>
                  <h3 className="text-base font-bold text-foreground leading-tight">{component.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {component.manufacturer}
                    {component.model && <span className="text-muted-foreground/70"> · {component.model}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                  <Badge className={`text-xs border font-semibold px-2 ${silColor}`}>
                    SIL {component.silLevel ?? 0}
                  </Badge>
                  <div className={`flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${riskConfig.cls}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${riskConfig.dot}`} />
                    {riskConfig.label}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap mt-2">
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                  {component.category}
                </span>
                {component.subcategory && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {component.subcategory}
                  </span>
                )}
                <div className={`flex items-center gap-1 text-xs font-medium ${certColor}`}>
                  <CertIcon className="h-3 w-3" />
                  <span className="capitalize">{certStatus.replace('-', ' ')}</span>
                </div>
              </div>

              {component.description && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                  {component.description}
                </p>
              )}
            </div>
          </div>

          {/* Standards compliance row */}
          {component.componentStandards?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-medium">Standards:</span>
                {component.componentStandards.map((cs: any) => (
                  <div key={cs.standard?.id || cs.standardId} className="flex items-center gap-1">
                    <ComplianceIcon status={cs.complianceStatus} />
                    <span className="text-xs font-medium text-foreground">{cs.standard?.code || "EN Standard"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RAMS Breakdown */}
        <div className="px-5 py-3 bg-muted/30 border-y border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreBar label="Reliability" value={Number(component.reliabilityScore) || 0} color="#2563eb" />
            <ScoreBar label="Availability" value={Number(component.availabilityScore) || 0} color="#16a34a" />
            <ScoreBar label="Maintainability" value={Number(component.maintainabilityScore) || 0} color="#d97706" />
            <ScoreBar label="Safety" value={Number(component.safetyScore) || 0} color="#dc2626" />
          </div>
        </div>

        {/* Expanded Technical Details */}
        {expanded && (
          <div className="px-5 py-4 border-b border-border space-y-4 bg-muted/10">
            {component.technicalSpecs && Object.keys(component.technicalSpecs).length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-railway-blue" />
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(component.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="bg-background rounded-lg p-2.5 border border-border">
                      <div className="text-xs text-muted-foreground capitalize mb-0.5">{key.replace(/_/g, ' ')}</div>
                      <div className="text-xs font-bold text-foreground">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {component.operatingConditions && Object.keys(component.operatingConditions).length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-green-600" />
                  Operating Conditions
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.entries(component.operatingConditions).map(([key, value]) => (
                    <div key={key} className="bg-green-50 dark:bg-green-950/20 rounded-lg p-2.5 border border-green-100 dark:border-green-900">
                      <div className="text-xs text-muted-foreground capitalize mb-0.5">{key.replace(/_/g, ' ')}</div>
                      <div className="text-xs font-bold text-foreground">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Collapse" : "View Details"}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              RAMS Report
            </Button>
            <Button size="sm" className="h-8 text-xs gradient-railway text-white border-0 shadow">
              <ExternalLink className="h-3 w-3 mr-1.5" />
              Standards
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
