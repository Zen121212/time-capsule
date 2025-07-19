import { Routes, Route } from "react-router-dom";
import AuthPage from "../pages/Home/AuthPage";
import Dasboard from "../pages/Dashboard/Dashboard";
import PublicWall from "../pages/PublicWall/PublicWall";
import CapsuleDetail from "../pages/CapsuleDetail/CapsuleDetail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dasboard />} />
      <Route path="/public-wall" element={<PublicWall />} />
      <Route path="/capsule/:id" element={<CapsuleDetail />} />
    </Routes>
  );
}
