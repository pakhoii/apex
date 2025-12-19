import { useEffect, useState } from "react"
import "./compare.css"

// Type definition for Car (Future-proofing for API)
interface Car {
    id: number;
    brand: string;
    name: string;
    year: number;
    price: number;
    amount: number;
    image: string;
}

// Mock API service (Simulating fetching data)
const fetchCars = async (): Promise<Car[]> => {
    // In the future, this would be: return axios.get("/api/cars")
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    brand: "BMW",
                    name: "M440i xDrive",
                    year: 2024,
                    price: 87500,
                    amount: 15,
                    image: "/images/bmw-m440i.png",
                },
                {
                    id: 2,
                    brand: "Range Rover",
                    name: "SV Black",
                    year: 2024,
                    price: 187500,
                    amount: 8,
                    image: "/images/rangeRover-SV.png",
                },
            ]);
        }, 500); // Simulate network delay
    });
};

export default function ComparePage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchCars();
                setCars(data);
            } catch (error) {
                console.error("Failed to fetch cars", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        window.scrollTo(0, 0);
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading comparison...</div>; // Simple loading state
    }

    return (
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
                                    src={car.image}
                                    alt={`${car.brand} ${car.name}`}
                                    loading="lazy"
                                />
                            </div>
                            <div className="car-info">
                                <h3 className="car-name">
                                    {car.brand} {car.name}
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
    )
}
