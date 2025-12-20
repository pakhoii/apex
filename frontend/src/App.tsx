import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoutes from "@/routes/protectedRoute";
import Landing from "@/pages/Landing/landing";
import Auth from "@/pages/Auth/auth";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />

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
