import { useState } from "react";
import { Loader2 } from "lucide-react"; // Eye icons removed to match clean mockup style or kept if desired? Mockup has dots. keeping standard input for now.
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./auth.css";

export const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        identifier: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Login", credentials);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="auth-page-container">
            {/* Top Toggle */}
            <div className="auth-toggle-container">
                <a
                    href="/register"
                    className="auth-toggle-link"
                >
                    Register
                </a>
                <div className="auth-toggle-active">
                    Login
                </div>
            </div>

            <Card className="auth-card">
                <CardHeader className="auth-card-header">
                    <CardTitle className="auth-card-title">Login here.</CardTitle>
                    <CardDescription className="auth-description">
                        Login form
                    </CardDescription>
                </CardHeader>
                <CardContent className="auth-card-content">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-form-group">
                            <Label htmlFor="identifier" className="auth-label">
                                Email
                            </Label>
                            <Input
                                id="identifier"
                                name="identifier"
                                placeholder="schirano@gmail.com"
                                value={credentials.identifier}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <Label htmlFor="password" className="auth-label">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="**********"
                                value={credentials.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="auth-submit-button"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="auth-spinner" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
