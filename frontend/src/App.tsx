import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Auth from "@/pages/Auth/auth";
import Landing from "@/pages/Landing/landing";
import ProtectedRoutes from "@/routes/protectedRoute";
import AboutPage from "./pages/About/about";
import CheckoutPage from "./pages/Checkout/checkout";
import ComparePage from "./pages/Compare/compare";
import DashboardPage from "./pages/Dashboard/dashboard";
import ModelDetailsPage from "./pages/Models/modelDetails";
import ModelsPage from "./pages/Models/models";
import MyCart from "./pages/MyCart/myCart";
import TestDrive from "./pages/TestDrive/testDrive";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/models" element={<ModelsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/my-cart" element={<MyCart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/test-drive/:modelId" element={<TestDrive />} />
                <Route path="/compare/:id1/:id2" element={<ComparePage />} />
                <Route path="/models/:modelId" element={<ModelDetailsPage />} />

                {/* ===== PROTECTED ROUTES ===== */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoutes>
                            <DashboardPage />
                        </ProtectedRoutes>
                    }
                />

                {/* ===== FALLBACK ===== */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
