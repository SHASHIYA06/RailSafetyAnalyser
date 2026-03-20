import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Train, LayoutDashboard, Search, BookOpen, BarChart3,
  Newspaper, FolderOpen, Settings, ChevronLeft, ChevronRight,
  Bell, User, Moon, Sun, Download, Menu, X, Shield, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const navItems = [
  {
    section: "Main",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard", badge: null },
      { href: "/components", icon: Search, label: "Component Search", badge: null },
      { href: "/standards", icon: BookOpen, label: "Standards Library", badge: "20" },
    ]
  },
  {
    section: "Analysis",
    items: [
      { href: "/rams", icon: BarChart3, label: "RAMS Analysis", badge: null },
      { href: "/news", icon: Newspaper, label: "Rail News", badge: "Live" },
      { href: "/documents", icon: FolderOpen, label: "Documents", badge: null },
    ]
  },
  {
    section: "System",
    items: [
      { href: "/admin", icon: Settings, label: "Admin Panel", badge: null },
    ]
  }
];

export default function Layout({ children, title, subtitle, actions }: LayoutProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const Sidebar = ({ mobile = false }) => (
    <div
      className={`flex flex-col h-full transition-all duration-300 ${
        mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'
      }`}
      style={{ background: 'var(--sidebar-bg)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-white/8 ${collapsed && !mobile ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 gradient-railway rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Train className="text-white h-5 w-5" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight">Railway RAMS</div>
            <div className="text-xs" style={{ color: 'var(--sidebar-text)' }}>Intelligence Platform</div>
          </div>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--sidebar-text)' }}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1">
        {navItems.map((section) => (
          <div key={section.section}>
            {(!collapsed || mobile) && (
              <div className="section-header">{section.section}</div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${isActive ? 'active' : ''} ${collapsed && !mobile ? 'justify-center px-2' : ''}`}
                    title={collapsed && !mobile ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {(!collapsed || mobile) && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.badge === 'Live' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-white/10 text-white/70'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      {(!collapsed || mobile) && (
        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--sidebar-hover)' }}>
            <div className="w-9 h-9 gradient-railway rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold">EN 50126 Compliant</div>
              <div className="text-xs" style={{ color: 'var(--sidebar-text)' }}>Platform Certified</div>
            </div>
            <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col">
            <Sidebar mobile />
          </div>
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 bg-white dark:bg-card border-b border-border px-6 h-16 flex items-center gap-4 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            {title && (
              <div>
                <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
                {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* Top Bar Actions */}
          <div className="flex items-center gap-2">
            {actions}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 gradient-railway rounded-xl flex items-center justify-center cursor-pointer">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
