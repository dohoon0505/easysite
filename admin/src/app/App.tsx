/**
 * App shell — router + auth listener + global toast container.
 */
import { AuthListener } from "./AuthBoundary";
import { AppRoutes } from "./routes";
import { ToastContainer } from "@/components/AlertToast";

export function App() {
  return (
    <>
      <AuthListener />
      <AppRoutes />
      <ToastContainer />
    </>
  );
}
