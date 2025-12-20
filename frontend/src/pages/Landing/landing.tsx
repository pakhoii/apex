import ModelGallery from "@/components/ModelsGallery/modelGallery";
import { useModel } from "@/hooks/useModel";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/useInView";
import Navbar from "@/components/Navbar/navbar";
import { Footer } from "@/components/Footer/footer";

import "./landing.css";

export default function Landing() {
    const { fetchModels, loading, error } = useModel();
    const [models, setModels] = useState([]);

    const section1Ref = useInView({ threshold: 0.2 });
    const section2Ref = useInView({ threshold: 0.2 });
    const section3Ref = useInView({ threshold: 0.2 });

    useEffect(() => {
        const getModels = async () => {
            const pagination = { skip: 0, limit: 10 };
            try {
                const data = await fetchModels(pagination);
                setModels(data.rows);
            } catch (err) {
                console.error("Failed to fetch models:", err);
            }
        }
        getModels();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="landing-page">
                {/* Section 1 */}
                <div 
                    className={`landing-section-container ${section1Ref.isVisible ? 'landing-fade-in' : 'landing-fade-out'}`}
                    ref={section1Ref.ref}
                >
                    <img 
                        src="/images/mclaren.jpg" 
                        alt="Apex Models"
                        className="landing-section-img"
                    />
                    <div className="landing-section-info">
                        <h1 className="landing-title">APEX</h1>
                        <p className="landing-slogan">Driven by Quality, Defined by Trust</p>
                        <Button className="landing-discover-btn" size="lg">
                            Discover Now
                        </Button>
                    </div>
                </div>

                {/* Section 2 */}
                <div 
                    className={`landing-section-container ${section2Ref.isVisible ? 'landing-fade-in' : 'landing-fade-out'}`}
                    ref={section2Ref.ref}
                >
                    <ModelGallery models={models} />
                </div>

                {/* Section 3 */}
                <div 
                    className={`landing-section-container ${section3Ref.isVisible ? 'landing-fade-in' : 'landing-fade-out'}`}
                    ref={section3Ref.ref}
                >
                    <img 
                        src="/images/yellow-abstract.jpg" 
                        alt="Yellow Abstract"
                        className="landing-section-img"
                    />
                    <div className="landing-section-info">
                        <h1 className="landing-title">More About Us</h1>
                        <div className="m-4"></div>
                        <Button className="landing-discover-btn" size="lg">
                            Discover Now
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}