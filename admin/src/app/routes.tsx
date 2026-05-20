/**
 * 라우트 테이블 — lazy load 는 M3 에서 도입. M2 는 직접 import.
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthBoundary } from "./AuthBoundary";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { UsersAdmin } from "@/pages/super/UsersAdmin";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <AuthBoundary>
            <Dashboard />
          </AuthBoundary>
        }
      />

      <Route
        path="/super/users"
        element={
          <AuthBoundary requireRole="super">
            <UsersAdmin />
          </AuthBoundary>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
