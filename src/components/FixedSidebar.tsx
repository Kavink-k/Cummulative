import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Upload,
  LogOut,
  BookOpen,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout, getUser } from "@/lib/auth";

import { LayoutDashboard } from "lucide-react";

type FixedSidebarProps = {
  collapsed: boolean;
  onHoverExpand: () => void;
  onHoverCollapse: () => void;
};

const baseLink =
  "group rounded-lg text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

function NavItem({
  to,
  icon: Icon,
  label,
  collapsed,
}: {
  to: string;
  icon: any;
  label: string;
  collapsed: boolean;
}) {
  // Shared link element (we'll wrap it in a tooltip if collapsed)
  const linkEl = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          baseLink,
          collapsed
            ? // Collapsed: center as a square tile (no text)
            "w-full h-10 grid place-items-center"
            : // Expanded: regular horizontal pill
            "w-full flex items-center gap-3 px-3 py-2",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted"
        )
      }
    >
      {/* Icon scales slightly larger when collapsed */}
      <Icon className={cn(collapsed ? "h-5 w-5" : "h-4 w-4")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (!collapsed) return linkEl;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function FixedSidebar({
  collapsed,
  onHoverExpand,
  onHoverCollapse,
}: FixedSidebarProps) {
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  return (
    <TooltipProvider delayDuration={150}>
      {/* Fixed left rail; expands on hover/focus */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card/70 backdrop-blur-md md:flex hidden flex-col",
          "transition-[width] duration-200 ease-out"
        )}
        style={{ width: "var(--sbw)" }} // set by Shell via CSS var
        aria-label="Sidebar"
        aria-expanded={!collapsed}
        onMouseEnter={onHoverExpand}
        onMouseLeave={onHoverCollapse}
        onFocusCapture={onHoverExpand}
        onBlurCapture={onHoverCollapse}
      >
        {/* Brand / header */}
        <div
          className={cn(
            "border-b flex items-center",
            collapsed ? "justify-center p-2" : "justify-start gap-2 p-3"
          )}
        >
          {/* <div className="bg-primary text-primary-foreground rounded-lg grid place-items-center"
               style={{ width: collapsed ? 28 : 32, height: collapsed ? 28 : 32 }}>
            <BookOpen className={cn(collapsed ? "h-4 w-4" : "h-5 w-5")} />
          </div> */}
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Student Record</div>
              <div className="text-xs text-muted-foreground">
                {user?.name || "User"}
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div className={cn("flex-1", collapsed ? "px-2 pt-2" : "p-3 pt-3")}>
          {!collapsed && (
            <h2 className="text-xs font-semibold text-muted-foreground mb-2">
              Submission
            </h2>
          )}
          <nav className={cn("w-full", collapsed ? "space-y-1" : "space-y-2")}>
            <NavItem
              to="/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              collapsed={collapsed}
            />
            <NavItem to="/form" icon={ClipboardList} label="Form Submission" collapsed={collapsed} />
            <NavItem to="/bulk" icon={Upload} label="Bulk Submission" collapsed={collapsed} />
          </nav>

          {/* Admin Section */}
          {isAdmin && (
            <>
              {!collapsed && (
                <h2 className="text-xs font-semibold text-muted-foreground mb-2 mt-6">
                  Administration
                </h2>
              )}
              <nav className={cn("w-full", collapsed ? "space-y-1 mt-4" : "space-y-2")}>
                <NavItem to="/admin" icon={Shield} label="Admin Dashboard" collapsed={collapsed} />
              </nav>
            </>
          )}
        </div>

        {/* Logout pinned bottom */}
        <div className={cn("border-t", collapsed ? "p-2" : "p-3")}>
          <Button
            variant="destructive"
            className={cn(
              "w-full",
              collapsed ? "h-10 grid place-items-center p-0" : "justify-start"
            )}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut className={cn(collapsed ? "h-5 w-5" : "h-4 w-4")} />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
