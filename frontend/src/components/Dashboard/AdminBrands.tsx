import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrand } from "@/hooks/useBrand";
import type { BrandOut } from "@/types/brand";
import { Building2, Edit2, Image, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./dashboard.css";

export default function AdminBrands() {
    const { fetchAllBrands, createBrand, updateBrand, deleteBrand, loading } = useBrand();
    const [brands, setBrands] = useState<BrandOut[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBrand, setEditingBrand] = useState<BrandOut | null>(null);
    const [formData, setFormData] = useState({ name: "" });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBrands();
    }, []);

    const loadBrands = async () => {
        try {
            const data = await fetchAllBrands();
            setBrands(data);
        } catch (err) {
            console.error("Failed to fetch brands:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const form = new FormData();
        form.append("name", formData.name);
        if (logoFile) {
            form.append("logo_file", logoFile);
        }

        try {
            if (editingBrand) {
                await updateBrand(editingBrand.id, form);
            } else {
                await createBrand(form);
            }
            loadBrands();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to save brand");
        }
    };

    const handleEdit = (brand: BrandOut) => {
        setEditingBrand(brand);
        setFormData({ name: brand.name });
        setShowForm(true);
    };

    const handleDelete = async (brandId: number) => {
        if (!confirm("Are you sure you want to delete this brand?")) return;
        try {
            await deleteBrand(brandId);
            loadBrands();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to delete brand");
        }
    };

    const resetForm = () => {
        setFormData({ name: "" });
        setLogoFile(null);
        setEditingBrand(null);
        setShowForm(false);
        setError(null);
    };

    return (
        <div className="admin-brands">
            <div className="section-header">
                <h2 className="section-title">
                    <Building2 className="section-icon" />
                    Manage Brands
                </h2>
                <Button onClick={() => setShowForm(true)} className="add-btn">
                    <Plus size={16} />
                    Add Brand
                </Button>
            </div>

            {showForm && (
                <Card className="admin-form-card">
                    <h3>{editingBrand ? "Edit Brand" : "Add New Brand"}</h3>
                    {error && <div className="form-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <Label htmlFor="name">Brand Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter brand name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="logo">Logo Image</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                            />
                        </div>
                        <div className="form-actions">
                            <Button type="button" variant="outline" onClick={resetForm}>
                                <X size={16} /> Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                <Save size={16} /> {loading ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="brands-grid">
                {brands.map((brand) => (
                    <Card key={brand.id} className="brand-card">
                        <div className="brand-logo">
                            {brand.logo_url ? (
                                <img src={brand.logo_url} alt={brand.name} />
                            ) : (
                                <Image size={40} />
                            )}
                        </div>
                        <div className="brand-info">
                            <h4>{brand.name}</h4>
                            <span className="brand-id">ID: {brand.id}</span>
                        </div>
                        <div className="brand-actions">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(brand)}>
                                <Edit2 size={14} />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(brand.id)}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
