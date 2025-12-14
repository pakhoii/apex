import { useState } from "react";
import { Loader2 } from "lucide-react";
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

export const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Register", formData);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="auth-page-container">
            {/* Top Toggle */}
            <div className="auth-toggle-container">
                <div className="auth-toggle-active">
                    Register
                </div>
                <a
                    href="/login"
                    className="auth-toggle-link"
                >
                    Login
                </a>
            </div>

            <Card className="auth-card">
                <CardHeader className="auth-card-header">
                    <CardTitle className="auth-card-title">Create an account here.</CardTitle>
                    <CardDescription className="auth-description">
                        Register form
                    </CardDescription>
                </CardHeader>
                <CardContent className="auth-card-content">
                    <form onSubmit={handleSubmit} className="auth-form-register">
                        <div className="auth-form-group">
                            <Label htmlFor="name" className="auth-label">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Pietro Schirano"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <Label htmlFor="username" className="auth-label">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="@schirano"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <Label htmlFor="email" className="auth-label">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="schirano@gmail.com"
                                value={formData.email}
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
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>

                        <div className="auth-form-group">
                            <Label htmlFor="confirmPassword" className="auth-label">
                                Re-enter Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="**********"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="auth-input"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="auth-submit-button-register"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="auth-spinner" />
                                    Creating...
                                </>
                            ) : (
                                "Create An Account"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
