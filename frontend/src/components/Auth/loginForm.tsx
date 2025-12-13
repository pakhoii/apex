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
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 p-4 text-white font-sans">
            {/* Top Toggle */}
            <div className="mb-6 bg-zinc-800/80 p-1 rounded-lg flex items-center shadow-lg backdrop-blur-sm">
                <a
                    href="/register"
                    className="px-6 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                    Register
                </a>
                <div className="px-6 py-2 rounded-md bg-gray-200 text-black text-sm font-medium shadow-sm">
                    Login
                </div>
            </div>

            <Card className="w-full max-w-md bg-black/90 border-none shadow-2xl text-white rounded-xl overflow-hidden">
                <CardHeader className="space-y-1 pb-2">
                    <CardTitle className="text-xl font-normal text-gray-300">Login here.</CardTitle>
                    <CardDescription className="sr-only">
                        Login form
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="identifier" className="text-gray-300 font-normal">
                                Email
                            </Label>
                            <Input
                                id="identifier"
                                name="identifier"
                                placeholder="schirano@gmail.com"
                                value={credentials.identifier}
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
                                value={credentials.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                className="bg-gray-200 border-transparent text-black placeholder:text-gray-500 rounded-md h-11 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="mt-4 w-fit px-8 bg-[#1a1e2e] hover:bg-[#252a3d] text-white border border-gray-800 rounded-lg h-11 text-base font-normal shadow-lg transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
