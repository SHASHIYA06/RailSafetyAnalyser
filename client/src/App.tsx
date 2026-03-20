import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAuthenticated } from "@/lib/auth";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import DlpInventoryPage from "@/pages/dlp-inventory";
import DlpToolsPage from "@/pages/dlp-tools";
import DlpVendorsPage from "@/pages/dlp-vendors";
import DlpSystemsPage from "@/pages/dlp-systems";
import DlpTransactionsPage from "@/pages/dlp-transactions";
import ComponentsPage from "@/pages/components";
import StandardsLibraryPage from "@/pages/standards-library";
import RAMSAnalysisPage from "@/pages/rams-analysis";
import NewsPage from "@/pages/news";
import AdminPage from "@/pages/admin";
import AISearchPage from "@/pages/ai-search";
import DriveDocumentsPage from "@/pages/drive-documents";
import NotFoundPage from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/inventory" component={() => <ProtectedRoute component={DlpInventoryPage} />} />
      <Route path="/tools" component={() => <ProtectedRoute component={DlpToolsPage} />} />
      <Route path="/vendors" component={() => <ProtectedRoute component={DlpVendorsPage} />} />
      <Route path="/systems" component={() => <ProtectedRoute component={DlpSystemsPage} />} />
      <Route path="/transactions" component={() => <ProtectedRoute component={DlpTransactionsPage} />} />
      <Route path="/search" component={() => <ProtectedRoute component={AISearchPage} />} />
      <Route path="/components" component={() => <ProtectedRoute component={ComponentsPage} />} />
      <Route path="/standards" component={() => <ProtectedRoute component={StandardsLibraryPage} />} />
      <Route path="/rams" component={() => <ProtectedRoute component={RAMSAnalysisPage} />} />
      <Route path="/news" component={() => <ProtectedRoute component={NewsPage} />} />
      <Route path="/drive" component={() => <ProtectedRoute component={DriveDocumentsPage} />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPage} />} />
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
