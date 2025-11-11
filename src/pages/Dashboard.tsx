import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchStudents, listStudents } from "@/lib/data";
import { LayoutDashboard, Search, User2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState(() => listStudents());

  useEffect(() => {
    // refresh list from storage whenever we mount
    setRows(listStudents());
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return rows.slice(0, 25);
    return searchStudents(q).slice(0, 50);
  }, [q, rows]);

  return (
    <>
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Search students by name, register number, or email
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 space-y-4">
        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle>Search</CardTitle>
            <CardDescription>Type to filter the students list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, RegNo, or email…"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Showing {results.length} result{results.length !== 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-2">
            <CardTitle>Results</CardTitle>
            <CardDescription>Click a student to view their full record</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {results.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6">No matches.</div>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/students/${encodeURIComponent(r.id)}`)}
                  className="w-full text-left py-3 flex items-center gap-3 hover:bg-muted/60 rounded-md px-2"
                >
                  <div className="bg-muted grid place-items-center rounded-md h-9 w-9">
                    <User2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {r.name || "Unnamed"}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {r.regNo ? `RegNo: ${r.regNo}` : r.email || r.id}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">
                    {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ""}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
