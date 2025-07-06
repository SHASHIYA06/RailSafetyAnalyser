import { FileText, ExternalLink, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StandardsGridProps {
  standards: any[];
  isLoading: boolean;
}

export default function StandardsGrid({ standards, isLoading }: StandardsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (standards.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">No standards found</p>
        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {standards.map((standard) => (
        <Card key={standard.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-railway-dark mb-1">
                  {standard.code}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {standard.category}
                </Badge>
              </div>
              {standard.pdfUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={standard.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-gray-900 mb-2">{standard.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {standard.description}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
              <span>Version: {standard.version || 'Latest'}</span>
              <span>
                {standard.publishedDate 
                  ? new Date(standard.publishedDate).getFullYear()
                  : 'Current'
                }
              </span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Details
              </Button>
              {standard.pdfUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={standard.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
