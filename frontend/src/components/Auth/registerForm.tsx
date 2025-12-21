import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

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
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const { register, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(
            {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                email: formData.email,
                password: formData.password,
            }
        );
    }
    
    return (
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
                        <Label htmlFor="firstName" className="auth-label">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            placeholder="Pietro"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="auth-input"
                        />
                    </div>

                    <div className="auth-form-group">
                        <Label htmlFor="lastName" className="auth-label">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Schirano"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="auth-input"
                        />
                    </div>

                    <div className="auth-form-group">
                        <Label htmlFor="phoneNumber" className="auth-label">
                            Phone Number
                        </Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="(123) 456-7890"
                            value={formData.phoneNumber}
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
                            placeholder="Type in your password"
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
                            placeholder="Re-enter your password"
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
    );
};
