import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardPage from "@/pages/dashboard";
import ComponentsPage from "@/pages/components";
import StandardsLibraryPage from "@/pages/standards-library";
import RAMSAnalysisPage from "@/pages/rams-analysis";
import NewsPage from "@/pages/news";
import DocumentsPage from "@/pages/documents";
import AdminPage from "@/pages/admin";
import AISearchPage from "@/pages/ai-search";
import DriveDocumentsPage from "@/pages/drive-documents";
import NotFoundPage from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/search" component={AISearchPage} />
      <Route path="/components" component={ComponentsPage} />
      <Route path="/standards" component={StandardsLibraryPage} />
      <Route path="/rams" component={RAMSAnalysisPage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/documents" component={DocumentsPage} />
      <Route path="/drive" component={DriveDocumentsPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
