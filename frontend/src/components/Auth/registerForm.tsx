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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 p-4 text-white font-sans">
            {/* Top Toggle */}
            <div className="mb-6 bg-zinc-800/80 p-1 rounded-lg flex items-center shadow-lg backdrop-blur-sm">
                <div className="px-6 py-2 rounded-md bg-gray-200 text-black text-sm font-medium shadow-sm">
                    Register
                </div>
                <a
                    href="/login"
                    className="px-6 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                    Login
                </a>
            </div>

            <Card className="w-full max-w-md bg-black/90 border-none shadow-2xl text-white rounded-xl overflow-hidden">
                <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-xl font-normal text-gray-300">Create an account here.</CardTitle>
                    <CardDescription className="sr-only">
                        Register form
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-300 font-normal">
                                Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Pietro Schirano"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="bg-gray-200 border-transparent text-black placeholder:text-gray-500 rounded-md h-11 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-gray-300 font-normal">
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="@schirano"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="bg-gray-200 border-transparent text-black placeholder:text-gray-500 rounded-md h-11 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300 font-normal">
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
                                className="bg-gray-200 border-transparent text-black placeholder:text-gray-500 rounded-md h-11 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-300 font-normal">
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
                                className="bg-gray-200 border-transparent text-black placeholder:text-gray-500 rounded-md h-11 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white font-normal">
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
                                className="bg-gray-200 border-transparent text-black placeholder:text-gray-500 rounded-md h-11 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 w-fit px-8 bg-[#1a1e2e] hover:bg-[#252a3d] text-white border border-gray-800 rounded-lg h-11 text-base font-normal shadow-lg transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
