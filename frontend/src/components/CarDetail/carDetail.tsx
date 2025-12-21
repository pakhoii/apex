import { useBrand } from '@/hooks/useBrand';
import { useCart } from '@/hooks/useCart';
import { useModel } from '@/hooks/useModel';
import type {
    ModelDetailsProps,
    ModelOut
} from "@/types/model";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import CompareChoosing from './compareChoosing';

import './carDetail.css';

interface ModelDetailsWithBrand extends ModelOut {
    brand: string;
}

const CarDetail: React.FC<ModelDetailsProps> = ({ modelId }) => {
    const [model, setModel] = useState<ModelDetailsWithBrand | null>(null);
    const [compareDialogOpen, setCompareDialogOpen] = useState(false);
    const { fetchModelsDetails, loading, error } = useModel();
    const { fetchBrandById } = useBrand();
    const { addItemToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const loadModel = async () => {
            try {
                const data = await fetchModelsDetails(modelId);
                // console.log(data)
                const brandData = await fetchBrandById(data.brand_id);
                const modelWithBrand: ModelDetailsWithBrand = {
                    ...data,
                    brand: brandData.name,
                };
                setModel(modelWithBrand);
            }
            catch (err) {
                console.error("Failed to fetch model details:", err);
            }
        };

        loadModel();
    }, [modelId]);

    return (
        <div className="car-detail-container">
            {/* Hero Image */}
            <img
                src={model?.image_url || "/images/porsche-911-turbo-s-black-background-amoled-pitch-black-3840x2880-7730.jpg"}
                alt={model?.name || "Car Image"}
                className="car-detail-hero-image"
            />

            <div className="car-detail-content">
                {/* Left Column */}
                <div className="car-detail-main-col">
                    {/* Info Card */}
                    <Card className="car-detail-info-card border-none shadow-none gap-2">
                        <h1 className="car-detail-title">{model?.name}</h1>
                        <p className="car-detail-price">${model?.price}</p>
                    </Card>

                    {/* Specification Section */}
                    <div>
                        <h2 className="car-detail-specs-title">Specification</h2>
                        <div className="car-detail-table-container">
                            <table className="car-detail-table">
                                <thead>
                                    <tr>
                                        <th>Features</th>
                                        <th>Stats</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Name</td>
                                        <td>{model?.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Year</td>
                                        <td>{model?.year}</td>
                                    </tr>
                                    <tr>
                                        <td>Brand</td>
                                        <td>{model?.brand}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="car-detail-sidebar">
                    <Button
                        size="lg"
                        className="car-detail-btn car-detail-btn-primary w-full text-base"
                        onClick={() => {
                            const access_token = localStorage.getItem("access_token");
                            if (!access_token) {
                                alert("Please log in to add items to your cart.");
                                return;
                            }
                            try {
                                addItemToCart({model_id : modelId, quantity: 1});
                            } catch (error) {
                                console.error("Failed to add item to cart:", error);
                            }

                            alert("Item added to cart!");
                        }}
                    >
                        Add To Cart
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="car-detail-btn car-detail-btn-outline w-full text-base"
                        onClick={() => {
                            navigate(`/test-drive/${modelId}`);
                        }}
                    >
                        Schedule Test Drive
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="car-detail-btn car-detail-btn-outline w-full text-base"
                        onClick={() => {
                            setCompareDialogOpen(true);
                        }}
                    >
                        Compare
                    </Button>
                    <CompareChoosing
                        open={compareDialogOpen}
                        onOpenChange={setCompareDialogOpen}
                        currentModelId={modelId}
                        currentModelName={model?.name}
                    />
                    <Button
                        variant="default"
                        size="lg"
                        className="car-detail-btn car-detail-btn-danger w-full text-base"
                        onClick={() => {
                            // TODO: Implement Add to Wishlist API call here
                            alert("Added to Wishlist!");
                        }}
                    >
                        Add To Wishlist
                    </Button>

                    {/* Service Info Box */}
                    <div className="car-detail-service-box">
                        <div className="car-detail-service-item">
                            <svg className="car-detail-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Free shipping on all orders</span>
                        </div>
                        <div className="car-detail-service-item">
                            <svg className="car-detail-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>30-day money-back guarantee</span>
                        </div>
                        <div className="car-detail-service-item">
                            <svg className="car-detail-check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>24/7 customer support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
