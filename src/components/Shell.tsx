import { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import FixedSidebar from "@/components/FixedSidebar";
import { cn } from "@/lib/utils";

export default function Shell() {
  // collapsed by default
  const [collapsed, setCollapsed] = useState(true);

  // smooth content padding synced with the sidebar width
  const sbw = useMemo(() => (collapsed ? "4rem" : "16rem"), [collapsed]);

  return (
    <div
      style={{ ["--sbw" as any]: sbw }}
      className={cn(
        "min-h-screen w-full bg-gradient-to-br from-background via-background to-accent/5",
        "transition-[padding] duration-200 ease-out md:pl-[var(--sbw)]"
      )}
    >
      <FixedSidebar
        collapsed={collapsed}
        onHoverExpand={() => setCollapsed(false)}
        onHoverCollapse={() => setCollapsed(true)}
      />

      <div className="mx-auto max-w-7xl">
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
