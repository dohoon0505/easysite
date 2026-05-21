/**
 * 라우트 테이블 — M3 확장.
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthBoundary } from "./AuthBoundary";
import { AppShell } from "./AppShell";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { ProductList } from "@/pages/ProductList";
import { ProductEdit } from "@/pages/ProductEdit";
import { CategoryManage } from "@/pages/CategoryManage";
import { PublishCenter } from "@/pages/PublishCenter";
import { AccountSettings } from "@/pages/AccountSettings";
import { UsersAdmin } from "@/pages/super/UsersAdmin";

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
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/new" element={<ProductEdit />} />
        <Route path="/products/:productId" element={<ProductEdit />} />
        <Route path="/categories" element={<CategoryManage />} />
        <Route path="/media" element={<Navigate to="/products" replace />} />
        <Route path="/publish" element={<PublishCenter />} />
        <Route path="/account" element={<AccountSettings />} />

        <Route
          path="/super/users"
          element={
            <AuthBoundary requireRole="super">
              <UsersAdmin />
            </AuthBoundary>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
