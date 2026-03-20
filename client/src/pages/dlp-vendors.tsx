import { useQuery } from "@tanstack/react-query";
import { Building2, Phone, Mail, Globe, Star, Clock, Loader2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";

const RATING_CONFIG: Record<string, { color: string; bg: string; stars: number }> = {
  Excellent: { color: "text-green-700", bg: "bg-green-50 border-green-200", stars: 5 },
  Good: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", stars: 4 },
  Average: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", stars: 3 },
  Poor: { color: "text-red-700", bg: "bg-red-50 border-red-200", stars: 2 },
};

const COUNTRY_FLAGS: Record<string, string> = {
  India: "🇮🇳", Germany: "🇩🇪", France: "🇫🇷", Belgium: "🇧🇪", UK: "🇬🇧",
};

export default function DlpVendorsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dlp/vendors"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/vendors");
      return res.json();
    },
    staleTime: 60000,
  });

  const vendors = data?.vendors || [];
  const excellentCount = vendors.filter((v: any) => v.qualityRating === "Excellent").length;
  const countries = Array.from(new Set<string>(vendors.map((v: any) => v.country)));

  return (
    <Layout
      title="Vendor Master"
      subtitle="10 certified suppliers across India, Germany & France — KMRCL approved vendor list"
    >
      <div className="p-4 md:p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Vendors", value: vendors.length, color: "text-blue-600" },
            { label: "Excellent Rating", value: excellentCount, color: "text-green-600" },
            { label: "Countries", value: countries.length, color: "text-purple-600" },
            { label: "Active Vendors", value: vendors.filter((v: any) => v.isActive).length, color: "text-teal-600" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
            <span className="text-muted-foreground">Loading vendors...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vendors.map((vendor: any) => {
              const rating = RATING_CONFIG[vendor.qualityRating] || RATING_CONFIG.Good;
              const flag = COUNTRY_FLAGS[vendor.country] || "🌐";
              return (
                <div key={vendor.id} className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 gradient-railway rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-black text-foreground text-base leading-tight">{vendor.vendorName}</div>
                        <div className="text-xs font-mono text-muted-foreground">{vendor.vendorCode}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${rating.bg} ${rating.color}`}>
                      {vendor.qualityRating}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    {vendor.contactPerson && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{vendor.contactPerson}</span>
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs truncate">{vendor.email}</span>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs">{vendor.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs">{flag} {vendor.country}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground">Payment</div>
                      <div className="text-sm font-bold text-foreground">{vendor.paymentTerms || "—"}</div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground">Lead Time</div>
                      <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {vendor.deliveryDays || "—"} days
                      </div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex-1 text-center">
                      <div className="text-xs text-muted-foreground">Stars</div>
                      <div className="flex justify-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < rating.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
