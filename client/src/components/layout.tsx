import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Train, LayoutDashboard, Package, Wrench, Building2, Cpu,
  Settings, ChevronLeft, ChevronRight, Bell, Moon, Sun, Menu,
  BarChart3, BookOpen, Brain, Cloud, ArrowUpDown, LogOut, Newspaper,
  PlusCircle, FileBarChart2, PackagePlus, ShieldAlert
} from "lucide-react";
import { logout, getUser } from "@/lib/auth";
import KhushiAgent from "./khushi-agent";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const navSections = [
  {
    section: "DLP Store",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/inventory", icon: Package, label: "DLP Inventory", badge: "Live" },
      { href: "/tools", icon: Wrench, label: "Tools" },
      { href: "/vendors", icon: Building2, label: "Vendors" },
      { href: "/systems", icon: Cpu, label: "Train Systems" },
      { href: "/transactions", icon: ArrowUpDown, label: "Transactions" },
      { href: "/issue", icon: PlusCircle, label: "New Transaction" },
      { href: "/alerts", icon: ShieldAlert, label: "Alerts", badge: "!" },
    ]
  },
  {
    section: "Reports & Admin",
    items: [
      { href: "/reports", icon: FileBarChart2, label: "Reports & Analytics" },
      { href: "/item-manager", icon: PackagePlus, label: "Item Manager" },
    ]
  },
  {
    section: "RAMS Module",
    items: [
      { href: "/standards", icon: BookOpen, label: "Standards Library" },
      { href: "/rams", icon: BarChart3, label: "RAMS Analysis" },
      { href: "/search", icon: Brain, label: "AI Search", badge: "AI" },
    ]
  },
  {
    section: "Resources",
    items: [
      { href: "/drive", icon: Cloud, label: "Drive Documents" },
      { href: "/news", icon: Newspaper, label: "Rail News", badge: "Live" },
    ]
  },
  {
    section: "System",
    items: [
      { href: "/admin", icon: Settings, label: "Admin Panel" },
    ]
  }
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  onMobileClose?: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  onLogout: () => void;
}

function Sidebar({ collapsed, onCollapse, onMobileClose, darkMode, onToggleDark, onLogout }: SidebarProps) {
  const [location] = useLocation();
  const user = getUser();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-border/50 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 gradient-railway rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
          <Train className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="font-black text-sm text-foreground leading-tight">KMRCL DLP</div>
            <div className="text-xs text-muted-foreground">Inventory System</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navSections.map(section => (
          <div key={section.section}>
            {!collapsed && (
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-2">
                {section.section}
              </div>
            )}
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all relative mb-0.5 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } ${collapsed ? "justify-center" : ""}`}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-white" : ""}`} />
                  {!collapsed && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                        }`}>{item.badge}</span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            {!collapsed && <div className="border-b border-border/30 my-1 mx-1" />}
          </div>
        ))}
      </div>

      {/* Khushi Agent */}
      {!collapsed && (
        <div className="px-2 py-2 border-t border-border/50">
          <KhushiAgent />
        </div>
      )}

      {/* User + Controls */}
      <div className={`p-3 border-t border-border/50 space-y-2 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/50 rounded-xl">
            <div className="w-7 h-7 gradient-railway rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground truncate">{user}</div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
          </div>
        )}
        <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-1"}`}>
          <button
            onClick={onToggleDark}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-xs"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && <span>{darkMode ? "Light" : "Dark"}</span>}
          </button>
          <button
            onClick={onLogout}
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-xs"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
        {!collapsed ? (
          <button
            onClick={() => onCollapse(true)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs text-muted-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Collapse
          </button>
        ) : (
          <button onClick={() => onCollapse(false)} className="p-2 rounded-xl text-muted-foreground hover:bg-muted transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Layout({ children, title, subtitle, actions }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDark = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove("dark");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-xl lg:hidden transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar
          collapsed={false}
          onCollapse={() => {}}
          onMobileClose={() => setMobileOpen(false)}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
        />
      </aside>

      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-200 flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
        <Sidebar
          collapsed={collapsed}
          onCollapse={setCollapsed}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 h-14 border-b border-border bg-card flex-shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            {title && <h1 className="font-black text-lg text-foreground leading-tight truncate">{title}</h1>}
            {subtitle && <p className="text-xs text-muted-foreground hidden sm:block truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
