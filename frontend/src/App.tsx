import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoutes from "@/routes/protectedRoute";
import Landing from "@/pages/Landing/landing";
import Auth from "@/pages/Auth/auth";
import ModelsPage from "./pages/Models/models";
import AboutPage from "./pages/About/about";
import ComparePage from "./pages/Compare/compare";
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
                <Route path="/compare/:id1/:id2" element={<ComparePage />} />
                <Route path="/test-drive" element={<TestDrive modelId={1} name={"Hello"} imageUrl={""} />} />

                {/* ===== CART ROUTE ===== */}
                <Route path="/my-cart" element={<MyCart />} />

                {/* ===== PROTECTED ROUTES ===== */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoutes>
                            {/* <Dashboard /> */}
                            <></>
                        </ProtectedRoutes>
                    }
                />

                {/* ===== FALLBACK ===== */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
