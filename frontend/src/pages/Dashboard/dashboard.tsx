import Navbar from "@/components/Navbar/navbar";
import { useUser } from "@/hooks/useUser";
import type { UserOut, UserRole } from "@/types/user";
import {
    Building2,
    Car,
    LayoutDashboard,
    LogOut,
    Package,
    User,
    Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

// User Components
import UserOrders from "@/components/Dashboard/UserOrders";
import UserProfile from "@/components/Dashboard/UserProfile";
import UserTestDriveBookings from "@/components/Dashboard/UserTestDriveBookings";

// Admin Components
import AdminBrands from "@/components/Dashboard/AdminBrands";
import AdminModels from "@/components/Dashboard/AdminModels";
import AdminOrders from "@/components/Dashboard/AdminOrders";
import AdminUsers from "@/components/Dashboard/AdminUsers";

type UserTab = "profile" | "orders" | "bookings";
type AdminTab = "brands" | "models" | "orders" | "users";
type DashboardTab = UserTab | AdminTab;

interface SidebarItem {
    id: DashboardTab;
    label: string;
    icon: React.ReactNode;
    role: UserRole | "any";
}

const sidebarItems: SidebarItem[] = [
    { id: "profile", label: "My Profile", icon: <User size={20} />, role: "any" },
    { id: "orders", label: "My Orders", icon: <Package size={20} />, role: "user" },
    { id: "bookings", label: "Test Drive Bookings", icon: <Car size={20} />, role: "user" },
    { id: "brands", label: "Manage Brands", icon: <Building2 size={20} />, role: "admin" },
    { id: "models", label: "Manage Models", icon: <Car size={20} />, role: "admin" },
    { id: "orders", label: "Manage Orders", icon: <Package size={20} />, role: "admin" },
    { id: "users", label: "Create Users", icon: <Users size={20} />, role: "admin" },
];

export default function DashboardPage() {
    const { getCurrentUser } = useUser();
    const navigate = useNavigate();
    const [user, setUser] = useState<UserOut | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<DashboardTab>("profile");

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            // Set default tab based on role
            if (userData.role === "admin") {
                setActiveTab("brands");
            } else {
                setActiveTab("orders");
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
            // Redirect to login if not authenticated
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleUserUpdate = (updatedUser: UserOut) => {
        setUser(updatedUser);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const getFilteredSidebarItems = () => {
        if (!user) return [];
        return sidebarItems.filter(
            item => item.role === "any" || item.role === user.role
        );
    };

    const renderContent = () => {
        if (!user) return null;

        // User tabs
        if (user.role === "user") {
            switch (activeTab) {
                case "profile":
                    return <UserProfile user={user} onUpdate={handleUserUpdate} />;
                case "orders":
                    return <UserOrders />;
                case "bookings":
                    return <UserTestDriveBookings />;
                default:
                    return <UserOrders />;
            }
        }

        // Admin tabs
        if (user.role === "admin") {
            switch (activeTab) {
                case "profile":
                    return <UserProfile user={user} onUpdate={handleUserUpdate} />;
                case "brands":
                    return <AdminBrands />;
                case "models":
                    return <AdminModels />;
                case "orders":
                    return <AdminOrders />;
                case "users":
                    return <AdminUsers />;
                default:
                    return <AdminBrands />;
            }
        }

        return null;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dashboard-page">
                    <div className="dashboard-loading-full">
                        <div className="spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-header">
                            <LayoutDashboard size={24} />
                            <h2>Dashboard</h2>
                        </div>
                        
                        <div className="sidebar-user">
                            <div className="user-avatar">
                                <User size={24} />
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user.first_name} {user.last_name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            {getFilteredSidebarItems().map((item) => (
                                <button
                                    key={`${item.id}-${item.role}`}
                                    className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="sidebar-footer">
                            <button className="sidebar-item logout" onClick={handleLogout}>
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </aside>

                    <main className="dashboard-content">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </>
    );
}
