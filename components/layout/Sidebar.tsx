"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Home, 
  ChevronLeft, 
  Menu,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Personas", href: "/personas", icon: Users },
    { name: "Debate Arena", href: "/debate", icon: MessageSquare },
    { name: "Market Insights", href: "/insights", icon: BarChart3 },
  ];

  return (
    <div 
      className={`h-full border-r bg-gray-900/20 border-white/10 flex flex-col transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-lg z-50 hover:scale-110 transition-transform"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 mb-4 flex items-center gap-3 overflow-hidden ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-lg">P</span>
        </div>
        {!isCollapsed && (
          <span className="font-display font-bold text-xl text-amber-400 whitespace-nowrap">
            PersonaGen
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? "bg-amber-400/10 text-amber-400" 
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.name : ""}
            >
              <Icon size={20} className={isActive ? "text-amber-400" : "group-hover:scale-110 transition-transform"} />
              {!isCollapsed && (
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer info or user profile could go here */}
      <div className="mt-auto p-4 border-t border-white/5">
        {!isCollapsed ? (
          <div className="px-2 py-3 rounded-xl bg-white/5 text-[10px] uppercase tracking-widest font-bold text-text-muted text-center">
            v1.2.0 Stable
          </div>
        ) : (
          <div className="text-[10px] font-bold text-amber-400 text-center">v1.2</div>
        )}
      </div>
    </div>
  );
}
