import Navbar from "@/components/Navbar/navbar"
import { useBrand } from "@/hooks/useBrand"
import { useModel } from "@/hooks/useModel"
import type { BrandOut } from "@/types/brand"
import type { ModelOut } from "@/types/model"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import "./models.css"

export default function ModelsPage() {
    // Seamless Video Loop Logic
    const [activeVideo, setActiveVideo] = useState(1)
    const videoRef1 = useRef<HTMLVideoElement>(null)
    const videoRef2 = useRef<HTMLVideoElement>(null)

    const { fetchModels, loading, error } = useModel()
    const { fetchAllBrands } = useBrand()

    // State for fetched data
    const [cars, setCars] = useState<ModelOut[]>([])
    const [brands, setBrands] = useState<BrandOut[]>([])
    const [brandMap, setBrandMap] = useState<Record<number, string>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

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

    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [minPrice, setMinPrice] = useState<number | null>(null)
    const [maxPrice, setMaxPrice] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6

    // Fetch brands on mount
    useEffect(() => {
        const getBrands = async () => {
            try {
                const brandsData = await fetchAllBrands()
                setBrands(brandsData)
                const map: Record<number, string> = {}
                brandsData.forEach((brand: BrandOut) => {
                    map[brand.id] = brand.name
                })
                setBrandMap(map)
            } catch (err) {
                console.error("Failed to fetch brands:", err)
            }
        }
        getBrands()
    }, [])

    // Fetch models with filters and pagination
    useEffect(() => {
        const fetchCars = async () => {
            setIsLoading(true)
            try {
                const filters = {
                    brand_id: selectedBrandId,
                    min_year: selectedYear,
                    max_year: selectedYear,
                    min_price: minPrice,
                    max_price: maxPrice,
                }
                const pagination = { 
                    skip: (currentPage - 1) * itemsPerPage, 
                    limit: itemsPerPage 
                }
                const data = await fetchModels(filters, pagination)
                setCars(data.rows)
                setTotalItems(data.total)
                setTotalPages(data.total_pages)
            } catch (err) {
                console.error("Failed to fetch models:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCars()
    }, [selectedBrandId, selectedYear, minPrice, maxPrice, currentPage])

    // Generate unique years from cars for filter dropdown
    const availableYears = Array.from(new Set(cars.map((car) => car.year))).sort((a, b) => b - a)

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedBrandId, selectedYear, minPrice, maxPrice])

    const handlePriceRangeChange = (range: string) => {
        if (range === "All") {
            setMinPrice(null)
            setMaxPrice(null)
        } else if (range === "Under $100k") {
            setMinPrice(null)
            setMaxPrice(100000)
        } else if (range === "$100k - $200k") {
            setMinPrice(100000)
            setMaxPrice(200000)
        } else if (range === "Over $200k") {
            setMinPrice(200000)
            setMaxPrice(null)
        }
    }

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

                <div className="models-filter-bar">
                    <div className="models-filter-container">
                        <div className="models-filter-group">
                            <label className="models-filter-label">Brand</label>
                            <select
                                className="models-filter-dropdown"
                                value={selectedBrandId ?? ""}
                                onChange={(e) => setSelectedBrandId(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="models-filter-group">
                            <label className="models-filter-label">Price Range</label>
                            <select 
                                className="models-filter-dropdown" 
                                value={minPrice === null && maxPrice === null ? "All" : minPrice === null ? "Under $100k" : minPrice === 100000 ? "$100k - $200k" : "Over $200k"}
                                onChange={(e) => handlePriceRangeChange(e.target.value)}
                            >
                                <option value="All">All Prices</option>
                                <option value="Under $100k">Under $100k</option>
                                <option value="$100k - $200k">$100k - $200k</option>
                                <option value="Over $200k">Over $200k</option>
                            </select>
                        </div>

                        <div className="models-filter-group">
                            <label className="models-filter-label">Year</label>
                            <select 
                                className="models-filter-dropdown" 
                                value={selectedYear ?? ""}
                                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                            >
                                <option value="">All Years</option>
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="models-reset-filter-btn"
                            onClick={() => {
                                setSelectedBrandId(null)
                                setSelectedYear(null)
                                setMinPrice(null)
                                setMaxPrice(null)
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Car Gallery */}
                <section className="models-gallery-section">
                    {isLoading ? (
                        <div className="models-loading-container">
                            <div className="models-loading-spinner"></div>
                            <p>Loading collection...</p>
                        </div>
                    ) : (
                        <>
                            <div className="models-gallery-grid">
                                {cars.map((car) => (
                                    <div key={car.id} className="models-car-card">
                                        <div className="models-car-image-container">
                                            <div className="models-card-glow"></div>
                                            <img src={car.image_url || "/placeholder.svg"} alt={`${brandMap[car.brand_id]} ${car.name}`} className="models-car-image" />
                                            <div className="models-image-overlay"></div>
                                            <h2 className="models-car-model-name">{car.name}</h2>
                                            <div className="models-car-info-overlay">
                                                <span className="models-car-year">{car.year}</span>
                                                <span className="models-car-price">${(car.price / 1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                        <div className="models-car-details">
                                            <div className="models-car-brand-badge">{brandMap[car.brand_id]}</div>
                                            
                                            <a href={`/models/${car.id}`}>
                                                <button className="models-learn-more-btn">
                                                    <span>Learn More</span>
                                                    <ArrowRight size={24} />
                                                </button>
                                            </a>   
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="models-pagination-container mt-20 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`models-pagination-btn px-4 py-2 border border-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 flex items-center justify-center rounded border ${currentPage === i + 1 ? 'bg-yellow-600 border-yellow-600 text-white' : 'border-yellow-700/50 text-yellow-500 hover:bg-yellow-700/20'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`models-pagination-btn px-4 py-2 border border-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed`}
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
