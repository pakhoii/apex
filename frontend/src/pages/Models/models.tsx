import { useState, useEffect, useRef } from "react"
import { ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar/navbar"
import "./models.css"

interface Car {
    id: number
    brand: string
    name: string
    price: number
    year: number
    amount: number
    image_url: string
    description: string
}

const MOCK_DATA: Car[] = [
    {
        id: 1,
        brand: "BMW",
        name: "M440i xDrive",
        price: 87500,
        year: 2024,
        amount: 5,
        image_url: "/images/bmw-m440i.png",
        description: "Iconic sports car with rear engine: 2 doors, 2+2 seats.",
    },
    {
        id: 2,
        brand: "Range Rover",
        name: "SV Black",
        price: 125000,
        year: 2024,
        amount: 3,
        image_url: "/images/black-range-rover-luxury-suv-side-view.jpg",
        description: "Luxury SUV with commanding presence: 4 doors, 4/5 seats.",
    },
    {
        id: 3,
        brand: "Porsche",
        name: "911 Turbo S",
        price: 220000,
        year: 2024,
        amount: 2,
        image_url: "/images/silver-porsche-911-turbo-s-luxury-sports-car.jpg",
        description: "Precise mid-engine sports car: 2 doors, 2 seats.",
    },
    {
        id: 4,
        brand: "Mercedes-AMG",
        name: "GT 63 S",
        price: 165000,
        year: 2024,
        amount: 4,
        image_url: "/images/black-mercedes-amg-gt-63-s-luxury-coupe.jpg",
        description: "Luxury sedan with a high level of comfort: 4 doors, 4/5 seats.",
    },
    {
        id: 5,
        brand: "Audi",
        name: "RS7 Sportback",
        price: 142000,
        year: 2024,
        amount: 6,
        image_url: "/images/grey-audi-rs7-sportback-luxury-sedan.jpg",
        description: "Electric sports car: 4 doors, 4/5 seats.",
    },
    {
        id: 6,
        brand: "Lamborghini",
        name: "Huracán EVO",
        price: 275000,
        year: 2024,
        amount: 1,
        image_url: "/images/yellow-lamborghini-huracan-evo-supercar.jpg",
        description: "Extreme performance supercar: 2 doors, 2 seats.",
    },
]

export default function ModelsPage() {
    // Seamless Video Loop Logic
    const [activeVideo, setActiveVideo] = useState(1)
    const videoRef1 = useRef<HTMLVideoElement>(null)
    const videoRef2 = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const checkTime = () => {
            const currentVideo = activeVideo === 1 ? videoRef1.current : videoRef2.current
            const nextVideo = activeVideo === 1 ? videoRef2.current : videoRef1.current

            if (currentVideo && nextVideo) {
                // If we are within 2 seconds of the end, start the next video (increased from 1s for smoother transit)
                const timeLeft = currentVideo.duration - currentVideo.currentTime
                if (timeLeft < 2 && timeLeft > 0) {
                    // Ensure next video is ready and playing
                    if (nextVideo.paused) {
                        nextVideo.currentTime = 0
                        nextVideo.play().catch(e => console.error("Video play error:", e))
                        setActiveVideo(activeVideo === 1 ? 2 : 1)
                    }
                }
            }
        }

        // Check every 100ms
        const interval = setInterval(checkTime, 100)
        return () => clearInterval(interval)
    }, [activeVideo])

    // Initial play for video 1
    useEffect(() => {
        if (videoRef1.current) {
            videoRef1.current.play().catch(e => console.error("Initial play error:", e))
        }
    }, [])

    const [selectedBrand, setSelectedBrand] = useState("All")
    const [selectedYear, setSelectedYear] = useState("All")
    const [priceRange, setPriceRange] = useState("All")

    // State for fetched data
    const [cars, setCars] = useState<Car[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Simulate API Fetch
    useEffect(() => {
        // TODO: Replace with actual API call
        // Example:
        // fetch('/api/cars')
        //   .then(res => res.json())
        //   .then(data => setCars(data))
        //   .finally(() => setIsLoading(false))

        const fetchCars = async () => {
            try {
                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 800))
                setCars(MOCK_DATA)
                setIsLoading(false)
            } catch (error) {
                console.error("Failed to fetch cars:", error)
                setIsLoading(false)
            }
        }

        fetchCars()
    }, [])

    const brands = ["All", ...Array.from(new Set(cars.map((car) => car.brand)))]
    const years = ["All", ...Array.from(new Set(cars.map((car) => car.year.toString())))]
    const priceRanges = ["All", "Under $100k", "$100k - $200k", "Over $200k"]

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    const filteredCars = cars.filter((car) => {
        const brandMatch = selectedBrand === "All" || car.brand === selectedBrand
        const yearMatch = selectedYear === "All" || car.year.toString() === selectedYear

        let priceMatch = true
        if (priceRange === "Under $100k") priceMatch = car.price < 100000
        else if (priceRange === "$100k - $200k") priceMatch = car.price >= 100000 && car.price <= 200000
        else if (priceRange === "Over $200k") priceMatch = car.price > 200000

        return brandMatch && yearMatch && priceMatch
    })

    // Prepare pagination on the filtered list
    // Reset to page 1 when filters change is usually good UX, but basic implementation first
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedBrand, selectedYear, priceRange])

    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredCars.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage)

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    return (
        <>
            <Navbar />
            <div className="models-page">
                {/* ... Hero Section ... */}
                <section className="hero-section">
                    <div className="hero-background">
                        {/* Seamless Dual Video Loop */}
                        <video
                            ref={videoRef1}
                            className={`hero-bg-video ${activeVideo === 1 ? "opacity-100" : "opacity-0"}`}
                            muted
                            playsInline
                            preload="auto"
                        >
                            <source src="/video/background-model.mp4" type="video/mp4" />
                        </video>
                        <video
                            ref={videoRef2}
                            className={`hero-bg-video ${activeVideo === 2 ? "opacity-100" : "opacity-0"}`}
                            muted
                            playsInline
                            preload="auto"
                        >
                            <source src="/video/background-model.mp4" type="video/mp4" />
                        </video>
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <h1 className="hero-main-title">Your <span className="hero-main-title-span">APEX</span> journey starts now.</h1>
                        <p className="hero-subtitle">Discover the pinnacle of automotive excellence</p>
                    </div>
                </section>

                <div className="filter-bar">
                    <div className="filter-container">
                        <div className="filter-group">
                            <label className="filter-label">Brand</label>
                            <select
                                className="filter-dropdown"
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                            >
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>
                                        {brand === "All" ? "All Brands" : brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Price Range</label>
                            <select className="filter-dropdown" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                                {priceRanges.map((range) => (
                                    <option key={range} value={range}>
                                        {range === "All" ? "All Prices" : range}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Year</label>
                            <select className="filter-dropdown" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year === "All" ? "All Years" : year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="reset-filter-btn"
                            onClick={() => {
                                setSelectedBrand("All")
                                setSelectedYear("All")
                                setPriceRange("All")
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Car Gallery */}
                <section className="gallery-section">
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading collection...</p>
                        </div>
                    ) : (
                        <>
                            <div className="gallery-grid">
                                {currentItems.map((car) => (
                                    <div key={car.id} className="car-card">
                                        <div className="car-image-container">
                                            <div className="card-glow"></div>
                                            <img src={car.image_url || "/placeholder.svg"} alt={`${car.brand} ${car.name}`} className="car-image" />
                                            <div className="image-overlay"></div>
                                            <h2 className="car-model-name">{car.name}</h2>
                                            <div className="car-info-overlay">
                                                <span className="car-year">{car.year}</span>
                                                <span className="car-price">${(car.price / 1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                        <div className="car-details">
                                            <div className="car-brand-badge">{car.brand}</div>
                                            <p className="car-description">{car.description}</p>
                                            <button className="learn-more-btn">
                                                <span>Learn More</span>
                                                <ArrowRight size={24} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="pagination-container mt-20 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`pagination-btn px-4 py-2 border border-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => paginate(i + 1)}
                                                className={`w-10 h-10 flex items-center justify-center rounded border ${currentPage === i + 1 ? 'bg-yellow-600 border-yellow-600 text-white' : 'border-yellow-700/50 text-yellow-500 hover:bg-yellow-700/20'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`pagination-btn px-4 py-2 border border-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </>
    )
}
