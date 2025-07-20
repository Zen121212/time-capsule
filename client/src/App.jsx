import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import Navigation from "./components/layout/Navigation/Navigation";
import { authService } from "./services/authService";
import "./App.css";

function App() {
  useEffect(() => {
    // Migrate existing users from old storage format to token-only
    authService.migrateToTokenStorage();
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const shouldShowNav = location.pathname !== "/";

  return (
    <>
      {shouldShowNav && <Navigation />}
      <AppRoutes />
    </>
  );
}

export default App;
