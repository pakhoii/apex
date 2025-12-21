import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useModel } from "@/hooks/useModel";
import { useBrand } from "@/hooks/useBrand";
import type { ModelOut } from "@/types/model";
import Navbar from "@/components/Navbar/navbar";
import "./compare.css"

interface ModelOutWithBrand extends ModelOut {
    brand: string;
}

export default function ComparePage() {
    const [cars, setCars] = useState<ModelOutWithBrand[]>([]);
    const [loading, setLoading] = useState(true);
    const { fetchModelsDetails } = useModel();
    const { fetchBrandById } = useBrand();


    const { id1, id2 } = useParams<{ id1: string; id2: string }>();
    if (!id1 || !id2) {
        return <div className="min-h-screen flex items-center justify-center text-white">Invalid model IDs for comparison.</div>;
    }

    const modelIds = [Number(id1), Number(id2)];

    // Initial data fetch
    useEffect(() => {
        const loadModels = async () => {
            setLoading(true);
            try {
                const results = await Promise.all(
                    modelIds.map(async (modelId) => {
                        const modelDetails = await fetchModelsDetails(modelId);
                        if (!modelDetails) return null;

                        const brandDetails = await fetchBrandById(modelDetails.brand_id);

                        return {
                            ...modelDetails,
                            brand: brandDetails?.name ?? "Unknown",
                        };
                    })
                );

                setCars(results.filter(Boolean)); // set 1 lần duy nhất
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadModels();
        window.scrollTo(0, 0);
    }, []);


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading comparison...</div>; // Simple loading state
    }

    return (
        <>
            <Navbar />
            <div className="compare-container">
                {/* Header */}
                <div className="compare-header">
                    <h1 className="compare-title">
                        <span className="compare-title-gradient">Compare</span> Vehicles
                    </h1>
                    <p className="compare-subtitle text-balance">
                        Side-by-side comparison of luxury vehicles to help you make the perfect choice
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="compare-content">
                    <div className="compare-grid">
                        {/* Car Cards */}
                        {cars.map((car) => (
                            <div key={car.id} className="car-card">
                                <div className="car-image-container">
                                    <img
                                        src={car.image_url || ""}
                                        alt={`${car.brand_id} ${car.name}`}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="car-info">
                                    <h3 className="car-name">
                                        {car.brand_id} {car.name}
                                    </h3>
                                    <p className="car-price">${car.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Specifications Comparison */}
                    <div className="specs-container">
                        {/* Basic Information */}
                        <div className="spec-section">
                            <h2 className="spec-title">Vehicle Information</h2>

                            {/* 
                                Spec Grid with Vertical Divider 
                                - grid-cols-1 on mobile
                                - grid-cols-2 on desktop
                                - "divide-x" can create a divider between flex items, but for grid, we can style the first item's border.
                                - Actually, a cleaner way to get a full height divider is using a relative container or just border-right on the first column.
                            */}
                            <div className="spec-grid relative">
                                {/* Vertical Divider (Desktop Only) */}
                                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--apex-color-border)] -translate-x-1/2"></div>

                                {cars.map((car, index) => (
                                    <div key={car.id} className={`spec-list ${index === 0 ? "md:pr-8" : "md:pl-8"}`}>
                                        <div className="spec-item">
                                            <span className="spec-label">Brand</span>
                                            <span className="spec-value">{car.brand}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Model</span>
                                            <span className="spec-value">{car.name}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Year</span>
                                            <span className="spec-value">{car.year}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">Price</span>
                                            <span className="spec-value">${car.price.toLocaleString()}</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-label">In Stock</span>
                                            <span className="spec-value">{car.amount} units</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
