/**
 * 라우트 테이블 — 새 디자인 도입 후.
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthBoundary } from "./AuthBoundary";
import { AppShell } from "./AppShell";
import { Login } from "@/pages/Login";
import { HomeSection } from "@/pages/HomeSection";
import { ProductList } from "@/pages/ProductList";
import { ProductEdit } from "@/pages/ProductEdit";
import { CategoryManage } from "@/pages/CategoryManage";
import { PublishCenter } from "@/pages/PublishCenter";
import { AccountSettings } from "@/pages/AccountSettings";
import { AuditLogs } from "@/pages/AuditLogs";
import { UsersAdmin } from "@/pages/super/UsersAdmin";
import { SitesAdmin } from "@/pages/super/SitesAdmin";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <AuthBoundary>
            <AppShell />
          </AuthBoundary>
        }
      >
        <Route path="/" element={<HomeSection />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:productId" element={<ProductEdit />} />
        <Route path="/categories" element={<CategoryManage />} />
        <Route path="/publish" element={<PublishCenter />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/audit" element={<AuditLogs />} />

        <Route
          path="/super/users"
          element={
            <AuthBoundary requireRole="super">
              <UsersAdmin />
            </AuthBoundary>
          }
        />
        <Route
          path="/super/sites"
          element={
            <AuthBoundary requireRole="super">
              <SitesAdmin />
            </AuthBoundary>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
