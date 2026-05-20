/**
 * App shell — router + auth listener + global toast container + confirm host.
 */
import { ToastContainer, ConfirmHost } from "@/components";
import { ConfirmProvider } from "@/hooks/useConfirm";
import { AuthListener } from "./AuthBoundary";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <ConfirmProvider>
      <AuthListener />
      <AppRoutes />
      <ToastContainer />
      <ConfirmHost />
    </ConfirmProvider>
  );
}
