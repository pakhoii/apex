import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/hooks/useUser";
import type { UserOut, UserUpdateMe } from "@/types/user";
import { Edit2, Mail, Phone, Save, User, X } from "lucide-react";
import { useState } from "react";
import "./dashboard.css";

interface UserProfileProps {
    user: UserOut;
    onUpdate: (updatedUser: UserOut) => void;
}

export default function UserProfile({ user, onUpdate }: UserProfileProps) {
    const { updateCurrentUser, loading } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserUpdateMe>({
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const updatedUser = await updateCurrentUser(formData);
            onUpdate(updatedUser);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to update profile");
        }
    };

    const handleCancel = () => {
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            phone_number: user.phone_number,
        });
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="user-profile">
            <h2 className="section-title">
                <User className="section-icon" />
                My Profile
            </h2>

            <Card className="profile-card">
                {!isEditing ? (
                    <div className="profile-view">
                        <div className="profile-avatar">
                            <User size={48} />
                        </div>
                        <div className="profile-info">
                            <h3 className="profile-name">
                                {user.first_name} {user.last_name}
                            </h3>
                            <div className="profile-detail">
                                <Mail size={16} />
                                <span>{user.email}</span>
                            </div>
                            <div className="profile-detail">
                                <Phone size={16} />
                                <span>{user.phone_number}</span>
                            </div>
                            <div className="profile-role">
                                Role: <span className="role-badge">{user.role}</span>
                            </div>
                        </div>
                        <Button onClick={() => setIsEditing(true)} className="edit-btn">
                            <Edit2 size={16} />
                            Edit Profile
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="profile-form">
                        {error && <div className="form-error">{error}</div>}
                        
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name || ""}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name || ""}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number || ""}
                                onChange={handleChange}
                                placeholder="Phone Number"
                            />
                        </div>
                        
                        <div className="form-group">
                            <Label>Email</Label>
                            <Input value={user.email} disabled />
                            <p className="form-hint">Email cannot be changed</p>
                        </div>

                        <div className="form-actions">
                            <Button type="button" variant="outline" onClick={handleCancel}>
                                <X size={16} />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                <Save size={16} />
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}
