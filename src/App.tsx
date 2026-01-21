
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireAuth from "@/components/RequireAuth";
import Shell from "@/components/Shell";

import Index from "./pages/Index";
import BulkSubmission from "./pages/BulkSubmission";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import StudentDetail from "./pages/StudentDetail";
import StudentEdit from "./pages/StudentEdit";
import StudentPrint from "./pages/StudentPrint";
import StudentView from "./components/StudentView";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected area with persistent sidebar */}
          <Route
            element={
              <RequireAuth>
                <Shell />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Index />} />        {/* default: Form Submission */}
            <Route path="/form" element={<Index />} />
            <Route path="/bulk" element={<BulkSubmission />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/students/:studentId" element={<StudentDetail />} /> */}
            <Route path="/students/:studentId/edit" element={<StudentEdit />} />
            <Route path="/students/:studentId/print" element={<StudentPrint />} />
            <Route path="/students/:studentId" element={<StudentView />} />

          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
