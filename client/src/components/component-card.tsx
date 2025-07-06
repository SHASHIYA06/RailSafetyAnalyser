import { CheckCircle, AlertTriangle, XCircle, Eye, Download, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ComponentCardProps {
  component: any;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const ramsBreakdown = component.ramsBreakdown || {
    reliability: Number(component.reliabilityScore) || 0,
    availability: Number(component.availabilityScore) || 0,
    maintainability: Number(component.maintainabilityScore) || 0,
    safety: Number(component.safetyScore) || 0,
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="text-success-green h-4 w-4" />;
      case 'partial':
        return <AlertTriangle className="text-warning-orange h-4 w-4" />;
      case 'non-compliant':
        return <XCircle className="text-danger-red h-4 w-4" />;
      default:
        return <AlertTriangle className="text-warning-orange h-4 w-4" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
      case 'very low':
        return 'bg-green-100 text-success-green';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-danger-red';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-railway-dark">{component.name}</h3>
              <Badge 
                variant={component.certificationStatus === 'certified' ? 'default' : 'secondary'}
                className={component.certificationStatus === 'certified' ? 'bg-green-100 text-success-green' : ''}
              >
                {component.certificationStatus === 'certified' ? 'Certified' : 'Pending'}
              </Badge>
              {component.silLevel && (
                <Badge variant="outline" className="bg-blue-100 text-railway-blue">
                  SIL {component.silLevel}
                </Badge>
              )}
            </div>
            <p className="text-gray-600 mb-3">{component.description}</p>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-600">
                Model: <span className="font-medium">{component.model}</span>
              </span>
              <span className="text-gray-600">
                Manufacturer: <span className="font-medium">{component.manufacturer}</span>
              </span>
              <span className="text-gray-600">
                Updated: <span className="font-medium">
                  {component.lastUpdated ? new Date(component.lastUpdated).toLocaleDateString() : 'N/A'}
                </span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success-green mb-1">
              {Number(component.ramsScore)?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">RAMS Score</div>
          </div>
        </div>

        {/* Standards Compliance */}
        <div className="mb-4">
          <h4 className="font-medium text-railway-dark mb-2">Standards Compliance</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {component.componentStandards?.length > 0 ? (
              component.componentStandards.map((cs: any) => (
                <div key={cs.standard.id} className="flex items-center space-x-2">
                  {getComplianceIcon(cs.complianceStatus)}
                  <span className="text-sm text-gray-700">{cs.standard.code}</span>
                </div>
              ))
            ) : (
              <div className="col-span-full text-sm text-gray-500">
                No compliance data available
              </div>
            )}
          </div>
        </div>

        {/* RAMS Breakdown */}
        <div className="mb-4">
          <h4 className="font-medium text-railway-dark mb-3">RAMS Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Reliability</span>
                <span>{Math.round(ramsBreakdown.reliability)}%</span>
              </div>
              <Progress value={ramsBreakdown.reliability} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Availability</span>
                <span>{Math.round(ramsBreakdown.availability)}%</span>
              </div>
              <Progress value={ramsBreakdown.availability} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Maintainability</span>
                <span>{Math.round(ramsBreakdown.maintainability)}%</span>
              </div>
              <Progress value={ramsBreakdown.maintainability} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Safety</span>
                <span>{Math.round(ramsBreakdown.safety)}%</span>
              </div>
              <Progress value={ramsBreakdown.safety} className="h-2" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button variant="ghost" size="sm" className="text-railway-blue hover:text-blue-700">
              <Eye className="mr-1 h-4 w-4" />
              View Details
            </Button>
            <Button variant="ghost" size="sm" className="text-railway-blue hover:text-blue-700">
              <Download className="mr-1 h-4 w-4" />
              Download Spec
            </Button>
            <Button variant="ghost" size="sm" className="text-railway-blue hover:text-blue-700">
              <Scale className="mr-1 h-4 w-4" />
              Compare
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Risk Level:</span>
            <Badge 
              variant="secondary" 
              className={getRiskLevelColor(component.riskLevel)}
            >
              {component.riskLevel || 'Medium'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
