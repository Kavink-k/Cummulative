import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ClipboardList, Upload, PanelLeftClose, PanelLeftOpen, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { logout, getUser } from "@/lib/auth";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const linkBase =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors";

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
  const content = (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          linkBase,
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted"
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  if (!collapsed) return content;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "h-screen sticky top-0 border-r bg-card/60 backdrop-blur-sm hidden md:flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header / Brand + Toggle */}
        <div className={cn("p-3 pb-2 border-b flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-sm font-semibold">Student Record</div>
                <div className="text-xs text-muted-foreground">
                  {user?.name || "User"}
                </div>
              </div>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggle}
            className={cn("ml-2", collapsed && "hidden")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>

          {/* When collapsed, show a floating toggle icon */}
          {collapsed && (
            <button
              onClick={onToggle}
              className="absolute right-1 top-2 p-1 rounded-md hover:bg-muted"
              aria-label="Expand sidebar"
              title="Expand"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="p-3">
          <h2 className={cn("text-xs font-semibold text-muted-foreground mb-2", collapsed && "sr-only")}>
            Submission
          </h2>
          <nav className="space-y-2">
            <NavItem to="/form" icon={ClipboardList} label="Form Submission" collapsed={collapsed} />
            <NavItem to="/bulk" icon={Upload} label="Bulk Submission" collapsed={collapsed} />
          </nav>
        </div>

        {/* Spacer pushes logout to bottom */}
        <div className="flex-1" />

        {/* Logout at bottom */}
        <div className="p-3 border-t">
          <Button
            variant="destructive"
            className={cn("w-full justify-start", collapsed && "justify-center p-2")}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
