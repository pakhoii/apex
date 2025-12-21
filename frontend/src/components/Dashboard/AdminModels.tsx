import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBrand } from "@/hooks/useBrand";
import { useModel } from "@/hooks/useModel";
import type { BrandOut } from "@/types/brand";
import type { ModelOut } from "@/types/model";
import { Car, Edit2, Image, Plus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./dashboard.css";

interface ModelFormData {
    name: string;
    price: string;
    year: string;
    amount: string;
    brand_id: string;
}

export default function AdminModels() {
    const { fetchModels, createModel, updateModel, loading } = useModel();
    const { fetchAllBrands } = useBrand();
    const [models, setModels] = useState<ModelOut[]>([]);
    const [brands, setBrands] = useState<BrandOut[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingModel, setEditingModel] = useState<ModelOut | null>(null);
    const [formData, setFormData] = useState<ModelFormData>({
        name: "",
        price: "",
        year: "",
        amount: "",
        brand_id: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadModels();
        loadBrands();
    }, []);

    const loadModels = async () => {
        try {
            const data = await fetchModels({}, { skip: 0, limit: 100 });
            setModels(data.rows || []);
        } catch (err) {
            console.error("Failed to fetch models:", err);
        }
    };

    const loadBrands = async () => {
        try {
            const data = await fetchAllBrands();
            setBrands(data);
        } catch (err) {
            console.error("Failed to fetch brands:", err);
        }
    };

    const getBrandName = (brandId: number) => {
        const brand = brands.find(b => b.id === brandId);
        return brand?.name || `Brand #${brandId}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const form = new FormData();
        form.append("name", formData.name);
        form.append("price", formData.price);
        form.append("year", formData.year);
        form.append("amount", formData.amount);
        form.append("brand_id", formData.brand_id);
        if (imageFile) {
            form.append("image_file", imageFile);
        }

        try {
            if (editingModel) {
                await updateModel(editingModel.id, form);
            } else {
                await createModel(form);
            }
            loadModels();
            resetForm();
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to save model");
        }
    };

    const handleEdit = (model: ModelOut) => {
        setEditingModel(model);
        setFormData({
            name: model.name,
            price: model.price.toString(),
            year: model.year.toString(),
            amount: model.amount.toString(),
            brand_id: model.brand_id.toString(),
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            year: "",
            amount: "",
            brand_id: "",
        });
        setImageFile(null);
        setEditingModel(null);
        setShowForm(false);
        setError(null);
    };

    return (
        <div className="admin-models">
            <div className="section-header">
                <h2 className="section-title">
                    <Car className="section-icon" />
                    Manage Models
                </h2>
                <Button onClick={() => setShowForm(true)} className="add-btn">
                    <Plus size={16} />
                    Add Model
                </Button>
            </div>

            {showForm && (
                <Card className="admin-form-card">
                    <h3>{editingModel ? "Edit Model" : "Add New Model"}</h3>
                    {error && <div className="form-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="name">Model Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter model name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="brand_id">Brand</Label>
                                <select
                                    id="brand_id"
                                    value={formData.brand_id}
                                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                                    required
                                    className="form-select"
                                >
                                    <option value="">Select a brand</option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Enter price"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    placeholder="Enter year"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <Label htmlFor="amount">Stock Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="Enter stock amount"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <Label htmlFor="image">Model Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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

            <div className="models-grid">
                {models.map((model) => (
                    <Card key={model.id} className="model-card">
                        <div className="model-image">
                            {model.image_url ? (
                                <img src={model.image_url} alt={model.name} />
                            ) : (
                                <Image size={60} />
                            )}
                        </div>
                        <div className="model-info">
                            <h4>{model.name}</h4>
                            <p className="model-brand">{getBrandName(model.brand_id)}</p>
                            <p className="model-price">${model.price.toLocaleString()}</p>
                            <p className="model-details">
                                Year: {model.year} | Stock: {model.amount}
                            </p>
                        </div>
                        <div className="model-actions">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(model)}>
                                <Edit2 size={14} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
