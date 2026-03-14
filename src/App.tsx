import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RolesProvider } from "@/contexts/RolesContext";
import { UsersProvider } from "@/contexts/UsersContext";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { TicketsProvider } from "@/contexts/TicketsContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Register from "@/components/Auth/Register";
import Login from "@/components/Auth/Login";
import Dashboard from "@/components/Dashboard/Dashboard";
import RolesPage from "@/components/Roles/RolesPage";
import UsersPage from "@/components/Users/UsersPage";
import AuditPage from "@/components/Audit/AuditPage";
import TicketsPage from "@/components/Tickets/TicketsPage";
import CategoriesPage from "@/components/Categories/CategoriesPage";
import AgentsPage from "@/components/Agents/AgentsPage";
import Index from "@/pages/Index";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RolesProvider>
            <UsersProvider>
              <CategoriesProvider>
              <TicketsProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout><Dashboard /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/users"
                  element={
                    <ProtectedRoute permission="users.view">
                      <DashboardLayout><UsersPage /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/roles"
                  element={
                    <ProtectedRoute permission="roles.view">
                      <DashboardLayout><RolesPage /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/categories"
                  element={
                    <ProtectedRoute permission="categories.view">
                      <DashboardLayout><CategoriesPage /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/audit"
                  element={
                    <ProtectedRoute permission="audit.view">
                      <DashboardLayout><AuditPage /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/tickets"
                  element={
                    <ProtectedRoute permission="tickets.view">
                      <DashboardLayout><TicketsPage /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/agents"
                  element={
                    <ProtectedRoute permission="agents.view">
                      <DashboardLayout><AgentsPage /></DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </TicketsProvider>
              </CategoriesProvider>
            </UsersProvider>
          </RolesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
