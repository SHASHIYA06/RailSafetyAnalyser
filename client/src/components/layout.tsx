import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Train, LayoutDashboard, Search, BookOpen, BarChart3,
  Newspaper, FolderOpen, Settings, ChevronLeft, ChevronRight,
  Bell, User, Moon, Sun, Menu, X, Shield, Zap, Brain, Cloud, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import KhushiAgent from "./khushi-agent";

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
      { href: "/search", icon: Brain, label: "AI Search", badge: "AI" },
      { href: "/components", icon: Search, label: "Components", badge: null },
    ]
  },
  {
    section: "Analysis",
    items: [
      { href: "/standards", icon: BookOpen, label: "Standards Library", badge: "30" },
      { href: "/rams", icon: BarChart3, label: "RAMS Analysis", badge: null },
    ]
  },
  {
    section: "Documents",
    items: [
      { href: "/drive", icon: Cloud, label: "Drive Documents", badge: "New" },
      { href: "/documents", icon: FolderOpen, label: "Documents", badge: null },
      { href: "/news", icon: Newspaper, label: "Rail News", badge: "Live" },
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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const SidebarContent = ({ mobile = false }) => (
    <div
      className={`flex flex-col h-full transition-all duration-300 ${mobile ? "w-72" : collapsed ? "w-20" : "w-64"}`}
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/8 flex-shrink-0 ${collapsed && !mobile ? "justify-center" : ""}`}>
        <div className="w-10 h-10 gradient-railway rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Train className="text-white h-5 w-5" />
        </div>
        {(!collapsed || mobile) && (
          <div className="min-w-0 flex-1">
            <div className="text-white font-bold text-sm leading-tight">Railway RAMS</div>
            <div className="text-xs" style={{ color: "var(--sidebar-text)" }}>Intelligence Platform</div>
          </div>
        )}
        {mobile ? (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-1.5 rounded-lg transition-colors text-white/60 hover:text-white hover:bg-white/10">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
        {navItems.map(section => (
          <div key={section.section} className="mb-2">
            {(!collapsed || mobile) && (
              <div className="section-header">{section.section}</div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`nav-item ${isActive ? "active" : ""} ${collapsed && !mobile ? "justify-center px-2" : ""}`}
                    title={collapsed && !mobile ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {(!collapsed || mobile) && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            item.badge === "Live"
                              ? "bg-green-500/20 text-green-400"
                              : item.badge === "AI"
                              ? "bg-violet-500/20 text-violet-300"
                              : item.badge === "New"
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-white/10 text-white/60"
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

      {/* Khushi AI prompt in sidebar */}
      {(!collapsed || mobile) && (
        <div className="p-3 border-t border-white/8 flex-shrink-0">
          <div className="p-3 rounded-xl space-y-2" style={{ background: "var(--sidebar-hover)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-railway rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white text-xs font-semibold">Khushi AI</div>
                <div className="text-xs" style={{ color: "var(--sidebar-text)" }}>RAMS Expert</div>
              </div>
              <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
              <div className="text-xs" style={{ color: "var(--sidebar-text)" }}>EN 50126 Compliant</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="flex flex-col shadow-2xl" style={{ background: "var(--sidebar-bg)" }}>
            <SidebarContent mobile />
          </div>
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 bg-white dark:bg-card border-b border-border px-4 md:px-6 h-16 flex items-center gap-3 shadow-sm z-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1 min-w-0">
            {title && (
              <div>
                <h1 className="text-base md:text-lg font-bold text-foreground truncate leading-tight">{title}</h1>
                {subtitle && <p className="text-xs text-muted-foreground truncate hidden sm:block">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            {actions}
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground" aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-9 h-9 gradient-railway rounded-xl flex items-center justify-center cursor-pointer" aria-label="User profile">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Khushi AI Floating Agent */}
      <KhushiAgent />
    </div>
  );
}
