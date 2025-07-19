import { BrowserRouter, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navigation from "./components/layout/Navigation/Navigation";
import "./App.css";

function App() {
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
