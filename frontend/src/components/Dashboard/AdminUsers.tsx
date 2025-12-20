import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import type { UserRole } from "@/types/user";
import { Plus, Save, UserPlus, Users, X } from "lucide-react";
import { useState } from "react";
import "./dashboard.css";

interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    role: UserRole;
}

export default function AdminUsers() {
    const { createUser, loading } = useUser();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        role: "user",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const newUser = await createUser(formData);
            setSuccess(`User "${newUser.first_name} ${newUser.last_name}" created successfully!`);
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to create user");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            password: "",
            role: "user",
        });
        setShowForm(false);
    };

    return (
        <div className="admin-users">
            <div className="section-header">
                <h2 className="section-title">
                    <Users className="section-icon" />
                    Create Users
                </h2>
                <Button onClick={() => setShowForm(true)} className="add-btn">
                    <Plus size={16} />
                    Create User
                </Button>
            </div>

            {success && (
                <Card className="success-message">
                    <UserPlus size={20} />
                    <span>{success}</span>
                    <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}>
                        <X size={16} />
                    </Button>
                </Card>
            )}

            {showForm && (
                <Card className="admin-form-card user-form-card">
                    <h3>Create New User</h3>
                    {error && <div className="form-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions">
                            <Button type="button" variant="outline" onClick={resetForm}>
                                <X size={16} /> Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                <Save size={16} /> {loading ? "Creating..." : "Create User"}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {!showForm && (
                <Card className="info-card">
                    <UserPlus size={40} />
                    <h3>Create New Users</h3>
                    <p>
                        As an admin, you can create new user accounts with either user or admin roles.
                        Click the "Create User" button above to get started.
                    </p>
                </Card>
            )}
        </div>
    );
}
