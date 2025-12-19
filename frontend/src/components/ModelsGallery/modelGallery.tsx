import { useEffect, useState } from "react";
import type { GalleryProps } from "@/types/model";
import { Button } from "../ui/button";
import { MoveRightIcon } from "lucide-react";
import "./modelGallery.css";

export default function ModelGallery({ models = [] }: GalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (models.length === 0) return;

        const interval = setInterval(() => {
            handleTransition();
        }, 6000);

        return () => clearInterval(interval);
    }, [models, currentIndex]);

    const handleTransition = () => {
        setIsTransitioning(true);
        
        setTimeout(() => {
            setCurrentIndex((prev) =>
                prev === models.length - 1 ? 0 : prev + 1
            );
            setIsTransitioning(false);
        }, 800);
    };

    // model hiện tại
    const currentModel = models[currentIndex];

    if (!currentModel) return null;

    return (
        <div className={`gallery-container ${isTransitioning ? 'gallery-transitioning' : ''}`}>
            {/* IMAGE */}
            <div className="image-container">
                <img
                    src={currentModel.image_url ?? ""}
                    alt={currentModel.name}
                    className={`gallery-image ${isTransitioning ? 'image-fade-out' : 'image-fade-in'}`}
                />
            </div>

            {/* INFO */}
            <div className="info-container">
                <h1 className={`model-name ${isTransitioning ? 'text-fade-out' : 'text-fade-in'}`}>
                    {currentModel.name}
                </h1>

                <Button className={`gallery-button ${isTransitioning ? 'button-fade-out' : 'button-fade-in'}`}>
                    Find Out More
                    <MoveRightIcon size={16} />
                </Button>
            </div>

            {/* Indicators */}
            <div className="gallery-indicators">
                {models.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'indicator-active' : ''}`}
                        onClick={() => {
                            setIsTransitioning(true);
                            setTimeout(() => {
                                setCurrentIndex(index);
                                setIsTransitioning(false);
                            }, 800);
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}