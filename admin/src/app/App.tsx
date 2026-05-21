/**
 * App shell — router + auth listener + global toast provider.
 */
import { ToastProvider } from "@/components";
import { AuthListener } from "./AuthBoundary";
import { AppRoutes } from "./routes";

export function App() {
  return (
    <ToastProvider>
      <AuthListener />
      <AppRoutes />
    </ToastProvider>
  );
}
