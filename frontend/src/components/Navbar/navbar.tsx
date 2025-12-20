import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LogInIcon, LayoutDashboard } from "lucide-react";

import "@/components/Navbar/navbar.css";

const NAV_ITEMS = {
  "ABOUT US": "/about",
  "MODELS": "/models",
  "CONTACT": "/contact",
  "DASHBOARD": "/dashboard",
  "WISHLIST": "/wishlist",
  "CART": "/cart",
//   "BOOK TEST DRIVE": "/test-drive",
};

export default function Navbar() {
    const accessToken = localStorage.getItem("access_token");

    return (
        <div className="nav-container">
            <div className="nav-left">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="nav-btn"
                                variant="ghost"
                                size="icon">
                            <Menu/>
                        </Button>
                    </SheetTrigger>

                    <SheetContent 
                        side="left"
                        className="menu-content"
                    >
                        <nav className="navbar">
                            {Object.entries(NAV_ITEMS).map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                className="relative group"
                            >
                                <span>{label}</span>
                            </a>
                        ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="nav-center">
                <a href="/">
                    <img 
                        src="/logo/web-logo.svg" 
                        alt="Company Logo" 
                        className="logo-image"
                    />
                </a>
            </div>

            {/* <div className="nav-right">
                <Button className="nav-btn">
                    LOGIN / SIGNUP
                    <LogInIcon />
                </Button>
            </div> */}
            {accessToken ? (
                <div className="nav-right">
                    <Button className="nav-btn">
                        <a href="/dashboard" className="nav-link">DASHBOARD</a>
                        <LayoutDashboard />
                    </Button>
                </div>
            ) : (
                <div className="nav-right">
                    <Button className="nav-btn">
                        <a href="/auth" className="nav-link">LOGIN / SIGNUP</a>
                        <LogInIcon />
                    </Button>
                </div>
            )}
        </div>
    )
}