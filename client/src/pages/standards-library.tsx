import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Train, Download, User, FileText, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function StandardsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: standardsData, isLoading } = useQuery({
    queryKey: ['/api/standards', { search: searchQuery, category: selectedCategory }],
  });

  const categories = [
    "RAMS",
    "EMC",
    "Software",
    "Fire Protection",
    "Cybersecurity",
    "Rolling Stock",
    "Signaling"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-railway-blue rounded-lg flex items-center justify-center">
                <Train className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-railway-dark">Railway RAMS Platform</h1>
                <p className="text-xs text-gray-500">Standards & Compliance Analysis</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-railway-blue transition-colors">
                Components
              </Link>
              <Link href="/standards" className="text-railway-blue font-medium border-b-2 border-railway-blue pb-1">
                Standards Library
              </Link>
              <Link href="/rams" className="text-gray-600 hover:text-railway-blue transition-colors">
                RAMS Analysis
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button className="bg-railway-blue hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-railway-dark mb-4">Standards Library</h2>
          <p className="text-gray-600">
            Comprehensive collection of EN standards and railway safety documentation
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search standards by code, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-railway-blue focus:border-railway-blue"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
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
            ))
          ) : standardsData?.standards.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No standards found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            standardsData?.standards.map((standard) => (
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
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Version: {standard.version || 'Latest'}</span>
                    <span>
                      {standard.publishedDate 
                        ? new Date(standard.publishedDate).getFullYear()
                        : 'Current'
                      }
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-2">
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
            ))
          )}
        </div>

        {/* Featured Standards Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-railway-dark mb-6">Featured Standards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-railway-blue">
              <CardHeader>
                <CardTitle className="text-railway-blue">EN 50126 Series</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The foundational RAMS (Reliability, Availability, Maintainability, Safety) standards for railway applications.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• EN 50126-1: Generic RAMS process</li>
                  <li>• EN 50126-2: Systems approach to safety</li>
                  <li>• Risk management and lifecycle processes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-success-green">
              <CardHeader>
                <CardTitle className="text-success-green">EN 50716 (New)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Latest software development standard for railway applications, replacing EN 50128 in 2024.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Enhanced cybersecurity requirements</li>
                  <li>• Modern development methodologies</li>
                  <li>• Backward compatibility with EN 50128</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
